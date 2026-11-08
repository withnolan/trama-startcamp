import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { certificadoValido, estadoPanel } from "../calculo/semaforo";
import { ARCHIVO, type ArchivosCrudos, type CodigoIncidencia, type Gravedad, type NombreArchivo } from "./contratos";
import { ESCENARIOS } from "./escenarios";
import { generar } from "./generador";
import { completitud, filasOtrasMarcas, informeCalidad, ingerir, type OpcionesIngesta } from "./ingesta";
import { PARAMETROS_PUBLICOS_PROVISIONALES as P } from "./parametros";
import { esFecha, finDeMes, periodoValido } from "./parsers";
import { clavesPersonales } from "./validacion";

// ---------- Fixtures hechas a mano a partir de CABECERAS (SINTÉTICAS) ----------
const DIR = join(__dirname, "fixtures");
const fixtures = (): ArchivosCrudos =>
  Object.fromEntries((Object.keys(ARCHIVO) as NombreArchivo[]).map((n) => [n, readFileSync(join(DIR, ARCHIVO[n]), "utf8")]));
const op: OpcionesIngesta = { escenario: "fixture", marcaId: "MARCA-A", marcaNombre: "Marca A (ficticia)", parametros: P, hashCrudo: "fixture" };

/** Añade filas al final de un archivo. */
const mas = (a: ArchivosCrudos, n: NombreArchivo, ...filas: string[]): ArchivosCrudos => ({ ...a, [n]: a[n]!.trimEnd() + "\n" + filas.join("\n") + "\n" });
/** Sustituye un texto (una vez) dentro de un archivo. */
const cambia = (a: ArchivosCrudos, n: NombreArchivo, de: string, por: string): ArchivosCrudos => {
  expect(a[n]).toContain(de);
  return { ...a, [n]: a[n]!.replace(de, por) };
};
/** Quita la línea que contiene un texto. */
const quita = (a: ArchivosCrudos, n: NombreArchivo, de: string): ArchivosCrudos => ({
  ...a, [n]: a[n]!.split(/\r?\n/).filter((l) => !l.includes(de)).join("\n"),
});
const ing = (a: ArchivosCrudos, o: Partial<OpcionesIngesta> = {}) => ingerir(a, { ...op, ...o });
const hay = (a: ArchivosCrudos, codigo: CodigoIncidencia, gravedad: Gravedad, o: Partial<OpcionesIngesta> = {}) =>
  ing(a, o).dataset.incidencias.filter((i) => i.codigo === codigo && i.gravedad === gravedad);

describe("parsers", () => {
  it("fechas ISO reales, fin de mes y periodos de cuota", () => {
    expect(esFecha("2026-02-28")).toBe(true);
    expect(esFecha("2026-02-30")).toBe(false);
    expect(esFecha("2026-2-01")).toBe(false);
    expect(finDeMes("2028-02")).toBe("2028-02-29");
    expect(periodoValido("303", "2026-T3")).toBe(true);
    expect(periodoValido("303", "2026-10")).toBe(false);
    expect(periodoValido("347", "2025")).toBe(true);
    expect(periodoValido("declarada", "2026-10")).toBe(true);
  });
});

