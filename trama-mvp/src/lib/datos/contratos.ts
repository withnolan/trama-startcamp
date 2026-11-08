/**
 * Contratos del pipeline de datos (SUPERPROMPT_DATOS.md §4). Dueño: A0 (orquestador). Cambios solo ADITIVOS.
 * Todo lo que describe talleres, pedidos o personas es SINTÉTICO. Lo único real son los parámetros públicos, con fuente.
 *
 * Importante para los scripts (node --experimental-strip-types): imports relativos CON extensión .ts y solo `import type`
 * para tipos. El alias `@/` solo funciona dentro de Next y Vitest.
 */
import type { EstadoSemaforo, ISODate, Mes, Pais, Seed } from "../calculo/tipos.ts";

// ---------- Procedencia y calidad ----------
export type TipoFuente = "oficial" | "declarado" | "estimado" | "publico";

export interface Procedencia {
  archivo: string;
  fila: number; // 1 = primera fila de datos (sin contar la cabecera)
  tipoFuente: TipoFuente;
  fechaDato: ISODate | Mes;
  firmante?: string;
}

export type CodigoIncidencia =
  | "CABECERA_INVALIDA"
  | "TIPO_INVALIDO"
  | "FECHAS_INVALIDAS"
  | "DUPLICADO"
  | "REFERENCIA_DESCONOCIDA"
  | "FIRMANTE_INCOHERENTE"
  | "FALTA_INFORME"
  | "INFORME_TARDIO"
  | "RECTIFICACION"
  | "MINUTOS_BAJO_SUELO"
  | "MINUTOS_SIN_CONTRASTAR"
  | "SUBENCARGO_EXCEDE"
  | "TALLER_MICRO"
  | "DURC_CADUCADO"
  | "JORNADA_FUERA_RANGO"
  | "PLANTILLA_INCOHERENTE";

export type Gravedad = "bloqueante" | "aviso" | "info";

export interface Incidencia {
  codigo: CodigoIncidencia;
  gravedad: Gravedad;
  entidad: string; // p. ej. "informe_plantilla_es.csv:12" o "taller:TS-07"
  detalle: string;
}

// ---------- Parámetros públicos (reales, con fuente) ----------
export interface FuentePublica {
  url: string;
  consultado: ISODate;
  sha256: string | null; // null si se escribió a mano (alternativa de A1)
}

export interface ValorPublico<T> {
  valor: T;
  unidad: string;
  fuente: FuentePublica;
  nota: string;
  capturado: boolean; // true = sale de una API o documento descargado por el script; false = copiado a mano con su URL
  verificado?: boolean;
}

/** Tramos de asalariados del DIRCE que vigila Trama (1-49). */
export type TramoAsalariados = "1-2" | "3-5" | "6-9" | "10-19" | "20-49";

export interface ParametrosPublicos {
  version: string;
  empresasPorTramo: { cnae14: ValorPublico<Record<TramoAsalariados, number>>; cnae15: ValorPublico<Record<TramoAsalariados, number>> };
  jornadaAnualConvenio: { textil: ValorPublico<number>; marroquineria: ValorPublico<number> };
  horasSemanalesIndustria?: { ES: ValorPublico<number>; IT: ValorPublico<number> };
  sueloMinutos: Record<string, ValorPublico<number | null>>; // por categoría de prenda; null = sin contrastar
  referenciaPremiumMinutos: ValorPublico<number>;
}

// ---------- Formatos crudos (lo que «llega» a Trama). CSV con «;», UTF-8, cabecera fija, decimales con punto ----------
export const CABECERAS = {
  talleres: ["taller_id", "nombre", "pais", "ciudad", "provincia", "nivel", "padre_id", "especialidad", "convenio"],
  pedidos_erp: ["pedido_id", "marca_id", "taller_id", "referencia", "tipo_pieza_id", "unidades", "inicio", "fin", "origen", "pedido_origen_id"],
  escandallo: ["tipo_pieza_id", "version", "minutos", "vigente_desde", "autor", "categoria"],
  informe_plantilla_es: [
    "taller_id", "ccc_ficticio", "mes", "plantilla_media_ponderada", "num_trabajadores", "num_titulares",
    "horas_titulares", "firmante_tipo", "despacho", "fecha_emision",
  ],
  lul_agregado_it: [
    "taller_id", "mes", "ore_registrate_totali", "num_lavoratori", "durc_regolare", "durc_scadenza",
    "asseco_vigente", "consulente", "fecha_emision",
  ],
  cuota_facturacion: ["taller_id", "marca_id", "periodo", "cuota_pct", "fuente"],
} as const;

export type NombreArchivo = keyof typeof CABECERAS;
export const ARCHIVO: Record<NombreArchivo, string> = {
  talleres: "talleres.csv",
  pedidos_erp: "pedidos_erp.csv",
  escandallo: "escandallo.csv",
  informe_plantilla_es: "informe_plantilla_es.csv",
  lul_agregado_it: "lul_agregado_it.csv",
  cuota_facturacion: "cuota_facturacion.csv",
};

export type Convenio = "textil" | "marroquineria";

