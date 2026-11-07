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

## Prompt complementario (7-nov, ~23:45)
- Concepto «horas cotizadas» → «horas de alta» (personas de alta en la Seguridad Social —ITA— × jornada pactada; Italia: LUL + Asse.Co) — en España se cotiza por base, no por horas (crítica J2); nombres de campos internos y del seed sin cambiar para no romper cálculo ni tests.
- Talleres con varias marcas: semáforo principal sigue usando solo los pedidos de la marca (cota mínima) + estimación de la carga total con la cuota de facturación de la marca (carga ÷ cuota), que es cota inferior si la marca paga por hora ≥ que las demás — cierra J3/J4/J5 sin cruzar datos entre marcas; en la app solo en el simulador y en /como-calculamos, no en el panel (no reabrir el cálculo testado).
- Simulador en directo del semáforo (`SimuladorSemaforo` + `lib/calculo/simular.ts`, misma lógica que el panel) dentro de `#horas` y en /como-calculamos — cierra «no hay demo que calcule» (J3).
- Cada alerta lleva «Por qué salta» (cifras reales) y «Qué comprobaría una persona» (nóminas y registro de jornada, visita sin avisar, entrevistas confidenciales, consumo eléctrico por franjas, lista de subcontratas) + «Trama propone; decide una persona».
- Cambios de alcance enviados a los agentes del Equipo A en marcha (no reiniciados) — más barato que rehacerlo en el Equipo B.
- Investigación ampliada en paralelo: fuentes de horas (ITA, plantilla media, registro de jornada, LUL/UNIEMENS/DURC/Asse.Co), encaje legal (OIT, art. 42 ET, cláusulas, RGPD, competencia) y LLAMADAS.md con contactos verificados — los cierres de PROBLEMAS_CERRADOS.md necesitan evidencia, no opinión.
- Simulacro con 5 jurados (perfiles J1-J5 del complemento) en lugar de 3 — el complemento lo pide y cubre el original.

## Nombres ficticios (investigacion/nombres.md)
- «Laboratorio Gelso» → «Laboratorio Bagolaro» en specs, seed y tests — existe «Gelso Milano», marca de moda de Milán, y en la demo ese taller es la subcontrata en rojo.
- Se mantienen «Ordessa» (se parece a Laboratorios Ordesa, nutrición infantil: otro sector y siempre con «(marca ficticia)»), «Taller del Almendro» y «Marroquinería Lentisco» — coincidencias genéricas fuera del sector o no son empresas.
- `protocoloLegal.nota` del seed decía «explotación» (palabra prohibida en src/): cambiada en `src/data/seed.json` por «indicios que requieren valoración jurídica»; `specs/seed.json` intacto como referencia.
- Simulador: con 7 personas el verde exige ≤ 714 chaquetas (700 → verde; 800 → ámbar 0,95) — el guion de demo usa 700.

## Bucle de mentores y jurado (encargo de las 23:45)
- Mentores = los 5 agentes del Equipo B (Pitch, Producto, Negocio, Impacto, Diseño), los mismos toda la noche — el megaprompt ya pedía ese equipo y el bucle pide 3-6 mentores persistentes que lo ven todo; se evita duplicar agentes. Perfiles y motivo en `mentores/equipo.md`.
- Jurado: agentes nuevos por ronda (3 desde las 00:40 por límite de uso), con ≥ 2 perfiles fijos para comparar.
- El jurado ve solo `PITCH_FINAL.md`, `HOJA_DATOS.md` y capturas de `demo-backup/`; devuelve JSON que el director guarda en `jurado/rN/notas.json` (los jurados no escriben en el repo) — aislamiento.
- Rúbrica fija en `jurado/rubrica.md` (Hult + referencia UC3M, 25/20/20/15/10/10) y medias con `node jurado/medias.mjs` (con autocomprobación).
- El simulacro del complemento (5 jurados J1-J5 + una ronda) queda absorbido por la ronda 1 del bucle; `SIMULACRO.md` resume y remite a `EVOLUCION.md`.
- `DOCUMENTO_MAESTRO.md` no duplica guion ni preguntas: remite a `PITCH_FINAL.md` y `PREGUNTAS.md` (una sola fuente de verdad que el bucle va mejorando).

