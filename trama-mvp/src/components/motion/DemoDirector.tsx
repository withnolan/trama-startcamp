"use client";
// Coreografía de ?demo=1 (MOTION §5) sobre los hooks data-m del CONTRATO. Dueño: agente de Animación.
// layout.tsx pone data-demo="1" en <html> antes del primer pintado y demo.css oculta lo que se va a revelar.
// Una sola secuencia con tiempos absolutos. Clic o Esc → estado final. Al terminar o saltar: data-demo="fin".
// Si falta un data-m, su paso no anima nada y la secuencia sigue.
import { useEffect } from "react";
import { useAnimate, type AnimationSequence, type Segment } from "motion/react";
import { contadoresEn } from "@/components/motion/KpiCounter";
import { dist, dur, ease, s, spring } from "@/lib/motion/tokens";

/** Tiempos absolutos en s (MOTION §5 con un scroll a #horas: a 1280×720 los contadores quedan bajo el pliegue). */
const T = {
  anillo: 0.4,
  horas: 2.6, // scroll
  contadores: 3.2,
  grafico: 4.2,
  desajuste: 5.4,
  cadena: 7.6, // scroll
  fantasma: 8.2,
  declaracion: 9.4,
  plan: 11.4, // scroll
  hitos: 11.9,
  proteccion: 14.9, // scroll
  tarjetas: 15.4,
  impacto: 16.4, // scroll
  kpi: 16.9,
  fin: 18.4,
};

/** Scroll a cada bloque con «start»: [id] lleva scroll-margin-top = nav + aviso + subnav (globals.css). */
const BLOQUES: [number, string][] = [
  [T.horas, "seccion-horas"],
  [T.cadena, "seccion-cadena"],
  [T.plan, "seccion-plan"],
  [T.impacto, "seccion-impacto"],
];

const m = (nombre: string) => Array.from(document.querySelectorAll(`[data-m="${nombre}"]`));
const entra = { opacity: [0, 1], y: [dist.sm, 0] };

/** Scroll suave mínimo para ver de `primero` a `ultimo`; si no cabe (1280×720), manda el final. */
function encuadrar(primero: Element, ultimo: Element) {
  const arriba = parseFloat(getComputedStyle(primero).scrollMarginTop) || 0; // nav + aviso + subnav (demo.css)
  const abajo = window.innerHeight - 24;
  const top = primero.getBoundingClientRect().top;
  const bottom = ultimo.getBoundingClientRect().bottom;
  let dy = top < arriba ? top - arriba : 0;
  if (bottom - dy > abajo) dy = bottom - abajo;
  if (dy) window.scrollBy({ top: dy, behavior: "smooth" });
}