export interface FilaTaller {
  taller_id: string; nombre: string; pais: Pais; ciudad: string; provincia: string;
  nivel: 1 | 2 | 3; padre_id: string; especialidad: string; convenio: Convenio;
}
export interface FilaPedido {
  pedido_id: string; marca_id: string; taller_id: string; referencia: string; tipo_pieza_id: string;
  unidades: number; inicio: ISODate; fin: ISODate; origen: "marca" | "subencargo"; pedido_origen_id: string;
}
export interface FilaInformeES {
  taller_id: string; ccc_ficticio: string; mes: Mes; plantilla_media_ponderada: number; num_trabajadores: number;
  num_titulares: number; horas_titulares: number; firmante_tipo: "gestor_laboral" | "consulente_del_lavoro";
  despacho: string; fecha_emision: ISODate;
}

/** Conjunto de archivos crudos en memoria: nombre de archivo → texto CSV. */
export type ArchivosCrudos = Partial<Record<NombreArchivo, string>>;

// ---------- Verdad oculta (solo la lee la evaluación) ----------
export type Arquetipo =
  | "sano"
  | "pico_legitimo"
  | "subcontrata_oculta"
  | "personal_sin_alta"
  | "media_jornada_falsa"
  | "informe_tardio_o_ausente"
  | "rectificacion"
  | "minutos_rebajados"
  | "varias_marcas"
  | "micro";

/** Arquetipos con un problema real de capacidad (lo que debería acabar en rojo). */
export const ARQUETIPOS_PROBLEMA: readonly Arquetipo[] = [
  "subcontrata_oculta", "personal_sin_alta", "media_jornada_falsa", "minutos_rebajados", "varias_marcas",
];

export interface VerdadTaller {
  tallerId: string;
  arquetipo: Arquetipo;
  problemaReal: boolean;
  personasReales: number;      // quien trabaja de verdad (no llega a Trama)
  personasDeclaradas: number;  // lo que figura en el informe
  ratioRealMedio: number;      // carga real ÷ capacidad real declarada, media de la ventana evaluada
  nota: string;
}

export interface Verdad {
  escenario: string;
  semilla: number;
  talleres: VerdadTaller[];
}

// ---------- Salida de la ingesta ----------
export interface MetaIngesta {
  escenario: string;
  semilla: number | null;
  versionGenerador: string;
  hashCrudo: string;
  archivos: { nombre: string; filas: number }[];
}

/** Una versión del escandallo tal como llegó (N2: la ingesta las conserva todas; el score usa la vigente en cada mes). */
export interface VersionEscandallo {
  tipoPiezaId: string;
  version: number;
  minutos: number;
  vigenteDesde: ISODate;
  autor: string;
  categoria: string; // texto del CSV: «marroquineria», «confeccion» o una categoría con suelo (p. ej. «americana_forrada»)
}

export interface CuotaFacturacion {
  tallerId: string;
  marcaId: string;
  periodo: string; // «2026-T3» (303) o «2025» (347) o «2026-10» (declarada)
  cuotaPct: number; // 1-100
  fuente: "303" | "347" | "declarada";
}

/** Indicadores de calidad de Italia (no invalidan el dato; bajan la confianza en el score v2). */
export interface IndicadorIT {
  tallerId: string;
  mes: Mes;
  durcRegolare: boolean;
  durcScadenza: ISODate;
  assecoVigente: boolean;
}

export interface DatasetIngerido {
  seed: Seed;
  procedencia: Record<string, Procedencia>; // clave: id de la entidad (taller, pedido, certificado)
  incidencias: Incidencia[];
  metaIngesta: MetaIngesta;
  // ---- N2 (aditivos; opcionales para no romper N1) ----
  escandalloVersiones?: VersionEscandallo[];
  cuotas?: CuotaFacturacion[];
  indicadoresIT?: IndicadorIT[];
  /** Fuente de las horas de cada certificado del seed (clave: id del certificado). */
  fuenteHoras?: Record<string, "informe_es" | "lul_it">;
}

// ---------- Score ----------
export type Confianza = "alta" | "media" | "baja";

export interface ResultadoScore {
  tallerId: string;
  mes: Mes;
  ratio: number | null | undefined; // null = ∞; undefined = sin datos
  estado: EstadoSemaforo;
  confianza: Confianza;
  motivosConfianza: string[];
  minutosUsados: "escandallo" | "suelo";
  horasFuente: "informe_es" | "lul_it" | "ninguna";
  explicacion: string[];
  // ---- N2 (aditivos) ----
  /** Estimación de la carga total del taller con la cuota de facturación: abre revisión, NUNCA da rojo. */
  ratioTotalEstimado?: number | null;
  revisionAbierta?: boolean;
  /** Estado que daba el motor v1 (semaforo.ts) para comparar. */
  estadoV1?: EstadoSemaforo;
}

// ---------- Escenario del generador ----------
export interface Escenario {
  nombre: string;
  descripcion: string;
  meses: Mes[];                 // meses con pedidos e informes; se evalúa el último
  marcaId: string;
  marcaNombre: string;
  composicion: Partial<Record<Arquetipo, number>>; // nº de talleres por arquetipo
  pais: Pais;
}
