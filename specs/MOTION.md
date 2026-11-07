# MOTION — MVP de Trama

## 1. Principios
1. **El movimiento explica.** Solo se anima lo que cuenta algo: el desajuste de horas, la cadena oculta, el avance del plan. Nada decorativo.
2. **Sobrio.** Un rojo es una alerta, no una prueba: sin sacudidas, rebotes ni bucles infinitos.
3. **Orden de lectura.** Los elementos entran en el orden en que se leen; un foco de atención cada vez.
4. **Rápido y prescindible.** ≤ 600 ms por interacción; con `prefers-reduced-motion` se llega al estado final sin perder información.

## 2. Librería
- **Motion** (paquete `motion`, licencia MIT): `npm i motion`, importar desde `motion/react`.
- Los componentes que lo usan llevan `"use client"`. Las páginas siguen siendo Server Components y pasan datos calculados a componentes cliente en `components/motion/` (`KpiCounter`, `StaggerList`, `Semaforo`, `HorasChart`, `CadenaDiagram`, `PlanTimeline`).
- `app/providers.tsx` (cliente) envuelve la app con `<MotionConfig reducedMotion="user">`; se monta en `app/layout.tsx`.
- Cada componente usa además `useReducedMotion()`: si es `true`, renderiza con `initial={false}` (estado final).
- **Basta CSS** (Tailwind `transition`) para hover, pulsado y focus; Motion para entradas, secuencias, SVG y contadores.

## 3. Tokens (`lib/motion/tokens.ts`)
```ts
export const dur = { fast: 120, base: 200, medium: 320, slow: 600, count: 900, draw: 1200, pulse: 1200 } as const; // ms
export const ease = {
  out:    [0.22, 1, 0.36, 1],   // entradas
  inOut:  [0.65, 0, 0.35, 1],   // dibujo de líneas
  linear: [0, 0, 1, 1],         // progreso
} as const;
export const spring = {
  gentle: { type: "spring", stiffness: 260, damping: 30, mass: 1 }, // sin rebote
  firm:   { type: "spring", stiffness: 400, damping: 40, mass: 1 },
} as const;
export const dist = { xs: 4, sm: 8, md: 16 } as const; // px
export const stagger = 0.04;                           // s entre hijos
export const s = (ms: number) => ms / 1000;            // Motion usa segundos
```
Espejo CSS en `globals.css`: `--dur-fast`, `--dur-base`, `--ease-out`.

## 4. Catálogo
RM = versión con `prefers-reduced-motion: reduce`.

**4.1 Contadores de KPIs** — panel de la marca
- Disparador: primer montaje del panel en la sesión (`sessionStorage`).
- Qué: `useMotionValue(0)` → `animate(mv, valor, { duration: s(dur.count), ease: ease.out })`; se pinta con `<motion.span>{useTransform(mv, fmt)}</motion.span>` (sin re-render), `fmt` = `Intl.NumberFormat("es-ES")` redondeado. 80 ms de desfase entre KPIs.
- `tabular-nums` y ancho mínimo para no mover el layout. Número animado con `aria-hidden`; un `sr-only` lleva el valor final.
- RM: valor final directo.

**4.2 Filas de talleres** — lista del panel
- Disparador: montaje de la lista.
- Qué: `opacity 0→1`, `y dist.sm→0`, `dur.base`, `ease.out`, `staggerChildren: stagger`. Solo se escalonan las 8 primeras; ordenar o filtrar no anima.
- RM: sin animación.

**4.3 Semáforo a rojo** — badge de fila y cabecera del detalle
- Disparador: montaje con estado `rojo` o cambio a `rojo`.
- Qué: dos capas superpuestas (color anterior / rojo) con crossfade de opacidad, `dur.medium`. Después, un anillo (span absoluto) `scale 1→1.6`, `opacity 0.4→0`, `dur.pulse`, `ease.out`, **2 repeticiones** y se detiene (0,83 Hz). En la lista, un solo pulso.
- Nunca solo color: icono + texto «Rojo · revisión abierta»; anuncio `aria-live="polite"`.
- RM: cambio instantáneo, sin anillo.

**4.4 Horas necesarias vs cotizadas** — detalle de taller (SVG, periodo móvil de 3 meses)
- Disparador: `whileInView` (`once: true`, `amount: 0.5`) o secuencia demo.
- Qué, en orden: (1) línea de cotizadas `pathLength 0→1`, `dur.draw`, `ease.inOut`; (2) línea de necesarias, igual, al terminar la anterior; (3) área entre ambas = zona de desajuste (rojo 20 % con rayado) `opacity 0→1`, `dur.medium`; (4) etiqueta «Faltan ≈4.640 h (×2,4)» (texto del cálculo) `opacity` + `y dist.sm→0`, `spring.gentle`. La banda ámbar de margen es estática desde el inicio.
- RM: gráfico completo.