function secuencia() {
  // Los contadores montados en modo demo esperan en su valor final; aquí pasan a 0 y cuentan dentro de la secuencia.
  const contar = (nombres: string[], at: number): Segment => {
    const cs = contadoresEn(nombres.flatMap(m));
    cs.forEach((c) => c.mv.set(0));
    return [(p: number) => cs.forEach((c) => c.mv.set(c.valor * p)), { at, duration: s(dur.count), ease: ease.out }];
  };
  const hitos = m("hito");
  const paso = Math.min(0.6, 3 / Math.max(1, hitos.length)); // 600 ms por hito, todos dentro de 3 s
  const conector = m("conector-subcontrata");
  const trazos = conector.flatMap((el) =>
    el instanceof SVGGeometryElement ? [el] : Array.from(el.querySelectorAll("path, line, polyline")),
  );
  const tarjetas = ["tarjeta-clausula", "tarjeta-limite", "tarjeta-acompanamiento"].flatMap(m);

  const pasos: AnimationSequence = [
    // Cabecera: el semáforo se enciende en rojo y el anillo late 2 veces (1,2 s por pulso = 0,83 Hz) y para.
    [m("semaforo-cabecera"), { opacity: [0, 1], scale: [0.96, 1] }, { at: 0, duration: s(dur.medium), ease: ease.out }],
    // (dos segmentos y no `repeat`: en motion 14, repeat + cúbica en array rompe la secuencia)
    ...[0, 1].map((i): Segment => [
      m("semaforo-anillo"),
      { opacity: [0.4, 0], scale: [1, 1.6] },
      { at: T.anillo + i * s(dur.pulse), duration: s(dur.pulse), ease: ease.out },
    ]),
    // Horas: cuentan cotizadas y necesarias, aparece el gráfico y después la etiqueta del desajuste.
    [[...m("contador-cotizadas"), ...m("contador-necesarias")], { opacity: [0, 1] }, { at: T.contadores, duration: s(dur.base) }],
    contar(["contador-cotizadas", "contador-necesarias"], T.contadores),
    [m("grafico-horas"), entra, { at: T.grafico, duration: s(dur.slow), ease: ease.out }],
    [m("grafico-desajuste"), entra, { at: T.desajuste, ...spring.gentle }],
    // Cadena: hueco «Subcontrata no declarada» → nodo real + conector + «Cláusula y certificado extendidos».
    [m("nodo-fantasma"), { opacity: [0, 1] }, { at: T.fantasma, duration: s(dur.medium), ease: ease.out }],
    [m("nodo-fantasma"), { opacity: [1, 0] }, { at: T.declaracion, duration: s(dur.medium) }],
    [m("nodo-subcontrata"), entra, { at: T.declaracion, ...spring.gentle }],
    [conector, { opacity: [0, 1] }, { at: T.declaracion, duration: s(dur.fast) }],
    [trazos, { pathLength: [0, 1] }, { at: T.declaracion, duration: s(dur.slow), ease: ease.inOut }],
    [m("etiqueta-extension"), { opacity: [0, 1] }, { at: T.declaracion + s(dur.slow), duration: s(dur.base) }],
    // Plan: hitos uno a uno.
    ...hitos.map((el, i): Segment => [el, entra, { at: T.hitos + i * paso, duration: s(dur.medium), ease: ease.out }]),
    // Protección: cláusula, límite y acompañamiento con 80 ms de desfase.
    ...tarjetas.map((el, i): Segment => [el, entra, { at: T.tarjetas + i * 0.08, duration: s(dur.base), ease: ease.out }]),
    // Impacto: cuenta el KPI principal del taller.
    [m("kpi-principal-taller"), { opacity: [0, 1] }, { at: T.kpi, duration: s(dur.base) }],
    contar(["kpi-principal-taller"], T.kpi),
  ];

  // Encuadres en mitad de la secuencia: cada hito se trae a la vista al aparecer; las tarjetas, todas juntas.
  const encuadres: [number, Element, Element][] = hitos.map((el, i) => [T.hitos + i * paso, el, el]);
  if (tarjetas.length) encuadres.push([T.proteccion, tarjetas[0], tarjetas[tarjetas.length - 1]]);
  return { pasos, encuadres };
}

// StrictMode monta → desmonta → monta: la demo solo se cierra si el director no vuelve a montarse.
let cierre: number | undefined;

/** Lo monta /taller/[id] (dentro del mismo Suspense que el contenido). Sin data-demo="1" no hace nada. */
export function DemoDirector() {
  const [, animate] = useAnimate();

  useEffect(() => {
    window.clearTimeout(cierre);
    const html = document.documentElement;
    if (html.dataset.demo !== "1") return;

    let tl: ReturnType<typeof animate> | undefined;
    let saltada = false;
    const fin = () => {
      html.dataset.demo = "fin"; // demo.css deja de ocultar; lo animado queda en su estado final
    };
    const quitar = () => {
      window.removeEventListener("pointerdown", saltar, true);
      window.removeEventListener("keydown", tecla);
    };
    const terminar = () => {
      quitar();
      fin();
    };
    const saltar = () => {
      saltada = true; // los scrolls pendientes ya no se hacen
      if (tl) tl.complete(); // todo a su estado final; onComplete → terminar
      else terminar();
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") saltar();
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      terminar(); // sin secuencia ni scroll: todo visible al instante
      return;
    }
    window.addEventListener("pointerdown", saltar, true);
    window.addEventListener("keydown", tecla);
    history.scrollRestoration = "manual"; // al recargar, la demo empieza arriba
    window.scrollTo({ top: 0, behavior: "instant" });

    // Un fotograma de margen: los KpiCounter del mismo commit ya se han registrado.
    const raf = requestAnimationFrame(() => {
      if (html.dataset.demo !== "1") return; // saltada antes de empezar
      const { pasos, encuadres } = secuencia();
      const linea = (tl = animate(pasos, { onComplete: terminar }));
      for (const [at, nombre] of BLOQUES) {
        const el = m(nombre)[0];
        linea.call(() => !saltada && el?.scrollIntoView({ behavior: "smooth", block: "start" }), at);
      }
      for (const [at, primero, ultimo] of encuadres) linea.call(() => !saltada && encuadrar(primero, ultimo), at);
      linea.call(() => {}, T.fin); // reposo: la secuencia termina en T.fin
    });

    return () => {
      cancelAnimationFrame(raf);
      quitar();
      tl?.stop();
      cierre = window.setTimeout(fin, 0);
    };
  }, [animate]);

  return null;
}
