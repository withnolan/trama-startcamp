/**
 * Score N1 (= motor actual, sin cambios) y evaluación contra la verdad oculta del generador.
 * El score NO lee la verdad: solo `evaluar()` la cruza después. Todas las cifras son «en datos sintéticos».
 */
import { estadoPanel, evaluarCadena } from "../calculo/semaforo.ts";
import type { EstadoSemaforo, Seed } from "../calculo/tipos.ts";
import type { Arquetipo, Confianza, DatasetIngerido, ResultadoScore, Verdad } from "./contratos.ts";

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
