// Textos de la interfaz (specs/DESIGN.md §3 y §6, specs/LEGAL.md §2 y §3). Dueño: agente Legal.
// Los componentes importan de aquí; el agente Legal puede cambiar los valores y añadir exports, no renombrar ni quitar.
// Reglas: lenguaje no acusatorio («posible desajuste», «revisión abierta», «sin datos»); una alerta no es una prueba;
// un verde no es un sello; ninguna marca, empresa ni persona real. Concepto: «horas de alta» (no «horas cotizadas»:
// en España se cotiza por base, no por horas). Las funciones reciben cifras YA formateadas con @/lib/formato.
import type {
  EstadoSemaforo,
  Firmante,
  Hito,
  HitoVista,
  NodoCadena,
  Pais,
  PlanCorreccion,
  RevisorIndependiente,
} from "@/lib/calculo/tipos";

type Via = PlanCorreccion["proteccionTrabajadores"]["regularizaciones"][number]["via"];

// ---------- Semáforo ----------
export const ETIQUETA_ESTADO: Record<EstadoSemaforo, string> = {
  verde: "En margen",
  ambar: "Vigilar",
  rojo: "Revisar",
  sin_datos: "Sin datos",
};

/** Una línea por estado (leyenda, tooltip, celda). */
export const DESCRIPCION_ESTADO: Record<EstadoSemaforo, string> = {
  verde: "La carga cabe en las horas de alta.",
  ambar: "Supera las horas de alta dentro del margen para picos.",
  rojo: "Supera el margen: se abre una revisión.",
  sin_datos: "Falta un informe mensual de horas de alta: no se puede calcular el semáforo.",
};

/** `aria-label` del semáforo en modo `soloIcono` (DESIGN §8): «Estado: Revisar». */
export const ariaEstado = (estado: EstadoSemaforo) => `Estado: ${ETIQUETA_ESTADO[estado]}`;

/** Anuncio `aria-live` cuando el semáforo cambia en la demo (MOTION): «Rojo · revisión abierta». */
export const ANUNCIO_ESTADO: Record<EstadoSemaforo, string> = {
  verde: "Verde · en margen",
  ambar: "Ámbar · vigilar",
  rojo: "Rojo · revisión abierta",
  sin_datos: "Sin datos · falta el informe de horas",
};

/** Filtros del panel (DESIGN §3): «Rojo (1)». */
export const FILTRO_ESTADO: Record<EstadoSemaforo | "todos", string> = {
  todos: "Todos",
  rojo: "Rojo",
  ambar: "Ámbar",
  verde: "Verde",
  sin_datos: "Sin datos",
};

// ---------- Notas bajo la cabecera del taller ----------
export const NOTA_ALERTA = {
  titulo: "Es una alerta, no una prueba.",
  texto:
    "El trabajo encargado no cabe en las horas de alta de la plantilla. Se abre una revisión con el proveedor; no implica incumplimiento ni justifica retirar pedidos.",
};

/** Qué significa un verde, y nada más (no puede usarse en publicidad ni como sello público). */
export const VERDE_NO_ES_SELLO =
  "Un verde no es un sello: significa que las horas cuadran con los pedidos de esta marca, y nada más.";

/** `NotaAlerta({estado})`: una nota por estado; la de rojo es NOTA_ALERTA. */
export const NOTA_ESTADO: Record<EstadoSemaforo, { titulo: string; texto: string }> = {
  verde: {
    titulo: "Sin desajuste en el periodo.",
    texto: `Las horas de alta cubren la carga estimada de tus pedidos en los últimos 3 meses. ${VERDE_NO_ES_SELLO}`,
  },
  ambar: {
    titulo: "Desajuste dentro del margen para picos.",
    texto:
      "Puede deberse a una campaña, a producción adelantada o a minutos estándar mal fijados. Se pide una explicación al proveedor, sin plan de corrección.",
  },
  rojo: NOTA_ALERTA,
  sin_datos: {
    titulo: "Sin informe no hay semáforo.",
    texto:
      "Falta el informe de horas de alta de algún mes del periodo. La falta de un dato no es una prueba: se recuerda la entrega al taller y a su gestor.",
  },
};

