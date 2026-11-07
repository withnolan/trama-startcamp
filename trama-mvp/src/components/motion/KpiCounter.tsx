"use client";
// STUB del director. Dueño: agente de Animación (sustituir por la versión animada, mismas props).
import { fmtHoras, fmtNumero, fmtPct } from "@/lib/formato";

export interface KpiCounterProps {
  valor: number;
  formato: "entero" | "porcentaje" | "horas";
  decimales?: number;
  /** atributo data-m para la coreografía de la demo */
  dataM?: string;
}

export function formatearKpi(valor: number, formato: KpiCounterProps["formato"], decimales = 0) {
  if (formato === "horas") return fmtHoras(valor, decimales);
  if (formato === "porcentaje") return fmtPct(valor, decimales);
  return fmtNumero(valor, decimales);
}

export function KpiCounter({ valor, formato, decimales = 0, dataM }: KpiCounterProps) {
  return (
    <span className="tabular-nums" data-m={dataM}>
      {formatearKpi(valor, formato, decimales)}
    </span>
  );
}
