# DECISIONES

Una línea por decisión: decisión — motivo.

- Kit descomprimido en la raíz (`specs/`, `trama-mvp/`); el zip queda fuera de git — es solo el origen.
- Repositorio git en la raíz `STARTCAMP/` (docs + specs + app); sin remotos — regla 1.
- Contratos compartidos escritos por el director antes de lanzar el Equipo A (`src/lib/calculo/tipos.ts`, `src/lib/motion/tokens.ts`, `src/content/textos.ts`, `src/app/providers.tsx`) — para que 5 agentes trabajen en paralelo sin pisarse.
- Estado `sin_datos` (con guion bajo, como DATA_MODEL) también en la UI, en lugar de `sin-datos` de DESIGN — un solo tipo en todo el código.
- Fuentes con `@fontsource-variable/inter` y `@fontsource-variable/source-serif-4` (OFL-1.1) en vez de `next/font/google` (DESIGN §2) — el megaprompt pide que funcione sin internet, también al reconstruir.
- Ruta de la demo `/taller/[id]?demo=1` (MOTION §5 dice `/talleres/`) — el megaprompt y DESIGN usan `/taller/`.
- Gráfico de horas: se muestran solo las ventanas calculables con los certificados del seed (may–oct → 4 ventanas: may–jul … ago–oct), no 6 — no se inventan datos para rellenar.
- Aviso permanente «Prototipo de demostración · datos ficticios» (megaprompt) en lugar de «Demo con datos ficticios» (DESIGN §6).
- Dependencias añadidas: `lucide-react` 1.70.0 (ISC), `@fontsource-variable/*` 5.3.x (OFL-1.1), `@playwright/test` 1.65.0 (Apache-2.0, dev). Licencias comprobadas con `npm view`.
- Base del kit: lint, tests y build en verde tal cual (Next 16.4.5, React 19.3.0); no hizo falta cambiar versiones.
- Investigación (evento, jurado, nombres, hechos) en paralelo con el Equipo A y guardada en `investigacion/` — ahorra tiempo; el Equipo B la recibe como parte del repositorio.