// ---------- Aviso de datos ficticios ----------
export const AVISO_DEMO = {
  banda: "Prototipo de demostración · datos ficticios: empresas, talleres, personas y cifras son inventados.",
  compacto: "Prototipo de demostración · datos ficticios",
};

// ---------- Marco de la app ----------
export const TEXTOS_APP = {
  nombre: "Trama",
  lema: "Control mensual de capacidad de talleres",
  descripcion:
    "Prototipo con datos ficticios: compara los pedidos de una marca con las horas de alta de sus talleres.",
  /** Qué aporta Trama (en lugar de «certifica» o «evita sanciones»). */
  valor: "Trama ayuda a decidir dónde mirar y documenta que la empresa vigiló.",
  saltar: "Saltar al contenido",
  navAria: "Principal",
  nav: { panel: "Panel", comoCalculamos: "Cómo calculamos", legal: "Legal y avisos" },
  pie: "Trama · MVP · datos ficticios",
  aviso: "No constituye asesoramiento jurídico.",
};

/** `/` (DESIGN §3). */
export const TEXTOS_ENTRADA = {
  titulo: "Trama",
  subtitulo: "Control mensual de capacidad de talleres",
  boton: "Entrar como marca demo",
  nota: "Entrarás como una marca ficticia. Sin registro, sin contraseña y sin datos reales.",
};

/** Página 404 general. */
export const TEXTOS_NO_ENCONTRADO = {
  titulo: "No encontramos esta página.",
  accion: "Volver al panel",
};

export const PAIS_NOMBRE: Record<Pais, string> = { ES: "España", IT: "Italia" };

export const NIVEL_CADENA: Record<1 | 2 | 3, string> = {
  1: "Proveedor directo",
  2: "Subcontrata · nivel 2",
  3: "Subcontrata · nivel 3",
};

/** Quién firma el informe mensual de horas de alta. */
export const TIPO_FIRMANTE: Record<Firmante["tipo"], string> = {
  gestor_laboral: "gestor laboral o graduado social",
  consulente_del_lavoro: "consulente del lavoro",
};

/** De dónde salen las horas de alta en cada país. */
export const ORIGEN_HORAS: Record<Pais, string> = {
  ES: "Personas de alta en la Seguridad Social (ITA) × jornada pactada",
  IT: "Libro Unico del Lavoro (LUL), extraído por el consulente del lavoro",
};

// ---------- Privacidad y competencia (LEGAL.md §1.1, §1.2 y §2) ----------
export const TEXTOS_PRIVACIDAD = {
  tallerPequeno: "Taller de menos de 4 personas: solo mostramos el semáforo para proteger su privacidad.",
  cifraOculta: "Solo semáforo",
  cifraOcultaAria: "Cifras ocultas por privacidad: taller de menos de 4 personas",
  agregadas: "Horas de alta totales del taller (informe agregado). Nunca por persona.",
  soloTusDatos: "Solo ves tus pedidos y tus semáforos. Nunca datos de otras marcas.",
  revisionAbierta:
    "El revisor independiente ha abierto una revisión en este taller. No mostramos datos de otros clientes.",
};

// ---------- /panel ----------
export const TEXTOS_PANEL = {
  titulo: "Panel de cumplimiento",
  /** "Periodo móvil ago–oct 2026 · fuente: informes mensuales de horas de alta" */
  periodo: (periodo: string) => `Periodo móvil ${periodo} · fuente: informes mensuales de horas de alta`,
  kpisTitulo: "Impacto en los trabajadores",
  talleresTitulo: "Talleres de tu cadena",
  filtrosAria: "Filtrar talleres por estado",
  filtro: (etiqueta: string, n: number) => `${etiqueta} (${n})`,
  columnas: {
    estado: "Estado",
    taller: "Taller",
    nivel: "Nivel en la cadena",
    pais: "País",
    carga: "Carga / horas de alta",
    certificado: "Último informe",
    detalle: "Detalle",
  },
  verDetalle: "Ver detalle",
  verDetalleAria: (taller: string) => `Ver detalle de ${taller}`,
  conPlan: "Plan de corrección en curso",
  subcontrataDe: (proveedor: string) => `Subcontrata de ${proveedor}`,
  sinCertificado: "Sin informe",
  nota: TEXTOS_PRIVACIDAD.soloTusDatos,
  vacio: "Aún no hay talleres en tu cadena.",
  filtroVacio: {
    rojo: "Ningún taller en rojo este periodo.",
    ambar: "Ningún taller en ámbar este periodo.",
    verde: "Ningún taller en verde este periodo.",
    sin_datos: "Ningún taller sin datos este periodo.",
  } satisfies Record<EstadoSemaforo, string>,
  verTodos: "Ver todos",
  error: "No hemos podido leer los datos de la demo. Recarga la página.",
};

