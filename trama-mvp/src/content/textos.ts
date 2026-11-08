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
  nav: { panel: "Panel", escenas: "Escenas", comoCalculamos: "Cómo calculamos", legal: "Legal y avisos" },
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

// ---------- KPIs (DESIGN §6, DATA_MODEL §4; rediseño en problemas/metricas_impacto.md) ----------
export const KPI_ETIQUETAS = {
  principal: "Personas de la línea base que siguen de alta",
  horasRegularizadas: "Hueco cerrado con altas nuevas",
  acompanados: "Personas sin alta al abrir la alerta",
  pedidosMantenidos: "Pedidos mantenidos durante el plan",
  fallos: "Bajas en la línea base desde la alerta",
};

/** Cómo se calcula cada KPI, en una frase (tooltip o nota). */
export const KPI_AYUDA = {
  principal:
    "Personas contadas al abrir la alerta, con y sin alta. Solo cuenta como logro estar de alta, y nadie sale de la línea base. Provisional hasta los 6 meses.",
  horasRegularizadas:
    "Parte del hueco de horas de la cadena que se ha cerrado con más plantilla de alta, frente a la que se ha cerrado retirando pedidos.",
  acompanados:
    "Las cuenta el revisor en una visita sin aviso, con un censo confidencial: ni la marca ni Trama ven nombres. Recuento agregado del revisor: ya de alta, en trámite (arraigo en España, art. 18 en Italia) o sin vía (no cumplen los requisitos o les fue denegada). Con 1-3 personas se muestra «menos de 4».",
  pedidosMantenidos: "Pedidos a la cadena durante el plan frente al periodo de referencia, en horas estándar al mes.",
  fallos:
    "Personas de la línea base que han estado de alta y ya no lo están. Sustituye al recuento de despidos, que declara el propio taller.",
};

/** Línea `contexto` de cada KpiCard: de dónde partía → dónde está. Cifras ya formateadas. */
export const KPI_CONTEXTO = {
  /** "14 de 18 personas · al abrir la alerta, 11 de alta · provisional (mes 3 de 6)" */
  principal: (siguen: string, base: string, partida: string, mes: number, de: number, definitiva: boolean) =>
    `${siguen} de ${base} personas · al abrir la alerta, ${partida} de alta · ${definitiva ? "definitiva" : `provisional (mes ${mes} de ${de})`}`,
  /** "1.120 h con altas nuevas · 800 h con pedidos retirados · faltaban 2.720 h, hoy 800 h" */
  horasRegularizadas: (altas: string, retirados: string, faltaban: string, hoy: string) =>
    `${altas} con altas nuevas · ${retirados} con pedidos retirados · faltaban ${faltaban}, hoy ${hoy}`,
  /** "3 ya de alta · 4 en trámite · 0 sin vía de regularización" */
  acompanados: (yaDeAlta: string, enTramite: string, sinVia: string) =>
    `${yaDeAlta} ya de alta · ${enTramite} en trámite · ${sinVia} sin vía de regularización`,
  /** "Reducción del 10 % · límite pactado 20 % · partida: 2.667 h al mes (may–jul 2026)" */
  pedidosMantenidos: (reduccion: string, limite: string, partida: string | null, supera: boolean) =>
    `Reducción del ${reduccion} · límite pactado ${limite}${supera ? " · supera el límite" : ""}${partida ? ` · partida: ${partida}` : ""}`,
  /** "de 14 personas que han estado de alta · lo cuenta el revisor con la lista de la gestoría" */
  fallos: (personas: string) => `de ${personas} personas que han estado de alta · lo cuenta el revisor con la lista de la gestoría`,
  /** Grupos de 1 a 3 personas que revelan situación migratoria: «menos de 4» (misma regla de privacidad que el resto). */
  menosDe4: "menos de 4",
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
    "Reconstrucción anonimizada a partir de información pública de prensa: el proveedor directo no tenía taller propio (capacidad 0: rojo siempre) y un subproveedor con 7 personas entregaba entre 6.000 y 7.000 chaquetas al año. Unas 2 h por chaqueta disponibles. 180 min es la referencia de una fábrica premium; el suelo externo es el mínimo industrial, 126 min, y con él sale ámbar. Mueve los minutos para ver dónde deja de caber.",
  /** "Carga de Ordessa: 8.000 h frente a 3.360 h de alta (2,4×)" */
  cargaMarca: (necesarias: string, alta: string, ratio: string) =>
    `Carga de Ordessa: ${necesarias} frente a ${alta} de alta (${ratio})`,
  /** "Carga total estimada del taller: 11,9× las horas de alta" */
  cargaTotal: (ratio: string) => `Carga total estimada del taller: ${ratio} las horas de alta`,
  formula:
    "Carga total ≈ carga de Ordessa ÷ su parte de la facturación del taller. Es una estimación (el precio por hora cambia entre clientes): no da rojo, abre una revisión. El rojo directo solo sale si los pedidos de Ordessa superan 1,10× la capacidad.",
  abreRevision: "Abre una revisión",
  sinRevision: "No abre revisión",
  nota: "El taller de la demo es ficticio (240 min por chaqueta, de su ficha de costes ficticia). El caso reconstruido usa cifras públicas de prensa, anonimizadas, y 180 min por chaqueta, la referencia de una fábrica premium (el suelo externo, mínimo industrial, es de 126 min).",
};

