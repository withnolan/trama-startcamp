/**
 * Modelo de riesgo laboral por taller (muestra mínima). Reglas transparentes, sin modelos opacos:
 *   Riesgo = Σ (Severidad × Calidad de evidencia) × Probabilidad (convergencia de señales) × Exposición
 * + la opacidad (falta de datos) como alerta de trazabilidad.
 * Los indicadores de la OIT son PISTAS para priorizar una verificación humana: el sistema nunca concluye que hay trabajo
 * forzoso ni marca nada como «evidencia confirmada» (eso solo lo puede hacer el revisor sobre el terreno).
 */
import type { Arquetipo, DatasetIngerido, IndicadoresLaborales, Verdad } from "./contratos.ts";
import type { ResultadoScoreV2 } from "./score.ts";

export type NivelRiesgo = "bajo" | "medio" | "alto" | "critico";
export type CategoriaEvidencia = "evidencia_confirmada" | "sospecha_fundada" | "riesgo_potencial" | "sin_informacion_suficiente" | "sin_senales";

export interface Senal {
  id: "CAPACIDAD" | "HORAS_NO_REGISTRADAS" | "HORAS_EXTRA" | "SALARIO_RETENIDO" | "SILENCIO_ROTACION" | "SIN_CANAL" | "OPACIDAD";
  indicadorOIT: string;
  severidad: 1 | 2 | 3 | 4;
  evidencia: number; // 0-1: contradicción entre fuentes independientes > fuente oficial > entrevistas > patrón indirecto
  fuentes: string[];
  hallazgo: string;
  contradiccion: boolean;
}

export interface ResultadoRiesgo {
  tallerId: string;
  nombre: string;
  ciudad: string;
  nivel: NivelRiesgo;
  puntos: number;
  categoria: CategoriaEvidencia;
  senales: Senal[];
  exposicion: number; // 0-1: peso del taller en las horas encargadas por la marca
  presionComercial: boolean; // la carga de la marca puede ser parte de la causa
  verificacion: string[]; // qué evidencia humana hace falta
  remediacion: { accion: string; responsable: string; plazo: string; criterio: string }[];
}

export const UMBRALES_RIESGO = { critico: 5, alto: 2.5, medio: 1 } as const;
const ORDEN: Record<NivelRiesgo, number> = { critico: 3, alto: 2, medio: 1, bajo: 0 };

const n = (x: number | null) => String(x).replace(".", ",");

