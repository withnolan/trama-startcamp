"use client";
// STUB del director. Dueño: agente de Animación (sustituir por fundido + 8 px con tokens, mismas props).
import type { ReactNode } from "react";

export function Aparecer({ children, retraso = 0, className }: { children: ReactNode; retraso?: number; className?: string }) {
  void retraso;
  return <div className={className}>{children}</div>;
}
