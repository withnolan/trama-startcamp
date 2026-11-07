/**
 * Tipos compartidos de Trama.
 * Sección 1: copia literal de specs/DATA_MODEL.md §1.
 * Sección 2: contrato de vista (lo produce src/data/vista.ts; lo consumen componentes y rutas).
 * Dueño: agente de Datos y cálculo. Cambios solo ADITIVOS (no renombrar ni quitar campos).
 */

// ---------- Básicos ----------
export type ISODate = string;              // 'YYYY-MM-DD'
export type Mes = string;                  // 'YYYY-MM'
export type Pais = 'ES' | 'IT';
export type EstadoSemaforo = 'verde' | 'ambar' | 'rojo' | 'sin_datos';

// ---------- Marca ----------
export interface Marca {
  id: string;
  nombre: string;
  sector: 'marroquineria' | 'confeccion' | 'marroquineria_y_confeccion';
  pais: Pais;
  limiteReduccionPedidosPctPorDefecto: number; // 0-100; se copia a cada PlanCorreccion
}

// ---------- Taller y cadena ----------
export interface DeclaracionSubcontrata {
  momento: 'previa' | 'tras_alerta';  // ¿estaba declarada antes o se declaró a raíz de una alerta?
  fecha: ISODate;
  alertaId: string | null;            // obligatorio si momento = 'tras_alerta'
}

export interface Taller {
  id: string;
  nombre: string;
  pais: Pais;
  ciudad: string;
  provincia: string;
  nivel: 1 | 2 | 3;                   // 1 = proveedor directo de la marca; 2 = subcontrata de un nivel 1; 3 = subcontrata de un nivel 2
  padreId: string | null;             // null si nivel 1
  subcontrataIds: string[];           // hijos directos. Invariante: = talleres cuyo padreId === id
  declaracionSubcontrata: DeclaracionSubcontrata | null; // null si nivel 1
  especialidad: string;
}

// ---------- Tipo de pieza ----------
export interface TipoPieza {
  id: string;
  nombre: string;
  categoria: 'marroquineria' | 'confeccion';
  minutosEstandar: number;            // minutos de mano de obra directa por unidad, a ritmo estándar (100 %)
  fuente: 'estimacion_demo' | 'ficha_costes';
}

// ---------- Pedido ----------
export interface Pedido {
  id: string;
  marcaId: string;
  tallerId: string;                   // quien produce: el proveedor (origen 'marca') o la subcontrata (origen 'subencargo')
  tipoPiezaId: string;
  unidades: number;                   // entero > 0
  inicio: ISODate;                    // ventana de producción (inclusiva)
  fin: ISODate;                       // >= inicio
  referencia: string;
  origen: 'marca' | 'subencargo';     // 'subencargo' = parte de un pedido de la marca que el proveedor pasa a una subcontrata declarada
  pedidoOrigenId: string | null;      // solo para 'subencargo'
  fechaDeclaracion?: ISODate;         // solo para 'subencargo'
}
// Invariantes de un subencargo s con pedido de origen o:
//   s.tipoPiezaId === o.tipoPiezaId;  taller(s).padreId === o.tallerId;  Σ unidades de los subencargos de o <= o.unidades

// ---------- Certificado de horas ----------
export interface Firmante {
  tipo: 'gestor_laboral' | 'consulente_del_lavoro'; // ES → gestor_laboral; IT → consulente_del_lavoro
  despacho: string;
  numeroColegiado: string;
  viaAsseCo: boolean;                 // IT: tiene que ser true (asseverazione Asse.Co)
}

export interface CertificadoHoras {
  id: string;
  tallerId: string;
  mes: Mes;
  horasTotalesCotizadas: number;      // TOTAL de la plantilla asalariada en el mes: jornada contratada (incluye vacaciones,
                                      // bajas y permisos retribuidos) + horas extra declaradas. Nunca se desglosa por trabajador.
  numTrabajadores: number;            // asalariados de alta en el mes
  numTitulares?: number;              // titulares o socios trabajadores de alta (autónomo RETA / artigiano INPS)
  horasTitulares?: number;            // horas declaradas por los titulares; computan con un tope de 160 h/mes por titular
  firmante: Firmante;
  fechaEmision: ISODate;
  retroactivo?: boolean;              // emitido más tarde (p. ej. por una subcontrata declarada tras la alerta)
  // Solo talleres bajo un plan de corrección (datos agregados, firmados por el mismo firmante):
  trabajadoresLineaBaseDeAlta?: number; // cuántos trabajadores de la línea base del plan siguen de alta este mes
  despidosEnMes?: number;
}

// ---------- Alerta (instantánea inmutable) ----------
export interface Alerta {
  id: string;
  marcaId: string;
  tallerId: string;                   // raíz de la cadena (nivel 1)
  mesEvaluado: Mes;
  ventana: Mes[];
  fecha: ISODate;
  estado: 'rojo';
  horasNecesarias: number;
  horasCotizadas: number;
  ratio: number | null;
  nota?: string;
}

