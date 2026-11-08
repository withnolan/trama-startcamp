import { describe, expect, it } from "vitest";
import seedDemo from "@/data/seed.json";
import { estadoPanel } from "../calculo/semaforo";
import { MIN_MARCAS_SUMA } from "../calculo/simular";
import type { CertificadoHoras, Pais, Pedido, Seed, Taller } from "../calculo/tipos";
import type { DatasetIngerido, IndicadorIT, VersionEscandallo } from "./contratos";
import { PARAMETROS_PUBLICOS_PROVISIONALES as P, PARAMETROS_SEMAFORO } from "./parametros";
import { CIERRE_EXPLICACION, confianzaDe, estadoConUmbral, MIN_MARCAS_SUMA_V2, puntuarV2 } from "./score";

// ---------- Datasets pequeños hechos a mano ----------
const VENTANA = ["2026-08", "2026-09", "2026-10"];

function tallerDe(id: string, pais: Pais = "ES", padreId: string | null = null, subs: string[] = []): Taller {
  return {
    id, nombre: `${id} (ficticio)`, pais, ciudad: "Ubrique", provincia: "Cádiz", nivel: padreId ? 2 : 1, padreId,
    subcontrataIds: subs, declaracionSubcontrata: padreId ? { momento: "previa", fecha: "2026-01-01", alertaId: null } : null,
    especialidad: "",
  };
}

function cert(tallerId: string, mes: string, horas: number, pais: Pais = "ES", extra: Partial<CertificadoHoras> = {}): CertificadoHoras {
  return {
    id: `C-${tallerId}-${mes}`, tallerId, mes, horasTotalesCotizadas: horas, numTrabajadores: 10,
    firmante: { tipo: pais === "ES" ? "gestor_laboral" : "consulente_del_lavoro", despacho: "Despacho (ficticio)", numeroColegiado: "X", viaAsseCo: pais === "IT" },
    fechaEmision: `${mes === "2026-12" ? "2027-01" : mes.slice(0, 5) + String(+mes.slice(5) + 1).padStart(2, "0")}-05`,
    ...extra,
  };
}

const pedido = (id: string, tallerId: string, unidades: number, inicio = "2026-08-01", fin = "2026-10-31", pieza = "TP-A", extra: Partial<Pedido> = {}): Pedido => ({
  id, marcaId: "M", tallerId, tipoPiezaId: pieza, unidades, inicio, fin, referencia: id, origen: "marca", pedidoOrigenId: null, ...extra,
});

function dataset(p: {
  talleres: Taller[];
  pedidos: Pedido[];
  certs: CertificadoHoras[];
  minutos?: number;
  versiones?: VersionEscandallo[];
  cuotas?: DatasetIngerido["cuotas"];
  indicadoresIT?: IndicadorIT[];
}): DatasetIngerido {
  const seed: Seed = {
    meta: { descripcion: "test", version: "t", fechaCorte: "2026-11-28", mesEvaluacionActual: "2026-10", mesesConCertificado: VENTANA, minutosEstandar: "" },
    parametros: PARAMETROS_SEMAFORO,
    marca: { id: "M", nombre: "Marca (ficticia)", sector: "marroquineria", pais: "ES", limiteReduccionPedidosPctPorDefecto: 20 },
    tiposPieza: [{ id: "TP-A", nombre: "Pieza A", categoria: "marroquineria", minutosEstandar: p.minutos ?? 60, fuente: "ficha_costes" }],
    talleres: p.talleres,
    pedidos: p.pedidos,
    certificadosHoras: p.certs,
    alertas: [],
    planesCorreccion: [],
    metricasImpacto: {} as Seed["metricasImpacto"],
    esperado: null,
  };
  return {
    seed, procedencia: {}, incidencias: [],
    metaIngesta: { escenario: "test", semilla: null, versionGenerador: "", hashCrudo: "", archivos: [] },
    ...(p.versiones ? { escandalloVersiones: p.versiones } : {}),
    ...(p.cuotas ? { cuotas: p.cuotas } : {}),
    ...(p.indicadoresIT ? { indicadoresIT: p.indicadoresIT } : {}),
  };
}

const version = (v: number, minutos: number, desde: string, categoria = "marroquineria"): VersionEscandallo => ({
  tipoPiezaId: "TP-A", version: v, minutos, vigenteDesde: desde, autor: "Compras (ficticio)", categoria,
});
const certsVentana = (id: string, horas: number, pais: Pais = "ES") => VENTANA.map((m) => cert(id, m, horas, pais));
const PROHIBIDAS = /fraude|ilegal|explotaci|certifica/i;