**4.5 Subcontrata declarada** — diagrama de cadena
- Antes: nodo fantasma bajo el proveedor, borde discontinuo, «Subcontrata no declarada», `opacity 0.6`.
- Disparador: estado `declarada` o secuencia demo.
- Qué: conector `pathLength 0→1`, `dur.slow`, `ease.inOut`; nodo real superpuesto al fantasma, crossfade + `y dist.sm→0`, `spring.gentle`; luego etiqueta «Cláusula y certificado extendidos», `opacity`, `dur.base`. Posiciones fijas desde el inicio (sin animaciones de layout).
- RM: nodo y conector finales.

**4.6 Timeline del plan de corrección**
- Hitos (de los datos): alerta → subcontrata declarada → plan extendido → revisión del tercero → cláusula anti-despido y límite de reducción → seguimiento a 6 meses.
- Disparador: `whileInView` o secuencia demo.
- Qué, por hito completado: segmento de barra `scaleX 0→1` (`origin-left`), `dur.medium`, `ease.linear`; después punto `scale 0.6→1` + check `opacity`, `spring.firm`. 600 ms por hito. Pendientes en gris, estáticos.
- RM: estado final.

**4.7 Páginas, hover y focus**
- Página: `app/template.tsx` (cliente) con `motion.div` `opacity 0→1`, `y dist.xs→0`, `dur.base`, `ease.out`. Sin animación de salida.
- Hover (CSS): filas y tarjetas con capa `before:` cuya `opacity` pasa 0→1 en `dur.fast`; botones `active:scale-[0.98]`.
- Focus: anillo `focus-visible` **sin transición**, siempre visible.
- RM: página solo con opacidad en `dur.fast`; hover igual.

## 5. Coreografía de la demo (taller en rojo, ~18 s)
Se activa al abrir `/talleres/[id]?demo=1`. Un único `useAnimate` en la página ejecuta una secuencia (`animate([...])` con `at` absoluto) sobre selectores `[data-m="…"]` y los motion values de los contadores. Auto-scroll entre bloques con `scrollIntoView({ behavior: "smooth", block: "start" })`, pensado para 1440×900. Clic o `Esc` → `controls.complete()` (salta al final). Sin `?demo=1`, cada bloque usa su disparador del catálogo.

| t (s) | Qué ocurre |
|---|---|
| 0,0–0,6 | Entrada de página; semáforo de cabecera pasa a rojo. |
| 0,6–3,0 | Anillo: 2 pulsos. |
| 0,6–1,5 | Cuentan «3.360 h cotizadas» y «≈8.000 h necesarias». |
| 1,6–2,8 | Se dibuja la línea de cotizadas. |
| 2,8–4,0 | Se dibuja la línea de necesarias. |
| 4,0–4,6 | Zona de desajuste + etiqueta «Faltan ≈4.640 h (×2,4)». |
| 4,6–7,0 | Pausa para narrar. |
| 7,0–7,6 | Scroll a «Cadena y subcontratas». |
| 7,6–8,2 | Nodo fantasma «Subcontrata no declarada». |
| 9,0–10,0 | Declaración: conector, nodo real y «Cláusula y certificado extendidos». |
| 10,0–11,5 | Pausa. |
| 11,5–12,0 | Scroll a «Plan de corrección». |
| 12,0–15,0 | Timeline: 5 hitos × 600 ms; el 6.º (seguimiento) queda pendiente. |
| 15,0–15,5 | Scroll a «Protección de trabajadores». |
| 15,5–16,3 | Tarjetas «Cláusula anti-despido» y «Límite de reducción de pedidos» (desfase 80 ms). |
| 16,3–17,2 | Cuenta el KPI «Trabajadores que siguen empleados y dados de alta». |
| 17,2–18,0 | Reposo. Fin. |

RM: sin secuencia ni auto-scroll; todo en estado final.

## 6. Rendimiento y accesibilidad
- Solo `transform` y `opacity`. Excepciones acotadas: `pathLength` de SVG (repinta, no recalcula layout) y el texto de los contadores (`tabular-nums`, ancho fijo).
- Prohibido animar `width`, `height`, `top/left`, `margin`, `box-shadow`, `background-color` o `filter`; no usar `layout` ni `layoutId`.
- Sin layout thrash: nada de `getBoundingClientRect`/`offset*` durante la animación; medir una vez al montar. Contadores vía motion values, no estado de React.
- `prefers-reduced-motion` en todo: `MotionConfig reducedMotion="user"` + `useReducedMotion()` en cada componente + `@media (prefers-reduced-motion: reduce)` que anula `transition`/`animation` CSS. Probar con DevTools → Rendering → Emulate.
- Sin parpadeos: ningún elemento cambia de luminancia más de 3 veces por segundo; el pulso más rápido es 0,83 Hz. Ninguna animación infinita.
- La información nunca depende solo del movimiento o del color. La animación no roba el foco ni bloquea clics.
- Presupuesto: 60 fps en el portátil de la demo con CPU ×4 de throttling; si no, quitar el rayado.
