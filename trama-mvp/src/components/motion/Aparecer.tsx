"use client";
// Entrada de bloque (MOTION §4.2/§4.7): fundido + 8 px, dur.base, al entrar en pantalla, una vez. Dueño: agente de Animación.
// Para escalonar una lista: retraso={i * 40} (ms). Sin JS lo muestra demo.css (@media scripting: none).
import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { dist, dur, ease, s } from "@/lib/motion/tokens";

const visible = { opacity: 1, y: 0 };

export function Aparecer({
  children,
  retraso = 0,
  className,
}: {
  children: ReactNode;
  /** ms */
  retraso?: number;
  className?: string;
}) {
  const reducir = useReducedMotion();
  // En la demo manda el DemoDirector: aquí, visible al instante (solo cambia en cliente; el HTML del servidor es el mismo).
  const [demo] = useState(() => typeof document !== "undefined" && document.documentElement.dataset.demo === "1");
  const instantaneo = reducir || demo;
  return (
    <motion.div
      data-aparecer=""
      className={className}
      initial={{ opacity: 0, y: dist.sm }}
      {...(instantaneo ? { animate: visible } : { whileInView: visible, viewport: { once: true } })}
      transition={instantaneo ? { duration: 0 } : { duration: s(dur.base), ease: ease.out, delay: s(retraso) }}
    >
      {children}
    </motion.div>
  );
}
