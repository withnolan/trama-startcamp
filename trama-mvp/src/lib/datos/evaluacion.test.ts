import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { EstadoSemaforo } from "../calculo/tipos";
import type { Arquetipo, Verdad } from "./contratos";
import { ESCENARIOS } from "./escenarios";
import {
  agregarSemillas, evaluacionSemillasMarkdown, intervalo, metricasCorrida, percentil, puntuar, UMBRALES_CURVA, type MetricasCorrida,
} from "./evaluacion";
import { generar } from "./generador";
import { ingerir } from "./ingesta";
import { PARAMETROS_PUBLICOS_PROVISIONALES as P, PARAMETROS_SEMAFORO } from "./parametros";
import { puntuarV2, type ResultadoScoreV2 } from "./score";

const RAIZ = join(__dirname, "..", "..", "..");

// ---------- Scores y verdad hechos a mano ----------
function sc(tallerId: string, estado: EstadoSemaforo, carga: number, horas: number, extra: Partial<ResultadoScoreV2> = {}): ResultadoScoreV2 {
  const sinDatos = estado === "sin_datos";
  return {
    tallerId, mes: "2026-10", ratio: sinDatos ? undefined : carga / horas, estado, confianza: "alta", motivosConfianza: [],
    minutosUsados: "escandallo", horasFuente: sinDatos ? "ninguna" : "informe_es", explicacion: [], revisionAbierta: false,
    estadoV1: estado, micro: false, evaluaciones: [{ tipo: "cadena", tallerId, carga, horas, micro: false, sinDatos, estado, ratio: carga / horas }],
    horasNecesarias: carga, horasDeAlta: sinDatos ? undefined : horas, horasPorSuelo: 0, ...extra,
  };
}
const verdadDe = (xs: [string, Arquetipo, boolean][]): Verdad => ({
  escenario: "test", semilla: 1,
  talleres: xs.map(([tallerId, arquetipo, problemaReal]) => ({ tallerId, arquetipo, problemaReal, personasReales: 5, personasDeclaradas: 5, ratioRealMedio: 1, nota: "" })),
});

const VERDAD = verdadDe([
  ["A", "sano", false], ["B", "subcontrata_oculta", true], ["C", "subcontrata_oculta", true],
  ["D", "informe_tardio_o_ausente", false], ["E", "varias_marcas", true], ["F", "minutos_rebajados", true],
]);
const V2 = [
  sc("A", "verde", 500, 1000), sc("B", "rojo", 1500, 1000), sc("C", "ambar", 1050, 1000), sc("D", "sin_datos", 9000, 0),
  sc("E", "verde", 500, 1000, { revisionAbierta: true, ratioTotalEstimado: 2.5 }),
  sc("F", "rojo", 1200, 1000, { minutosUsados: "suelo", estadoV1: "ambar" }),
];
const V1 = V2.map((s) => ({ ...s, estado: s.estadoV1, revisionAbierta: undefined }));

describe("percentiles e intervalos", () => {
  it("percentil lineal (tipo 7) en un caso conocido: 1…20 → p5 = 1,95 y p95 = 19,05", () => {
    const xs = Array.from({ length: 20 }, (_, i) => i + 1);
    expect(percentil(xs, 0.05)).toBeCloseTo(1.95, 12);
    expect(percentil(xs, 0.95)).toBeCloseTo(19.05, 12);
    expect(percentil([...xs].reverse(), 0.5)).toBeCloseTo(10.5, 12);
    expect(percentil([], 0.5)).toBeNull();
  });

  it("intervalo ignora las semillas sin valor (null) y redondea a 4 decimales", () => {
    expect(intervalo([0, 0.5, 1, null])).toEqual({ media: 0.5, p5: 0.05, p95: 0.95, min: 0, max: 1, n: 3 });
    expect(intervalo([null, undefined])).toEqual({ media: null, p5: null, p95: null, min: null, max: null, n: 0 });
  });
});