// ---------- KPIs (DESIGN §6, DATA_MODEL §4) ----------
export const KPI_ETIQUETAS = {
  principal: "Siguen empleados y dados de alta 6 meses después de la alerta",
  horasRegularizadas: "Horas regularizadas",
  acompanados: "Trabajadores acompañados en su regularización",
  pedidosMantenidos: "Pedidos mantenidos durante el plan",
  fallos: "Despidos o recortes por encima del límite",
};

/** Cómo se calcula cada KPI, en una frase (tooltip o nota). */
export const KPI_AYUDA = {
  principal:
    "Personas de la línea base (con y sin alta al abrir la alerta) que siguen empleadas y de alta. Provisional hasta cumplir 6 meses.",
  horasRegularizadas: "Horas de alta de más en los talleres del plan frente a su media del periodo de referencia.",
  acompanados:
    "Regularizaciones iniciadas con una ONG o un sindicato: arraigo sociolaboral (España) o permiso art. 18 por la vía social (Italia).",
  pedidosMantenidos: "Pedidos a la cadena durante el plan frente al periodo de referencia, en horas estándar al mes.",
  fallos: "Despidos tras la alerta y planes con una caída de pedidos por encima del límite pactado. Lo esperado es 0.",
};

/** Línea `contexto` de cada KpiCard. */
export const KPI_CONTEXTO = {
  /** "14 de 18 trabajadores · provisional (mes 3 de 6)" */
  principal: (siguen: string, base: string, mes: number, de: number, definitiva: boolean) =>
    `${siguen} de ${base} trabajadores · ${definitiva ? "definitiva" : `provisional (mes ${mes} de ${de})`}`,
  horasRegularizadas: "En los talleres del plan, frente al periodo de referencia",
  /** "0 resueltos · 3 altas directas" */
  acompanados: (resueltos: string, altas: string) => `${resueltos} resueltos · ${altas} altas directas`,
  /** "Reducción del 10 % · límite pactado 20 %" */
  pedidosMantenidos: (reduccion: string, limite: string) => `Reducción del ${reduccion} · límite pactado ${limite}`,
  /** "0 despidos · 0 planes con recorte sobre el límite" */
  fallos: (despidos: string, planes: string) => `${despidos} despidos · ${planes} planes con recorte sobre el límite`,
};

// ---------- /taller/[id] ----------
export const SECCIONES_TALLER = {
  horas: "Horas necesarias y horas de alta",
  cadena: "Cadena de suministro",
  plan: "Plan de corrección",
  proteccion: "Protección de trabajadores",
  impacto: "Impacto en este taller",
};

/** Etiquetas cortas de la subnav (DESIGN §3). */
export const SUBNAV_TALLER = {
  aria: "Secciones del taller",
  horas: "Horas",
  cadena: "Cadena",
  plan: "Plan",
  proteccion: "Protección",
  impacto: "Impacto",
};

