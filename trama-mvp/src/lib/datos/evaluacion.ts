/**
 * Score N1 (= motor actual, sin cambios) y evaluación contra la verdad oculta del generador.
 * El score NO lee la verdad: solo `evaluar()` la cruza después. Todas las cifras son «en datos sintéticos».
 */
import { estadoPanel, evaluarCadena } from "../calculo/semaforo.ts";
import type { EstadoSemaforo, Seed } from "../calculo/tipos.ts";
import type { Arquetipo, Confianza, DatasetIngerido, ResultadoScore, Verdad } from "./contratos.ts";
import { estadoConUmbral, type ResultadoScoreV2 } from "./score.ts";

const fmtH = (h: number) => Math.round(h).toLocaleString("es-ES");

/** Score de cada taller de nivel 1 en el mes de evaluación, con el motor del MVP (semaforo.ts). */
export function puntuar(d: DatasetIngerido): ResultadoScore[] {
  const seed: Seed = d.seed;
  const mes = seed.meta.mesEvaluacionActual;
  return seed.talleres
    .filter((t) => t.nivel === 1)
    .map((t) => {
      const ev = evaluarCadena(seed, t.id, mes);
      const estado = estadoPanel(seed, t.id, mes);
      const avisos = d.incidencias.filter((i) => i.gravedad === "aviso" && i.entidad.includes(t.id));
      const motivos = [
        ...(estado === "sin_datos" ? ["Falta el informe de plantilla de algún mes de la ventana."] : []),
        ...avisos.map((i) => `${i.codigo}: ${i.detalle}`),
        "Minutos del escandallo sin suelo público (marroquinería): sin contrastar.",
      ];
      const confianza: Confianza = estado === "sin_datos" ? "baja" : avisos.length ? "media" : "alta";
      const explicacion =
        estado === "sin_datos"
          ? [`Sin informe de ${ev.mesesSinCertificado?.join(", ")}: no se calcula el semáforo (nunca rojo por falta de datos).`]
          : [
              `Entre ${ev.ventana[0]} y ${ev.ventana.at(-1)}, tus pedidos necesitan unas ${fmtH(ev.horasNecesarias ?? 0)} h; el informe de plantilla recoge ${fmtH(ev.horasCotizadas ?? 0)} h de alta.`,
              ev.ratio == null ? "Ratio ∞: hay carga y 0 h de alta." : `Ratio ${ev.ratio.toFixed(2).replace(".", ",")}× → ${estado}.`,
              "Es un indicio que abre una revisión, no una prueba. Decide una persona.",
            ];
      return {
        tallerId: t.id,
        mes,
        ratio: estado === "sin_datos" ? undefined : ev.ratio,
        estado,
        confianza,
        motivosConfianza: motivos,
        minutosUsados: "escandallo",
        horasFuente: estado === "sin_datos" ? "ninguna" : "informe_es",
        explicacion,
      } satisfies ResultadoScore;
    });
}

export interface Evaluacion {
  escenario: string;
  semilla: number;
  mes: string;
  talleres: number;
  etiqueta: "datos sintéticos";
  porArquetipo: { arquetipo: Arquetipo; problemaReal: boolean; n: number; estados: Record<EstadoSemaforo, number> }[];
  matriz: { vp: number; fn: number; fp: number; vn: number }; // positivo = problema real; alerta = rojo
  sensibilidadRojo: number | null;
  sensibilidadRojoOAmbar: number | null;
  precisionRojo: number | null;
  falsosRojosEnSanos: number; // rojos entre talleres sin problema real
  sinDatosEnRojo: number; // debe ser 0
  detalle: { tallerId: string; arquetipo: Arquetipo; problemaReal: boolean; estado: EstadoSemaforo; ratio: number | null | undefined; ratioReal: number }[];
}

const div = (a: number, b: number) => (b === 0 ? null : Math.round((a / b) * 1000) / 1000);

