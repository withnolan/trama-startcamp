/**
 * Parsers estrictos de valores de los CSV del pipeline (SUPERPROMPT_DATOS.md §5.2, A3).
 * Devuelven NaN / null cuando el texto no tiene el formato exacto: la ingesta lo convierte en incidencia.
 */
import { sumarMeses } from "../calculo/semaforo.ts";
import type { ISODate, Mes } from "../calculo/tipos.ts";

const RE_FECHA = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const RE_MES = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Fecha ISO «YYYY-MM-DD» que existe en el calendario (rechaza 2026-02-30). */
export function esFecha(s: string): boolean {
  if (!RE_FECHA.test(s)) return false;
  return new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;
}

export const esMes = (s: string): boolean => RE_MES.test(s);

/** Entero con signo opcional, sin decimales ni espacios. */
export const entero = (s: string): number => (/^-?\d+$/.test(s) ? Number(s) : NaN);

/** Decimal con punto («12.5»); no admite coma decimal ni separador de miles. */
export const decimal = (s: string): number => (/^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN);

/** «true» / «false» exactos; cualquier otra cosa → null. */
export const booleano = (s: string): boolean | null => (s === "true" ? true : s === "false" ? false : null);

export const primerDia = (m: Mes): ISODate => `${m}-01`;

/** Último día natural del mes. */
export function finDeMes(m: Mes): ISODate {
  const d = new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0));
  return d.toISOString().slice(0, 10);
}

/** Primer día del mes `n` meses después de `m`. */
export const primerDiaTras = (m: Mes, n: number): ISODate => primerDia(sumarMeses(m, n));

/** Periodo de la cuota según su fuente: 303 trimestral («2026-T3»), 347 anual («2025»), declarada mensual («2026-10»). */
export function periodoValido(fuente: string, periodo: string): boolean {
  if (fuente === "303") return /^\d{4}-T[1-4]$/.test(periodo);
  if (fuente === "347") return /^\d{4}$/.test(periodo);
  if (fuente === "declarada") return esMes(periodo);
  return false;
}

export const r2 = (x: number): number => Math.round(x * 100) / 100;
