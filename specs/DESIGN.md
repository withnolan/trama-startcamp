# DESIGN — MVP de Trama (diseño web y UX)

Herramienta para un responsable de cumplimiento; sin landing ni pitch. Next.js (App Router) + Tailwind.

## 1. Principios
1. **Rigor visible**: cada cifra lleva unidad, periodo y fuente ("Certificado del gestor laboral, oct 2026").
2. **Sobriedad de casa de lujo**: papel, tinta y aire. Sin degradados ni ilustraciones; el único color fuerte es el del semáforo.
3. **Alerta, no acusación**: el lenguaje abre revisiones; nunca "fraude", "culpable" ni "irregulares".
4. **Trabajadores en el centro**: protección e impacto siempre junto al riesgo.
5. **Legible proyectado**: cuerpo ≥16 px, cifras clave ≥36 px, una idea por bloque. Probar a 1280×720 con zoom 125 %.

## 2. Tokens (`tailwind.config.ts → theme.extend`)
**Colores** (solo modo claro). Contrastes verificados con WCAG 2.1:

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `papel` | #F7F5F1 | fondo de página | — |
| `superficie` | #FFFFFF | tarjetas, tabla | — |
| `superficie-2` | #F0ECE5 | cabecera de tabla, hover | — |
| `borde` | #DDD6CB | separadores (decorativo) | — |
| `borde-fuerte` | #8C8478 | contorno de controles | 3,7:1 |
| `tinta` | #1B1A18 | texto principal | 16:1 |
| `tinta-2` | #57524A | texto secundario | 7,1:1 |
| `marca` / `marca-hover` / `marca-suave` | #1E3354 / #16263F / #E6EBF2 | botones, enlaces, foco | blanco sobre marca 12,7:1 |
| `verde-texto` / `verde-fondo` / `verde-grafico` | #1D6B3E / #E5F2EA / #2F8152 | estado verde | 5,7:1 |
| `ambar-texto` / `ambar-fondo` / `ambar-grafico` | #8A5300 / #FCF0D8 / #A86A00 | estado ámbar | 5,6:1 |
| `rojo-texto` / `rojo-fondo` / `rojo-grafico` | #A11D1D / #FBE8E6 / #B42318 | estado rojo | 6,6:1 |
| `gris-grafico` | #7A8494 | horas cotizadas, "sin datos" | 3,8:1 |

**Tipografía** (Google Fonts, OFL, vía `next/font/google`): **Source Serif 4** (600) para h1–h2 → `--font-serif`; **Inter** (400/500/600) para UI y cifras → `--font-sans`. Cifras siempre con `tabular-nums`.
Escala (px tamaño/interlínea): `xs` 13/18 (solo notas legales) · `sm` 14/20 · `base` 16/24 · `lg` 18/28 · `xl` 22/30 (h3, Inter 600) · `2xl` 28/36 (h2 serif) · `3xl` 36/44 (h1 serif) · `kpi` 44/48 (Inter 600).

**Espaciado**: escala Tailwind (4 px). Página `px-8 py-10`, tarjeta `p-6`, entre bloques `gap-8`, dentro de bloque `gap-4`.
**Radios**: `sm` 4 px (badges), `md` 6 px (botones), `lg` 10 px (tarjetas).
**Sombras**: preferir bordes. `card`: `0 1px 2px rgba(27,26,24,.06)`; `pop` (tooltip): `0 8px 24px rgba(27,26,24,.12)`.
**Movimiento**: `motion` (MIT); solo fundido/desplazamiento de 8 px, 200 ms; desactivado con `prefers-reduced-motion`.
**Iconos**: `lucide-react` (ISC).

## 3. Pantallas
Todas dentro de `AppShell`; contenido `max-w-[1200px] mx-auto`; grid de 12 columnas; <1024 px todo a 1 columna.

### `/` — Entrada
Objetivo: entrar con un clic. Tarjeta centrada `max-w-md`: "Trama" (serif), "Control mensual de capacidad de talleres", botón primario **Entrar como marca demo** (autofoco) → `/panel`, y `AvisoDatosFicticios compacto`.

### `/panel` — Panel de cumplimiento
Objetivo: en 5 s saber qué talleres revisar y si la protección funciona.
1. Cabecera: h1 "Panel de cumplimiento" + "Periodo móvil ago–oct 2026 · fuente: certificados mensuales".
2. KPIs: `KpiCard principal` a 12 columnas; debajo, 4 `KpiCard` (3 columnas cada una): horas regularizadas, trabajadores acompañados, pedidos mantenidos, incidencias (`fallo`).
3. Filtros por estado (grupo de botones): Todos (n) · Rojo (n) · Ámbar (n) · Verde (n) · Sin certificado (n).
4. `TallerTable`: Estado · Taller · Nivel en la cadena · País · Carga / capacidad · Último certificado · "Ver detalle". Orden: rojo › ámbar › sin certificado › verde; después, ratio de mayor a menor.