export function evaluar(scores: ResultadoScore[], verdad: Verdad): Evaluacion {
  const vacio = (): Record<EstadoSemaforo, number> => ({ verde: 0, ambar: 0, rojo: 0, sin_datos: 0 });
  const porArq = new Map<Arquetipo, { problemaReal: boolean; n: number; estados: Record<EstadoSemaforo, number> }>();
  const m = { vp: 0, fn: 0, fp: 0, vn: 0 };
  let rojoOAmbarEnProblema = 0;
  let problemas = 0;
  let sinDatosEnRojo = 0;
  const detalle: Evaluacion["detalle"] = [];

  for (const v of verdad.talleres) {
    const s = scores.find((x) => x.tallerId === v.tallerId);
    if (!s) throw new Error(`Sin score para ${v.tallerId}`);
    const a = porArq.get(v.arquetipo) ?? { problemaReal: v.problemaReal, n: 0, estados: vacio() };
    a.n++;
    a.estados[s.estado]++;
    porArq.set(v.arquetipo, a);
    const alerta = s.estado === "rojo";
    if (v.problemaReal) {
      problemas++;
      if (alerta) m.vp++; else m.fn++;
      if (s.estado === "rojo" || s.estado === "ambar") rojoOAmbarEnProblema++;
    } else if (alerta) m.fp++;
    else m.vn++;
    if (v.arquetipo === "informe_tardio_o_ausente" && s.estado === "rojo") sinDatosEnRojo++;
    detalle.push({ tallerId: v.tallerId, arquetipo: v.arquetipo, problemaReal: v.problemaReal, estado: s.estado, ratio: s.ratio, ratioReal: v.ratioRealMedio });
  }

  return {
    escenario: verdad.escenario,
    semilla: verdad.semilla,
    mes: scores[0]?.mes ?? "",
    talleres: verdad.talleres.length,
    etiqueta: "datos sintéticos",
    porArquetipo: [...porArq.entries()].map(([arquetipo, x]) => ({ arquetipo, ...x })),
    matriz: m,
    sensibilidadRojo: div(m.vp, m.vp + m.fn),
    sensibilidadRojoOAmbar: div(rojoOAmbarEnProblema, problemas),
    precisionRojo: div(m.vp, m.vp + m.fp),
    falsosRojosEnSanos: m.fp,
    sinDatosEnRojo,
    detalle: detalle.sort((x, y) => x.tallerId.localeCompare(y.tallerId)),
  };
}

const pct = (x: number | null) => (x == null ? "—" : `${Math.round(x * 100)} %`);
const ESTADO: Record<EstadoSemaforo, string> = { verde: "verde", ambar: "ámbar", rojo: "rojo", sin_datos: "sin datos" };

export function evaluacionMarkdown(e: Evaluacion): string {
  const L = [
    `# Evaluación del score · escenario «${e.escenario}» · semilla ${e.semilla} · **en datos sintéticos**`,
    "",
    `> Todas las cifras salen de talleres INVENTADOS por el generador, cuya verdad conocemos. No es una validación con clientes ni con datos reales. Score = motor actual del MVP (\`semaforo.ts\`), ventana de 3 meses que termina en ${e.mes}.`,
    "",
    "## Resumen",
    "",
    `- Talleres: ${e.talleres} · con problema real de capacidad: ${e.matriz.vp + e.matriz.fn}`,
    `- Detectados en **rojo**: ${e.matriz.vp} de ${e.matriz.vp + e.matriz.fn} (${pct(e.sensibilidadRojo)}) · en rojo o ámbar: ${pct(e.sensibilidadRojoOAmbar)}`,
    `- Precisión del rojo: ${pct(e.precisionRojo)} · **falsos rojos** en talleres sin problema: ${e.falsosRojosEnSanos}`,
    `- Talleres sin informe que acaban en rojo: ${e.sinDatosEnRojo} (regla: nunca rojo por falta de datos)`,
    "",
    "## Por arquetipo",
    "",
    "| Arquetipo | ¿Problema real? | Talleres | Verde | Ámbar | Rojo | Sin datos |",
    "|---|---|---|---|---|---|---|",
    ...e.porArquetipo.map((a) => `| ${a.arquetipo} | ${a.problemaReal ? "sí" : "no"} | ${a.n} | ${a.estados.verde} | ${a.estados.ambar} | ${a.estados.rojo} | ${a.estados.sin_datos} |`),
    "",
    "## Matriz de confusión (alerta = rojo)",
    "",
    "| | Rojo | No rojo |",
    "|---|---|---|",
    `| Problema real | ${e.matriz.vp} | ${e.matriz.fn} |`,
    `| Sin problema | ${e.matriz.fp} | ${e.matriz.vn} |`,
    "",
    "## Detalle por taller",
    "",
    "| Taller | Arquetipo (verdad) | Ratio de pedidos sobre capacidad (verdad) | Score | Estado |",
    "|---|---|---|---|---|",
    ...e.detalle.map((d) => `| ${d.tallerId} | ${d.arquetipo} | ${d.ratioReal.toFixed(2)} | ${d.ratio === undefined ? "—" : d.ratio === null ? "∞" : d.ratio.toFixed(2)} | ${ESTADO[d.estado]} |`),
    "",
    "## Límites (se dicen tal cual)",
    "",
    "- Una sola semilla (N1): las cifras son ilustrativas, sin intervalo. N2 repite con 20 semillas.",
    "- El score es un mínimo: solo ve los pedidos de esta marca. Una subcontrata oculta con poco exceso (ratio entre 1,0 y 1,1) sale en ámbar, no en rojo.",
    "- Los minutos son los del escandallo sintético; en marroquinería no hay suelo público con el que contrastarlos.",
  ];
  return L.join("\n") + "\n";
}

