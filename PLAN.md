# PLAN — Trama · Start Camp UC3M 2026

Pitch: domingo 8-nov-2026. Inicio del trabajo: sábado 7-nov, 23:10.

| Fase | Hora objetivo | Estado |
|---|---|---|
| 0. Arranque: kit, install, lint/test/build base, git, contratos compartidos | 23:10–23:25 | hecho |
| 0b. Investigación en paralelo (evento, jurado, nombres ficticios, hechos y fuentes) → `investigacion/` | 23:25–00:30 | en curso |
| 1. Equipo A (5 agentes, rama `mvp`): Diseño UI · Animación · Legal · Datos · Integración | 23:25–01:25 | en curso |
| 1b. Cierre Equipo A: lint/test/build verdes, `MVP_ESTADO.md`, fusión en `main` | 01:25–01:40 | pendiente |
| 1c. Investigación ampliada (fuentes de horas, encaje legal, LLAMADAS.md) | 23:50–01:30 | en curso |
| 2. Equipo B (5 agentes nuevos): Negocio + Impacto → `PROBLEMAS_CERRADOS.md`; Pitch → `PITCH_FINAL.md` + `PREGUNTAS.md`; Producto → rama `pulido`; Diseño → Lovable (al final) | 01:40–04:00 | pendiente |
| 3. Simulacro: 5 jurados (J1-J5) + una ronda de mejoras → `SIMULACRO.md` | 04:00–04:45 | pendiente |
| 4. Verificación final, `LEEME_PRIMERO.md`, `INFORME_FINAL.md` | 04:45–05:15 | pendiente |

Prioridad (complemento): calidad antes que cantidad; cerrar las críticas J1-J5 manda; Lovable y pulido visual al final.
Prioridad si falta tiempo: demo `?demo=1` + plan B › guion 4:00 + preguntas › Lovable › resto del documento maestro › pulido visual.

## Estructura
- `specs/` — fuente de verdad del MVP (del kit).
- `trama-mvp/` — app Next.js (prototipo de demo, sin backend).
- `investigacion/` — notas con fuentes (evento, jurado, hechos, mercado, competencia).
- `DECISIONES.md` — decisiones tomadas sin preguntar (una línea cada una).

## POR DÓNDE VOY (pausa por límite de uso, 8-nov ~00:23; se reanuda a las 00:33)
Hecho: Equipo A cerrado y fusionado en `main` (lint 0 · tests 96/96 · build OK · e2e 22/22 · plan B en `demo-backup/`). Investigación completa en `investigacion/` (evento, jurado, nombres, hechos_legales, mercado_competencia, fuentes_horas, encaje_legal, minutos_chaqueta). `LLAMADAS.md` listo. Repo privado `withnolan/trama-startcamp` creado, push bloqueado por permisos (commits locales). Rúbrica + `jurado/medias.mjs` listos. `mentores/equipo.md` listo.
Detenidos en la pausa (reanudar con SendMessage, conservan su contexto):
- Mentor B3 Negocio (id aa2703b67f9489716): escribiendo `problemas/` (b, h, i, competencia, v5_segunda_cuenta) + ampliación del último prompt (cuota vs corrección, mercado España sin doble conteo, 347 vs resta, quién decide, competidores en una frase).
- Agente MARCAS (id a3f7b8942a8f3acee): escribiendo `MARCAS.md`.
Siguiente al reanudar, en este orden:
1. Reanudar Negocio y MARCAS («continúa donde lo dejaste»).
2. Lanzar mentor B4 Impacto (a, c, d, e, f, g, Hult/ODS, métricas con punto de partida, plan como cláusula, art. 42 ET + datos ITSS, «propuesta»).
3. Lanzar mentor B2 Producto en rama `pulido`: escenas «Taller con 4 marcas» y «Caso Milán 2025 (datos públicos)» anonimizado (proveedor A capacidad 0; B 7 personas, 6.000 chaquetas/año, 180 min con fuente), documentos simulados opcionales, métricas de impacto en la app, plan B regenerado.
4. Lanzar mentor B1 Pitch: `PITCH_FINAL.md` (≤560 palabras, [RELLENAR] llamada y marcas + versión B, datos simulados dichos en voz alta), `PREGUNTAS.md`, `HOJA_DATOS.md`, `DOCUMENTO_MAESTRO.md`; consolidar `PROBLEMAS_CERRADOS.md` con `problemas/*.md`.
5. Ronda 1 del jurado: 5 jurados nuevos (3 fijos) con pitch del Equipo B vs v5 saneado, a ciegas → `jurado/r1/notas.json` → `node jurado/medias.mjs`. Luego rondas de mentores hasta 4 o las 6:00 → `EVOLUCION.md`. Mentor B5 Diseño (Lovable) al final.
6. Cierre: verificación, `LEEME_PRIMERO.md`, `INFORME_FINAL.md`, `SIMULACRO.md`, commit (y push si el usuario lo habilita).

## Gestión del límite de uso (desde 00:40)
- Máximo 2 agentes a la vez; jurados de 3; sin rondas repetidas si la nota no se mueve; bloques cortos con commit + PLAN + LEEME al cerrar cada uno.
- En marcha (2): mentor B2 Producto (`/escenas`: 4 marcas + caso Milán, rama `pulido`) y mentor B1 Pitch (`PITCH_FINAL.md`, `PREGUNTAS.md`, `HOJA_DATOS.md`, `DOCUMENTO_MAESTRO.md`).
- En pausa (reanudar con SendMessage, de uno en uno, cuando quede hueco): B3 Negocio (aa2703b67f9489716), B4 Impacto (a47be5b9008334319), MARCAS (a3f7b8942a8f3acee).
- Orden: escenas + pitch + preguntas + LEEME → ronda 1 jurado (3: 2 fijos + 1 rotatorio; v1 vs v5 saneado) → mejoras → MARCAS / Negocio / Impacto → PROBLEMAS_CERRADOS → Lovable → cierre.

## 01:15 — estado
- Hecho y en `main`: pitch v1 + PREGUNTAS + HOJA_DATOS + DOCUMENTO_MAESTRO; `/escenas` (caso Milán, 4 marcas, documentos SIMULADO; e2e 25/25, tests 101/101); MARCAS.md.
- En marcha: mentor B3 Negocio (revisa precio/mercado del pitch y escribe `problemas/` b, h, i, competencia) · jurado R1-F1.
- Siguiente: jurados R1-F2 y R1-R1 cuando quede hueco → `jurado/r1/notas.json` → medias → mentores aplican mejoras (v2). Luego Impacto (a, c, d, e, f, g, métricas) → PROBLEMAS_CERRADOS → Lovable → cierre.
- Git: árbol compartido en la rama `pulido`; `main` se actualiza con un merge sin checkout (script en el scratchpad: commit-tree + update-ref).

## 03:25 — CIERRE
Hecho todo el plan: Equipo A (MVP) → investigación → Equipo B / mentores → 4 rondas de jurado (6,52 → 6,43 → 6,73 → 6,23; bucle parado: 4 rondas, máximo) → verificación final (lint 0, tests 101/101, e2e 25/25 sin internet, 0 marcas reales y 0 palabras vetadas en src, licencias documentadas, sin remotos) → `LEEME_PRIMERO.md` e `INFORME_FINAL.md`. Pendiente solo lo humano (ver `LEEME_PRIMERO.md` §4) y el push a GitHub (bloqueado por permisos).
