/**
 * Muestra laboral (OIT): generación SINTÉTICA e ingesta de dos tablas agregadas por taller y trimestre que entrega el
 * revisor independiente (sindicato u ONG) tras entrevistas confidenciales y revisión de nóminas y registro de jornada.
 * Nunca hay datos por persona: si se entrevistó a menos de 4 personas, el revisor no da cifras (privacidad).
 */
import {
  ARCHIVO,
  CABECERAS,
  type ArchivosCrudos,
  type Arquetipo,
  type Incidencia,
  type IndicadoresLaborales,
} from "./contratos.ts";
import { aCsv, leerCsv } from "./csv.ts";
import { crearRng, type Rng } from "./prng.ts";

/** Supuesto S-L1: salario mensual de convenio de referencia (12 pagas, sintético). */
export const SALARIO_CONVENIO_REF = 1400;
export const MIN_ENTREVISTAS = 4;

/** Indicadores de la OIT (2012/2025) que simula cada arquetipo laboral. */
export const OIT_POR_ARQUETIPO: Partial<Record<Arquetipo, string[]>> = {
  horas_extra_excesivas: ["horas extra excesivas", "condiciones de trabajo y de vida abusivas"],
  salario_retenido: ["retención de salario", "servidumbre por deudas (posible)"],
  silencio_alta_rotacion: ["intimidación y amenazas (posible)", "abuso de la vulnerabilidad (posible)"],
  subcontrata_oculta: ["horas extra excesivas (posible)", "condiciones de trabajo abusivas (posible)"],
};