describe("ingesta N2 · recorrido completo con las fixtures (ES + IT + cuota + escandallo con 2 versiones + subencargo)", () => {
  const { ok, dataset: d } = ing(fixtures());

  it("entra entera, sin bloqueantes", () => {
    expect(ok).toBe(true);
    expect(d.incidencias.filter((i) => i.gravedad === "bloqueante")).toEqual([]);
    expect(d.seed.talleres.map((t) => t.id)).toEqual(["TS-01", "TS-02", "TI-01"]);
    expect(d.seed.meta.mesEvaluacionActual).toBe("2026-10");
  });

  it("cadena: subcontrata declarada «previa» desde el primer mes y subencargo aceptado", () => {
    const [ts1, ts2, ti1] = d.seed.talleres;
    expect(ts1.subcontrataIds).toEqual(["TS-02"]);
    expect(ts2.declaracionSubcontrata).toEqual({ momento: "previa", fecha: "2026-08-01", alertaId: null });
    expect(ts1.declaracionSubcontrata).toBeNull();
    expect(ti1.declaracionSubcontrata).toBeNull();
    expect(d.seed.pedidos.find((p) => p.id === "P-004")).toMatchObject({ origen: "subencargo", pedidoOrigenId: "P-003", tallerId: "TS-02" });
  });

  it("separación entre marcas: ni pedidos ni cuotas de otra marca, y el informe solo da el número", () => {
    expect(d.seed.pedidos).toHaveLength(7);
    expect(d.seed.pedidos.every((p) => p.marcaId === "MARCA-A")).toBe(true);
    expect(d.cuotas!.every((c) => c.marcaId === "MARCA-A")).toBe(true);
    expect(d.cuotas).toHaveLength(3);
    expect(filasOtrasMarcas(d)).toBe(2);
    const md = informeCalidad(d, ok);
    expect(md).toContain("2 filas de otras marcas descartadas por separación entre marcas");
    expect(md).not.toContain("MARCA-B");
    expect(JSON.stringify(d)).not.toContain("MARCA-B");
  });

  it("Italia: LUL → certificado con firmante consulente vía Asse.Co, indicadores y fuente de horas", () => {
    const lul = d.seed.certificadosHoras.filter((c) => c.tallerId === "TI-01");
    expect(lul.map((c) => c.horasTotalesCotizadas)).toEqual([1600, 1580, 1620]);
    expect(lul.every((c) => c.numTrabajadores === 10 && c.firmante.tipo === "consulente_del_lavoro" && c.firmante.viaAsseCo)).toBe(true);
    expect(d.indicadoresIT).toHaveLength(3);
    expect(d.indicadoresIT![0]).toEqual({ tallerId: "TI-01", mes: "2026-08", durcRegolare: true, durcScadenza: "2027-01-31", assecoVigente: true });
    const f = Object.values(d.fuenteHoras!);
    expect(f.filter((x) => x === "lul_it")).toHaveLength(3);
    expect(f.filter((x) => x === "informe_es")).toHaveLength(6);
    for (const c of d.seed.certificadosHoras) expect(d.fuenteHoras![c.id]).toBe(c.tallerId.startsWith("TI") ? "lul_it" : "informe_es");
  });

  it("España: horas = plantilla media ponderada × jornada de convenio ÷ 12; titulares aparte", () => {
    const c = d.seed.certificadosHoras.find((x) => x.tallerId === "TS-02" && x.mes === "2026-10")!;
    expect(c.horasTotalesCotizadas).toBeCloseTo((2 * P.jornadaAnualConvenio.marroquineria.valor) / 12, 1);
    expect(c).toMatchObject({ numTrabajadores: 2, numTitulares: 1, horasTitulares: 160 });
  });

  it("escandallo: se conservan todas las versiones y el seed usa la vigente en el mes de evaluación", () => {
    expect(d.escandalloVersiones).toHaveLength(4);
    expect(d.escandalloVersiones!.find((v) => v.tipoPiezaId === "TP-AMER" && v.version === 2)).toEqual({
      tipoPiezaId: "TP-AMER", version: 2, minutos: 130, vigenteDesde: "2026-09-15", autor: "Producto (ficticio)", categoria: "americana_forrada",
    });
    const pieza = (id: string, o: Partial<OpcionesIngesta> = {}) => ing(fixtures(), o).dataset.seed.tiposPieza.find((t) => t.id === id)!;
    expect(pieza("TP-BOLSO")).toMatchObject({ minutosEstandar: 300, categoria: "marroquineria" });
    expect(pieza("TP-AMER")).toMatchObject({ minutosEstandar: 130, categoria: "confeccion" });
    expect(pieza("TP-BOLSO", { mesEvaluacion: "2026-09" }).minutosEstandar).toBe(360);
    expect(pieza("TP-AMER", { mesEvaluacion: "2026-08" }).minutosEstandar).toBe(150);
  });

  it("procedencia de cada taller, pedido, versión de escandallo, informe y cuota", () => {
    const pr = d.procedencia;
    for (const t of d.seed.talleres) expect(pr[`taller:${t.id}`]).toMatchObject({ archivo: "talleres.csv", tipoFuente: "declarado" });
    for (const p of d.seed.pedidos) expect(pr[`pedido:${p.id}`]).toMatchObject({ archivo: "pedidos_erp.csv", tipoFuente: "declarado" });
    for (const v of d.escandalloVersiones!) expect(pr[`escandallo:${v.tipoPiezaId}:v${v.version}`]).toMatchObject({ archivo: "escandallo.csv", tipoFuente: "declarado", firmante: v.autor });
    for (const c of d.seed.certificadosHoras) expect(pr[`informe:${c.id}`].tipoFuente).toBe("oficial");
    expect(pr["informe:" + d.seed.certificadosHoras.find((c) => c.tallerId === "TI-01")!.id].archivo).toBe("lul_agregado_it.csv");
    expect(pr["cuota:TS-01:303:2026-T3"]).toMatchObject({ archivo: "cuota_facturacion.csv", fila: 1, tipoFuente: "oficial" });
    expect(pr["cuota:TI-01:347:2025"].tipoFuente).toBe("oficial");
    expect(pr["cuota:TS-02:declarada:2026-10"].tipoFuente).toBe("declarado");
    expect(pr["pedido:P-004"].fila).toBe(4);
  });

  it("el Seed pasa por estadoPanel de semaforo.ts sin lanzar y con datos para cada cadena", () => {
    for (const t of d.seed.talleres.filter((x) => x.nivel === 1)) {
      const e = estadoPanel(d.seed, t.id, d.seed.meta.mesEvaluacionActual);
      expect(e).not.toBe("sin_datos");
    }
  });

  it("informe de calidad: SINTÉTICO, completitud, peor 5 %, descartes y privacidad", () => {
    const md = informeCalidad(d, ok);
    for (const s of ["SINTÉTICO", "## Completitud por taller y mes", "| TI-01 | ✓ | ✓ | ✓ |", "## El 5 % de talleres", "## Filas descartadas por motivo", "Privacidad"])
      expect(md).toContain(s);
  });
});

