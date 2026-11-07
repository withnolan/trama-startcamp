// STUB del director. Dueño: agente de Datos. Implementar con src/lib/calculo (mismas firmas; se pueden añadir funciones).
import type { DetalleTaller, EstadoSemaforo, KpiVista, Marca, Mes, TallerResumen } from "@/lib/calculo/tipos";

const pendiente = (n: string): never => {
  throw new Error(`TODO: ${n}`);
};

export const MES_ACTUAL: Mes = "2026-10";
/** "ago–oct 2026" */
export const PERIODO_ACTUAL = "ago–oct 2026";
export const marca = (): Marca => pendiente("marca");
/** Talleres de nivel 1 con sus subcontratas anidadas, ya ordenados (rojo › ámbar › sin datos › verde; ratio desc). */
export const resumenPanel = (): TallerResumen[] => pendiente("resumenPanel");
/** Recuento por estado para los filtros del panel (cuenta las filas de nivel 1 por estadoPanel). */
export const contarEstados = (): Record<EstadoSemaforo | "todos", number> => pendiente("contarEstados");
/** 5 KPIs de marca: [principal, horasRegularizadas, acompanados, pedidosMantenidos, fallos]. */
export const kpisMarca = (): KpiVista[] => pendiente("kpisMarca");
/** null si el id no existe. */
export const detalleTaller = (id: string): DetalleTaller | null => (void id, pendiente("detalleTaller"));
/** Para generateStaticParams. */
export const idsTalleres = (): string[] => pendiente("idsTalleres");