// ---------- Plan de corrección ----------
export type EstadoHito = 'pendiente' | 'en_curso' | 'cumplido' | 'incumplido';
// "vencido" no se guarda: se deriva (estado !== 'cumplido' && hoy > fechaLimite)

export interface Hito {
  id: string;
  descripcion: string;
  responsable: 'marca' | 'proveedor' | 'subcontrata' | 'revisor' | 'ong_sindicato';
  fechaLimite: ISODate;
  fechaCumplimiento: ISODate | null;
  estado: EstadoHito;
}

export interface RevisorIndependiente {
  tipo: 'sindicato' | 'ong' | 'consulente_asseveratore';
  nombre: string;
  pais: Pais;
  independiente: true;
  declaracionAusenciaConflicto: boolean;
}

export interface ClausulaAntiDespido {
  vigenteDesde: ISODate;              // fecha de la alerta
  vigenteHasta: ISODate;
  alcance: 'toda_la_cadena';
  texto: string;
  incumplimientos: number;
}

export interface PlanCorreccion {
  id: string;
  marcaId: string;
  alertaId: string;
  tallerRaizId: string;
  talleresIncluidos: string[];        // raíz + subcontratas (la lista crece con cada extensión)
  extensiones: { tallerId: string; fecha: ISODate; motivo: string }[];
  estado: 'en_curso' | 'cerrado_cumplido' | 'cerrado_incumplido';
  fechaInicio: ISODate;
  fechaFinPrevista: ISODate;          // fecha de la alerta + 6 meses
  revisor: RevisorIndependiente;
  hitos: Hito[];
  clausulaAntiDespido: ClausulaAntiDespido;
  limiteReduccionPedidosPct: number;  // 0-100: la marca no puede bajar más de este % (en horas estándar/mes)
  periodoReferenciaPedidos: Mes[];    // = ventana de la alerta
  proteccionTrabajadores: {
    lineaBase: { tallerId: string; deAltaEnAlerta: number; sinAltaIdentificados: number }[]; // recuento agregado
    altasDirectas: number;            // personas sin alta pero con permiso válido, dadas de alta sin necesidad de trámite
    regularizaciones: {
      tallerId: string;
      via: 'arraigo_sociolaboral' | 'art18_via_social'; // ES | IT
      iniciadas: number; resueltasFavorables: number; denegadas: number;
    }[];
    entidadAcompanante: string;
  };
  protocoloLegal: { activado: boolean; fecha: ISODate | null; nota: string };
}

// ---------- Métricas de impacto (agregadas por marca) ----------
export interface MetricasImpacto {
  marcaId: string;
  fechaCorte: ISODate;
  ultimoMesCertificado: Mes;
  principal: {
    nombre: string;
    trabajadoresLineaBase: number;
    siguenEmpleadosYDeAlta: number;
    porcentaje: number;               // 0-100, 2 decimales
    mesesDesdeAlerta: number;
    definitiva: boolean;              // false hasta que se cumplen los 6 meses
    fechaDefinitiva: ISODate;
  };
  horasRegularizadas: number;
  trabajadoresAcompanados: { iniciados: number; resueltosFavorables: number; altasDirectas: number };
  pedidosMantenidos: {
    horasMensualesReferencia: number;
    horasMensualesDurantePlan: number;
    porcentajeMantenido: number;
    reduccionPct: number;
    limiteReduccionPct: number;
    cumpleLimite: boolean;
  };
  fallos: { despidosTrasAlerta: number; planesConCaidaPedidosSobreLimite: number };
  planesActivos: number;
}

// ---------- Resultado del cálculo (no se guarda: se calcula) ----------
export interface Evaluacion {
  tipo: 'taller' | 'cadena';
  tallerId: string;
  mes: Mes;                           // último mes de la ventana
  ventana: Mes[];
  estado: EstadoSemaforo;
  horasNecesarias?: number;
  horasCotizadas?: number;
  ratio?: number | null;              // null = ∞ (0 h cotizadas con carga > 0)
  micro?: boolean;
  mesesSinCertificado?: Mes[];
  certificadosSubcontrataQueFaltan?: { tallerId: string; mes: Mes }[]; // solo en tipo 'cadena'
}

// ---------- Seed completo ----------
export interface Seed {
  meta: { descripcion: string; version: string; fechaCorte: ISODate; mesEvaluacionActual: Mes; mesesConCertificado: Mes[]; minutosEstandar: string };
  parametros: {
    mesesVentana: number; umbralVerde: number; umbralRojo: number; umbralRojoMicro: number;
    maxPersonasMicro: number; topeHorasTitularMes: number; decimalesRatio: number; reparto: string;
  };
  marca: Marca;
  tiposPieza: TipoPieza[];
  talleres: Taller[];
  pedidos: Pedido[];
  certificadosHoras: CertificadoHoras[];
  alertas: Alerta[];
  planesCorreccion: PlanCorreccion[];
  metricasImpacto: MetricasImpacto;
  esperado: unknown; // lo tipan los tests
}

// =====================================================================
// 2. CONTRATO DE VISTA (src/data/vista.ts → componentes y páginas)
// =====================================================================