describe("ingesta N2 · un caso por código de incidencia", () => {
  const F = fixtures();

  it("CABECERA_INVALIDA: archivo bloqueado entero (también falta de archivo de horas)", () => {
    const r = ing(cambia(F, "escandallo", "minutos", "mins"));
    expect(r.ok).toBe(false);
    expect(r.dataset.incidencias.some((i) => i.codigo === "CABECERA_INVALIDA" && i.entidad === "escandallo.csv")).toBe(true);
    expect(r.dataset.escandalloVersiones).toEqual([]);
    const sinHoras = ing({ ...F, informe_plantilla_es: undefined, lul_agregado_it: undefined });
    expect(sinHoras.ok).toBe(false);
    const lulMal = ing(cambia(F, "lul_agregado_it", "consulente", "consulente_lavoro"));
    expect(lulMal.ok).toBe(false);
    expect(lulMal.dataset.indicadoresIT).toEqual([]);
  });

  it("TIPO_INVALIDO: unidades, cuota fuera de 1-100, fuente desconocida, nivel 1 con padre, columnas de más", () => {
    const a = mas(F, "pedidos_erp", "P-010;MARCA-A;TS-01;x;TP-BOLSO;abc;2026-10-01;2026-10-31;marca;");
    expect(hay(a, "TIPO_INVALIDO", "bloqueante")[0].entidad).toBe("pedidos_erp.csv:9 · taller:TS-01");
    expect(hay(mas(F, "cuota_facturacion", "TS-01;MARCA-A;2026-T2;150;303"), "TIPO_INVALIDO", "bloqueante")).toHaveLength(1);
    expect(hay(mas(F, "cuota_facturacion", "TS-01;MARCA-A;2026-T2;20;modelo390"), "TIPO_INVALIDO", "bloqueante")).toHaveLength(1);
    expect(hay(mas(F, "talleres", "TS-03;Taller (ficticio);ES;Elche;Alicante;1;TS-01;Bolsos;marroquineria"), "TIPO_INVALIDO", "bloqueante")).toHaveLength(1);
    expect(hay(mas(F, "talleres", "TS-04;Taller (ficticio);ES;Elche;Alicante;3;TS-01;Bolsos;marroquineria"), "TIPO_INVALIDO", "bloqueante")[0].detalle).toContain("nivel 2");
    expect(hay(mas(F, "lul_agregado_it", "TI-01;2026-07;1600;10;si;2027-01-31;true;Studio (ficticio);2026-08-10"), "TIPO_INVALIDO", "bloqueante")).toHaveLength(1);
    expect(hay(mas(F, "talleres", "TS-05;x;ES;Elche;Alicante;1;;Bolsos;marroquineria;extra"), "TIPO_INVALIDO", "bloqueante")).toHaveLength(1);
  });

  it("FECHAS_INVALIDAS: fecha imposible, informe emitido antes de acabar el mes, periodo de cuota", () => {
    expect(hay(mas(F, "pedidos_erp", "P-011;MARCA-A;TS-01;x;TP-BOLSO;5;2026-02-30;2026-03-10;marca;"), "FECHAS_INVALIDAS", "bloqueante")).toHaveLength(1);
    expect(hay(mas(F, "lul_agregado_it", "TI-01;2026-11;1600;10;true;2027-01-31;true;Studio Gelso (ficticio);2026-11-20"), "FECHAS_INVALIDAS", "bloqueante")).toHaveLength(1);
    expect(hay(mas(F, "cuota_facturacion", "TS-01;MARCA-A;2026-10;35;303"), "FECHAS_INVALIDAS", "bloqueante")).toHaveLength(1);
  });

  it("DUPLICADO: taller repetido e informe idéntico repetido", () => {
    expect(hay(mas(F, "talleres", "TS-01;Otro (ficticio);ES;Elche;Alicante;1;;Bolsos;marroquineria"), "DUPLICADO", "bloqueante")).toHaveLength(1);
    const linea = F.informe_plantilla_es!.split("\n")[1];
    const r = ing(mas(F, "informe_plantilla_es", linea));
    expect(r.dataset.incidencias.filter((i) => i.codigo === "DUPLICADO")).toHaveLength(1);
    expect(r.dataset.incidencias.some((i) => i.codigo === "RECTIFICACION")).toBe(false);
  });

  it("REFERENCIA_DESCONOCIDA: padre inexistente (y su cascada), subencargo a quien no es subcontrata del origen", () => {
    const r = ing(mas(F, "talleres", "TS-06;x (ficticio);ES;Elche;Alicante;2;TS-99;Bolsos;marroquineria", "TS-07;y (ficticio);ES;Elche;Alicante;3;TS-06;Bolsos;marroquineria"));
    expect(r.dataset.incidencias.filter((i) => i.codigo === "REFERENCIA_DESCONOCIDA" && i.gravedad === "bloqueante").map((i) => i.entidad))
      .toEqual(["talleres.csv:4 · taller:TS-06", "talleres.csv:5 · taller:TS-07"]);
    const sub = mas(F, "pedidos_erp", "P-012;MARCA-A;TI-01;x;TP-BOLSO;5;2026-10-01;2026-10-31;subencargo;P-003");
    expect(hay(sub, "REFERENCIA_DESCONOCIDA", "bloqueante")[0].detalle).toContain("no es subcontrata declarada de TS-01");
    expect(hay(mas(F, "pedidos_erp", "P-013;MARCA-A;TS-02;x;TP-BOLSO;5;2026-10-01;2026-10-31;subencargo;P-999"), "REFERENCIA_DESCONOCIDA", "bloqueante")).toHaveLength(1);
  });

  it("FIRMANTE_INCOHERENTE: LUL de un taller de España, informe ES de un taller de Italia (bloqueantes); LUL sin Asse.Co (info)", () => {
    expect(hay(mas(F, "lul_agregado_it", "TS-01;2026-07;1600;10;true;2027-01-31;true;Studio (ficticio);2026-08-10"), "FIRMANTE_INCOHERENTE", "bloqueante")).toHaveLength(1);
    expect(hay(mas(F, "informe_plantilla_es", "TI-01;DEMO-ES-9;2026-07;5;5;0;0;gestor_laboral;Gestoría (ficticia);2026-08-05"), "FIRMANTE_INCOHERENTE", "bloqueante")).toHaveLength(1);
    const sinAsseco = cambia(F, "lul_agregado_it", "true;Studio Gelso (ficticio);2026-11-10", "false;Studio Gelso (ficticio);2026-11-10");
    const info = hay(sinAsseco, "FIRMANTE_INCOHERENTE", "info");
    expect(info).toHaveLength(1);
    expect(info[0].detalle).toContain("motor v1");
    const d = ing(sinAsseco).dataset;
    expect(d.seed.certificadosHoras.find((c) => c.tallerId === "TI-01" && c.mes === "2026-10")!.firmante.viaAsseCo).toBe(false);
    expect(d.indicadoresIT!.at(-1)!.assecoVigente).toBe(false);
    // el motor v1 no cuenta ese informe → la cadena italiana pasa a «sin datos» (nunca rojo)
    expect(certificadoValido(d.seed, "TI-01", "2026-10")).toBeNull();
    expect(estadoPanel(d.seed, "TI-01", "2026-10")).toBe("sin_datos");
  });

  it("FALTA_INFORME: taller sin informe de un mes (✗ en la completitud)", () => {
    const a = quita(F, "informe_plantilla_es", "TS-01;DEMO-ES-1001;2026-09");
    const f = hay(a, "FALTA_INFORME", "aviso");
    expect(f).toEqual([expect.objectContaining({ entidad: "taller:TS-01", detalle: expect.stringContaining("2026-09") })]);
    expect(completitud(ing(a).dataset).filas[0].celdas).toEqual(["✓", "✗", "✓"]);
  });

  it("INFORME_TARDIO: emitido después del mes siguiente (T en la completitud)", () => {
    const a = cambia(F, "informe_plantilla_es", "2026-10;7.5;8;0;0;gestor_laboral;Gestoría Brezo (ficticia);2026-11-05", "2026-10;7.5;8;0;0;gestor_laboral;Gestoría Brezo (ficticia);2026-12-15");
    expect(hay(a, "INFORME_TARDIO", "aviso")).toHaveLength(1);
    expect(completitud(ing(a).dataset).filas[0].celdas.at(-1)).toBe("T");
  });

  it("RECTIFICACION: dos informes del mismo mes → info, gana la emisión más reciente (como el motor) y R", () => {
    const a = mas(F, "informe_plantilla_es", "TS-01;DEMO-ES-1001;2026-10;6;8;0;0;gestor_laboral;Gestoría Brezo (ficticia);2026-11-20");
    expect(hay(a, "RECTIFICACION", "info")).toHaveLength(1);
    expect(hay(a, "INFORME_TARDIO", "aviso")).toHaveLength(0);
    const d = ing(a).dataset;
    expect(certificadoValido(d.seed, "TS-01", "2026-10")!.fechaEmision).toBe("2026-11-20");
    expect(completitud(d).filas[0].celdas.at(-1)).toBe("R");
  });

  it("MINUTOS_BAJO_SUELO y rebaja > 20 % entre versiones (aviso con autor y fecha)", () => {
    const a = mas(F, "escandallo", "TP-AMER;3;100;2026-10-10;Compras nuevas (ficticio);americana_forrada");
    const bajo = hay(a, "MINUTOS_BAJO_SUELO", "aviso");
    expect(bajo).toHaveLength(1);
    expect(bajo[0].detalle).toContain("126");
    const rebaja = hay(a, "MINUTOS_SIN_CONTRASTAR", "aviso");
    expect(rebaja).toHaveLength(1);
    expect(rebaja[0].detalle).toMatch(/23 %.*Compras nuevas \(ficticio\).*2026-10-10/);
    expect(ing(a).dataset.seed.tiposPieza.find((t) => t.id === "TP-AMER")!.minutosEstandar).toBe(100);
    // la rebaja de 360 → 300 (17 %) del fixture no avisa
    expect(hay(F, "MINUTOS_SIN_CONTRASTAR", "aviso")).toEqual([]);
  });

  it("MINUTOS_SIN_CONTRASTAR (info): suelo null (marroquinería) o categoría sin suelo", () => {
    expect(hay(F, "MINUTOS_SIN_CONTRASTAR", "info").map((i) => i.entidad)).toEqual(["escandallo.csv:1 · pieza:TP-BOLSO"]);
    const a = mas(F, "escandallo", "TP-CAMISA;1;40;2026-05-01;Producto (ficticio);camisa");
    expect(hay(a, "MINUTOS_SIN_CONTRASTAR", "info")).toHaveLength(2);
    expect(ing(a).dataset.seed.tiposPieza.find((t) => t.id === "TP-CAMISA")!.categoria).toBe("confeccion");
  });

  it("SUBENCARGO_EXCEDE: Σ unidades de los subencargos > pedido origen → se descarta el subencargo", () => {
    const a = mas(F, "pedidos_erp", "P-014;MARCA-A;TS-02;x;TP-BOLSO;90;2026-10-01;2026-10-31;subencargo;P-003");
    expect(hay(a, "SUBENCARGO_EXCEDE", "bloqueante")).toHaveLength(1);
    const d = ing(a).dataset;
    expect(d.seed.pedidos.some((p) => p.id === "P-014")).toBe(false);
    expect(d.seed.pedidos.some((p) => p.id === "P-004")).toBe(true);
    expect(filasOtrasMarcas(d)).toBe(2); // la fila descartada no se confunde con otra marca
  });

  it("TALLER_MICRO: 3 personas o menos (info)", () => {
    expect(hay(F, "TALLER_MICRO", "info").map((i) => i.entidad)).toEqual(["taller:TS-02"]);
  });

  it("DURC_CADUCADO: vence antes de fin de mes o no regular (aviso, no invalida las horas)", () => {
    const a = cambia(F, "lul_agregado_it", "2026-10;1620;10;true;2027-01-31", "2026-10;1620;10;true;2026-10-15");
    expect(hay(a, "DURC_CADUCADO", "aviso")).toHaveLength(1);
    const b = cambia(F, "lul_agregado_it", "2026-09;1580;10;true", "2026-09;1580;10;false");
    expect(hay(b, "DURC_CADUCADO", "aviso")).toHaveLength(1);
    expect(ing(b).dataset.seed.certificadosHoras.filter((c) => c.tallerId === "TI-01")).toHaveLength(3);
  });

  it("JORNADA_FUERA_RANGO: España plantilla/trabajadores < 0,5; Italia fuera de 60-200 h por trabajador", () => {
    expect(hay(cambia(F, "informe_plantilla_es", "2026-09;7.5;8", "2026-09;3;8"), "JORNADA_FUERA_RANGO", "aviso")).toHaveLength(1);
    expect(hay(cambia(F, "lul_agregado_it", "2026-09;1580;10", "2026-09;300;10"), "JORNADA_FUERA_RANGO", "aviso")).toHaveLength(1);
    expect(hay(cambia(F, "lul_agregado_it", "2026-09;1580;10", "2026-09;2500;10"), "JORNADA_FUERA_RANGO", "aviso")).toHaveLength(1);
  });

  it("PLANTILLA_INCOHERENTE: plantilla media > trabajadores (ES) u horas sin trabajadores (IT)", () => {
    expect(hay(cambia(F, "informe_plantilla_es", "2026-09;7.5;8", "2026-09;9;8"), "PLANTILLA_INCOHERENTE", "aviso")).toHaveLength(1);
    expect(hay(cambia(F, "lul_agregado_it", "2026-09;1580;10", "2026-09;1580;0"), "PLANTILLA_INCOHERENTE", "aviso")).toHaveLength(1);
  });

  it("ninguna fila se descarta en silencio: filas = ingeridas + bloqueadas + otras marcas", () => {
    const a = mas(
      mas(F, "pedidos_erp", "P-001;MARCA-A;TS-01;dup;TP-BOLSO;5;2026-10-01;2026-10-31;marca;", "P-015;MARCA-A;TS-77;x;TP-BOLSO;5;2026-10-01;2026-10-31;marca;", "P-016;MARCA-C;TS-01;x;TP-BOLSO;5;2026-10-01;2026-10-31;marca;"),
      "cuota_facturacion", "TS-99;MARCA-A;2026-T3;35;303",
    );
    const { dataset: d, ok } = ing(a);
    expect(ok).toBe(true);
    expect(d.seed.pedidos).toHaveLength(7);
    expect(filasOtrasMarcas(d)).toBe(3);
    const md = informeCalidad(d, ok);
    expect(md).toContain("| pedidos_erp.csv | DUPLICADO | 1 |");
    expect(md).toContain("| cuota_facturacion.csv | REFERENCIA_DESCONOCIDA | 1 |");
    expect(md).not.toMatch(/MARCA-[BC]/);
  });
});