// =====================================================================
// N2 · Evaluación con muchas semillas (v1 frente a v2), con intervalos 5-95 %. Todo «en datos sintéticos».
// =====================================================================

export type VersionScore = "v1" | "v2";

export interface TasasArquetipo {
  n: number;
  rojo: number | null;
  rojoOAmbar: number | null;
  sinDatos: number | null;
  revision: number | null;
}

export interface GlobalCorrida {
  problemas: number;
  sinProblema: number;
  sensibilidadRojo: number | null;
  sensibilidadRojoOAmbar: number | null;
  precisionRojo: number | null;
  tasaFalsosRojos: number | null; // rojos entre talleres sin problema real
  falsosRojos: number;
  sinDatosEnRojo: number; // debe ser 0
  revisionVariasMarcas: number | null; // null si el escenario no tiene `varias_marcas`
}

export interface MetricasCorrida {
  semilla: number;
  talleres: number;
  porArquetipo: { arquetipo: Arquetipo; problemaReal: boolean; v1: TasasArquetipo; v2: TasasArquetipo }[];
  global: Record<VersionScore, GlobalCorrida>;
  /** Curva del umbral rojo (score v2; el umbral real del producto no cambia). */
  curva: { umbral: number; sensibilidad: number | null; tasaFalsosRojos: number | null }[];
  /** Efecto del suelo de minutos: talleres donde actúa, y cuántos cambian de estado de v1 a v2. */
  suelo: { conSuelo: number; cambianDeEstado: number; pasanARojo: number; minutosRebajadosConSuelo: number | null };
  /** Talleres cuyo estado v2 difiere del v1 (por cualquier motivo: suelo, Italia sin Asse.Co…). */
  cambiosV1V2: number;
}

export const UMBRALES_CURVA = [1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3];

const tasa = (a: number, b: number) => (b === 0 ? null : Math.round((a / b) * 10000) / 10000);

