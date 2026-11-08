// Datos del seed → contrato de vista (src/lib/calculo/tipos.ts §2). Dueño: agente de Datos.
import {
  COMPROBACIONES_ALERTA,
  KPI_CONTEXTO,
  KPI_ETIQUETAS,
  RESPONSABLE_HITO,
  TEXTOS_CADENA,
  TEXTOS_PROTECCION,
  TIPO_REVISOR,
} from "@/content/textos";
import { seed } from "@/data";
import { MESES_SEGUIMIENTO, calcularMetricas } from "@/lib/calculo/metricas";
import {
  GRAVEDAD,
  estadoPanel,
  evaluarCadena,
  evaluarTaller,
  miembrosCadena,
  personas,
  taller as tallerDe,
  ultimoCertificado,
  ventanaMeses,
} from "@/lib/calculo/semaforo";
import type {
  Alerta,
  CertificadoHoras,
  DetalleTaller,
  EstadoSemaforo,
  Evaluacion,
  Firmante,
  Hito,
  HitoVista,
  KpiVista,
  Marca,
  Mes,
  MetricasImpacto,
  NodoCadena,
  PlanCorreccion,
  Taller,
  TallerResumen,
  VentanaHoras,
} from "@/lib/calculo/tipos";
import { fmtFecha, fmtHoras, fmtNumero, fmtPct, fmtRatio, fmtVentana, fmtVentanaCorta } from "@/lib/formato";

export const MES_ACTUAL: Mes = seed.meta.mesEvaluacionActual;
/** "ago–oct 2026" */
export const PERIODO_ACTUAL = fmtVentana(ventanaMeses(MES_ACTUAL, seed.parametros.mesesVentana));
const FECHA_CORTE = seed.meta.fechaCorte;
/** RGPD (LEGAL §1.1): con menos de 4 personas la marca solo ve el semáforo. Umbral de diseño, no legal. */
const MIN_PERSONAS_CIFRAS = 4;
/** "Ordessa (marca ficticia)" → "Ordessa" para las frases. */
const NOMBRE_MARCA = seed.marca.nombre.replace(/\s*\(.*\)$/, "");

const FIRMANTE: Record<Firmante["tipo"], { tipo: string; fuente: string }> = {
  gestor_laboral: { tipo: "Gestor laboral o graduado social", fuente: "a partir del informe de plantilla media de la Seguridad Social" },
  consulente_del_lavoro: { tipo: "Consulente del lavoro", fuente: "a partir del LUL" },
};

// ---------- Ayudantes ----------
/** La evaluación que representa al taller: la de su cadena si tiene subcontratas; si no, la suya. */
const evaluacionDe = (t: Taller, mes: Mes) => (t.subcontrataIds.length ? evaluarCadena : evaluarTaller)(seed, t.id, mes);

/** Menos de 4 personas en su último informe. */
const pocasPersonas = (id: string) => {
  const c = ultimoCertificado(seed, id);
  return !!c && personas(c) < MIN_PERSONAS_CIFRAS;
};

/** Cifras de lo que se muestra de t (su cadena si tiene subcontratas): basta un miembro pequeño, porque restando se verían sus horas. */
const ocultarCifrasDe = (t: Taller) => (t.subcontrataIds.length ? miembrosCadena(seed, t.id) : [t.id]).some(pocasPersonas);

const planDe = (id: string) => seed.planesCorreccion.find((p) => p.talleresIncluidos.includes(id)) ?? null;

const sinCifras = (e: Evaluacion): Evaluacion => ({ ...e, horasNecesarias: undefined, horasCotizadas: undefined, ratio: undefined });

const raizDe = (t: Taller): Taller => (t.padreId ? raizDe(tallerDe(seed, t.padreId)) : t);

const esAlerta = (estado: EstadoSemaforo) => estado === "rojo" || estado === "ambar";

// ---------- Panel ----------
const clave = (r: TallerResumen) => (r.ratio === null ? Number.MAX_VALUE : (r.ratio ?? -1)); // ∞ primero, sin cifra al final
const ordenar = (filas: TallerResumen[]) =>
  filas.sort((a, b) => GRAVEDAD[b.estado] - GRAVEDAD[a.estado] || clave(b) - clave(a));