export interface TallerParaLaboral {
  tallerId: string;
  arquetipo: Arquetipo;
  personas: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;

/** Genera `salarios_horas.csv` y `voz_quejas.csv` con señales correlacionadas por arquetipo. RNG propio: no altera el resto. */
export function generarLaboral(talleres: TallerParaLaboral[], periodo: string, semilla: number): ArchivosCrudos {
  const rng: Rng = crearRng((semilla ^ 0x5bd1e995) >>> 0);
  const sh: Record<string, string | number>[] = [];
  const vq: Record<string, string | number>[] = [];
  for (const t of talleres) {
    const a = t.arquetipo;
    const entrevistadas = t.personas < MIN_ENTREVISTAS ? t.personas : Math.min(t.personas, rng.entero(4, 12));
    const suprimir = entrevistadas < MIN_ENTREVISTAS;

    // Horas: el registro del taller suele cuadrar con la jornada; las entrevistas cuentan la realidad.
    const registro = r1(rng.uniforme(39, 41));
    let extra = r1(rng.uniforme(0, 4));
    let entrevistas = r1(registro + rng.uniforme(-1, 2));
    let pagadas = Math.round(rng.uniforme(90, 100));
    if (a === "pico_legitimo" || a === "subcontrata_oculta") extra = r1(rng.uniforme(2, 7));
    if (a === "horas_extra_excesivas") {
      extra = r1(rng.uniforme(10, 18));
      entrevistas = r1(registro + extra * rng.uniforme(0.8, 1.0));
      pagadas = Math.round(rng.uniforme(15, 55));
    }

    // Salario: mediana sobre convenio, pago puntual y deducciones bajas, salvo retención.
    let salario = Math.round(SALARIO_CONVENIO_REF * rng.uniforme(1.03, 1.25));
    let retraso = rng.entero(0, 5);
    let deducciones = r1(rng.uniforme(0, 3));
    if (a === "salario_retenido") {
      salario = Math.round(SALARIO_CONVENIO_REF * rng.uniforme(0.72, 0.95));
      retraso = rng.entero(30, 75);
      deducciones = r1(rng.uniforme(12, 30));
    }

    // Voz: canal accesible y quejas proporcionales al tamaño, salvo silencio con alta rotación.
    let canal = rng.next() < 0.85 ? "accesible" : "no_existe";
    let quejas = Math.max(0, Math.round(t.personas * rng.uniforme(0.05, 0.35)));
    let resueltas = Math.round(quejas * rng.uniforme(0.7, 1));
    let rotacion = Math.round(rng.uniforme(5, 30));
    let represalias = 0;
    if (a === "silencio_alta_rotacion") {
      canal = rng.next() < 0.5 ? "inaccesible" : "no_existe";
      quejas = 0;
      resueltas = 0;
      rotacion = Math.round(rng.uniforme(60, 120));
      represalias = rng.entero(0, 2);
    }

    sh.push({
      taller_id: t.tallerId, periodo, personas_entrevistadas: entrevistadas,
      horas_semana_registro: registro,
      horas_semana_entrevistas: suprimir ? "" : entrevistas,
      horas_extra_semana: suprimir ? "" : extra,
      pct_horas_extra_pagadas: suprimir ? "" : pagadas,
      salario_mediano_mes_eur: suprimir ? "" : salario,
      salario_convenio_mes_eur: SALARIO_CONVENIO_REF,
      dias_retraso_pago: retraso,
      pct_deducciones: suprimir ? "" : deducciones,
    });
    vq.push({
      taller_id: t.tallerId, periodo, canal_quejas: canal, quejas_recibidas: quejas, quejas_resueltas: resueltas,
      rotacion_anual_pct: rotacion, represalias_reportadas: suprimir ? "" : represalias,
    });
  }
  return { salarios_horas: aCsv(CABECERAS.salarios_horas, sh), voz_quejas: aCsv(CABECERAS.voz_quejas, vq) };
}

/** Ingesta de las dos tablas laborales. Celda vacía = null (sin dato o suprimido). Filas inválidas se descartan con incidencia. */
export function ingerirLaboral(archivos: ArchivosCrudos, talleresIds: string[]): { laboral: IndicadoresLaborales[]; incidencias: Incidencia[] } {
  const inc: Incidencia[] = [];
  const porTaller = new Map<string, IndicadoresLaborales>();
  const nuevo = (tallerId: string, periodo: string): IndicadoresLaborales => ({
    tallerId, periodo, personasEntrevistadas: 0, horasSemanaRegistro: null, horasSemanaEntrevistas: null, horasExtraSemana: null,
    pctHorasExtraPagadas: null, salarioMedianoMes: null, salarioConvenioMes: null, diasRetrasoPago: null, pctDeducciones: null,
    canalQuejas: null, quejasRecibidas: null, quejasResueltas: null, rotacionAnualPct: null, represaliasReportadas: null,
  });
  const num = (s: string, min: number, max: number): number | null | "error" => {
    if (s === "") return null;
    if (!/^-?\d+(\.\d+)?$/.test(s)) return "error";
    const x = Number(s);
    return x < min || x > max ? "error" : x;
  };

  for (const nombre of ["salarios_horas", "voz_quejas"] as const) {
    const texto = archivos[nombre];
    const archivo = ARCHIVO[nombre];
    if (texto === undefined) {
      inc.push({ codigo: "FALTA_INFORME", gravedad: "aviso", entidad: archivo, detalle: "No ha llegado la tabla del revisor: la dimensión laboral queda sin información." });
      continue;
    }
    const csv = leerCsv(texto);
    if (csv.cabecera.join(";") !== CABECERAS[nombre].join(";")) {
      inc.push({ codigo: "CABECERA_INVALIDA", gravedad: "bloqueante", entidad: archivo, detalle: "Cabecera distinta del contrato. Archivo descartado entero." });
      continue;
    }
    for (const { numero, valores: v } of csv.filas) {
      const ent = `${archivo}:${numero} · taller:${v.taller_id}`;
      if (!talleresIds.includes(v.taller_id)) {
        inc.push({ codigo: "REFERENCIA_DESCONOCIDA", gravedad: "bloqueante", entidad: ent, detalle: "Fila descartada: taller desconocido." });
        continue;
      }
      const r = porTaller.get(v.taller_id) ?? nuevo(v.taller_id, v.periodo);
      const campos: [keyof IndicadoresLaborales, string, number, number][] =
        nombre === "salarios_horas"
          ? [
              ["personasEntrevistadas", v.personas_entrevistadas, 0, 10000],
              ["horasSemanaRegistro", v.horas_semana_registro, 0, 100],
              ["horasSemanaEntrevistas", v.horas_semana_entrevistas, 0, 100],
              ["horasExtraSemana", v.horas_extra_semana, 0, 60],
              ["pctHorasExtraPagadas", v.pct_horas_extra_pagadas, 0, 100],
              ["salarioMedianoMes", v.salario_mediano_mes_eur, 0, 20000],
              ["salarioConvenioMes", v.salario_convenio_mes_eur, 0, 20000],
              ["diasRetrasoPago", v.dias_retraso_pago, 0, 365],
              ["pctDeducciones", v.pct_deducciones, 0, 100],
            ]
          : [
              ["quejasRecibidas", v.quejas_recibidas, 0, 10000],
              ["quejasResueltas", v.quejas_resueltas, 0, 10000],
              ["rotacionAnualPct", v.rotacion_anual_pct, 0, 500],
              ["represaliasReportadas", v.represalias_reportadas, 0, 10000],
            ];
      const valores = campos.map(([k, s, a, b]) => [k, num(s, a, b)] as const);
      const malo = valores.find(([, x]) => x === "error");
      if (malo) {
        inc.push({ codigo: "TIPO_INVALIDO", gravedad: "bloqueante", entidad: ent, detalle: `Fila descartada: ${String(malo[0])} fuera de rango o no numérico.` });
        continue;
      }
      for (const [k, x] of valores) (r as unknown as Record<string, unknown>)[k] = x;
      if (nombre === "voz_quejas") {
        if (!["accesible", "inaccesible", "no_existe"].includes(v.canal_quejas)) {
          inc.push({ codigo: "TIPO_INVALIDO", gravedad: "bloqueante", entidad: ent, detalle: `Fila descartada: canal_quejas «${v.canal_quejas}».` });
          continue;
        }
        r.canalQuejas = v.canal_quejas as IndicadoresLaborales["canalQuejas"];
        if ((r.quejasResueltas ?? 0) > (r.quejasRecibidas ?? 0))
          inc.push({ codigo: "PLANTILLA_INCOHERENTE", gravedad: "aviso", entidad: ent, detalle: "Más quejas resueltas que recibidas." });
      } else if (r.personasEntrevistadas < MIN_ENTREVISTAS) {
        inc.push({ codigo: "MUESTRA_INSUFICIENTE", gravedad: "info", entidad: ent, detalle: "Menos de 4 personas entrevistadas: el revisor no da cifras (privacidad)." });
      }
      porTaller.set(v.taller_id, r);
    }
  }
  return { laboral: [...porTaller.values()].sort((a, b) => a.tallerId.localeCompare(b.tallerId)), incidencias: inc };
}
