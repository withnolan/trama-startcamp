"use client";
// Contador de KPI (MOTION §4.1). Dueño: agente de Animación.
// SSR y sin JS: valor final. Cliente: cuenta de 0 al valor al entrar en pantalla, una vez por sesión.
// Modo demo (data-demo="1"): no arranca solo; lo cuenta el DemoDirector (ver contadoresEn).
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { fmtHoras, fmtNumero, fmtPct } from "@/lib/formato";
import { dur, ease, s } from "@/lib/motion/tokens";

export interface KpiCounterProps {
  valor: number;
  formato: "entero" | "porcentaje" | "horas";
  decimales?: number;
  /** atributo data-m para la coreografía de la demo */
  dataM?: string;
  /** id del KPI: clave de «ya visto en la sesión» */
  id?: string;
  /** retraso en ms (MOTION §4.1: 80 ms entre KPIs) */
  retraso?: number;
}

export function formatearKpi(valor: number, formato: KpiCounterProps["formato"], decimales = 0) {
  if (formato === "horas") return fmtHoras(valor, decimales);
  if (formato === "porcentaje") return fmtPct(valor, decimales);
  return fmtNumero(valor, decimales);
}

type Contador = { mv: MotionValue<number>; valor: number };
const enDemo = new Map<Element, Contador>();

/** Para el DemoDirector: contadores montados en modo demo dentro de (o en) estos elementos. */
export function contadoresEn(elementos: Element[]): Contador[] {
  return [...enDemo].filter(([el]) => elementos.some((e) => e.contains(el))).map(([, c]) => c);
}

// React lee getServerSnapshot (true) solo al hidratar HTML del servidor; al montar en navegación de cliente, false.
const sinSuscripcion = () => () => {};
const alHidratar = () => true;
const enCliente = () => false;

const yaVisto = (clave: string) => {
  try {
    return sessionStorage.getItem(clave) === "1";
  } catch {
    return false; // sessionStorage bloqueado: se anima
  }
};

export function KpiCounter({ valor, formato, decimales = 0, dataM, id, retraso = 0 }: KpiCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(valor);
  const texto = useTransform(mv, (v) => formatearKpi(v, formato, decimales));
  const reducir = useReducedMotion();
  const enVista = useInView(ref, { once: true, amount: 0.5 });
  const pendiente = useRef(false);
  const hidratando = useSyncExternalStore(sinSuscripcion, enCliente, alHidratar);
  const delServidor = useRef(hidratando); // se queda con el valor del primer render
  const clave = `trama:kpi:${id ?? dataM ?? formato}:${valor}`;
  const final = formatearKpi(valor, formato, decimales);

  // Antes del primer pintado del cliente: decide si cuenta (y entonces arranca en 0).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.dataset.demo === "1") {
      enDemo.set(el, { mv, valor });
      return () => {
        enDemo.delete(el);
      };
    }
    // En la carga inicial el servidor ya pintó el valor final: si está a la vista se queda (sin parpadeo final → 0).
    const pintado = delServidor.current && el.getBoundingClientRect().top < window.innerHeight;
    pendiente.current = !reducir && !pintado && !yaVisto(clave);
    mv.set(pendiente.current ? 0 : valor);
  }, [clave, mv, reducir, valor]);

  useEffect(() => {
    if (!enVista || !pendiente.current) return;
    pendiente.current = false;
    try {
      sessionStorage.setItem(clave, "1");
    } catch {
      // sin sessionStorage: volverá a contar en la próxima visita
    }
    const a = animate(mv, valor, { duration: s(dur.count), ease: ease.out, delay: s(retraso) });
    return () => a.stop();
  }, [enVista, clave, mv, retraso, valor]);

  // La copia invisible del valor final reserva el ancho: el layout no se mueve al contar.
  return (
    <span ref={ref} data-m={dataM} className="inline-grid tabular-nums">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {final}
      </span>
      <motion.span aria-hidden="true" className="col-start-1 row-start-1 text-right">
        {texto}
      </motion.span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