function senalesDe(s: ResultadoScoreV2, l: IndicadoresLaborales | undefined): Senal[] {
  const out: Senal[] = [];
  const ratio = typeof s.ratio === "number" ? s.ratio.toFixed(2).replace(".", ",") : "∞";
  if (s.estado === "sin_datos")
    out.push({ id: "OPACIDAD", indicadorOIT: "—", severidad: 2, evidencia: 0.5, fuentes: ["informe de plantilla"], contradiccion: false, hallazgo: "Falta el informe de plantilla de algún mes: no se puede comprobar la capacidad." });
  else if (s.estado === "rojo")
    out.push({ id: "CAPACIDAD", indicadorOIT: "horas extra excesivas / subcontratación oculta (posible)", severidad: 3, evidencia: 1, fuentes: ["pedidos de la marca", "informe de plantilla (Seguridad Social)"], contradiccion: true, hallazgo: `Los pedidos necesitan ${ratio}× las horas de alta: producción incompatible con la plantilla.` });
  else if (s.estado === "ambar" && typeof s.ratio === "number" && s.ratio >= 1)
    out.push({ id: "CAPACIDAD", indicadorOIT: "horas extra excesivas (posible)", severidad: 1, evidencia: 1, fuentes: ["pedidos de la marca", "informe de plantilla"], contradiccion: false, hallazgo: `Carga al límite de la capacidad (${ratio}×).` });

  if (!l) {
    out.push({ id: "OPACIDAD", indicadorOIT: "—", severidad: 2, evidencia: 0.5, fuentes: ["revisor"], contradiccion: false, hallazgo: "No hay datos del revisor (entrevistas, nóminas, quejas): condiciones sin verificar." });
    return out;
  }
  if (l.horasSemanaEntrevistas != null && l.horasSemanaRegistro != null && l.horasSemanaEntrevistas - l.horasSemanaRegistro >= 6)
    out.push({ id: "HORAS_NO_REGISTRADAS", indicadorOIT: "horas extra excesivas", severidad: 3, evidencia: 0.9, fuentes: ["registro de jornada", "entrevistas confidenciales"], contradiccion: true, hallazgo: `El registro dice ${n(l.horasSemanaRegistro)} h/semana; en las entrevistas, ${n(l.horasSemanaEntrevistas)} h.` });
  if (l.horasExtraSemana != null && l.horasExtraSemana >= 10) {
    const malPagadas = l.pctHorasExtraPagadas != null && l.pctHorasExtraPagadas < 50;
    out.push({ id: "HORAS_EXTRA", indicadorOIT: malPagadas ? "horas extra excesivas + retención de salario (parcial)" : "horas extra excesivas", severidad: malPagadas ? 3 : 2, evidencia: 0.7, fuentes: ["entrevistas confidenciales"], contradiccion: false, hallazgo: `${n(l.horasExtraSemana)} h extra a la semana${malPagadas ? `; solo se paga el ${l.pctHorasExtraPagadas} %` : ""}.` });
  }
  const retraso = l.diasRetrasoPago != null && l.diasRetrasoPago >= 30;
  const deduc = l.pctDeducciones != null && l.pctDeducciones >= 10;
  const bajo = l.salarioMedianoMes != null && l.salarioConvenioMes != null && l.salarioMedianoMes < l.salarioConvenioMes;
  if (retraso || deduc)
    out.push({ id: "SALARIO_RETENIDO", indicadorOIT: "retención de salario", severidad: 4, evidencia: retraso && deduc ? 0.9 : 0.8, fuentes: ["nóminas y pagos", "entrevistas confidenciales"], contradiccion: false, hallazgo: [retraso && `pagos con ${l.diasRetrasoPago} días de retraso`, deduc && `deducciones del ${n(l.pctDeducciones)} %`, bajo && `salario mediano (${l.salarioMedianoMes} €) bajo convenio (${l.salarioConvenioMes} €)`].filter(Boolean).join("; ") + "." });
  if (l.quejasRecibidas === 0 && l.rotacionAnualPct != null && l.rotacionAnualPct >= 50)
    out.push({ id: "SILENCIO_ROTACION", indicadorOIT: "intimidación / abuso de vulnerabilidad (posible)", severidad: 2, evidencia: 0.6, fuentes: ["registro de quejas", "rotación de plantilla"], contradiccion: true, hallazgo: `Cero quejas con una rotación del ${l.rotacionAnualPct} % al año${l.canalQuejas !== "accesible" ? ` y canal ${l.canalQuejas === "no_existe" ? "inexistente" : "inaccesible"}` : ""}.` });
  else if (l.canalQuejas && l.canalQuejas !== "accesible")
    out.push({ id: "SIN_CANAL", indicadorOIT: "—", severidad: 1, evidencia: 0.6, fuentes: ["revisor"], contradiccion: false, hallazgo: `Canal de quejas ${l.canalQuejas === "no_existe" ? "inexistente" : "inaccesible"}.` });
  return out;
}

