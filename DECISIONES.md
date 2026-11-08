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

## Mentor 3 · Negocio (v1, ~01:40)
- Mercado España con el INE (DIRCE 1-1-2025, tabla 73019): techo 6.083 empresas de confección, piel y calzado con 1-49 asalariados × 720 € = 4,4 M€/año (fase 1 piel y calzado: 2.217 → 1,6 M€), cada taller una vez — «2.131 fábricas de calzado» incluía 442 sin asalariados y dejaba fuera confección y marroquinería, donde está el piloto. Frases exactas en `mentores/v1_negocio.md`.
- Se mantiene 60 €/taller/mes + informe a coste; el 80 % es margen sobre la cuota y a escala (≈56 % sobre lo facturado); corrección pagada por la marca directo al revisor con margen 0 % para Trama — sin incentivo a generar rojos (J4).
- Varias marcas: la estimación por facturación nunca da rojo, solo «revisión abierta»; rojo directo si los pedidos de una marca superan solos 1,10 × la capacidad; el 347 solo comprueba (anual, sin clientes extranjeros) — evita falsos rojos por precio por hora o material.
- Frase de competidores ajustada («…cruza cada mes pedidos con horas de alta»): Sedex y amfori comparten una auditoría entre clientes y Milán sí pide horas por cliente — la versión «cada relación por separado / nadie suma» no era exacta.

## Mentor 4 · Impacto (ronda 1, 8-nov madrugada)
- Art. 42 ET fuera del guion hablado; en [2:36] se propone dato ITSS («más de 120.000 empleos irregulares aflorados en 2025»: 122.146 en el balance de marzo, 131.645 en la memoria de octubre) + 2027 en una frase — no sabemos si el art. 42 cubre la confección; se queda en la respuesta de 25 s con «si» (`problemas/d_no_declarado_vs_forzoso.md`).
- Minutos por pieza: los del escandallo con el que paga compras, versionados, y el semáforo usa como mínimo el suelo público de la categoría (americana forrada ≈126 min) — único mecanismo nuevo: si la marca rebaja minutos, el rojo no desaparece (`problemas/c_informe_complaciente.md`).
- KPIs: «Horas regularizadas» → «Hueco cerrado con altas nuevas» (1.120 h altas / 800 h pedidos retirados), «Despidos» → «Bajas en la línea base», «sin vía» de regularización contada aparte; punto de partida en cada métrica — 320 de las 1.120 h son una contratación nueva y los despidos los autodeclara el taller (`problemas/metricas_impacto.md`).
- Se mantiene «horas de alta» (no «capacidad en alta»); el documento pasa a «informe mensual de plantilla» — cambiar el concepto costaba más de lo que aportaba; el «informe de horas de alta» no existe (`problemas/a_fuentes_horas.md`).

## Mentor 4 · Impacto (ronda 3, tras r2)
- Suelo de minutos por prenda y segmento (americana forrada: industrial 126 min, premium/lujo 180 min; piel y calzado «sin contrastar» hasta que el piloto lo construya) y Trama usa el mayor con el escandallo — fallo 3 de 3 «los minutos los pone quien paga»; con lujo a 180 el caso Milán sigue rojo aunque se declaren 130 (`problemas/c_informe_complaciente.md`).
- Personas sin alta: las cuenta el revisor en visita sin aviso antes de avisar al proveedor, con censo confidencial (a Trama solo recuentos firmados); a 6 meses coteja con la lista de la gestoría y firma recuentos, «no localizadas» = no logrado; sin vía: no se promete empleo legal (LO 4/2000 art. 54.1.d), acompañamiento y cifra publicada — fallo nuevo de R2 (`problemas/metricas_impacto.md`).
- Meta 2030 sobre los 600 talleres del año 3 de Negocio (v3_negocio.md aún no existía): ≈6.000 personas en talleres vigilados, ≈60 alertas/año, ≈90 altas/año de quien trabajaba sin alta, con supuestos S1-S4 marcados.
- Cláusula 0 «desde la entrada»: 6 meses sin bajas ni recortes > 20 % por entrar en Trama, ámbar o sin datos (`problemas/f_rojo_abandono.md`).

## Cierre (03:25)
- Bucle parado tras 4 rondas (máximo del encargo); la 4.ª bajó (6,73 → 6,23).
- Se presenta **v4** (`PITCH_FINAL.md`), no v3 (mejor nota, 6,73): v3 llamaba «suelo» a 180 min (es el techo de una fábrica premium) y su meta 2030 no cuadraba con el mercado — regla del encargo: una nota más baja y honesta vale más que una alta y falsa. v3 archivada en `pitches/v3_pitch_final.md`.
- Meta 2030 unificada a ≈ 37 talleres por marca (40 marcas, ≈ 1.150 talleres, ≈ 11.500 personas, ≈ 1,08 M€/año) tras detectar la incoherencia en la ronda 4.
- Licencias: directas permisivas; transitivas MPL-2.0 (lightningcss, axe-core: desarrollo) y LGPL-3.0 (sharp, opcional y sin usar) documentadas como excepción en `MVP_ESTADO.md` — quitarlas rompe Tailwind o el lint.
- Conocido y no corregido: en el seed la visita del revisor llega 33 días después de la alerta (la regla dice: sin aviso, antes de comunicar la alerta y como máximo en 7 días); cambiar fechas rompe los tests calibrados — se dice en `PREGUNTAS.md`.

## Pipeline de datos (8-nov, desde las 11:49; rama `datos`, SUPERPROMPT_DATOS.md)
- Trabajo en la rama `datos` con etiqueta `datos-n0` sobre `main` como rollback final; `main` no se toca antes del pitch.
- N1 lo construye el orquestador solo (sin subagentes): pipeline de principio a fin antes de paralelizar.
- Scripts en TypeScript con `node --experimental-strip-types` e imports con extensión `.ts`; se añade `allowImportingTsExtensions` a `tsconfig.json` (requiere `noEmit`, que ya estaba) — sin dependencias nuevas.
- N1 incluye `escandallo.csv` (1 versión por pieza) además de los 3 archivos previstos: el Seed necesita los minutos y así la ingesta no depende de constantes del generador.
- Horas de alta en la ingesta = plantilla media ponderada × jornada anual del convenio ÷ 12 (1.768 h marroquinería, provisional y sin verificar en el BOE hasta A1).
- Parámetros públicos provisionales copiados a mano con su URL (`capturado: false`); A1 los sustituye por la instantánea.
- Lista de exclusión de nombres reales (`trama-mvp/datos/exclusion_nombres.txt`, 74 nombres) sacada de MARCAS.md, LLAMADAS.md y los casos de Milán.
- Parada por consumo (usuario, ~12:20): se para en el mínimo factible. A1, A3 y A4 fusionados en verde; A2 (generador N2) detenido sin commits → descartado (rollback por diseño: su worktree no se fusiona). El escenario sigue siendo el de N1 (España, 4 arquetipos); Italia, varias marcas y minutos rebajados quedan para después del pitch.
- Con el generador N1, score v1 y v2 coinciden en las 20 semillas; las diferencias de v2 (suelo, LUL sin Asse.Co, cuota) solo aparecerán con el generador N2.
- Muestra laboral (usuario, 12:30): enfoque general y anonimizado (sin Loro Piana en los datos; el caso real solo en el pitch); datos laborales agregados por el revisor; 3 indicadores OIT además de capacidad; nada por persona y sin cifras con < 4 entrevistas.
- Riesgo con reglas transparentes y nivel mínimo «medio» si hay cualquier señal o vacío de datos; el sistema nunca asigna «evidencia confirmada».