describe("score v2 · minutos efectivos", () => {
  it("el suelo de minutos sube un ratio de ámbar a rojo (y v1 sigue en ámbar)", () => {
    // 1.800 uds × 100 min = 3.000 h frente a 3.000 h → 1,00 ámbar. Con el suelo de 126 min: 3.780 h → 1,26 rojo.
    const d = dataset({
      talleres: [tallerDe("T1")], pedidos: [pedido("P1", "T1", 1800)], certs: certsVentana("T1", 1000), minutos: 100,
      versiones: [version(1, 100, "2026-01-01", "americana_forrada")],
    });
    const [r] = puntuarV2(d, P);
    expect(r.estadoV1).toBe("ambar");
    expect(r.estado).toBe("rojo");
    expect(r.ratio).toBe(1.26);
    expect(r.minutosUsados).toBe("suelo");
    expect(r.horasPorSuelo).toBeCloseTo(780, 6);
    expect(r.motivosConfianza.join(" ")).toMatch(/por debajo del suelo/);
    expect(r.explicacion.join(" ")).toMatch(/suelo público/);
  });

  it("escandallo con 2 versiones dentro del mes: cada día cuenta con la versión vigente", () => {
    // Octubre: días 1-15 a 120 min y 16-31 a 60 min. 310 uds × (15×120 + 16×60) / (60 × 31) = 460 h.
    const d = dataset({
      talleres: [tallerDe("T1")], pedidos: [pedido("P1", "T1", 310, "2026-10-01", "2026-10-31")], certs: certsVentana("T1", 1000),
      versiones: [version(1, 120, "2026-01-01"), version(2, 60, "2026-10-16")],
    });
    const [r] = puntuarV2(d, P);
    expect(r.horasNecesarias).toBeCloseTo(460, 9);
    expect(r.minutosUsados).toBe("escandallo");
    expect(r.motivosConfianza.join(" ")).toMatch(/sin contrastar/);
    expect(r.confianza).toBe("media");
  });

  it("dos versiones con la misma fecha: gana la de número mayor; sin versiones se usan los tiposPieza", () => {
    const base = { talleres: [tallerDe("T1")], pedidos: [pedido("P1", "T1", 300, "2026-10-01", "2026-10-31")], certs: certsVentana("T1", 1000) };
    expect(puntuarV2(dataset({ ...base, versiones: [version(2, 30, "2026-01-01"), version(1, 90, "2026-01-01")] }), P)[0].horasNecesarias).toBeCloseTo(150, 9);
    expect(puntuarV2(dataset({ ...base, minutos: 60 }), P)[0].horasNecesarias).toBeCloseTo(300, 9);
  });
});

