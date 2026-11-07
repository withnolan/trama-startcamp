"use client";
import { CircleCheck, CircleHelp, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import { animate, useReducedMotion, type Segment } from "motion/react";
import { useEffect, useRef } from "react";
import { ETIQUETA_ESTADO, ariaEstado } from "@/content/textos";
import type { EstadoSemaforo } from "@/lib/calculo/tipos";
import { dur, ease, s } from "@/lib/motion/tokens";

// Forma distinta por estado: nunca solo color (DESIGN §8).
export const ICONO_ESTADO: Record<EstadoSemaforo, LucideIcon> = {
  verde: CircleCheck,
  ambar: TriangleAlert,
  rojo: OctagonAlert,
  sin_datos: CircleHelp,
};

const PILDORA: Record<EstadoSemaforo, string> = {
  verde: "bg-verde-fondo text-verde-texto border-verde-texto/25",
  ambar: "bg-ambar-fondo text-ambar-texto border-ambar-texto/25",
  rojo: "bg-rojo-fondo text-rojo-texto border-rojo-texto/25",
  sin_datos: "bg-superficie-2 text-tinta-2 border-dashed border-borde-fuerte",
};

const COLOR_ICONO: Record<EstadoSemaforo, string> = {
  verde: "text-verde-grafico",
  ambar: "text-ambar-grafico",
  rojo: "text-rojo-grafico",
  sin_datos: "text-tinta-2",
};

const TAMANO = {
  sm: { caja: "gap-1.5 px-2.5 py-0.5 text-sm", icono: 16 },
  md: { caja: "gap-2 px-3 py-1 text-base", icono: 18 },
  lg: { caja: "gap-2.5 px-4 py-2 text-lg", icono: 22 },
} as const;

export interface SemaforoProps {
  estado: EstadoSemaforo;
  tamano?: keyof typeof TAMANO;
  soloIcono?: boolean;
  /** atributo data-m para la coreografía de la demo */
  dataM?: string;
}

export function Semaforo({ estado, tamano = "md", soloIcono = false, dataM }: SemaforoProps) {
  const Icono = ICONO_ESTADO[estado];
  const t = TAMANO[tamano];
  const anillo = useRef<HTMLSpanElement>(null);
  const reducir = useReducedMotion();

  // MOTION §4.3: dos pulsos al montar en rojo y se detiene. Con ?demo=1 la coreografía manda.
  useEffect(() => {
    const el = anillo.current;
    if (!el || estado !== "rojo" || reducir || document.documentElement.dataset.demo === "1") return;
    // Dos segmentos seguidos en vez de `repeat` (en motion 14, repeat con curva cúbica falla).
    const pulso: Segment = [el, { scale: [1, 1.6], opacity: [0.4, 0] }, { duration: s(dur.pulse), ease: [...ease.out] }];
    const controles = animate([pulso, pulso]);
    return () => controles.stop();
  }, [estado, reducir]);

  if (soloIcono) {
    return (
      <span
        role="img"
        aria-label={ariaEstado(estado)}
        data-m={dataM}
        className={`inline-flex shrink-0 ${COLOR_ICONO[estado]}`}
      >
        <Icono size={t.icono} strokeWidth={2.25} aria-hidden />
      </span>
    );
  }

  return (
    <span
      data-m={dataM}
      className={`relative inline-flex shrink-0 items-center whitespace-nowrap rounded-full border font-semibold ${PILDORA[estado]} ${t.caja}`}
    >
      {tamano === "lg" && (
        <span
          ref={anillo}
          data-m="semaforo-anillo"
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-full border-2 border-current opacity-0"
        />
      )}
      <Icono size={t.icono} strokeWidth={2.25} aria-hidden className="shrink-0" />
      <span>{ETIQUETA_ESTADO[estado]}</span>
    </span>
  );
}