export const TEXTOS_TALLER = {
  migas: "Panel",
  migasAria: "Migas de pan",
  /** "2,4× las horas de alta" (ratio ya con ×: fmtRatio). */
  ratio: (ratio: string) => `${ratio} las horas de alta`,
  ratioCadena: "Ratio de toda la cadena (proveedor y subcontratas)",
  plantilla: (n: string) => `${n} personas de alta`,
  resumen: {
    titulo: "Resumen del periodo",
    necesarias: "Horas necesarias",
    cotizadas: "Horas de alta",
    diferencia: "Diferencia",
    plantilla: "Plantilla de alta",
    firmante: "Firmante",
    fecha: "Fecha del informe",
    /** "Informe de horas de alta del gestor laboral o graduado social, oct 2026" (firmante: TIPO_FIRMANTE). */
    fuente: (firmante: string, mes: string) => `Informe de horas de alta del ${firmante}, ${mes}`,
    necesariasAyuda: "Pedidos de la marca × minutos estándar (estimación de demo).",
    cotizadasAyuda: TEXTOS_PRIVACIDAD.agregadas,
  },
  /** DESIGN §3, estado sin informe. */
  sinCertificado: (mes: string) => `Falta el informe de horas de alta de ${mes}: no se puede calcular el semáforo.`,
  verdeSinPlan: "Sin plan de corrección: el taller está dentro del margen.",
  ambarSinPlan: "Sin plan de corrección: se ha pedido una explicación al proveedor.",
  sinDatosSinPlan: "Sin plan de corrección: falta un informe para calcular el semáforo.",
  cifrasOcultas: TEXTOS_PRIVACIDAD.tallerPequeno,
  noEncontrado: { titulo: "No encontramos este taller.", accion: "Volver al panel" },
};

/** `ResumenAlerta` (LEGAL.md §2, «Alerta roja»). */
export const TEXTOS_ALERTA = {
  titulo: (taller: string) => `Revisión necesaria en ${taller}`,
  tituloPorQue: "Por qué salta",
  tituloComprobar: "Qué comprobaría una persona",
  cierre: "Trama propone dónde mirar; decide una persona del equipo de cumplimiento.",
  /** "Alerta del 7 ago 2026 · instantánea: no se recalcula" */
  fecha: (fecha: string) => `Alerta del ${fecha} · instantánea: no se recalcula`,
  necesarias: "necesarias según tus pedidos",
  cotizadas: "de alta en toda la plantilla",
  /** "Faltan ≈4.640 h (×2,4)": horas con fmtHoras, ratio SIN × (fmtNumero(r, 1)). */
  faltan: (horas: string, ratio: string) => `Faltan ≈${horas} (×${ratio})`,
  cuerpo: (p: { desde: string; hasta: string; necesarias: string; cotizadas: string; firmante: string }) =>
    `Entre ${p.desde} y ${p.hasta}, tus pedidos a este taller requieren unas ${p.necesarias} según los minutos estándar; el informe del ${p.firmante} recoge ${p.cotizadas} de alta para toda la plantilla.`,
  causas:
    "La diferencia puede deberse a subcontratas no declaradas, horas trabajadas no declaradas o errores en los datos. Esto no prueba ninguna infracción.",
  siguientePaso:
    "Siguiente paso: pedir al proveedor la declaración de subcontratas. Mantén los pedidos dentro del límite pactado mientras dure la revisión.",
};

/** Lista «Qué comprobaría una persona» de ResumenAlerta (la hace el revisor independiente, no la marca). */
export const COMPROBACIONES_ALERTA: string[] = [
  "Nóminas y registro de jornada del periodo",
  "Visita sin avisar, también en horario de tarde",
  "Entrevistas confidenciales con trabajadores, hechas por el revisor independiente",
  "Contrastar el consumo eléctrico por franjas con los turnos declarados",
  "Pedir al proveedor la lista de subcontratas y sus horas de alta",
];