Estados: *vacío* "Aún no hay talleres en tu cadena."; *filtro sin resultados* "Ningún taller en ámbar este periodo." + botón "Ver todos"; *sin datos* fila con `Semaforo sin-datos`; *error* `role="alert"` "No hemos podido leer los datos de la demo. Recarga la página."

### `/taller/[id]` — Detalle
Objetivo: entender por qué salta la alerta y qué se hace sin perjudicar a los trabajadores.
1. Migas "Panel / {taller}". Cabecera: h1 nombre, `Badge` de nivel, país, `Semaforo lg`, ratio "2,4× la capacidad cotizada". Debajo, `NotaAlerta` (copy en §6).
2. Subnav fija (anclas): Horas · Cadena · Plan · Protección · Impacto.
3. `#horas` grid 8/4: `HoursChart` | "Resumen del periodo": necesarias, cotizadas, diferencia, plantilla cotizada, firmante (gestor laboral / consulente del lavoro) y fecha.
4. `#cadena` 12 col: `ChainDiagram`.
5. `#plan` 7 col `PlanTimeline` | `#proteccion` 5 col: cláusula anti-despido (`Badge verde` "Activa"), límite de reducción de pedidos (barra "usado X % de Y %", valores de los datos), acompañamiento (n trabajadores, entidad, vía: arraigo sociolaboral / art. 18).
6. `#impacto`: 4 `KpiCard` compactas del taller.
7. Si el rojo apunta a un posible delito: caja neutra "Se aplica el protocolo legal" → `/legal#protocolo`.

Estados: *id inexistente* → `notFound()`: "No encontramos este taller." + "Volver al panel"; *sin certificado*: gráfico sin barra de cotizadas y "Falta el certificado de oct 2026: no se puede calcular el semáforo."; *verde*: "Sin plan de corrección: el taller está dentro del margen."; *rojo sin subcontratas declaradas*: nodo punteado "Declaración pendiente: obligatoria tras un rojo".

### `/como-calculamos` y `/legal`
Prosa `max-w-[720px]`, h2 por sección, índice de anclas arriba.
- Cómo calculamos: 1) Carga = pedidos × minutos estándar. 2) Horas cotizadas: total del taller, nunca por persona. 3) Ventana móvil de 3 meses y margen ámbar. 4) Qué significa cada color. 5) Límites del método. Incluir tabla con el ejemplo de la demo (2.000 × 4 h = 8.000 h frente a 7 × 160 × 3 = 3.360 h).
- Legal: datos ficticios; datos agregados por taller; cada marca solo ve su semáforo; `#protocolo`; "No constituye asesoramiento jurídico."

## 4. Componentes
| Componente | Props | Variantes |
|---|---|---|
| `Semaforo` | `estado: 'verde'\|'ambar'\|'rojo'\|'sin-datos'`, `tamano?: 'sm'\|'md'\|'lg'`, `soloIcono?: boolean` | Icono + texto: `CircleCheck`, `TriangleAlert`, `OctagonAlert`, `CircleHelp`; píldora `*-fondo` con texto `*-texto` |
| `KpiCard` | `etiqueta`, `valor`, `unidad?`, `contexto?` ("de 11 trabajadores") | `principal` (cifra `kpi`, barra de progreso), `normal`, `fallo` (rojo si >0, verde con "0") |
| `TallerTable` / `TallerRow` | `talleres: TallerResumen[]`, `filtro` / `taller` | fila `hover:bg-superficie-2`; nombre = enlace |
| `ChainDiagram` | `nodos: {id, nombre, tipo: 'marca'\|'proveedor'\|'subcontrata', nivel, pais, plantilla, estado, declaradaEl?}[]` | horizontal (flex + flechas SVG); vertical <1024 px; nodo `pendiente` con borde punteado |
| `HoursChart` | `ventanas: {etiqueta, necesarias, cotizadas, limiteAmbar, limiteRojo, estado}[]`, `altura?=320` | — |
| `PlanTimeline` | `hitos: {titulo, fecha, estado: 'hecho'\|'en-curso'\|'pendiente'\|'retrasado', responsable}[]`, `revisor` | lista vertical con conector; estado con icono + texto |
| `Badge` | `variante`, `icono?`, `children` | `neutro`, `marca`, `verde`, `ambar`, `rojo` |
| `AvisoDatosFicticios` | `variante` | `banda` (bajo la nav, `superficie-2`), `compacto` |
| `AppShell` | `marca`, `children` | nav superior de 64 px: "Trama" + marca demo · Panel · Cómo calculamos · Legal y avisos; enlace "Saltar al contenido" |
| `Footer` | — | "Trama · MVP · datos ficticios" + enlaces a Cómo calculamos y Legal |
| `NotaAlerta` | `estado` | borde izquierdo de 4 px del color del estado |