function fila(t: Taller, raiz: boolean): TallerResumen {
  const ev = raiz ? evaluacionDe(t, MES_ACTUAL) : evaluarTaller(seed, t.id, MES_ACTUAL);
  const ocultar = raiz ? ocultarCifrasDe(t) : pocasPersonas(t.id);
  return {
    id: t.id,
    nombre: t.nombre,
    nivel: t.nivel,
    pais: t.pais,
    ciudad: t.ciudad,
    estado: raiz ? estadoPanel(seed, t.id, MES_ACTUAL) : ev.estado,
    ratio: ocultar || ev.estado === "sin_datos" ? undefined : ev.ratio,
    horasNecesarias: ocultar ? undefined : ev.horasNecesarias,
    horasCotizadas: ocultar ? undefined : ev.horasCotizadas,
    micro: ev.micro ?? false,
    ocultarCifras: ocultar,
    ultimoCertificado: ultimoCertificado(seed, t.id)?.mes ?? null,
    tienePlan: !!planDe(t.id),
    subcontratas: ordenar(t.subcontrataIds.map((id) => fila(tallerDe(seed, id), false))),
  };
}

export const marca = (): Marca => seed.marca;

/** Talleres de nivel 1 con sus subcontratas anidadas, ya ordenados (rojo › ámbar › sin datos › verde; ratio desc). */
export const resumenPanel = (): TallerResumen[] =>
  ordenar(seed.talleres.filter((t) => t.nivel === 1).map((t) => fila(t, true)));

/** Recuento por estado para los filtros del panel (cuenta las filas de nivel 1 por estadoPanel). */
export function contarEstados(): Record<EstadoSemaforo | "todos", number> {
  const n = { todos: 0, rojo: 0, ambar: 0, sin_datos: 0, verde: 0 };
  for (const f of resumenPanel()) {
    n.todos++;
    n[f.estado]++;
  }
  return n;
}

// ---------- KPIs ----------
const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/**
 * Lo que la rediseñada tarjeta de impacto necesita y MetricasImpacto no trae (problemas/metricas_impacto.md):
 * recuentos de la línea base y hueco de horas de la cadena al abrir la alerta frente a hoy, plan a plan.
 */
function recuentosPlanes(planes: PlanCorreccion[]) {
  const r = { deAltaEnAlerta: 0, sinAlta: 0, yaDeAlta: 0, enTramite: 0, altas: 0, retirados: 0, faltaban: 0, hoy: 0 };
  for (const p of planes) {
    const pt = p.proteccionTrabajadores;
    r.deAltaEnAlerta += suma(pt.lineaBase.map((l) => l.deAltaEnAlerta));
    r.sinAlta += suma(pt.lineaBase.map((l) => l.sinAltaIdentificados));
    r.yaDeAlta += pt.altasDirectas + suma(pt.regularizaciones.map((g) => g.resueltasFavorables));
    r.enTramite += suma(pt.regularizaciones.map((g) => g.iniciadas - g.resueltasFavorables - g.denegadas));
    const mesAlerta = seed.alertas.find((a) => a.id === p.alertaId)?.mesEvaluado;
    if (!mesAlerta) continue;
    const antes = evaluarCadena(seed, p.tallerRaizId, mesAlerta);
    const ahora = evaluarCadena(seed, p.tallerRaizId, MES_ACTUAL);
    const [c0, h0, c1, h1] = [antes.horasNecesarias, antes.horasCotizadas, ahora.horasNecesarias, ahora.horasCotizadas].map((x) => x ?? 0);
    r.altas += h1 - h0; // más plantilla de alta
    r.retirados += c0 - c1; // menos pedidos
    r.faltaban += Math.max(0, c0 - h0);
    r.hoy += Math.max(0, c1 - h1);
  }
  return { ...r, sinVia: r.sinAlta - r.yaDeAlta - r.enTramite }; // sin vía incluye las denegadas
}