/** Simulador «Prueba el cálculo» (3 controles). Cifras con @/lib/formato. */
export const TEXTOS_SIMULADOR = {
  titulo: "Prueba el cálculo",
  ayuda:
    "Mueve las unidades, los minutos o las personas de alta y mira cómo cambia el semáforo. Mismo cálculo que el panel.",
  controles: {
    chaquetas: "Chaquetas en el trimestre",
    personas: "Personas de alta",
    cuota: "Parte de la facturación del taller que es de Ordessa",
  },
  minutos: "Minutos por chaqueta",
  escenarios: { demo: "Taller de la demo", casoPublico: "Caso reconstruido con datos públicos" },
  casoPublico:
    "Reconstrucción anonimizada a partir de información pública de prensa: el proveedor directo no tenía taller propio (capacidad 0) y un subproveedor con 7 personas entregaba entre 6.000 y 7.000 chaquetas al año. Unas 2 h por chaqueta disponibles. Los minutos por chaqueta son una estimación: muévelos para ver dónde deja de caber.",
  /** "Carga de Ordessa: 8.000 h frente a 3.360 h de alta (2,4×)" */
  cargaMarca: (necesarias: string, alta: string, ratio: string) =>
    `Carga de Ordessa: ${necesarias} frente a ${alta} de alta (${ratio})`,
  /** "Carga total estimada del taller: 11,9× las horas de alta" */
  cargaTotal: (ratio: string) => `Carga total estimada del taller: ${ratio} las horas de alta`,
  formula: "Carga total ≈ carga de Ordessa ÷ su parte de la facturación del taller.",
  nota: "El taller de la demo es ficticio; el caso reconstruido usa cifras públicas de prensa, anonimizadas. Los minutos por pieza son una estimación.",
};

/** `HoursChart` (DESIGN §5). */
export const TEXTOS_GRAFICO = {
  titulo: "Horas necesarias y horas de alta por trimestre móvil",
  pie: "Necesarias: pedidos de la marca × minutos estándar. De alta: informe mensual de horas de alta del taller. Cada ventana suma 3 meses.",
  series: {
    cotizadas: "Horas de alta",
    necesarias: "Necesarias",
    limiteAmbar: "Límite ámbar",
    limiteRojo: "Límite rojo",
  },
  ejeY: "Horas",
  tooltip: { necesarias: "Necesarias", cotizadas: "De alta", ratio: "Ratio", estado: "Estado" },
  verTabla: "Ver como tabla",
  verGrafico: "Ver como gráfico",
  tablaCaption: "Horas por ventana móvil de 3 meses",
  columnas: { ventana: "Ventana", necesarias: "Necesarias", cotizadas: "De alta", ratio: "Ratio", estado: "Estado" },
  sinCertificado: "Sin informe",
  cifrasOcultas: "Cifras ocultas: taller de menos de 4 personas. Solo se muestra el semáforo de cada ventana.",
};

/** `ChainDiagram` (DESIGN §4, MOTION). */
export const TEXTOS_CADENA = {
  aria: "Cadena de suministro: marca, proveedor y subcontratas declaradas",
  tipo: { marca: "Marca", proveedor: "Proveedor directo", subcontrata: "Subcontrata" } satisfies Record<
    NodoCadena["tipo"],
    string
  >,
  momento: { previa: "Declarada antes de la alerta", tras_alerta: "Declarada tras la alerta" } satisfies Record<
    NonNullable<NodoCadena["momento"]>,
    string
  >,
  declarada: (fecha: string) => `Declarada el ${fecha}`,
  fantasma: "Subcontrata no declarada",
  pendiente: "Declaración pendiente: obligatoria tras un rojo",
  extension: "Cláusula e informe mensual extendidos",
  plantilla: (n: string) => `${n} personas de alta`,
  plantillaOculta: "Menos de 4 personas: solo semáforo",
  peorEstado: "El proveedor muestra el peor estado de su cadena.",
  sinCertificadoCuentaCero: "Una subcontrata sin informe de horas cuenta 0 h: declararla no limpia un rojo.",
  nota: "Solo se muestran tu marca y los talleres de tu cadena. Nunca datos de otras marcas.",
};

// ---------- Plan de corrección (DESIGN §4 PlanTimeline) ----------
export const ESTADO_HITO: Record<HitoVista["estado"], string> = {
  hecho: "Hecho",
  "en-curso": "En curso",
  pendiente: "Pendiente",
  retrasado: "Retrasado",
};

/** Para construir `HitoVista.responsable`. */
export const RESPONSABLE_HITO: Record<Hito["responsable"], string> = {
  marca: "Marca",
  proveedor: "Proveedor",
  subcontrata: "Subcontrata",
  revisor: "Revisor independiente",
  ong_sindicato: "ONG o sindicato",
};