## Encargo de medianoche (datos verificados + pitch v5)
- El bloque de la llamada del pitch v5 se trata como ejemplo, no como hecho: en todo lo evaluado o presentado va con [RELLENAR] + versión B; «[confirmar]» en equipo, «tenemos contactos» y la mesa de Milán con la logística — regla de no inventar validaciones.
- Caso reconstruido en la app anonimizado: escenario del simulador «Caso reconstruido con datos públicos» (1.500 chaquetas/trimestre, 7 personas × 146 h/mes) + control de minutos por chaqueta + sección `caso-publico` en /como-calculamos; fuentes solo en documentos — el usuario lo pide y la regla de datos ficticios se respeta al no haber nombres.
- Pitch v5 vs pitch del Equipo B: ronda 1 del jurado ciego con ambos (etiquetados X/Y, orden aleatorio); los mentores se quedan con el ganador o combinan.
- Mensajes a marcas en `MARCAS.md` (agente aparte de LLAMADAS) — distinto público y canal; nadie envía nada salvo el equipo humano.
- Asse.Co es una asseverazione anual, no un informe mensual: en Italia la fuente mensual de horas es el LUL (verificado en `investigacion/hechos_legales.md`).

## Último encargo (8-nov, 00:05)
- Remoto GitHub PRIVADO `trama-startcamp` con push tras cada commit — el usuario lo pide expresamente y sustituye la regla 1 del megaprompt («nada de remotos»); `gh` está instalado con sesión. Nada de Vercel. Se crea cuando Integración termine su fusión, para no chocar con su git; antes de cada push: grep de secretos/datos personales + lint/test/build en verde.
- Escenas nuevas de demo («Taller con 4 marcas» y «Caso Milán 2025 (datos públicos)», anonimizado) las hace el mentor de Producto en la rama `pulido` tras la fusión — Integración está verificando y no conviene cambiarle el alcance.
- Los fallos del jurado externo se reparten: Negocio (cuota vs corrección, mercado España sin doble conteo, varias marcas 347 vs resta, quién decide, competidores en una frase), Impacto (métricas con punto de partida, altas nuevas vs pedidos retirados, plan como cláusula, art. 42 ET + datos ITSS, «propuesta»), Pitch (todo al pitch y a PREGUNTAS, datos simulados dichos en voz alta).
- Repo privado `withnolan/trama-startcamp` creado con `gh` (visibilidad PRIVATE comprobada), pero el `git push` lo bloqueó el sistema de permisos de la sesión: no se reintenta ni se rodea; se sigue con commits locales y los comandos para subirlo quedan en `LEEME_PRIMERO.md` — el usuario pidió exactamente eso si `gh` fallaba.
- Caso reconstruido: los minutos por chaqueta pasan a 180 (taller premium que declara hasta 180 min; `investigacion/minutos_chaqueta.md`) en lugar de 240 sin fuente; el taller T1 de la demo sigue con 240 porque es ficticio y cambiarlo rompería toda la historia y los tests — recomendación al mentor de Producto.

## Límite de uso (00:40)
- Máximo 2 agentes simultáneos (usuario): siguen Producto (escenas) y Pitch; Negocio, Impacto y MARCAS en pausa con su contexto — el pitch y las escenas van primero.
- Jurado de 3 por ronda (2 perfiles fijos: profesora de emprendimiento social e inversora early-stage; 1 rotatorio), en lugar de 5 — orden del usuario; sin rondas repetidas si la nota no se mueve.
- El mentor de Pitch decide precio/mercado/encaje a partir de `investigacion/` mientras Negocio e Impacto están en pausa; lo apunta en `mentores/v1_pitch.md` para revisarlo después.