/** Métricas de una semilla. Recibe los scores YA calculados; la verdad oculta solo se usa aquí, para comparar. */
export function metricasCorrida(
  semilla: number,
  v1: ResultadoScore[],
  v2: ResultadoScoreV2[],
  verdad: Verdad,
  parametros: Seed["parametros"],
): MetricasCorrida {
  const porId = { v1: new Map<string, ResultadoScore>(v1.map((s) => [s.tallerId, s])), v2: new Map(v2.map((s) => [s.tallerId, s])) };
  const arqs: Arquetipo[] = [];
  for (const v of verdad.talleres) if (!arqs.includes(v.arquetipo)) arqs.push(v.arquetipo);
  const score = (ver: VersionScore, id: string): ResultadoScore => {
    const s = porId[ver].get(id);
    if (!s) throw new Error(`Sin score ${ver} para ${id}`);
    return s;
  };
  const scoreV2 = (id: string) => score("v2", id) as ResultadoScoreV2;

  const tasas = (ver: VersionScore, arq: Arquetipo): TasasArquetipo => {
    const ss = verdad.talleres.filter((v) => v.arquetipo === arq).map((v) => score(ver, v.tallerId));
    const n = ss.length;
    return {
      n,
      rojo: tasa(ss.filter((s) => s.estado === "rojo").length, n),
      rojoOAmbar: tasa(ss.filter((s) => s.estado === "rojo" || s.estado === "ambar").length, n),
      sinDatos: tasa(ss.filter((s) => s.estado === "sin_datos").length, n),
      revision: tasa(ss.filter((s) => s.revisionAbierta).length, n),
    };
  };

  const global = (ver: VersionScore): GlobalCorrida => {
    const pr = verdad.talleres.filter((v) => v.problemaReal).map((v) => score(ver, v.tallerId));
    const sp = verdad.talleres.filter((v) => !v.problemaReal).map((v) => score(ver, v.tallerId));
    const vp = pr.filter((s) => s.estado === "rojo").length;
    const fp = sp.filter((s) => s.estado === "rojo").length;
    const vm = verdad.talleres.filter((v) => v.arquetipo === "varias_marcas").map((v) => score(ver, v.tallerId));
    const sinDatosEnRojo = verdad.talleres.filter((v) => {
      const s = score(ver, v.tallerId);
      return s.estado === "rojo" && (v.arquetipo === "informe_tardio_o_ausente" || s.horasFuente === "ninguna");
    }).length;
    return {
      problemas: pr.length,
      sinProblema: sp.length,
      sensibilidadRojo: tasa(vp, pr.length),
      sensibilidadRojoOAmbar: tasa(pr.filter((s) => s.estado === "rojo" || s.estado === "ambar").length, pr.length),
      precisionRojo: tasa(vp, vp + fp),
      tasaFalsosRojos: tasa(fp, sp.length),
      falsosRojos: fp,
      sinDatosEnRojo,
      revisionVariasMarcas: vm.length ? tasa(vm.filter((s) => s.revisionAbierta).length, vm.length) : null,
    };
  };

  const curva = UMBRALES_CURVA.map((u) => {
    let vp = 0, fp = 0, np = 0, nn = 0;
    for (const v of verdad.talleres) {
      const rojo = estadoConUmbral(scoreV2(v.tallerId), parametros, u) === "rojo";
      if (v.problemaReal) {
        np++;
        if (rojo) vp++;
      } else {
        nn++;
        if (rojo) fp++;
      }
    }
    return { umbral: u, sensibilidad: tasa(vp, np), tasaFalsosRojos: tasa(fp, nn) };
  });

  const conSuelo = v2.filter((s) => s.minutosUsados === "suelo");
  const rebajados = verdad.talleres.filter((v) => v.arquetipo === "minutos_rebajados");
  return {
    semilla,
    talleres: verdad.talleres.length,
    porArquetipo: arqs.map((a) => ({
      arquetipo: a,
      problemaReal: verdad.talleres.find((v) => v.arquetipo === a)!.problemaReal,
      v1: tasas("v1", a),
      v2: tasas("v2", a),
    })),
    global: { v1: global("v1"), v2: global("v2") },
    curva,
    suelo: {
      conSuelo: conSuelo.length,
      cambianDeEstado: conSuelo.filter((s) => s.estado !== s.estadoV1).length,
      pasanARojo: conSuelo.filter((s) => s.estado === "rojo" && s.estadoV1 !== "rojo").length,
      minutosRebajadosConSuelo: rebajados.length
        ? tasa(rebajados.filter((v) => scoreV2(v.tallerId).minutosUsados === "suelo").length, rebajados.length)
        : null,
    },
    cambiosV1V2: v2.filter((s) => s.estado !== s.estadoV1).length,
  };
}

// ---------- Agregación entre semillas ----------
export interface Intervalo {
  media: number | null;
  p5: number | null;
  p95: number | null;
  min: number | null;
  max: number | null;
  n: number; // semillas con valor (las que tienen denominador > 0)
}

const r4 = (x: number) => Math.round(x * 10000) / 10000;

/** Percentil con interpolación lineal entre posiciones (tipo 7, el de numpy y R por defecto). */
export function percentil(valores: number[], p: number): number | null {
  if (!valores.length) return null;
  const v = [...valores].sort((a, b) => a - b);
  const h = (v.length - 1) * p;
  const lo = Math.floor(h);
  const hi = Math.ceil(h);
  return v[lo] + (h - lo) * (v[hi] - v[lo]);
}