/** `planes`: los mismos con los que se calculó `m` (todos los de la marca, o el del taller). */
function kpis(m: MetricasImpacto, planes: PlanCorreccion[]): KpiVista[] {
  const p = m.principal;
  const pm = m.pedidosMantenidos;
  const r = recuentosPlanes(planes);
  const recuento = (n: number) => (n >= 1 && n <= 3 ? KPI_CONTEXTO.menosDe4 : fmtNumero(n));
  const principal = KPI_CONTEXTO.principal(
    fmtNumero(p.siguenEmpleadosYDeAlta),
    fmtNumero(p.trabajadoresLineaBase),
    fmtNumero(r.deAltaEnAlerta),
    p.mesesDesdeAlerta,
    MESES_SEGUIMIENTO,
    p.definitiva,
  );
  // Con los dos tramos positivos, la tarjeta da el % del hueco cerrado con altas; si no, las horas con su signo.
  const cerrado = r.altas + r.retirados;
  const conPorcentaje = r.altas >= 0 && r.retirados >= 0 && cerrado > 0;
  const haEstadoDeAlta = r.deAltaEnAlerta + r.yaDeAlta;
  const partida = planes.length
    ? `${fmtHoras(pm.horasMensualesReferencia)} al mes${planes.length === 1 ? ` (${fmtVentana(planes[0].periodoReferenciaPedidos)})` : ""}`
    : null;
  return [
    {
      id: "principal",
      etiqueta: KPI_ETIQUETAS.principal,
      valor: p.porcentaje,
      formato: "porcentaje",
      decimales: 1,
      variante: "principal",
      progreso: p.porcentaje,
      contexto: !p.trabajadoresLineaBase
        ? "Sin planes de corrección"
        : p.definitiva
          ? principal
          : `${principal} · definitiva el ${fmtFecha(p.fechaDefinitiva)}`,
    },
    {
      id: "horasRegularizadas",
      etiqueta: KPI_ETIQUETAS.horasRegularizadas,
      valor: conPorcentaje ? Math.round((r.altas / cerrado) * 10000) / 100 : r.altas,
      formato: conPorcentaje ? "porcentaje" : "horas",
      variante: "normal",
      contexto: KPI_CONTEXTO.horasRegularizadas(fmtHoras(r.altas), fmtHoras(r.retirados), fmtHoras(r.faltaban), fmtHoras(r.hoy)),
    },
    {
      id: "acompanados",
      etiqueta: KPI_ETIQUETAS.acompanados,
      valor: r.sinAlta,
      formato: "entero",
      variante: "normal",
      contexto: KPI_CONTEXTO.acompanados(fmtNumero(r.yaDeAlta), recuento(r.enTramite), recuento(r.sinVia)),
    },
    {
      id: "pedidosMantenidos",
      etiqueta: KPI_ETIQUETAS.pedidosMantenidos,
      valor: pm.porcentajeMantenido,
      formato: "porcentaje",
      variante: "normal",
      contexto: KPI_CONTEXTO.pedidosMantenidos(fmtPct(pm.reduccionPct), fmtPct(pm.limiteReduccionPct), partida, !pm.cumpleLimite),
    },
    {
      id: "fallos",
      etiqueta: KPI_ETIQUETAS.fallos,
      valor: Math.max(0, haEstadoDeAlta - p.siguenEmpleadosYDeAlta),
      formato: "entero",
      variante: "fallo",
      contexto: KPI_CONTEXTO.fallos(fmtNumero(haEstadoDeAlta)),
    },
  ];
}

/** 5 KPIs de marca: [principal, horasRegularizadas, acompanados, pedidosMantenidos, fallos]. */
export const kpisMarca = (): KpiVista[] =>
  kpis(
    calcularMetricas(seed, FECHA_CORTE),
    seed.planesCorreccion.filter((p) => p.marcaId === seed.marca.id),
  );

// ---------- Detalle ----------
function ventanas(t: Taller, ocultar: boolean): VentanaHoras[] {
  const P = seed.parametros;
  // Solo las ventanas calculables con los certificados del seed (may–jul … ago–oct).
  return seed.meta.mesesConCertificado
    .slice(P.mesesVentana - 1)
    .filter((m) => m <= MES_ACTUAL)
    .map((m) => {
      const ev = evaluacionDe(t, m);
      const cotizadas = ocultar || ev.estado === "sin_datos" ? null : (ev.horasCotizadas ?? null);
      return {
        etiqueta: fmtVentanaCorta(ev.ventana),
        mes: m,
        necesarias: ev.horasNecesarias ?? 0,
        cotizadas,
        limiteAmbar: cotizadas === null ? null : P.umbralVerde * cotizadas,
        limiteRojo: cotizadas === null ? null : (ev.micro ? P.umbralRojoMicro : P.umbralRojo) * cotizadas,
        ratio: cotizadas === null ? undefined : ev.ratio,
        estado: ev.estado,
      };
    });
}

