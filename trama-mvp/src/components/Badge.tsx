import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const VARIANTE = {
  neutro: "bg-superficie-2 text-tinta-2 border-borde",
  marca: "bg-marca-suave text-marca border-marca/20",
  verde: "bg-verde-fondo text-verde-texto border-verde-texto/25",
  ambar: "bg-ambar-fondo text-ambar-texto border-ambar-texto/25",
  rojo: "bg-rojo-fondo text-rojo-texto border-rojo-texto/25",
} as const;

export interface BadgeProps {
  variante: keyof typeof VARIANTE;
  icono?: LucideIcon;
  children: ReactNode;
}

export function Badge({ variante, icono: Icono, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-0.5 text-sm font-medium ${VARIANTE[variante]}`}
    >
      {Icono && <Icono size={15} strokeWidth={2.25} aria-hidden className="shrink-0" />}
      {children}
    </span>
  );
}