describe("score v2 · horas y confianza", () => {
  it("Italia sin Asse.Co: las horas del LUL cuentan (v1 daba sin datos) y baja la confianza", () => {
    const certs = VENTANA.map((m) => cert("T1", m, 1000, "IT", { firmante: { tipo: "consulente_del_lavoro", despacho: "Studio (ficticio)", numeroColegiado: "X", viaAsseCo: false } }));
    const d = dataset({ talleres: [tallerDe("T1", "IT")], pedidos: [pedido("P1", "T1", 2000)], certs }); // 2.000 h / 3.000 h
    const [r] = puntuarV2(d, P);
    expect(r.estadoV1).toBe("sin_datos");
    expect(r.estado).toBe("verde");
    expect(r.ratio).toBe(0.6667);
    expect(r.horasFuente).toBe("lul_it");
    expect(r.confianza).toBe("media");
    expect(r.motivosConfianza.join(" ")).toMatch(/sin Asse.Co/);
  });

  it("DURC caducado: el dato cuenta, pero la confianza pasa a baja", () => {
    const ind: IndicadorIT[] = VENTANA.map((m) => ({ tallerId: "T1", mes: m, durcRegolare: true, durcScadenza: "2026-09-15", assecoVigente: true }));
    const d = dataset({ talleres: [tallerDe("T1", "IT")], pedidos: [pedido("P1", "T1", 2000)], certs: certsVentana("T1", 1000, "IT"), indicadoresIT: ind });
    const [r] = puntuarV2(d, P);
    expect(r.estado).toBe("verde");
    expect(r.confianza).toBe("baja");
    expect(r.motivosConfianza.some((m) => m.startsWith("[grave] DURC"))).toBe(true);
  });

  it("rectificación: cuenta la emisión más reciente y se avisa", () => {
    const certs = [...certsVentana("T1", 1000), cert("T1", "2026-10", 500, "ES", { id: "C-T1-2026-10-bis", fechaEmision: "2026-11-20" })];
    const [r] = puntuarV2(dataset({ talleres: [tallerDe("T1")], pedidos: [pedido("P1", "T1", 1000)], certs }), P);
    expect(r.horasDeAlta).toBe(2500);
    expect(r.motivosConfianza.join(" ")).toMatch(/rectificado/);
  });

  it("sin datos del taller raíz: nunca rojo, aunque la carga sea enorme", () => {
    const d = dataset({ talleres: [tallerDe("T1")], pedidos: [pedido("P1", "T1", 99999)], certs: [cert("T1", "2026-08", 100), cert("T1", "2026-09", 100)] });
    const [r] = puntuarV2(d, P);
    expect(r.estado).toBe("sin_datos");
    expect(r.ratio).toBeUndefined();
    expect(r.horasFuente).toBe("ninguna");
    expect(r.confianza).toBe("baja");
    expect(estadoConUmbral(r, PARAMETROS_SEMAFORO, 1.0)).toBe("sin_datos");
  });

  it("reglas de confianza: baja con un grave o 3 leves; media con 1-2 leves; alta sin motivos", () => {
    expect(confianzaDe([])).toBe("alta");
    expect(confianzaDe([{ grave: false }, { grave: false }])).toBe("media");
    expect(confianzaDe([{ grave: false }, { grave: false }, { grave: false }])).toBe("baja");
    expect(confianzaDe([{ grave: true }])).toBe("baja");
  });
});