function resumen(t: Taller, ev: Evaluacion, ocultar: boolean): DetalleTaller["resumen"] {
  const miembros = ev.tipo === "cadena" ? miembrosCadena(seed, t.id) : [t.id];
  const certs = miembros.map((id) => ultimoCertificado(seed, id)).filter((c): c is CertificadoHoras => !!c);
  const despachos = new Map<Firmante["tipo"], Set<string>>();
  for (const c of certs) despachos.set(c.firmante.tipo, (despachos.get(c.firmante.tipo) ?? new Set()).add(c.firmante.despacho));
  const necesarias = ocultar ? null : (ev.horasNecesarias ?? null);
  const cotizadas = ocultar || ev.estado === "sin_datos" ? null : (ev.horasCotizadas ?? null);
  return {
    periodo: fmtVentana(ev.ventana),
    necesarias,
    cotizadas,
    diferencia: necesarias !== null && cotizadas !== null ? necesarias - cotizadas : null,
    plantilla: ocultar || !certs.length ? null : certs.reduce((s, c) => s + personas(c), 0),
    firmante:
      [...despachos].map(([tipo, ds]) => `${FIRMANTE[tipo].tipo} · ${[...ds].join(", ")} · ${FIRMANTE[tipo].fuente}`).join(" / ") ||
      "Sin informe",
    fechaCertificado: certs.map((c) => c.fechaEmision).sort().at(-1) ?? null,
    mesesSinCertificado: ev.mesesSinCertificado ?? [],
  };
}

const alertaDe = (id: string): Alerta | null => {
  const a = seed.alertas
    .filter((x) => miembrosCadena(seed, x.tallerId).includes(id))
    .sort((x, y) => (x.fecha < y.fecha ? -1 : 1))
    .at(-1);
  // La instantánea suma horas de toda su cadena: con un miembro pequeño, no se muestra.
  return a && !miembrosCadena(seed, a.tallerId).some(pocasPersonas) ? a : null;
};

function nodos(t: Taller): NodoCadena[] {
  const m = seed.marca;
  const raiz = raizDe(t);
  const lista: NodoCadena[] = [
    { id: m.id, nombre: m.nombre, tipo: "marca", nivel: 0, padreId: null, pais: m.pais },
    ...miembrosCadena(seed, raiz.id).map((id): NodoCadena => {
      const x = tallerDe(seed, id);
      const c = ultimoCertificado(seed, id);
      return {
        id,
        nombre: x.nombre,
        tipo: x.nivel === 1 ? "proveedor" : "subcontrata",
        nivel: x.nivel,
        padreId: x.padreId ?? m.id,
        pais: x.pais,
        ciudad: x.ciudad,
        plantilla: c && !pocasPersonas(id) ? personas(c) : null,
        estado: evaluarTaller(seed, id, MES_ACTUAL).estado, // cada nodo con su propio semáforo
        momento: x.declaracionSubcontrata?.momento,
        declaradaEl: x.declaracionSubcontrata?.fecha,
      };
    }),
  ];
  if (!raiz.subcontrataIds.length && estadoPanel(seed, raiz.id, MES_ACTUAL) === "rojo")
    lista.push({ id: `${raiz.id}-pendiente`, nombre: TEXTOS_CADENA.pendiente, tipo: "subcontrata", nivel: 2, padreId: raiz.id, pendiente: true });
  return lista;
}

/** Por qué está en rojo/ámbar, con las cifras reales del periodo actual (frases no acusatorias). */
function porQue(t: Taller, estado: EstadoSemaforo, ev: Evaluacion, al: Alerta | null, ocultar: boolean): string[] {
  if (!esAlerta(estado)) return [];
  const P = seed.parametros;
  const uRojo = fmtRatio(ev.micro ? P.umbralRojoMicro : P.umbralRojo, 2);
  const frases: string[] = [];
  if (!ocultar && ev.estado !== "sin_datos")
    frases.push(
      `Los pedidos de ${NOMBRE_MARCA} a ${ev.tipo === "cadena" ? "esta cadena" : "este taller"} necesitan ${fmtHoras(ev.horasNecesarias ?? 0)} en ${fmtVentana(ev.ventana)}; el personal de alta suma ${fmtHoras(ev.horasCotizadas ?? 0)} (${fmtRatio(ev.ratio, 2)}).`,
    );
  if (ev.estado === "rojo")
    frases.push(`Supera el límite rojo de ${uRojo} para talleres de ${ev.micro ? "hasta" : "más de"} ${P.maxPersonasMicro} personas.`);
  if (ev.estado === "ambar")
    frases.push(`Supera ${fmtRatio(P.umbralVerde, 2)} sin llegar al límite rojo de ${uRojo}: margen para picos de trabajo.`);
  if (estado === "rojo" && ev.estado !== "rojo")
    for (const id of miembrosCadena(seed, t.id).slice(1))
      if (evaluarTaller(seed, id, MES_ACTUAL).estado === "rojo")
        frases.push(`La subcontrata ${tallerDe(seed, id).nombre} está en rojo por separado.`);
  if (al && !ocultar)
    frases.push(
      `En la alerta del ${fmtFecha(al.fecha)} la diferencia era de ${fmtHoras(al.horasNecesarias)} frente a ${fmtHoras(al.horasCotizadas)} (${fmtRatio(al.ratio, 2)}).`,
    );
  for (const id of miembrosCadena(seed, raizDe(t).id)) {
    const d = tallerDe(seed, id).declaracionSubcontrata;
    if (d?.momento === "tras_alerta")
      frases.push(`La subcontrata ${tallerDe(seed, id).nombre} se declaró el ${fmtFecha(d.fecha)}, después de la alerta.`);
  }
  return frases;
}