const VERIFICACION: Record<Senal["id"], string> = {
  CAPACIDAD: "Mapa completo de subcontratas y visita sin aviso para contar a quién trabaja (con y sin alta).",
  HORAS_NO_REGISTRADAS: "Cruzar registro de jornada, consumo eléctrico por franjas y entrevistas confidenciales fuera del taller.",
  HORAS_EXTRA: "Revisar nóminas de horas extra y su voluntariedad en entrevistas privadas.",
  SALARIO_RETENIDO: "Revisar extractos de pago y deducciones con el revisor; entrevistar sobre deudas y adelantos.",
  SILENCIO_ROTACION: "Entrevistas confidenciales a personas que se fueron y a las que siguen; probar el canal de quejas.",
  SIN_CANAL: "Instalar un canal de quejas externo, anónimo y en el idioma de la plantilla.",
  OPACIDAD: "Pedir los datos que faltan con plazo; sin ellos, visita del revisor.",
};

const REMEDIACION: Partial<Record<Senal["id"], ResultadoRiesgo["remediacion"][number]>> = {
  CAPACIDAD: { accion: "Declarar subcontratas y ajustar plazos o pedidos dentro del límite pactado (sin cortar de golpe)", responsable: "Proveedor + compras de la marca", plazo: "10 días", criterio: "Ratio ≤ 1,10 dos meses seguidos con las mismas personas de alta" },
  HORAS_NO_REGISTRADAS: { accion: "Registro de jornada fiable y pago de las horas no registradas", responsable: "Proveedor (verifica el revisor)", plazo: "30 días", criterio: "Diferencia registro-entrevistas < 2 h/semana en la siguiente visita" },
  HORAS_EXTRA: { accion: "Limitar horas extra, hacerlas voluntarias y pagarlas", responsable: "Proveedor; la marca revisa sus plazos", plazo: "30 días", criterio: "≤ 4 h extra/semana y 100 % pagadas" },
  SALARIO_RETENIDO: { accion: "Pagar los atrasos y devolver deducciones indebidas", responsable: "Proveedor (verifica el revisor)", plazo: "15 días", criterio: "0 días de retraso y deducciones < 3 % en dos nóminas seguidas" },
  SILENCIO_ROTACION: { accion: "Canal de quejas externo y protección frente a represalias", responsable: "Revisor + proveedor", plazo: "30 días", criterio: "Canal en uso y rotación a la baja en el siguiente trimestre" },
  SIN_CANAL: { accion: "Canal de quejas externo y anónimo", responsable: "Revisor", plazo: "30 días", criterio: "Canal activo y conocido por la plantilla" },
  OPACIDAD: { accion: "Entregar los informes que faltan", responsable: "Proveedor y su gestoría", plazo: "10 días", criterio: "Datos completos de la ventana" },
};

export function evaluarRiesgo(d: DatasetIngerido, scores: ResultadoScoreV2[]): ResultadoRiesgo[] {
  const lab = new Map((d.laboral ?? []).map((l) => [l.tallerId, l]));
  const maxH = Math.max(1, ...scores.map((s) => s.horasNecesarias ?? 0));
  return scores
    .map((s) => {
      const t = d.seed.talleres.find((x) => x.id === s.tallerId)!;
      const l = lab.get(s.tallerId);
      const senales = senalesDe(s, l);
      const exposicion = Math.round(((s.horasNecesarias ?? 0) / maxH) * 100) / 100;
      const base = senales.reduce((acc, x) => acc + x.severidad * x.evidencia, 0);
      const fuentes = new Set(senales.filter((x) => x.id !== "OPACIDAD").flatMap((x) => x.fuentes));
      const nReales = senales.filter((x) => x.id !== "OPACIDAD").length;
      const probabilidad = 1 + 0.3 * Math.max(0, nReales - 1); // varias señales que convergen = más probable
      const puntos = Math.round(base * probabilidad * (0.8 + 0.4 * exposicion) * 100) / 100;
      let nivel: NivelRiesgo = puntos >= UMBRALES_RIESGO.critico ? "critico" : puntos >= UMBRALES_RIESGO.alto ? "alto" : puntos >= UMBRALES_RIESGO.medio ? "medio" : "bajo";
      const opaco = senales.some((x) => x.id === "OPACIDAD");
      // Suelo de «medio»: el vacío de datos es una alerta de trazabilidad, y cualquier señal real pide al menos seguimiento.
      if ((opaco || nReales > 0) && ORDEN[nivel] < ORDEN.medio) nivel = "medio";
      const fundada = senales.some((x) => x.contradiccion && x.severidad >= 2) || senales.some((x) => x.severidad === 4) || fuentes.size >= 3;
      const categoria: CategoriaEvidencia =
        nReales === 0 ? (opaco ? "sin_informacion_suficiente" : "sin_senales") : fundada ? "sospecha_fundada" : "riesgo_potencial";
      const extra = l?.horasExtraSemana ?? 0;
      const presionComercial = typeof s.ratio === "number" && s.ratio >= 0.75 && (extra >= 8 || s.estado === "rojo");
      const verificacion = [...new Set(senales.map((x) => VERIFICACION[x.id]))];
      const remediacion = senales.map((x) => REMEDIACION[x.id]).filter((x): x is NonNullable<typeof x> => !!x);
      if (presionComercial)
        remediacion.push({ accion: "Revisar plazos, volumen y precio por pieza de la marca (posible causa raíz)", responsable: "Compras y cumplimiento de la marca", plazo: "Próximo pedido", criterio: "Plazo y volumen compatibles con la capacidad en alta" });
      return { tallerId: s.tallerId, nombre: t.nombre, ciudad: t.ciudad, nivel, puntos, categoria, senales, exposicion, presionComercial, verificacion, remediacion };
    })
    .sort((a, b) => ORDEN[b.nivel] - ORDEN[a.nivel] || b.puntos - a.puntos || a.tallerId.localeCompare(b.tallerId));
}