export function intervalo(xs: (number | null | undefined)[]): Intervalo {
  const v = xs.filter((x): x is number => typeof x === "number");
  const media = v.length ? v.reduce((s, x) => s + x, 0) / v.length : null;
  const q = (p: number) => {
    const r = percentil(v, p);
    return r == null ? null : r4(r);
  };
  return { media: media == null ? null : r4(media), p5: q(0.05), p95: q(0.95), min: q(0), max: q(1), n: v.length };
}

type ClaveTasa = Exclude<keyof TasasArquetipo, "n">;
type ClaveGlobal = Exclude<keyof GlobalCorrida, "problemas" | "sinProblema">;
const CLAVES_TASA: ClaveTasa[] = ["rojo", "rojoOAmbar", "sinDatos", "revision"];
const CLAVES_GLOBAL: ClaveGlobal[] = [
  "sensibilidadRojo", "sensibilidadRojoOAmbar", "precisionRojo", "tasaFalsosRojos", "falsosRojos", "sinDatosEnRojo", "revisionVariasMarcas",
];

export interface EvaluacionSemillas {
  escenario: string;
  etiqueta: "datos sintéticos";
  semillas: number[];
  talleresPorSemilla: Intervalo;
  porArquetipo: {
    arquetipo: Arquetipo;
    problemaReal: boolean;
    talleresTotales: number;
    v1: Record<ClaveTasa, Intervalo>;
    v2: Record<ClaveTasa, Intervalo>;
  }[];
  global: Record<VersionScore, Record<ClaveGlobal, Intervalo>>;
  sinDatosEnRojoTotal: Record<VersionScore, number>;
  curva: { umbral: number; sensibilidad: Intervalo; tasaFalsosRojos: Intervalo }[];
  suelo: { conSuelo: Intervalo; cambianDeEstado: Intervalo; pasanARojo: Intervalo; minutosRebajadosConSuelo: Intervalo };
  cambiosV1V2Total: number;
  frases: string[];
  noDetecta: string[];
  corridas: MetricasCorrida[];
}

export function agregarSemillas(escenario: string, corridas: MetricasCorrida[]): EvaluacionSemillas {
  const arqs: { arquetipo: Arquetipo; problemaReal: boolean }[] = [];
  for (const c of corridas)
    for (const a of c.porArquetipo)
      if (!arqs.some((x) => x.arquetipo === a.arquetipo)) arqs.push({ arquetipo: a.arquetipo, problemaReal: a.problemaReal });
  const deArq = (c: MetricasCorrida, a: Arquetipo) => c.porArquetipo.find((x) => x.arquetipo === a);
  const tasasDe = (a: Arquetipo, ver: VersionScore) =>
    Object.fromEntries(CLAVES_TASA.map((k) => [k, intervalo(corridas.map((c) => deArq(c, a)?.[ver][k]))])) as Record<ClaveTasa, Intervalo>;
  const globalDe = (ver: VersionScore) =>
    Object.fromEntries(CLAVES_GLOBAL.map((k) => [k, intervalo(corridas.map((c) => c.global[ver][k]))])) as Record<ClaveGlobal, Intervalo>;

  const e: EvaluacionSemillas = {
    escenario,
    etiqueta: "datos sintéticos",
    semillas: corridas.map((c) => c.semilla),
    talleresPorSemilla: intervalo(corridas.map((c) => c.talleres)),
    porArquetipo: arqs.map(({ arquetipo, problemaReal }) => ({
      arquetipo,
      problemaReal,
      talleresTotales: corridas.reduce((s, c) => s + (deArq(c, arquetipo)?.v2.n ?? 0), 0),
      v1: tasasDe(arquetipo, "v1"),
      v2: tasasDe(arquetipo, "v2"),
    })),
    global: { v1: globalDe("v1"), v2: globalDe("v2") },
    sinDatosEnRojoTotal: {
      v1: corridas.reduce((s, c) => s + c.global.v1.sinDatosEnRojo, 0),
      v2: corridas.reduce((s, c) => s + c.global.v2.sinDatosEnRojo, 0),
    },
    curva: UMBRALES_CURVA.map((u, i) => ({
      umbral: u,
      sensibilidad: intervalo(corridas.map((c) => c.curva[i]?.sensibilidad)),
      tasaFalsosRojos: intervalo(corridas.map((c) => c.curva[i]?.tasaFalsosRojos)),
    })),
    suelo: {
      conSuelo: intervalo(corridas.map((c) => c.suelo.conSuelo)),
      cambianDeEstado: intervalo(corridas.map((c) => c.suelo.cambianDeEstado)),
      pasanARojo: intervalo(corridas.map((c) => c.suelo.pasanARojo)),
      minutosRebajadosConSuelo: intervalo(corridas.map((c) => c.suelo.minutosRebajadosConSuelo)),
    },
    cambiosV1V2Total: corridas.reduce((s, c) => s + c.cambiosV1V2, 0),
    frases: [],
    noDetecta: [],
    corridas,
  };
  e.frases = frasesPitch(e);
  e.noDetecta = noDetecta(e);
  return e;
}