const estadoHito = (h: Hito): HitoVista["estado"] =>
  h.estado === "cumplido"
    ? "hecho"
    : h.estado === "incumplido" || h.fechaLimite < FECHA_CORTE
      ? "retrasado"
      : h.estado === "en_curso"
        ? "en-curso"
        : "pendiente";

function plan(p: PlanCorreccion, m: MetricasImpacto): NonNullable<DetalleTaller["plan"]> {
  const pt = p.proteccionTrabajadores;
  const c = p.clausulaAntiDespido;
  return {
    id: p.id,
    revisor: p.revisor.nombre,
    revisorTipo: TIPO_REVISOR[p.revisor.tipo],
    hitos: p.hitos.map((h) => ({
      id: h.id,
      titulo: h.descripcion,
      fecha: h.fechaCumplimiento ?? h.fechaLimite,
      estado: estadoHito(h),
      responsable: RESPONSABLE_HITO[h.responsable],
    })),
    extensiones: p.extensiones.map((e) => ({ ...e, nombre: tallerDe(seed, e.tallerId).nombre })),
    clausula: { vigenteDesde: c.vigenteDesde, vigenteHasta: c.vigenteHasta, texto: c.texto, incumplimientos: c.incumplimientos },
    limiteReduccionPct: p.limiteReduccionPedidosPct,
    reduccionUsadaPct: Math.max(0, m.pedidosMantenidos.reduccionPct), // si los pedidos suben, no se usa límite
    acompanamiento: {
      iniciadas: m.trabajadoresAcompanados.iniciados,
      altasDirectas: pt.altasDirectas,
      entidad: pt.entidadAcompanante,
      vias: [...new Set(pt.regularizaciones.map((r) => TEXTOS_PROTECCION.acompanamiento.vias[r.via]))],
    },
    protocoloLegal: p.protocoloLegal,
    fechaFinPrevista: p.fechaFinPrevista,
  };
}

/** null si el id no existe. */
export function detalleTaller(id: string): DetalleTaller | null {
  const t = seed.talleres.find((x) => x.id === id);
  if (!t) return null;
  const ocultar = ocultarCifrasDe(t);
  const ev = evaluacionDe(t, MES_ACTUAL);
  const individual = evaluarTaller(seed, id, MES_ACTUAL);
  const estado = t.nivel === 1 ? estadoPanel(seed, id, MES_ACTUAL) : individual.estado;
  const al = alertaDe(id);
  const p = planDe(id);
  const metricas = p ? calcularMetricas({ ...seed, planesCorreccion: [p] }, FECHA_CORTE) : null;
  return {
    taller: t,
    estado,
    evaluacion: ocultar ? sinCifras(ev) : ev,
    evaluacionIndividual: ocultar ? sinCifras(individual) : individual,
    micro: ev.micro ?? false,
    ocultarCifras: ocultar,
    ventanas: ventanas(t, ocultar),
    resumen: resumen(t, ev, ocultar),
    alerta: al,
    nodos: nodos(t),
    plan: p && metricas ? plan(p, metricas) : null,
    impacto: p && metricas ? kpis(metricas, [p]).slice(0, 4) : [], // sin plan no hay impacto que medir
    porQue: porQue(t, estado, ev, al, ocultar),
    comprobaciones: esAlerta(estado) ? [...COMPROBACIONES_ALERTA] : [],
  };
}

/** Para generateStaticParams. */
export const idsTalleres = (): string[] => seed.talleres.map((t) => t.id);