// ---------- Panel de indicadores ----------
export function panelIndicadores(d: DatasetIngerido, r: ResultadoRiesgo[]) {
  const lab = d.laboral ?? [];
  const n = r.length || 1;
  const conDatos = lab.filter((l) => l.horasExtraSemana != null);
  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
  const quejas = lab.reduce((s, l) => s + (l.quejasRecibidas ?? 0), 0);
  return {
    talleres: r.length,
    trazabilidadCompleta: pct(r.filter((x) => !x.senales.some((s) => s.id === "OPACIDAD")).length, n),
    personasEntrevistadas: lab.reduce((s, l) => s + l.personasEntrevistadas, 0),
    criticos: r.filter((x) => x.nivel === "critico").length,
    altos: r.filter((x) => x.nivel === "alto").length,
    conRetrasoSalarial: pct(lab.filter((l) => (l.diasRetrasoPago ?? 0) >= 30).length, lab.length),
    horasExtraMedias: conDatos.length ? Math.round((conDatos.reduce((s, l) => s + (l.horasExtraSemana ?? 0), 0) / conDatos.length) * 10) / 10 : null,
    quejasResueltas: pct(lab.reduce((s, l) => s + (l.quejasResueltas ?? 0), 0), quejas),
    retencionDocumentos: null as null, // fuera de la muestra mínima: lo recoge el revisor en la fase siguiente
  };
}

// ---------- Evaluación contra la verdad (solo después de puntuar) ----------
export interface EvaluacionRiesgo {
  semillas: number;
  etiqueta: "datos sintéticos";
  porArquetipo: { arquetipo: Arquetipo; problema: boolean; n: number; niveles: Record<NivelRiesgo, number> }[];
  deteccion: number; // problemas laborales (capacidad u OIT) en alto o crítico
  deteccionMedio: number; // problemas laborales con al menos «medio» (entran en seguimiento)
  falsasAlarmas: number; // talleres sin problema en alto o crítico
  problemas: number;
  sinProblema: number;
}