describe("ingesta N2 · privacidad y compatibilidad con el generador N1", () => {
  const { archivos } = generar(ESCENARIOS.pitch, 2026, P, []);
  const esc = ESCENARIOS.pitch;
  const r = ingerir(archivos, { ...op, escenario: "pitch", marcaId: esc.marcaId, marcaNombre: esc.marcaNombre });

  it("el generador actual entra OK y sin bloqueantes; el seed pasa por estadoPanel", () => {
    expect(r.ok).toBe(true);
    expect(r.dataset.incidencias.filter((i) => i.gravedad === "bloqueante")).toEqual([]);
    expect(r.dataset.seed.talleres.length).toBeGreaterThan(0);
    for (const t of r.dataset.seed.talleres.filter((x) => x.nivel === 1))
      expect(() => estadoPanel(r.dataset.seed, t.id, r.dataset.seed.meta.mesEvaluacionActual)).not.toThrow();
    expect(informeCalidad(r.dataset, r.ok)).toContain("SINTÉTICO");
  });

  it("ninguna clave personal en ningún nivel del dataset (fixtures y generador)", () => {
    expect(clavesPersonales(r.dataset)).toEqual([]);
    expect(clavesPersonales(ing(fixtures()).dataset)).toEqual([]);
    // el detector funciona
    expect(clavesPersonales({ a: [{ b: { DNI: "x", nombre_trabajador: "y", horasPorPersona: 1 } }] })).toEqual([
      "$.a[0].b.DNI", "$.a[0].b.nombre_trabajador", "$.a[0].b.horasPorPersona",
    ]);
  });

  it("los fuentes de la ingesta no tocan la carpeta de la verdad oculta", () => {
    for (const f of ["ingesta.ts", "parsers.ts", "validacion.ts"])
      expect(readFileSync(join(__dirname, f), "utf8")).not.toMatch(/["'`/]verdad["'`/]/);
  });
});
