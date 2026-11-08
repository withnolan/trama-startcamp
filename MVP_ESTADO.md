# MVP_ESTADO — Trama (8-nov-2026)

## Qué hay
- App Next.js 16 en `trama-mvp/`, sin backend: datos ficticios en `src/data/seed.json`, cálculo con tests en `src/lib/calculo`.
- Rutas: `/` (entrada) · `/panel` (KPIs de impacto y tabla con filtros; el rojo sale primero) · `/taller/T1…T6` (semáforo y ratio,
  por qué salta y qué comprobar, horas, simulador, cadena, plan, protección, impacto, protocolo legal) · `/como-calculamos`
  (con simulador) · `/legal` · `/escenas` (ronda de pulido, ver abajo).
- Demo guiada: `/taller/T1?demo=1` (~18 s; `Esc` o clic → estado final; con movimiento reducido, todo al instante).
- Simulador «Prueba el cálculo»: escenario de la demo y «Caso reconstruido con datos públicos» (anonimizado).
- `/escenas` (mismo cálculo que el panel, `src/lib/calculo`): **caso Milán 2025** (reconstrucción anonimizada con datos
  públicos: proveedor sin taller → ∞; subproveedor de 7 personas con 6.000 chaquetas × 180 min → 1,47×, rojo desde ≈135 min),
  **taller con 4 marcas** (ficticio: 0,40 · 0,35 · 0,30 · 0,25 verdes; suma 1,30 roja; Ordessa solo ve su verde y
  «revisión abierta»; regla de 3 marcas) y **documentos de ejemplo SIMULADO** (plantilla media, escandallo, modelo 347).
  Enlazada desde la navegación y el panel; botones de escena fijos para la demo del pitch.
- Plan B en `demo-backup/`: 34 PNG (17 pantallas a 1280×720 y 1920×1080, con las escenas en 15-17) y
  `demo-T1-1280x720.webm` (demo completa).

## Qué NO hay
Backend, login, subida de informes, persistencia, datos reales, varias marcas en el panel (solo en la escena y en el
simulador), despliegue (GitHub/Vercel) ni diseño afinado para móvil (funciona, pero está pensado para proyector).

## Cómo arrancarlo (Windows, Git Bash)
```bash
cd /c/Users/sheng/Desktop/STARTCAMP/trama-mvp
npm install     # solo la primera vez, con internet
npm run demo    # compila y sirve en http://localhost:3000 (después funciona sin internet)
```
Abrir `http://localhost:3000/taller/T1?demo=1`. Guion de 40–60 s en `trama-mvp/README.md`.
Puerto 3000 ocupado: `npx next start -p 3001` (tras `npm run demo` o `npm run build`). Si algo falla: plan B, abrir
`demo-backup/` (PNG por pantalla o el vídeo).

## Verificación (con el build de producción)
- Ronda de pulido (8-nov, 01:10, rama `pulido`): `npm run lint` 0 problemas · `npm test` 101/101 (6 archivos) ·
  `npm run build` OK (15 páginas) · `npm run e2e` 25/25 (añade `/escenas` y una prueba de las escenas) · `npm run capturas` 35/35.
- Base del Equipo A: `npm run lint`: 0 problemas · `npm test`: 96/96 (5 archivos) · `npm run build`: OK (14 páginas prerenderizadas).
- `npm run e2e` (Playwright contra `next start`): 22/22. Las 7 rutas a 1280×720 y 1920×1080 sin `console.error`/`pageerror`,
  sin scroll horizontal y **sin internet** (se bloquea todo lo que no es localhost; las fuentes autoalojadas cargan); el
  rojo sale primero; 404; simulador (700 chaquetas → verde; caso reconstruido → rojo → ámbar → verde); `?demo=1` completo
  (todos los `data-m` acaban con opacidad 1) y salto con `Esc` y con clic.
- `npm run capturas`: 29/29. Higiene: 0 marcas reales y 0 palabras vetadas en `src/`.

## Licencias
Directas: todas permisivas (MIT, ISC, Apache-2.0, OFL-1.1). Transitivas con copyleft, sin GPL ni AGPL; se aceptan como
excepción (binarios y herramientas sin modificar; quitarlas rompe el build o el lint):
- `sharp` y `@img/sharp-libvips-*` (LGPL-3.0-or-later): opcional de Next para optimizar imágenes; no se usa (sin `next/image`).
- `lightningcss` (MPL-2.0, desarrollo): motor CSS de Tailwind 4 · `axe-core` (MPL-2.0, desarrollo): reglas de
  accesibilidad de `eslint-config-next` · `caniuse-lite` (CC-BY-4.0): datos de navegadores.

## Diferencias conocidas con `specs/`
- `src/data/seed.json` frente a `specs/seed.json`: 4 textos, mismas cifras (hitos H2 y H7 con «informe de horas de alta» y
  «≤»; nota del protocolo legal sin lenguaje acusatorio; especialidad de T6 abreviada).
- En la UI, «horas cotizadas» pasa a «horas de alta»; ruta `/taller/` (MOTION dice `/talleres/`); gráfico con 4 ventanas
  (no 6); fuentes @fontsource (no `next/font/google`). Detalle en `DECISIONES.md`.
- Integración: e2e en el puerto 3100; `/taller/[id]` con `instant = false` (todos los ids se prerenderizan); plan y
  protección en una sola captura porque comparten fila.
