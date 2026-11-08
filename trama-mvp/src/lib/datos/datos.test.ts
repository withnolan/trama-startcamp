import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import seedDemo from "@/data/seed.json";
import { CABECERAS, type ArchivosCrudos } from "./contratos";
import { aCsv, leerCsv } from "./csv";
import { ESCENARIOS } from "./escenarios";
import { evaluar, puntuar } from "./evaluacion";
import { CATALOGO_PIEZAS, generar, normalizar } from "./generador";
import { ingerir } from "./ingesta";
import { PARAMETROS_PUBLICOS_PROVISIONALES as P, PARAMETROS_SEMAFORO } from "./parametros";
import { crearRng } from "./prng";

const RAIZ = join(__dirname, "..", "..", "..");
const exclusion = readFileSync(join(RAIZ, "datos", "exclusion_nombres.txt"), "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));
const esc = ESCENARIOS.pitch;
const N = Object.values(esc.composicion).reduce((s, k) => s + (k ?? 0), 0);
const op = { escenario: "pitch", marcaId: esc.marcaId, marcaNombre: esc.marcaNombre, parametros: P, hashCrudo: "test" };

describe("prng", () => {
  it("misma semilla → misma secuencia; distinta semilla → distinta", () => {
    const a = crearRng(7), b = crearRng(7), c = crearRng(8);
    const sa = Array.from({ length: 5 }, () => a.next());
    expect(Array.from({ length: 5 }, () => b.next())).toEqual(sa);
    expect(Array.from({ length: 5 }, () => c.next())).not.toEqual(sa);
  });
});

describe("csv", () => {
  it("ida y vuelta, con BOM y CRLF", () => {
    const t = aCsv(["a", "b"], [{ a: 1, b: "x" }, { a: 2, b: "" }]);
    const l = leerCsv("﻿" + t.replace(/\n/g, "\r\n"));
    expect(l.cabecera).toEqual(["a", "b"]);
    expect(l.filas.map((f) => f.valores)).toEqual([{ a: "1", b: "x" }, { a: "2", b: "" }]);
  });
  it("fila con columnas de más → error con su número", () => {
    expect(leerCsv("a;b\n1;2;3\n").errores[0].numero).toBe(1);
  });
});

describe("generador", () => {
  const g1 = generar(esc, 2026, P, exclusion);

  it("es determinista: misma semilla → archivos idénticos byte a byte", () => {
    expect(generar(esc, 2026, P, exclusion)).toEqual(g1);
    expect(generar(esc, 2027, P, exclusion).archivos.pedidos_erp).not.toEqual(g1.archivos.pedidos_erp);
  });

  it("respeta la composición del escenario y las cabeceras del contrato", () => {
    const n = Object.values(esc.composicion).reduce((s, k) => s + (k ?? 0), 0);
    expect(g1.verdad.talleres).toHaveLength(n);
    for (const [k, cab] of Object.entries(CABECERAS))
      if (g1.archivos[k as keyof ArchivosCrudos]) expect(leerCsv(g1.archivos[k as keyof ArchivosCrudos]!).cabecera).toEqual([...cab]);
  });

  it("nombres ficticios: únicos, marcados y fuera de la lista de exclusión", () => {
    const nombres = leerCsv(g1.archivos.talleres!).filas.map((f) => f.valores.nombre);
    expect(new Set(nombres).size).toBe(nombres.length);
    for (const n of nombres) {
      expect(n).toMatch(/\(ficticio\)$/);
      for (const t of exclusion) expect(normalizar(n)).not.toContain(normalizar(t));
    }
  });

  it("tamaños dentro de 1-49 asalariados y pedidos válidos", () => {
    for (const f of leerCsv(g1.archivos.informe_plantilla_es!).filas) {
      const n = Number(f.valores.num_trabajadores);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(49);
      expect(Number(f.valores.plantilla_media_ponderada)).toBeLessThanOrEqual(n);
    }
    for (const f of leerCsv(g1.archivos.pedidos_erp!).filas) {
      expect(Number(f.valores.unidades)).toBeGreaterThan(0);
      expect(f.valores.fin >= f.valores.inicio).toBe(true);
      expect(CATALOGO_PIEZAS.some((p) => p.id === f.valores.tipo_pieza_id)).toBe(true);
    }
  });

  it("la verdad oculta no viaja en los archivos crudos", () => {
    const crudo = Object.values(g1.archivos).join("\n");
    for (const palabra of ["subcontrata_oculta", "pico_legitimo", "arquetipo", "problemaReal"]) expect(crudo).not.toContain(palabra);
  });
});

describe("ingesta", () => {
  const { archivos } = generar(esc, 2026, P, exclusion);

  it("el escenario pitch entra entero, sin bloqueantes", () => {
    const { ok, dataset } = ingerir(archivos, op);
    expect(ok).toBe(true);
    expect(dataset.incidencias.filter((i) => i.gravedad === "bloqueante")).toEqual([]);
    expect(dataset.seed.talleres).toHaveLength(N);
    expect(dataset.seed.parametros).toEqual(seedDemo.parametros);
  });

  it("horas de alta = plantilla media ponderada × jornada de convenio ÷ 12", () => {
    const { dataset } = ingerir(archivos, op);
    const fila = leerCsv(archivos.informe_plantilla_es!).filas[0].valores;
    const conv = leerCsv(archivos.talleres!).filas.find((f) => f.valores.taller_id === fila.taller_id)!.valores.convenio as "textil" | "marroquineria";
    const c = dataset.seed.certificadosHoras.find((x) => x.tallerId === fila.taller_id && x.mes === fila.mes)!;
    expect(c.horasTotalesCotizadas).toBeCloseTo((Number(fila.plantilla_media_ponderada) * P.jornadaAnualConvenio[conv].valor) / 12, 1);
  });

  it("cabecera cambiada → archivo bloqueado entero e ingesta no OK", () => {
    const malo = { ...archivos, pedidos_erp: archivos.pedidos_erp!.replace("unidades", "uds") };
    const r = ingerir(malo, op);
    expect(r.ok).toBe(false);
    expect(r.dataset.incidencias.some((i) => i.codigo === "CABECERA_INVALIDA" && i.gravedad === "bloqueante")).toBe(true);
  });

  it("filas malas → se descartan con su código y el resto entra", () => {
    const lineas = archivos.pedidos_erp!.trimEnd().split("\n");
    const [cab, f1] = lineas;
    const c = f1.split(";");
    const con = (id: string, i: number, valor: string) => c.map((x, k) => (k === 0 ? id : k === i ? valor : x)).join(";");
    const malas = [
      f1, // duplicado del original
      con("PS-9001", 2, "TS-99"), // taller desconocido
      con("PS-9002", 5, "0"), // unidades 0
      [...c.slice(0, 6), "2026-05-20", "2026-05-01", ...c.slice(8)].join(";").replace(c[0], "PS-9003"), // fin < inicio
    ];
    const r = ingerir({ ...archivos, pedidos_erp: [cab, ...lineas.slice(1), ...malas].join("\n") + "\n" }, op);
    const codigos = r.dataset.incidencias.filter((i) => i.gravedad === "bloqueante").map((i) => i.codigo).sort();
    expect(codigos).toEqual(["DUPLICADO", "FECHAS_INVALIDAS", "REFERENCIA_DESCONOCIDA", "TIPO_INVALIDO"]);
    expect(r.dataset.seed.pedidos).toHaveLength(lineas.length - 1);
  });

  it("firmante incoherente e informe emitido antes de acabar el mes → bloqueantes", () => {
    const [cab, f1] = archivos.informe_plantilla_es!.split("\n");
    const v = f1.split(";");
    const firmante = [...v.slice(0, 7), "consulente_del_lavoro", ...v.slice(8)].join(";");
    const pronto = [...v.slice(0, 9), `${v[2]}-15`].join(";");
    const r = ingerir({ ...archivos, informe_plantilla_es: [cab, firmante, pronto].join("\n") + "\n" }, op);
    const codigos = r.dataset.incidencias.filter((i) => i.gravedad === "bloqueante").map((i) => i.codigo).sort();
    expect(codigos).toEqual(["FECHAS_INVALIDAS", "FIRMANTE_INCOHERENTE"]);
  });

  it("privacidad: ningún campo por persona en el dataset", () => {
    const texto = JSON.stringify(ingerir(archivos, op).dataset);
    for (const k of ["dni", "nie", "nombreTrabajador", "horasPorPersona", "nacionalidad", "situacionMigratoria"]) expect(texto).not.toContain(`"${k}"`);
  });
});

describe("score N1 y evaluación", () => {
  const { archivos, verdad } = generar(esc, 2026, P, exclusion);
  const { dataset } = ingerir(archivos, op);
  const scores = puntuar(dataset);
  const ev = evaluar(scores, verdad);

  it("un score por taller; nunca rojo por falta de datos", () => {
    expect(scores).toHaveLength(dataset.seed.talleres.filter((t) => t.nivel === 1).length);
    for (const s of scores.filter((x) => x.horasFuente === "ninguna")) expect(s.estado).toBe("sin_datos");
    expect(ev.sinDatosEnRojo).toBe(0);
    const aus = ev.porArquetipo.find((a) => a.arquetipo === "informe_tardio_o_ausente");
    if (aus) expect(aus.estados.sin_datos).toBe(aus.n);
  });

  it("con la semilla del pitch: alguna subcontrata oculta en rojo y la etiqueta de datos sintéticos", () => {
    expect(ev.matriz.vp).toBeGreaterThan(0);
    expect(ev.etiqueta).toBe("datos sintéticos");
  });

  it("los umbrales del pipeline son los del seed de la demo", () => {
    expect(PARAMETROS_SEMAFORO).toEqual(seedDemo.parametros);
  });
});

describe("aislamiento de la verdad oculta", () => {
  it("ni la ingesta ni el score leen datos/verdad", () => {
    const fuentes = [
      join(RAIZ, "src", "lib", "datos", "ingesta.ts"),
      join(RAIZ, "src", "lib", "datos", "evaluacion.ts"),
      join(RAIZ, "scripts", "datos", "ingerir.ts"),
    ];
    for (const f of fuentes) expect(readFileSync(f, "utf8")).not.toMatch(/["'`/]verdad["'`/]/);
    // evaluar.ts sí la lee, pero solo después de puntuar
    const ev = readFileSync(join(RAIZ, "scripts", "datos", "evaluar.ts"), "utf8");
    expect(ev.indexOf("puntuar(")).toBeLessThan(ev.indexOf('"verdad"'));
  });

  it("los scripts usan imports relativos con extensión .ts (requisito de node --experimental-strip-types)", () => {
    const dir = join(RAIZ, "scripts", "datos");
    for (const f of readdirSync(dir)) expect(readFileSync(join(dir, f), "utf8")).not.toMatch(/from "@\//);
  });
});