export const TIPO_REVISOR: Record<RevisorIndependiente["tipo"], string> = {
  sindicato: "Sindicato",
  ong: "ONG",
  consulente_asseveratore: "Consulente asseveratore",
};

export const TEXTOS_PLAN = {
  /** "Plan de corrección · revisado por {entidad}" (DESIGN §6). */
  titulo: (entidad: string) => `${SECCIONES_TALLER.plan} · revisado por ${entidad}`,
  revisor: "Revisor independiente, con declaración de ausencia de conflicto de interés.",
  responsable: (r: string) => `Responsable: ${r}`,
  fechaLimite: (fecha: string) => `Fecha límite: ${fecha}`,
  cumplido: (fecha: string) => `Cumplido el ${fecha}`,
  extension: (taller: string, fecha: string) => `Plan extendido a ${taller} el ${fecha}`,
  finPrevisto: (fecha: string) => `Fin previsto: ${fecha}`,
  nuncaRescision: "Un rojo nunca rescinde el contrato de forma automática: abre este plan.",
  sinPlan: {
    verde: TEXTOS_TALLER.verdeSinPlan,
    ambar: TEXTOS_TALLER.ambarSinPlan,
    rojo: "Plan de corrección pendiente: se abre tras la alerta.",
    sin_datos: TEXTOS_TALLER.sinDatosSinPlan,
  } satisfies Record<EstadoSemaforo, string>,
};

/** Caja neutra «Se aplica el protocolo legal» → /legal#protocolo (DESIGN §3.7). */
export const TEXTOS_PROTOCOLO = {
  titulo: "Se aplica el protocolo legal",
  texto:
    "La revisión aportó indicios que debe valorar una asesoría jurídica externa. La protección de los trabajadores sigue activa. Trama documenta y deriva: no investiga ni acusa.",
  enlace: "Cómo funciona el protocolo",
  href: "/legal#protocolo",
};

// ---------- Protección de trabajadores ----------
export const TEXTOS_PROTECCION = {
  intro: "La alerta no la pagan los trabajadores: estas protecciones se activan con el plan.",
  clausula: {
    titulo: "Cláusula anti-despido",
    estado: "Activa",
    /** "Vigente del 7 ago 2026 al 7 ago 2027 · toda la cadena" */
    vigencia: (desde: string, hasta: string) => `Vigente del ${desde} al ${hasta} · toda la cadena`,
    texto:
      "Ningún taller de la cadena despide ni da de baja por causas ligadas a la alerta o al plan. Toda baja se comunica al revisor, que la revisa antes.",
    incumplimientos: (n: number) =>
      n === 0 ? "Sin incumplimientos" : n === 1 ? "1 incumplimiento" : `${n} incumplimientos`,
  },
  limite: {
    titulo: "Límite de reducción de pedidos",
    /** "Usado 10 % de 20 %" (cifras con fmtPct). */
    uso: (usado: string, limite: string) => `Usado ${usado} de ${limite}`,
    texto:
      "Durante el plan, la marca no reduce sus pedidos a la cadena más de este porcentaje frente al periodo de referencia, en horas estándar al mes.",
    porQue: "Retirar pedidos no corrige el desajuste: lo traslada a los trabajadores.",
    dentro: "Dentro del límite",
    fuera: "Por encima del límite",
  },
  acompanamiento: {
    titulo: "Acompañamiento",
    personas: (n: string) => `${n} trabajadores acompañados en su regularización`,
    altas: (n: string) => `${n} altas directas con permiso de trabajo válido`,
    entidad: (entidad: string) => `Con ${entidad}`,
    vias: {
      arraigo_sociolaboral: "Arraigo sociolaboral (España)",
      art18_via_social: "Permiso art. 18, vía social (Italia)",
    } satisfies Record<Via, string>,
    nota: "Lo gestiona la ONG o el sindicato. Trama solo recibe recuentos agregados: nunca nombres ni situación migratoria.",
  },
};

/** Sección #impacto del detalle. */
export const TEXTOS_IMPACTO = {
  nota: "Recuentos agregados de los talleres del plan, sin nombres. Fuente: informes mensuales y revisor independiente.",
  sinPlan: "Sin plan de corrección: no hay métricas de impacto en este taller.",
};
