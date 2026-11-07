/**
 * Cálculo del semáforo de Trama.
 *
 * Esqueleto con firmas tipadas: la lógica está pendiente (TODO) hasta integrar
 * DATA_MODEL.md y seed.json. Las funciones lanzan un error si se llaman.
 */

/** Periodo móvil de comparación, en meses (BRIEF). */
export const VENTANA_MESES = 3;

export type EstadoSemaforo = "verde" | "ambar" | "rojo";

/** Mes en formato "AAAA-MM". */
export type Mes = string;

/** Pedido de la marca a un taller en un mes. */
export interface Pedido {
  mes: Mes;
  tipoPieza: string;
  unidades: number;
}

/** Minutos estándar de confección por tipo de pieza. */
export type MinutosEstandar = Record<string, number>;

/**
 * Certificado mensual: TOTAL de horas cotizadas de la plantilla del taller
 * (nunca por trabajador), firmado por el gestor laboral o consulente del lavoro.
 */
export interface CertificadoHoras {
  mes: Mes;
  horasCotizadasTotales: number;
}

export interface UmbralesSemaforo {
  /** Margen ámbar para picos legítimos (valor pendiente de DATA_MODEL.md). */
  margenAmbar: number;
}

export interface ResultadoSemaforo {
  estado: EstadoSemaforo;
  meses: Mes[];
  horasNecesarias: number;
  horasCotizadas: number;
}

/** Carga mínima: pedidos × minutos estándar por tipo de pieza, en horas. */
export type CalcularHorasNecesarias = (
  pedidos: Pedido[],
  minutosEstandar: MinutosEstandar,
) => number;

/** Suma de horas cotizadas de los certificados. */
export type SumarHorasCotizadas = (certificados: CertificadoHoras[]) => number;

/** Estado del semáforo a partir de horas necesarias y cotizadas. */
export type ClasificarSemaforo = (
  horasNecesarias: number,
  horasCotizadas: number,
  umbrales: UmbralesSemaforo,
) => EstadoSemaforo;

/** Semáforo de la ventana móvil de VENTANA_MESES meses que termina en `mesFinal`. */
export type EvaluarVentanaMovil = (entrada: {
  mesFinal: Mes;
  pedidos: Pedido[];
  minutosEstandar: MinutosEstandar;
  certificados: CertificadoHoras[];
  umbrales: UmbralesSemaforo;
}) => ResultadoSemaforo;

function pendiente(nombre: string): never {
  throw new Error(`TODO: ${nombre} no está implementada todavía.`);
}

// TODO: implementar.
export const calcularHorasNecesarias: CalcularHorasNecesarias = () =>
  pendiente("calcularHorasNecesarias");

// TODO: implementar.
export const sumarHorasCotizadas: SumarHorasCotizadas = () =>
  pendiente("sumarHorasCotizadas");

// TODO: implementar.
export const clasificarSemaforo: ClasificarSemaforo = () =>
  pendiente("clasificarSemaforo");

// TODO: implementar.
export const evaluarVentanaMovil: EvaluarVentanaMovil = () =>
  pendiente("evaluarVentanaMovil");