/** Fila del panel (DESIGN §3 /panel). Nivel 1 con sus subcontratas anidadas. */
export interface TallerResumen {
  id: string;
  nombre: string;
  nivel: 1 | 2 | 3;
  pais: Pais;
  ciudad: string;
  estado: EstadoSemaforo;            // nivel 1: estadoPanel (peor de la cadena); subcontrata: su estado individual
  ratio: number | null | undefined;  // nivel 1: ratio de la cadena; null = ∞; undefined = sin datos
  horasNecesarias?: number;
  horasCotizadas?: number;
  micro: boolean;
  ocultarCifras: boolean;            // RGPD: < 4 personas → solo semáforo, sin cifras
  ultimoCertificado: Mes | null;     // último mes con certificado válido
  tienePlan: boolean;
  subcontratas: TallerResumen[];
}

/** Una ventana móvil para HoursChart (DESIGN §5). */
export interface VentanaHoras {
  etiqueta: string;                  // "may–jul 26"
  mes: Mes;                          // último mes de la ventana
  necesarias: number;
  cotizadas: number | null;          // null si sin datos
  limiteAmbar: number | null;        // = umbralVerde × cotizadas (por encima: ámbar)
  limiteRojo: number | null;         // = U_rojo × cotizadas (por encima: rojo)
  ratio: number | null | undefined;
  estado: EstadoSemaforo;
}

/** Nodo de ChainDiagram (DESIGN §4). */
export interface NodoCadena {
  id: string;
  nombre: string;
  tipo: 'marca' | 'proveedor' | 'subcontrata';
  nivel: 0 | 1 | 2 | 3;              // 0 = marca
  padreId: string | null;
  pais?: Pais;
  ciudad?: string;
  plantilla?: number | null;         // personas de alta (trab. + titulares) del último certificado; null si ocultarCifras
  estado?: EstadoSemaforo;
  momento?: 'previa' | 'tras_alerta';
  declaradaEl?: ISODate;
  pendiente?: boolean;               // nodo punteado "Declaración pendiente"
}

/** Hito para PlanTimeline (DESIGN §4). */
export interface HitoVista {
  id: string;
  titulo: string;
  fecha: ISODate;
  estado: 'hecho' | 'en-curso' | 'pendiente' | 'retrasado';
  responsable: string;               // ya en texto para mostrar ("Proveedor", "ONG o sindicato"...)
}

/** Datos de una KpiCard (DESIGN §4). */
export interface KpiVista {
  id: string;
  etiqueta: string;
  valor: number;                     // número crudo (KpiCounter lo anima); el formato lo da `formato`
  formato: 'entero' | 'porcentaje' | 'horas';
  decimales?: number;                // para KpiCounter/formatearKpi (p. ej. 1 en la principal: "77,8 %"); por defecto 0
  unidad?: string;
  contexto?: string;                 // "de 18 trabajadores · provisional (mes 3 de 6)"
  variante: 'principal' | 'normal' | 'fallo';
  progreso?: number;                 // 0-100, solo principal
}

/** Todo lo que necesita /taller/[id]. */
export interface DetalleTaller {
  taller: Taller;
  estado: EstadoSemaforo;            // el que se muestra en cabecera (estadoPanel si nivel 1)
  evaluacion: Evaluacion;            // cadena si nivel 1 con subcontratas; si no, la del taller
  evaluacionIndividual: Evaluacion;
  micro: boolean;
  ocultarCifras: boolean;
  ventanas: VentanaHoras[];
  resumen: {
    periodo: string;                 // "ago–oct 2026"
    necesarias: number | null;
    cotizadas: number | null;
    diferencia: number | null;       // necesarias − cotizadas
    plantilla: number | null;        // personas último mes
    firmante: string;                // "Gestor laboral · Gestoría X (ficticia)" / "Consulente del lavoro vía Asse.Co · ..."
    fechaCertificado: ISODate | null;
    mesesSinCertificado: Mes[];
  };
  alerta: Alerta | null;             // instantánea (p. ej. AL-001: 8.000 / 3.360 = 2,381)
  nodos: NodoCadena[];
  plan: null | {
    id: string;
    revisor: string;                 // nombre de la entidad revisora
    revisorTipo: string;             // "ONG", "Sindicato"...
    hitos: HitoVista[];
    extensiones: { tallerId: string; nombre: string; fecha: ISODate; motivo: string }[];
    clausula: { vigenteDesde: ISODate; vigenteHasta: ISODate; texto: string; incumplimientos: number };
    limiteReduccionPct: number;
    reduccionUsadaPct: number;       // reducción real de pedidos durante el plan
    acompanamiento: { iniciadas: number; altasDirectas: number; entidad: string; vias: string[] };
    protocoloLegal: { activado: boolean; fecha: ISODate | null; nota: string };
    fechaFinPrevista: ISODate;
  };
  impacto: KpiVista[];               // 4 KPIs compactas del taller/cadena ([] si no hay plan)
  porQue: string[];                  // frases con las cifras reales si el estado es rojo/ámbar; [] si verde o sin datos
  comprobaciones: string[];          // qué revisar si el estado es rojo/ámbar; [] si verde o sin datos
}