// ---------- /escenas (dos escenas para la demo; mismo cálculo que el panel) ----------
export const TEXTOS_ESCENAS = {
  titulo: "Escenas",
  entradilla:
    "El mismo cálculo del panel en dos situaciones: un taller que trabaja para varias marcas y un caso real reconstruido con datos públicos.",
  indiceAria: "Escenas de esta página",
  /** Enlace desde el panel. */
  enlacePanel: "Escenas: taller con 4 marcas y caso Milán 2025",
  cuatroMarcas: {
    titulo: "Taller con 4 marcas",
    resumen: "Con cada marca por separado sale verde. Al sumar los pedidos de las cuatro, rojo.",
    datos: "Datos ficticios",
    /** "Taller: Laboratorio Ligustro (ficticio) · 10 personas de alta" */
    taller: (nombre: string, personas: string) => `Taller: ${nombre} · ${personas} personas de alta`,
    marca: {
      etiqueta: "Panel de Ordessa",
      titulo: "Lo que ve Ordessa",
      /** "Sus pedidos: 1.920 h ÷ 4.800 h de alta" */
      cifras: (necesarias: string, alta: string) => `Sus pedidos: ${necesarias} ÷ ${alta} de alta`,
      revision: "Revisión abierta",
      revisionTexto: TEXTOS_PRIVACIDAD.revisionAbierta,
      noVe: "No ve cifras ni nombres de otras marcas, ni cuántas hay, ni por qué se abrió la revisión.",
    },
    tercero: {
      etiqueta: "No lo ve ninguna marca",
      titulo: "Lo que calcula Trama como tercero",
      caption: "Carga de cada marca y de la suma frente a las horas de alta del taller",
      columnas: { marca: "Marca", barra: "Carga frente a horas de alta", ratio: "Ratio", estado: "Estado" },
      suma: (n: string) => `Suma de las ${n}`,
      limiteAmbar: (r: string) => `Límite ámbar ${r}`,
      limiteRojo: (r: string) => `Límite rojo ${r}`,
      /** "6.240 h necesarias frente a 4.800 h de alta: no caben. Se abre una revisión." */
      pie: (necesarias: string, alta: string) => `${necesarias} necesarias frente a ${alta} de alta: no caben. Se abre una revisión.`,
    },
    salvaguardasAria: "Salvaguardas de competencia",
    minimo: {
      titulo: (n: string) => `Solo con ${n} marcas o más`,
      texto: (n: string) =>
        `La suma solo abre una revisión si al menos ${n} marcas del taller usan Trama. Con menos, la suma solo la ven el taller y el revisor independiente.`,
    },
    mismoAviso: {
      titulo: "El mismo aviso, sea cual sea la causa",
      texto:
        "«Revisión abierta» no cambia si la causa son los pedidos de la propia marca, la suma de varias u otra comprobación del revisor. Sin cifras, sin nombres y sin decir cuántas marcas hay.",
    },
    cuota: {
      titulo: "Si las demás marcas no usan Trama",
      /** "Carga total ≈ carga de Ordessa ÷ su parte de la facturación del taller. Con el 30 %: 0,40 ÷ 0,30 ≈ 1,33× → abre una revisión, sin datos de otras marcas." */
      texto: (pct: string, propio: string, cuota: string, total: string) =>
        `Carga total ≈ carga de Ordessa ÷ su parte de la facturación del taller. Con el ${pct}: ${propio} ÷ ${cuota} ≈ ${total} → abre una revisión, sin datos de otras marcas.`,
      enlace: "Cómo se calcula",
      href: "/como-calculamos#varias-marcas",
    },
  },
  casoMilan: {
    titulo: "Caso Milán 2025 (datos públicos)",
    corto: "Caso Milán 2025",
    rotulo: "Reconstrucción anonimizada a partir de información pública de prensa",
    /** Los estados salen del cálculo: «ámbar» con el mínimo industrial, «rojo» con minutos de fábrica premium. */
    resumen: (estadoSuelo: string, estadoPremium: string) =>
      `Una marca de lujo encargaba chaquetas a un proveedor sin taller propio, que las pasaba a un subproveedor de 7 personas. La auditoría no comprobó la capacidad. Con las cifras públicas, el proveedor sale rojo siempre; el subproveedor, ${estadoSuelo} con el mínimo industrial y ${estadoPremium} con minutos de fábrica premium.`,
    nodos: { marca: "Marca de lujo (anonimizada)", proveedor: "Proveedor A", subproveedor: "Subproveedor B" },
    pedidos: {
      titulo: "Lo que se encargaba",
      /** "6.000 chaquetas al año" */
      unidades: (n: string) => `${n} chaquetas al año`,
      unidadesNota: "La cifra baja del rango publicado (6.000-7.000).",
      /** "× 180 min por chaqueta = 18.000 h necesarias" */
      horas: (minutos: string, horas: string) => `× ${minutos} min por chaqueta = ${horas} necesarias`,
      minutosNota: (minutos: string, suelo: string) =>
        `${minutos} min: referencia de una fábrica premium (hasta ${minutos} min de costura). El suelo externo es el mínimo industrial: ${suelo} min.`,
    },
    proveedor: {
      titulo: "Sin taller propio",
      texto: (necesarias: string) => `${necesarias} ÷ 0 h de producción propia`,
      conclusion: "Rojo siempre, con cualquier minutaje: capacidad 0.",
    },
    subproveedor: {
      titulo: (personas: string) => `${personas} personas de alta`,
      /** "Con 180 min (fábrica premium): 18.000 h ÷ 12.250 h de alta (7 × ≈1.750 h al año)" */
      texto: (minutos: string, necesarias: string, alta: string, personas: string, horasPersona: string) =>
        `Con ${minutos} min (fábrica premium): ${necesarias} ÷ ${alta} de alta (${personas} × ≈${horasPersona} al año)`,
      /** "Supera el límite rojo de 1,10×." */
      conclusion: (limite: string) => `Supera el límite rojo de ${limite}.`,
    },
    /** "Con el suelo externo, el mínimo industrial (126 min): 1,03×, ámbar. El rojo empieza en ≈135 min." */
    umbral: (suelo: string, ratio: string, estado: string, minutosRojo: string) =>
      `Con el suelo externo, el mínimo industrial (${suelo} min): ${ratio}, ${estado}. El rojo empieza en ≈${minutosRojo} min.`,
    nota: "Anonimizado: sin nombres de empresas ni personas. Las fuentes de prensa están en la documentación del equipo, no en la app.",
  },
  documentos: {
    titulo: "Documentos de ejemplo",
    corto: "Documentos",
    sello: "Simulado",
    resumen: "Esquema del dato que entrega la gestoría (no es el formato oficial). De aquí salen las cifras del taller con 4 marcas.",
    usa: "Trama usa",
    plantilla: {
      titulo: "Informe de plantilla media de trabajadores en alta",
      emisor: "Lo emite la Seguridad Social (Sistema RED); lo descarga la gestoría. Agregado, sin nombres.",
      campos: { razon: "Razón social", ccc: "Código de cuenta de cotización", periodo: "Periodo", media: "Plantilla media en alta" },
      ccc: "DEMO-0001 (ficticio)",
      /** "10 × 160 h al mes × 3 meses = 4.800 h de alta" */
      usa: (personas: string, horasMes: string, meses: string, horas: string) =>
        `${personas} × ${horasMes} al mes × ${meses} meses = ${horas} de alta`,
    },
    escandallo: {
      titulo: "Ficha de costes (escandallo)",
      emisor: "La hace la marca para fijar el precio. Trama solo toma los minutos, nunca los precios.",
      pieza: "Chaqueta forrada · Ordessa (marca ficticia)",
      columnas: { operacion: "Operación", minutos: "Minutos" },
      total: "Total por chaqueta",
      /** "240 min × 480 chaquetas = 1.920 h necesarias" */
      usa: (minutos: string, piezas: string, horas: string) => `${minutos} min × ${piezas} chaquetas = ${horas} necesarias`,
    },
    modelo347: {
      titulo: "Modelo 347 (resumen por cliente)",
      emisor: "Lo presenta el taller a Hacienda cada año: importe con cada cliente de más de 3.005,06 €.",
      columnas: { cliente: "Cliente", importe: "Importe anual" },
      resto: "Resto de clientes",
      total: "Total declarado",
      /** "la parte de Ordessa, 288.000 € ÷ 960.000 € = 30 %. A la marca solo le llega si abre una revisión, nunca la cuota" */
      usa: (propio: string, total: string, pct: string) =>
        `la parte de Ordessa, ${propio} ÷ ${total} = ${pct}. A la marca solo le llega si abre una revisión, nunca la cuota`,
    },
  },
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
  nota: "Recuentos agregados de los talleres del plan, sin nombres. A las personas sin alta las cuenta el revisor independiente en una visita sin aviso, con un censo confidencial: ni la marca ni Trama ven nombres.",
  sinPlan: "Sin plan de corrección: no hay métricas de impacto en este taller.",
};