// ---------- Textos (pitch y límites) ----------
const p100 = (x: number | null) => (x == null ? "—" : `${Math.round(x * 100)} %`);

/** «67 % (intervalo 5-95 % entre semillas: 33-100 %)»; si todas las semillas dan lo mismo, «100 % (igual en las 20 semillas)». */
export function fmtIntervalo(i: Intervalo): string {
  if (i.media == null) return "—";
  if (i.min === i.max) return `${p100(i.media)} (igual en las ${i.n} semillas)`;
  return `${p100(i.media)} (intervalo 5-95 % entre semillas: ${Math.round((i.p5 ?? 0) * 100)}-${p100(i.p95)})`;
}

/** Versión compacta para tablas: «90 % (65-100)» o «0 %» si no varía. */
export function fmtCorto(i: Intervalo): string {
  if (i.media == null) return "—";
  if (i.min === i.max) return p100(i.media);
  return `${p100(i.media)} (${Math.round((i.p5 ?? 0) * 100)}-${Math.round((i.p95 ?? 0) * 100)})`;
}

const NOMBRE_ARQ: Partial<Record<Arquetipo, string>> = {
  sano: "talleres sanos",
  pico_legitimo: "talleres con un pico legítimo de un mes",
  subcontrata_oculta: "talleres que pasan trabajo a una subcontrata no declarada",
  personal_sin_alta: "talleres con personal sin alta",
  media_jornada_falsa: "talleres con altas a media jornada que trabajan a jornada completa",
  informe_tardio_o_ausente: "talleres con el informe tardío o ausente",
  rectificacion: "talleres con informes rectificados",
  minutos_rebajados: "talleres cuya marca rebajó los minutos del escandallo",
  varias_marcas: "talleres que trabajan para varias marcas",
  micro: "talleres de 3 personas o menos",
};
const nombreArq = (a: Arquetipo) => NOMBRE_ARQ[a] ?? `talleres «${a}»`;