export function evaluarRiesgoContraVerdad(corridas: { riesgo: ResultadoRiesgo[]; verdad: Verdad }[]): EvaluacionRiesgo {
  const porArq = new Map<Arquetipo, { problema: boolean; n: number; niveles: Record<NivelRiesgo, number> }>();
  let det = 0, detM = 0, fa = 0, prob = 0, sin = 0;
  for (const { riesgo, verdad } of corridas)
    for (const v of verdad.talleres) {
      const r = riesgo.find((x) => x.tallerId === v.tallerId);
      if (!r) continue;
      const problema = v.problemaLaboral ?? v.problemaReal;
      const a = porArq.get(v.arquetipo) ?? { problema, n: 0, niveles: { bajo: 0, medio: 0, alto: 0, critico: 0 } };
      a.n++;
      a.niveles[r.nivel]++;
      porArq.set(v.arquetipo, a);
      const alerta = r.nivel === "alto" || r.nivel === "critico";
      if (problema) { prob++; if (alerta) det++; if (r.nivel !== "bajo") detM++; } else { sin++; if (alerta) fa++; }
    }
  return { semillas: corridas.length, etiqueta: "datos sintéticos", porArquetipo: [...porArq.entries()].map(([arquetipo, x]) => ({ arquetipo, ...x })), deteccion: det, deteccionMedio: detM, falsasAlarmas: fa, problemas: prob, sinProblema: sin };
}

// ---------- Informe ----------
const NIVEL: Record<NivelRiesgo, string> = { critico: "🟥 Crítico", alto: "🟧 Alto", medio: "🟨 Medio", bajo: "🟩 Bajo" };
const CAT: Record<CategoriaEvidencia, string> = {
  evidencia_confirmada: "Evidencia confirmada", sospecha_fundada: "Sospecha fundada", riesgo_potencial: "Riesgo potencial",
  sin_informacion_suficiente: "Sin información suficiente", sin_senales: "Sin señales",
};
const pc = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "—");