## 5. Gráfico de horas
- Librería: **Recharts** (MIT), `ComposedChart` dentro de `ResponsiveContainer`, componente cliente.
- Eje X: últimas 6 ventanas móviles de 3 meses ("may–jul" … "ago–oct 26"). Tick personalizado: etiqueta + `Semaforo sm soloIcono` del estado de esa ventana.
- Eje Y: horas, desde 0 (obligatorio), `Intl.NumberFormat('es-ES')` + " h". Rejilla solo horizontal en `borde`.
- Barras agrupadas: **Cotizadas** `gris-grafico` y **Necesarias** `marca`, `barSize 28`, `radius [3,3,0,0]`. Valor encima de las barras solo en la última ventana.
- Umbrales: dos `Line` discontinuas (`strokeDasharray "6 4"`, sin puntos): `limiteAmbar` en `ambar-grafico` y `limiteRojo` en `rojo-grafico`, rotuladas al final: "Límite ámbar" y "Límite rojo". Los valores vienen de la librería de cálculo; el componente no fija porcentajes.
- Leyenda arriba a la izquierda, con texto. Tooltip: necesarias, cotizadas, ratio y estado en texto.
- `<figure>` + `<figcaption>` y botón "Ver como tabla" con los mismos datos.

## 6. Copy
- Semáforo: **Verde "En margen"** (la carga cabe en las horas cotizadas) · **Ámbar "Vigilar"** (supera las horas cotizadas dentro del margen para picos) · **Rojo "Revisar"** (supera el margen: se abre una revisión) · **"Sin certificado"**.
- NotaAlerta (rojo): "**Es una alerta, no una prueba.** El trabajo encargado no cabe en las horas que cotiza la plantilla. Se abre una revisión con el proveedor; no implica incumplimiento ni justifica retirar pedidos."
- Banda: "Demo con datos ficticios: empresas, talleres, personas y cifras son inventados."
- KPIs: "Siguen empleados y dados de alta 6 meses después de la alerta" · "Horas regularizadas" · "Trabajadores acompañados en su regularización" · "Pedidos mantenidos durante el plan" · "Despidos o recortes por encima del límite".
- Secciones del detalle: "Horas necesarias y cotizadas", "Cadena de suministro", "Plan de corrección · revisado por {entidad}", "Protección de trabajadores", "Impacto en este taller".

## 7. Demo en directo (90 s)
| Tiempo | Clic | Qué se ve |
|---|---|---|
| 0–10 s | "Entrar como marca demo" | Panel con los KPIs de impacto |
| 10–25 s | — | KPI principal; un taller rojo encabeza la tabla |
| 25–35 s | Filtro "Rojo" → fila del taller | Proveedor directo de 7 trabajadores |
| 35–55 s | — | 8.000 h necesarias frente a 3.360 h cotizadas, por encima del límite rojo; "2,4×"; NotaAlerta |
| 55–70 s | Subnav "Cadena" | Proveedor → subcontrata declarada, con su propio semáforo y certificado |
| 70–85 s | "Plan" | Hitos y revisor independiente; cláusula anti-despido activa; límite de reducción usado 0 % |
| 85–90 s | "Impacto" | Trabajadores de toda la cadena que siguen empleados y dados de alta |

Requisitos: el rojo sale primero; sin scroll horizontal a 1280 px; anclas con `scroll-margin-top` = nav + subnav.

## 8. Accesibilidad
- Texto ≥4,5:1 y controles/gráficos ≥3:1 (tabla §2). Nunca texto sobre `borde` ni en `gris-grafico`.
- Foco: `focus-visible:outline-2 outline-offset-2 outline-marca` en todo elemento interactivo; prohibido `outline-none` sin sustituto.
- Semáforo: siempre icono (forma distinta por estado) + texto; en `soloIcono`, `aria-label="Estado: Revisar"`. Nunca solo color.
- Teclado: orden lógico, enlace de salto, filtros con `aria-pressed`, la fila se abre con su enlace (sin `onClick` en `<tr>`), subnav navegable con Tab.
- Semántica: `lang="es"`, un h1 por página, `<th scope>`, `<figure>`; zoom 200 % sin pérdida; formatos es-ES ("8.000 h", "2,4×", "oct 2026").