describe("métricas de una semilla (caso hecho a mano)", () => {
  const m = metricasCorrida(1, V1, V2, VERDAD, PARAMETROS_SEMAFORO);

  it("sensibilidad, precisión, falsos rojos, sin datos en rojo y revisión de varias marcas", () => {
    expect(m.global.v2).toMatchObject({
      problemas: 4, sinProblema: 2, sensibilidadRojo: 0.5, sensibilidadRojoOAmbar: 0.75, precisionRojo: 1,
      tasaFalsosRojos: 0, falsosRojos: 0, sinDatosEnRojo: 0, revisionVariasMarcas: 1,
    });
    expect(m.global.v1.sensibilidadRojo).toBe(0.25); // sin suelo, F se queda en ámbar
    expect(m.global.v1.revisionVariasMarcas).toBe(0);
  });

  it("por arquetipo, dirigido por datos (sin lista fija), y efecto del suelo", () => {
    expect(m.porArquetipo.map((a) => a.arquetipo)).toEqual(["sano", "subcontrata_oculta", "informe_tardio_o_ausente", "varias_marcas", "minutos_rebajados"]);
    const sub = m.porArquetipo.find((a) => a.arquetipo === "subcontrata_oculta")!;
    expect(sub.v2).toEqual({ n: 2, rojo: 0.5, rojoOAmbar: 1, sinDatos: 0, revision: 0 });
    expect(m.suelo).toEqual({ conSuelo: 1, cambianDeEstado: 1, pasanARojo: 1, minutosRebajadosConSuelo: 1 });
    expect(m.cambiosV1V2).toBe(1);
  });

  it("curva del umbral: más sensibilidad con un umbral más bajo; sin datos nunca entra en rojo", () => {
    expect(m.curva.map((c) => c.umbral)).toEqual(UMBRALES_CURVA);
    expect(m.curva[0]).toEqual({ umbral: 1.0, sensibilidad: 0.75, tasaFalsosRojos: 0 }); // C (1,05) pasa a rojo
    expect(m.curva.at(-1)).toEqual({ umbral: 1.3, sensibilidad: 0.25, tasaFalsosRojos: 0 }); // F (1,20) deja de ser rojo
  });
});

describe("agregación entre semillas", () => {
  const corrida = (semilla: number, v2B: EstadoSemaforo): MetricasCorrida =>
    metricasCorrida(semilla, V1, V2.map((s) => (s.tallerId === "B" ? { ...s, estado: v2B } : s)), VERDAD, PARAMETROS_SEMAFORO);
  const e = agregarSemillas("test", [corrida(1, "rojo"), corrida(2, "ambar"), corrida(3, "verde")]);

  it("percentiles correctos sobre un caso conocido (rojo en subcontrata: 0,5 / 0 / 0)", () => {
    const sub = e.porArquetipo.find((a) => a.arquetipo === "subcontrata_oculta")!;
    expect(sub.v2.rojo).toEqual({ media: 0.1667, p5: 0, p95: 0.45, min: 0, max: 0.5, n: 3 });
    expect(sub.talleresTotales).toBe(6);
    expect(e.sinDatosEnRojoTotal).toEqual({ v1: 0, v2: 0 });
  });

  it("5 frases para el pitch, cada una con su número y «en datos sintéticos»; markdown sin palabras vetadas", () => {
    expect(e.frases).toHaveLength(5);
    for (const f of e.frases) {
      expect(f).toMatch(/^En datos sintéticos/);
      expect(f).toMatch(/\d/);
    }
    const md = evaluacionSemillasMarkdown(e);
    expect(md).toMatch(/en datos sintéticos/);
    expect(md).not.toMatch(/fraude|ilegal|explotaci|certifica/i);
  });
});

describe("evaluación multisemilla de principio a fin (en memoria)", () => {
  const esc = ESCENARIOS.pitch;
  const correr = (semillas: number[]) =>
    agregarSemillas(
      "pitch",
      semillas.map((s) => {
        const salida = generar(esc, s, P);
        const { dataset } = ingerir(salida.archivos, { escenario: "pitch", marcaId: esc.marcaId, marcaNombre: esc.marcaNombre, parametros: P, hashCrudo: "t" });
        const v1 = puntuar(dataset);
        const v2 = puntuarV2(dataset, P);
        return metricasCorrida(s, v1, v2, salida.verdad, dataset.seed.parametros);
      }),
    );

  it("es determinista: mismas semillas → mismo JSON", () => {
    expect(JSON.stringify(correr([1, 2, 3]))).toBe(JSON.stringify(correr([1, 2, 3])));
  });

  it("nunca hay talleres sin informe en rojo, en ninguna versión", () => {
    const e = correr([1, 2, 3, 4, 5]);
    expect(e.sinDatosEnRojoTotal).toEqual({ v1: 0, v2: 0 });
    expect(e.semillas).toEqual([1, 2, 3, 4, 5]);
  });

  it("el script multisemilla puntúa antes de mirar la verdad oculta", () => {
    const f = readFileSync(join(RAIZ, "scripts", "datos", "evaluar-semillas.ts"), "utf8");
    expect(f.indexOf("puntuar(")).toBeGreaterThan(0);
    expect(f.indexOf("puntuarV2(")).toBeLessThan(f.indexOf(".verdad"));
    expect(f.indexOf("puntuar(")).toBeLessThan(f.indexOf(".verdad"));
    expect(f).not.toMatch(/from "@\//);
  });
});
