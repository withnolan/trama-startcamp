import { CircleCheck, OctagonAlert } from "lucide-react";
import { TEXTOS_PROTECCION } from "@/content/textos";
import { fmtPct } from "@/lib/formato";

export interface BarraLimiteProps {
  /** reducción de pedidos usada durante el plan (0-100) */
  usadoPct: number;
  /** reducción máxima pactada (0-100) */
  limitePct: number;
}

/** «Usado 10 % de 20 %»: la barra entera es el límite pactado. */
export function BarraLimite({ usadoPct, limitePct }: BarraLimiteProps) {
  const dentro = usadoPct <= limitePct;
  const relleno = limitePct > 0 ? Math.min(100, (Math.max(0, usadoPct) / limitePct) * 100) : 100;
  const dec = Number.isInteger(usadoPct) ? 0 : 1;
  const Icono = dentro ? CircleCheck : OctagonAlert;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-semibold tabular-nums text-tinta">
        {TEXTOS_PROTECCION.limite.uso(fmtPct(usadoPct, dec), fmtPct(limitePct))}
      </p>
      <div aria-hidden className="h-2.5 overflow-hidden rounded-full border border-borde bg-superficie-2">
        <div
          className={`h-full rounded-full ${dentro ? "bg-verde-grafico" : "bg-rojo-grafico"}`}
          style={{ width: `${relleno}%` }}
        />
      </div>
      <p className={`flex items-center gap-1.5 text-base font-medium ${dentro ? "text-verde-texto" : "text-rojo-texto"}`}>
        <Icono size={18} strokeWidth={2.25} aria-hidden className="shrink-0" />
        {dentro ? TEXTOS_PROTECCION.limite.dentro : TEXTOS_PROTECCION.limite.fuera}
      </p>
    </div>
  );
}
