"use client";
import { Check, CircleCheck, CircleDot, Circle, Clock, ShieldCheck, type LucideIcon } from "lucide-react";
import { animate, inView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { ESTADO_HITO, TEXTOS_PLAN } from "@/content/textos";
import type { HitoVista } from "@/lib/calculo/tipos";
import { fmtFecha } from "@/lib/formato";
import { dur, ease, s, spring, stagger } from "@/lib/motion/tokens";

const ESTILO: Record<HitoVista["estado"], { icono: LucideIcon; texto: string; punto: string }> = {
  hecho: { icono: CircleCheck, texto: "text-verde-texto", punto: "border-verde-grafico bg-verde-grafico text-white" },
  "en-curso": { icono: CircleDot, texto: "text-marca", punto: "border-marca bg-superficie text-marca" },
  pendiente: { icono: Circle, texto: "text-tinta-2", punto: "border-borde-fuerte bg-superficie text-borde-fuerte" },
  retrasado: { icono: Clock, texto: "text-ambar-texto", punto: "border-ambar-grafico bg-ambar-fondo text-ambar-texto" },
};

export interface PlanTimelineProps {
  hitos: HitoVista[];
  /** nombre de la entidad revisora independiente */
  revisor: string;
}

export function PlanTimeline({ hitos, revisor }: PlanTimelineProps) {
  const lista = useRef<HTMLOListElement>(null);
  const reducir = useReducedMotion();

  // MOTION §4.6: al entrar en pantalla, cada hito hecho dibuja su tramo y luego su punto (600 ms por hito).
  // Sin JS, con movimiento reducido, con ?demo=1 o si ya está a la vista al montar: estado final directo.
  useEffect(() => {
    const ol = lista.current;
    if (!ol || reducir || document.documentElement.dataset.demo === "1") return;
    const caja = ol.getBoundingClientRect();
    if (caja.top < window.innerHeight && caja.bottom > 0) return;
    const puntos = [...ol.querySelectorAll<HTMLElement>("[data-punto-hecho]")];
    const tramos = [...ol.querySelectorAll<HTMLElement>("[data-tramo-hecho]")];
    puntos.forEach((p) => animate(p, { scale: 0.6, opacity: 0 }, { duration: 0 }));
    tramos.forEach((t) => animate(t, { scaleY: 0 }, { duration: 0 }));
    return inView(
      ol,
      () => {
        puntos.forEach((p, i) => {
          const t0 = i * s(dur.slow);
          if (i > 0 && tramos[i - 1]) {
            animate(tramos[i - 1], { scaleY: 1 }, { duration: s(dur.medium), ease: [...ease.linear], delay: t0 });
          }
          animate(p, { scale: 1, opacity: 1 }, { ...spring.firm, delay: t0 + (i > 0 ? s(dur.medium) : 0) + stagger });
        });
      },
      { amount: 0.3 },
    );
  }, [reducir]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-lg border border-borde bg-superficie-2 px-5 py-4">
        <ShieldCheck size={24} aria-hidden className="mt-0.5 shrink-0 text-marca" />
        <p className="flex flex-col">
          <span className="text-lg font-semibold text-tinta">{revisor}</span>
          <span className="text-base text-tinta-2">{TEXTOS_PLAN.revisor}</span>
        </p>
      </div>

      <ol ref={lista} className="flex flex-col">
        {hitos.map((h, i) => {
          const e = ESTILO[h.estado];
          const IconoEstado = e.icono;
          const siguienteHecho = hitos[i + 1]?.estado === "hecho";
          const ultimo = i === hitos.length - 1;
          return (
            <li key={h.id} data-m="hito" className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 pb-6 last:pb-0">
              {!ultimo && (
                <span
                  aria-hidden
                  {...(siguienteHecho ? { "data-tramo-hecho": "" } : {})}
                  className={`absolute left-[calc(1rem-1px)] top-9 -bottom-1 origin-top ${
                    siguienteHecho ? "w-0.5 bg-verde-grafico" : "w-0 border-l-2 border-dashed border-borde-fuerte"
                  }`}
                />
              )}
              <span
                aria-hidden
                {...(h.estado === "hecho" ? { "data-punto-hecho": "" } : {})}
                className={`relative z-10 mt-0.5 flex size-8 items-center justify-center rounded-full border-2 ${e.punto}`}
              >
                {h.estado === "hecho" && <Check size={16} strokeWidth={3} />}
                {h.estado === "en-curso" && <span className="size-2.5 rounded-full bg-marca" />}
                {h.estado === "retrasado" && <Clock size={16} strokeWidth={2.5} />}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-medium text-tinta">{h.titulo}</p>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-tinta-2 tabular-nums">
                  <span className={`inline-flex items-center gap-1.5 font-semibold ${e.texto}`}>
                    <IconoEstado size={16} strokeWidth={2.25} aria-hidden className="shrink-0" />
                    {ESTADO_HITO[h.estado]}
                  </span>
                  <span>{h.estado === "hecho" ? TEXTOS_PLAN.cumplido(fmtFecha(h.fecha)) : TEXTOS_PLAN.fechaLimite(fmtFecha(h.fecha))}</span>
                  <span>{TEXTOS_PLAN.responsable(h.responsable)}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