function frasesPitch(e: EvaluacionSemillas): string[] {
  const g = e.global.v2;
  const n = e.semillas.length;
  const nt = Math.round(e.talleresPorSemilla.media ?? 0);
  const arq = (a: Arquetipo) => e.porArquetipo.find((x) => x.arquetipo === a);
  const totalProblema = e.porArquetipo.filter((a) => a.problemaReal).reduce((s, a) => s + a.talleresTotales, 0);
  const totalSano = e.porArquetipo.filter((a) => !a.problemaReal).reduce((s, a) => s + a.talleresTotales, 0);
  const F = [
    `En datos sintéticos (${n} semillas de ${nt} talleres inventados; ${totalProblema} casos con un problema real de capacidad en total), Trama pone en rojo el ${fmtIntervalo(g.sensibilidadRojo)} de los talleres con problema.`,
    `En datos sintéticos, el ${fmtIntervalo(g.sensibilidadRojoOAmbar)} de los talleres con un problema real queda al menos en ámbar, que ya obliga a pedir una explicación al proveedor.`,
    g.tasaFalsosRojos.max === 0
      ? `En datos sintéticos, ninguno de los ${totalSano} talleres sin problema real (${e.porArquetipo.filter((a) => !a.problemaReal).map((a) => a.arquetipo).join(", ")}) salió en rojo en las ${n} semillas: 0 falsos rojos.`
      : `En datos sintéticos, sale en rojo el ${fmtIntervalo(g.tasaFalsosRojos)} de los talleres sin problema real (falsos rojos).`,
    e.sinDatosEnRojoTotal.v2 === 0
      ? `En datos sintéticos, ningún taller sin informe acabó en rojo en las ${n} semillas (0 casos): si falta el dato, Trama dice «sin datos», no acusa.`
      : `En datos sintéticos, ${e.sinDatosEnRojoTotal.v2} talleres sin informe acabaron en rojo en ${n} semillas: hay que revisarlo antes de enseñarlo.`,
  ];
  const reb = arq("minutos_rebajados");
  const vm = arq("varias_marcas");
  const pico = arq("pico_legitimo");
  if (reb)
    F.push(
      `En datos sintéticos, con el suelo público de minutos los ${nombreArq("minutos_rebajados")} pasan del ${fmtIntervalo(reb.v1.rojo)} en rojo sin suelo al ${fmtIntervalo(reb.v2.rojo)} con suelo.`,
    );
  else if (vm)
    F.push(
      `En datos sintéticos, con la cuota de facturación se abre una revisión en el ${fmtIntervalo(vm.v2.revision)} de los ${nombreArq("varias_marcas")}, sin ponerlos en rojo.`,
    );
  else if (pico)
    F.push(
      `En datos sintéticos, un pico legítimo de un mes acaba en rojo en el ${fmtIntervalo(pico.v2.rojo)} de los casos y en rojo o ámbar en el ${fmtIntervalo(pico.v2.rojoOAmbar)}: la ventana de 3 meses lo absorbe.`,
    );
  return F;
}

function noDetecta(e: EvaluacionSemillas): string[] {
  const L = [
    "Personal sin alta o altas a media jornada falsas: si la carga de pedidos de la marca cabe en las horas declaradas, no hay ninguna señal. El score compara pedidos con horas de alta; no cuenta personas.",
    "Trabajo de otras marcas que no están en Trama: sin cuota de facturación es invisible; con cuota solo abre una revisión, nunca da rojo (por diseño).",
    "Subcontrata oculta con poco exceso (ratio entre 1,0 y 1,1): sale en ámbar, no en rojo.",
    "Minutos rebajados en piel y calzado: no hay suelo público, así que el suelo no actúa y la rebaja solo queda en el historial del escandallo.",
    "Talleres sin informe: «sin datos», nunca rojo. Es una regla del producto, no un fallo de detección.",
    "Es un mínimo con los pedidos de una marca: si el problema no deja huella en los datos que llegan, ningún score lo ve.",
  ];
  for (const a of e.porArquetipo)
    if (a.problemaReal && a.v2.rojoOAmbar.media != null && a.v2.rojoOAmbar.media < 0.5)
      L.push(`En datos sintéticos, los ${nombreArq(a.arquetipo)} solo quedan en rojo o ámbar el ${fmtIntervalo(a.v2.rojoOAmbar)}.`);
  return L;
}

