# CONTRATO del Equipo A (lo comparten los 5 agentes)

## Propiedad de archivos (cada agente edita SOLO lo suyo)
| Agente | Archivos |
|---|---|
| 1 · Diseño UI | `src/app/globals.css`, `src/app/layout.tsx`, `src/components/*.tsx` (no `src/components/motion/`) |
| 2 · Animación | `src/lib/motion/*`, `src/app/providers.tsx`, `src/components/motion/*` |
| 3 · Legal | `src/content/*` |
| 4 · Datos y cálculo | `src/lib/calculo/*`, `src/lib/formato.ts`, `src/data/*` |
| 5 · Integración | `src/app/**/page.tsx`, `src/app/**/not-found.tsx`, `next.config.ts`, `package.json`, `scripts/`, `e2e/`, `playwright.config.ts`, `README.md`, `../demo-backup/`, git |

## Módulos compartidos (ya existen; la firma no se rompe, solo se añade)
- `@/lib/calculo/tipos` — modelo (DATA_MODEL §1) + contrato de vista: `TallerResumen`, `VentanaHoras`, `NodoCadena`, `HitoVista`, `KpiVista`, `DetalleTaller`.
- `@/data/vista` — `MES_ACTUAL`, `PERIODO_ACTUAL`, `marca()`, `resumenPanel()`, `contarEstados()`, `kpisMarca()`, `detalleTaller(id)`, `idsTalleres()`.
- `@/lib/formato` — `fmtNumero`, `fmtHoras`, `fmtRatio`, `fmtPct`, `fmtMes`, `fmtFecha`, `fmtVentana`.
- `@/content/textos` — `ETIQUETA_ESTADO`, `DESCRIPCION_ESTADO`, `NOTA_ALERTA`, `AVISO_DEMO`, `KPI_ETIQUETAS`, `SECCIONES_TALLER`.
- `@/content/legal` → `LEGAL`, `@/content/como-calculamos` → `COMO_CALCULAMOS` (forma `PaginaTexto` de `@/content/tipos`).
- `@/lib/motion/tokens` — `dur`, `ease`, `spring`, `dist`, `stagger`, `s()`.
- `@/components/motion/KpiCounter` — `<KpiCounter valor formato decimales? dataM? />` y `formatearKpi()`.
- `@/components/motion/Aparecer` — `<Aparecer retraso? className?>` (fundido + 8 px).
- `@/components/motion/DemoDirector` — `<DemoDirector />`, lo monta la página `/taller/[id]`.
- `@/app/providers` — `<Providers>` (MotionConfig reducedMotion="user"), lo monta `layout.tsx`.
- `@/lib/motion/demo.css` — lo importa `layout.tsx`.

## Componentes de presentación (Diseño UI) — props mínimas
`Semaforo({estado, tamano?, soloIcono?, dataM?})` · `Badge({variante, icono?, children})` · `KpiCard({kpi: KpiVista, compacta?, valor?: ReactNode})` · `TallerTable({talleres: TallerResumen[], recuento})` (cliente: incluye los filtros con `aria-pressed`) · `HoursChart({ventanas: VentanaHoras[], ocultarCifras?, altura?})` (cliente, Recharts, botón «Ver como tabla») · `ResumenAlerta({alerta, nombreTaller})` · `ResumenPeriodo({resumen, ocultarCifras})` · `ChainDiagram({nodos: NodoCadena[]})` · `PlanTimeline({hitos, revisor})` · `BarraLimite({usadoPct, limitePct})` · `NotaAlerta({estado})` · `SubnavTaller()` · `AvisoDatosFicticios({variante})` · `AppShell` · `Footer`.

## Modo demo `?demo=1`
1. `layout.tsx` lleva un `<script>` inline al principio de `<body>` que, si `location.search` contiene `demo=1`, hace `document.documentElement.dataset.demo = "1"` antes del primer pintado.
2. `demo.css` (Animación) oculta con `[data-demo="1"] [data-m=…] { opacity: 0 }` lo que la coreografía va a revelar y muestra `nodo-fantasma` (que fuera de la demo está `display:none`).
3. `DemoDirector` (Animación) lanza la secuencia con `useAnimate` sobre los selectores de abajo; clic o `Esc` → estado final; al terminar, todo visible. Con `prefers-reduced-motion` no hay secuencia: todo visible al instante.
4. Los componentes que se animan solos al montar (pulso del semáforo, entradas) **no** lo hacen si `document.documentElement.dataset.demo === "1"`: la demo manda.

### Hooks `data-m` (quién los pone)
| data-m | Elemento | Lo pone |
|---|---|---|
| `semaforo-cabecera` | Semáforo `lg` de la cabecera del taller | Integración (vía prop `dataM`) |
| `semaforo-anillo` | anillo decorativo (aria-hidden) dentro de `Semaforo tamano="lg"` | Diseño UI |
| `contador-cotizadas` / `contador-necesarias` | cifras de `ResumenAlerta` (3.360 h / 8.000 h) | Diseño UI (vía `KpiCounter dataM`) |
| `grafico-desajuste` | etiqueta «Faltan ≈4.640 h (×2,4)» de `ResumenAlerta` | Diseño UI |
| `grafico-horas` | `<figure>` de `HoursChart` | Diseño UI |
| `seccion-horas` · `seccion-cadena` · `seccion-plan` · `seccion-proteccion` · `seccion-impacto` | `<section id=horas|cadena|plan|proteccion|impacto>` | Integración |
| `nodo-fantasma` | «Subcontrata no declarada» (borde punteado) en el hueco del nodo con `momento === 'tras_alerta'` | Diseño UI |
| `nodo-subcontrata` · `conector-subcontrata` · `etiqueta-extension` | nodo real tras alerta, su conector SVG (`<path>` para `pathLength`) y «Cláusula y certificado extendidos» | Diseño UI |
| `hito` | cada `<li>` de `PlanTimeline` | Diseño UI |
| `tarjeta-clausula` · `tarjeta-limite` · `tarjeta-acompanamiento` | tarjetas de Protección | Integración |
| `kpi-principal-taller` | primera KPI de `#impacto` | Integración |

## Reglas de copy
Lenguaje no acusatorio: «posible desajuste», «revisión abierta», «sin datos». Prohibido en `src/`: explotación, ilegal, fraude, esclav*, culpable, irregular(es). Ninguna marca, empresa ni persona real en `src/` (ni en comentarios).