describe("score v2 · varias marcas y cadena", () => {
  const base = { talleres: [tallerDe("T1")], pedidos: [pedido("P1", "T1", 1500)], certs: certsVentana("T1", 1000) }; // 1.500 h / 3.000 h = 0,5

  it("cuota del 20 %: la estimación (2,5×) abre revisión, pero el estado sigue verde", () => {
    const [r] = puntuarV2(dataset({ ...base, cuotas: [{ tallerId: "T1", marcaId: "M", periodo: "2026-T3", cuotaPct: 20, fuente: "303" }] }), P);
    expect(r.estado).toBe("verde");
    expect(r.ratioTotalEstimado).toBe(2.5);
    expect(r.revisionAbierta).toBe(true);
    expect(r.explicacion.join(" ")).toMatch(/se abre una revisión/);
    expect(r.explicacion.join(" ")).not.toMatch(/20 %/); // la marca no ve la cuota
  });

  it("cuota del 80 % o cuota de otra marca: sin revisión", () => {
    const [a] = puntuarV2(dataset({ ...base, cuotas: [{ tallerId: "T1", marcaId: "M", periodo: "2026-T3", cuotaPct: 80, fuente: "303" }] }), P);
    expect(a.revisionAbierta).toBe(false);
    expect(a.ratioTotalEstimado).toBe(0.625);
    const [b] = puntuarV2(dataset({ ...base, cuotas: [{ tallerId: "T1", marcaId: "OTRA", periodo: "2026-T3", cuotaPct: 10, fuente: "303" }] }), P);
    expect(b.revisionAbierta).toBe(false);
    expect(b.ratioTotalEstimado).toBeUndefined();
  });

  it("cadena con subcontrata: resta el subencargo, peor estado de la cadena y de cada miembro, igual que v1", () => {
    // T1 recibe 3.000 h y pasa 1.500 h a T2. Cadena: 3.000 / (2.000 + 300) = 1,30 rojo. T1 solo: 0,75. T2 sola: 5,0.
    const d = dataset({
      talleres: [tallerDe("T1", "ES", null, ["T2"]), tallerDe("T2", "ES", "T1")],
      pedidos: [pedido("P1", "T1", 3000), pedido("S1", "T2", 1500, undefined, undefined, "TP-A", { origen: "subencargo", pedidoOrigenId: "P1" })],
      certs: [...certsVentana("T1", 2000 / 3), ...certsVentana("T2", 100)],
    });
    const [r] = puntuarV2(d, P);
    expect(r.ratio).toBe(1.3043);
    expect(r.estado).toBe("rojo");
    expect(r.estadoV1).toBe("rojo");
    expect(r.evaluaciones.map((e) => [e.tallerId, e.estado])).toEqual([["T1", "rojo"], ["T1", "verde"], ["T2", "rojo"]]);
  });

  it("falta el informe de una subcontrata: en la cadena cuenta 0 h; la subcontrata sola queda sin datos (como v1)", () => {
    const d = dataset({
      talleres: [tallerDe("T1", "ES", null, ["T2"]), tallerDe("T2", "ES", "T1")],
      pedidos: [pedido("P1", "T1", 1000)],
      certs: [...certsVentana("T1", 1000), cert("T2", "2026-08", 100), cert("T2", "2026-09", 100)],
    });
    const [r] = puntuarV2(d, P);
    expect(r.horasDeAlta).toBe(3200);
    expect(r.evaluaciones[0].estado).toBe("verde");
    expect(r.estado).toBe("sin_datos");
    expect(r.estadoV1).toBe("sin_datos");
    expect(r.confianza).toBe("baja");
    expect(r.motivosConfianza.join(" ")).toMatch(/subcontrata T2 de 2026-10: esos meses cuentan 0 h/);
  });

  it("explicación en lenguaje llano, sin palabras vetadas y con el cierre", () => {
    const ds = [
      dataset({ ...base, cuotas: [{ tallerId: "T1", marcaId: "M", periodo: "2026-T3", cuotaPct: 20, fuente: "303" }] }),
      dataset({ talleres: [tallerDe("T1")], pedidos: [pedido("P1", "T1", 99999)], certs: [] }),
    ];
    for (const d of ds)
      for (const r of puntuarV2(d, P)) {
        for (const t of [...r.explicacion, ...r.motivosConfianza]) expect(t).not.toMatch(PROHIBIDAS);
        expect(r.explicacion.at(-1)).toBe(CIERRE_EXPLICACION);
      }
  });

  it("umbral alternativo: a 1,10 coincide con el estado; a 1,40 el rojo de 1,30 pasa a ámbar", () => {
    const d = dataset({ talleres: [tallerDe("T1")], pedidos: [pedido("P1", "T1", 3900)], certs: certsVentana("T1", 1000) }); // 1,30
    const [r] = puntuarV2(d, P);
    expect(estadoConUmbral(r, PARAMETROS_SEMAFORO, PARAMETROS_SEMAFORO.umbralRojo)).toBe(r.estado);
    expect(estadoConUmbral(r, PARAMETROS_SEMAFORO, 1.4)).toBe("ambar");
  });

  it("MIN_MARCAS_SUMA del score v2 = el del simulador", () => {
    expect(MIN_MARCAS_SUMA_V2).toBe(MIN_MARCAS_SUMA);
  });
});

describe("score v2 · compatibilidad con el seed de la demo", () => {
  const seed = seedDemo as unknown as Seed;
  const d: DatasetIngerido = { seed, procedencia: {}, incidencias: [], metaIngesta: { escenario: "demo", semilla: null, versionGenerador: "", hashCrudo: "", archivos: [] } };
  const raices = seed.talleres.filter((t) => t.nivel === 1).map((t) => t.id);

  it("mismo estado que v1 en todos los talleres de nivel 1 (T1-T6), con los minutos del seed sin suelo", () => {
    const r = puntuarV2(d, P);
    expect(r.map((x) => x.tallerId)).toEqual(raices);
    for (const x of r) {
      expect(x.estado).toBe(estadoPanel(seed, x.tallerId, seed.meta.mesEvaluacionActual));
      expect(x.estadoV1).toBe(x.estado);
      expect(x.minutosUsados).toBe("escandallo");
    }
    expect(r.find((x) => x.tallerId === "T1")!.horasFuente).toBe("lul_it");
    expect(r.find((x) => x.tallerId === "T3")!.horasFuente).toBe("informe_es");
  });

  it("aplicando el suelo de la americana forrada (126 min) a las chaquetas de 240 min: nada cambia", () => {
    const r = puntuarV2(d, P, { categoriaPorPieza: { "TP-CHAQ-CACH": "americana_forrada", "TP-ABRIGO-CACH": "americana_forrada" } });
    for (const x of r) {
      expect(x.estado).toBe(x.estadoV1);
      expect(x.minutosUsados).toBe("escandallo");
    }
  });
});