export function evaluacionSemillasMarkdown(e: EvaluacionSemillas): string {
  const fi = fmtCorto;
  const g = (k: ClaveGlobal, nombre: string) => `| ${nombre} | ${fi(e.global.v1[k])} | ${fi(e.global.v2[k])} |`;
  const num = (i: Intervalo) => (i.media == null ? "—" : i.min === i.max ? `${i.media}` : `${i.media} (${i.p5}-${i.p95})`);
  const L = [
    `# Evaluación con ${e.semillas.length} semillas · escenario «${e.escenario}» · **en datos sintéticos**`,
    "",
    `> Talleres INVENTADOS por el generador, cuya situación real conocemos. No es una validación con clientes ni con datos reales. Semillas ${e.semillas[0]}-${e.semillas.at(-1)}; ${num(e.talleresPorSemilla)} talleres por semilla. En las tablas, cada cifra es la media entre semillas y, entre paréntesis, los percentiles 5 y 95 (sin paréntesis: igual en todas las semillas). v1 = motor actual del MVP (\`semaforo.ts\`); v2 = score v2 (\`score.ts\`: suelo de minutos, LUL en Italia sin exigir Asse.Co, cuota de facturación que abre revisión). Mismos umbrales.`,
    "",
    "## 5 frases para el pitch",
    "",
    ...e.frases.map((f, i) => `${i + 1}. ${f}`),
    "",
    "## Global (v1 frente a v2)",
    "",
    "| Métrica | v1 | v2 |",
    "|---|---|---|",
    g("sensibilidadRojo", "Talleres con problema real en rojo (sensibilidad)"),
    g("sensibilidadRojoOAmbar", "Talleres con problema real en rojo o ámbar"),
    g("precisionRojo", "Rojos que tienen un problema real (precisión)"),
    g("tasaFalsosRojos", "Rojos entre talleres sin problema real (falsos rojos)"),
    `| Talleres sin informe en rojo (casos en total; debe ser 0) | ${e.sinDatosEnRojoTotal.v1} | ${e.sinDatosEnRojoTotal.v2} |`,
    g("revisionVariasMarcas", "`varias_marcas` con revisión abierta"),
    "",
    `Talleres que cambian de estado de v1 a v2 (todas las semillas): ${e.cambiosV1V2Total}.${e.cambiosV1V2Total === 0 ? " Con este generador (España, piel sin suelo público, sin cuotas) v1 y v2 coinciden; las diferencias aparecerán con Italia sin Asse.Co, minutos rebajados con suelo y varias marcas." : ""}`,
    "",
    "## Por arquetipo (v1 → v2)",
    "",
    "| Arquetipo | ¿Problema real? | Talleres (todas las semillas) | En rojo | En rojo o ámbar | Sin datos | Revisión abierta (v2) |",
    "|---|---|---|---|---|---|---|",
    ...e.porArquetipo.map(
      (a) =>
        `| ${a.arquetipo} | ${a.problemaReal ? "sí" : "no"} | ${a.talleresTotales} | ${fi(a.v1.rojo)} → ${fi(a.v2.rojo)} | ${fi(a.v1.rojoOAmbar)} → ${fi(a.v2.rojoOAmbar)} | ${fi(a.v1.sinDatos)} → ${fi(a.v2.sinDatos)} | ${fi(a.v2.revision)} |`,
    ),
    "",
    "## Curva del umbral rojo (score v2; el producto sigue en 1,10)",
    "",
    "| Umbral rojo | Sensibilidad (rojo) | Falsos rojos en talleres sin problema |",
    "|---|---|---|",
    ...e.curva.map((c) => `| ${c.umbral.toFixed(2).replace(".", ",")}${c.umbral === 1.1 ? " (actual)" : ""} | ${fi(c.sensibilidad)} | ${fi(c.tasaFalsosRojos)} |`),
    "",
    "El umbral de los talleres de 3 personas o menos se mueve a la vez y conserva su margen (+0,15).",
    "",
    "## Efecto del suelo de minutos (v1 frente a v2)",
    "",
    `- Talleres por semilla en los que el suelo cambia el cálculo: ${num(e.suelo.conSuelo)}; de ellos cambian de estado: ${num(e.suelo.cambianDeEstado)}; pasan a rojo: ${num(e.suelo.pasanARojo)}.`,
    e.suelo.minutosRebajadosConSuelo.n
      ? `- En \`minutos_rebajados\`, el suelo actúa en el ${fi(e.suelo.minutosRebajadosConSuelo)} de los talleres (solo puede actuar en categorías con suelo público, como la americana forrada).`
      : "- El escenario de estas semillas no tiene el arquetipo `minutos_rebajados`: el efecto del suelo todavía no se puede medir con este generador.",
    "",
    "## Qué NO detecta (por construcción)",
    "",
    ...e.noDetecta.map((x) => `- ${x}`),
    "",
    "## Cómo se ha calculado",
    "",
    "- Por cada semilla: el generador crea los archivos y la verdad oculta; la ingesta lee solo los archivos; v1 y v2 puntúan el dataset; solo después se compara con la verdad.",
    "- Percentiles 5-95 con interpolación lineal entre semillas. Una tasa sin denominador (p. ej. un arquetipo ausente en una semilla) no cuenta para esa semilla.",
    "- Meses hasta la detección: no medido (el generador evalúa un único mes).",
  ];
  return L.join("\n") + "\n";
}