export function informeRiesgoMarkdown(d: DatasetIngerido, r: ResultadoRiesgo[], ev: EvaluacionRiesgo | null): string {
  const p = panelIndicadores(d, r);
  const prior = r.filter((x) => x.nivel === "critico" || x.nivel === "alto");
  const patrones = new Map<string, string[]>();
  for (const x of r) for (const s of x.senales) patrones.set(s.id, [...(patrones.get(s.id) ?? []), x.tallerId]);
  const L: string[] = [
    `# Informe de riesgo laboral · escenario «${d.metaIngesta.escenario}» · DATOS SIMULADOS`,
    "",
    "> Marca, talleres, personas y cifras son **inventados**. Los indicadores de la OIT son **pistas para priorizar una verificación humana**, no una conclusión: Trama no determina que exista trabajo forzoso ni marca nada como «evidencia confirmada» (eso solo lo hace el revisor sobre el terreno). Los datos laborales son agregados del revisor independiente; ninguno identifica a una persona.",
    "",
    "## 1. Panel de indicadores",
    "",
    "| Indicador | Valor |",
    "|---|---|",
    `| Talleres analizados | ${p.talleres} |`,
    `| Con trazabilidad completa (sin vacíos de datos) | ${p.trazabilidadCompleta} % |`,
    `| Personas entrevistadas por el revisor | ${p.personasEntrevistadas} |`,
    `| Casos críticos · altos | ${p.criticos} · ${p.altos} |`,
    `| Talleres con retrasos salariales ≥ 30 días | ${p.conRetrasoSalarial} % |`,
    `| Horas extra medias (entrevistas) | ${p.horasExtraMedias ?? "—"} h/semana |`,
    `| Quejas resueltas | ${p.quejasResueltas} % |`,
    "| Retención de documentos | fuera de la muestra mínima (siguiente fase) |",
    "",
    "## 2. Priorización de la verificación (alto y crítico)",
    "",
    "| # | Taller | Nivel | Puntos | Categoría | Por qué | Exposición | Presión de la marca |",
    "|---|---|---|---|---|---|---|---|",
    ...prior.map((x, i) => `| ${i + 1} | ${x.tallerId} · ${x.nombre} (${x.ciudad}) | ${NIVEL[x.nivel]} | ${x.puntos} | ${CAT[x.categoria]} | ${x.senales.map((s) => s.hallazgo).join(" ")} | ${Math.round(x.exposicion * 100)} % | ${x.presionComercial ? "posible causa raíz" : "—"} |`),
    "",
    "## 3. Mapa de riesgo (todos los talleres)",
    "",
    "| Taller | Nivel | Categoría | Señales |",
    "|---|---|---|---|",
    ...r.map((x) => `| ${x.tallerId} | ${NIVEL[x.nivel]} | ${CAT[x.categoria]} | ${x.senales.map((s) => s.id).join(", ") || "—"} |`),
    "",
    "## 4. Patrones y contradicciones",
    "",
    "| Patrón | Indicador OIT | Talleres |",
    "|---|---|---|",
    ...[...patrones.entries()].map(([id, ts]) => `| ${id} | ${r.flatMap((x) => x.senales).find((s) => s.id === id)?.indicadorOIT} | ${ts.join(", ")} |`),
    "",
    "Contradicciones entre fuentes independientes: " +
      (r.flatMap((x) => x.senales.filter((s) => s.contradiccion).map((s) => `${x.tallerId} (${s.fuentes.join(" frente a ")})`)).join(" · ") || "ninguna"),
    "",
    "## 5. Qué evidencia humana hace falta y plan de remediación (prioritarios)",
    "",
    ...prior.flatMap((x) => [
      `### ${x.tallerId} · ${NIVEL[x.nivel]}`,
      ...x.verificacion.map((v) => `- Verificar: ${v}`),
      ...x.remediacion.map((m) => `- Remediar: ${m.accion} · ${m.responsable} · ${m.plazo} · se da por cumplido si: ${m.criterio}`),
      "- Primera respuesta: investigar y proteger, nunca cortar pedidos de golpe ni cerrar el taller.",
      "",
    ]),
  ];
  if (ev) {
    L.push(
      `## 6. ¿Funciona? Evaluación contra la verdad del generador (${ev.semillas} semillas, datos sintéticos)`,
      "",
      `- Talleres con un problema laboral (capacidad u OIT) en **alto o crítico**: ${ev.deteccion} de ${ev.problemas} (${pc(ev.deteccion, ev.problemas)}).`,
      `- Con al menos nivel medio (entran en seguimiento): ${ev.deteccionMedio} de ${ev.problemas} (${pc(ev.deteccionMedio, ev.problemas)}).`,
      `- Talleres sin problema en alto o crítico (falsas alarmas): ${ev.falsasAlarmas} de ${ev.sinProblema} (${pc(ev.falsasAlarmas, ev.sinProblema)}).`,
      "",
      "| Arquetipo | ¿Problema? | Casos | Bajo | Medio | Alto | Crítico |",
      "|---|---|---|---|---|---|---|",
      ...ev.porArquetipo.map((a) => `| ${a.arquetipo} | ${a.problema ? "sí" : "no"} | ${a.n} | ${a.niveles.bajo} | ${a.niveles.medio} | ${a.niveles.alto} | ${a.niveles.critico} |`),
      "",
    );
  }
  L.push(
    "## 7. Limitaciones",
    "",
    "- Datos simulados: la evaluación mide si el método encuentra lo que el generador escondió, no su acierto en el mundo real.",
    "- Muestra mínima: 4 de los 11 indicadores de la OIT con señal (horas extra, retención de salario, intimidación y abuso de vulnerabilidad como posibles); faltan engaño, restricción de movimiento, aislamiento, violencia, retención de documentos, deuda y condiciones de vida.",
    "- Con menos de 4 personas entrevistadas el revisor no da cifras: esos talleres se valoran solo por capacidad y quejas.",
    "- Pesos y umbrales del modelo son una propuesta de diseño (transparente y ajustable), no un estándar.",
    "- Ninguna categoría es «evidencia confirmada»: hace falta verificación independiente sobre el terreno.",
  );
  return L.join("\n") + "\n";
}
