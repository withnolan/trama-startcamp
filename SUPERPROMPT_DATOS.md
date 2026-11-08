# SUPERPROMPT · Pipeline de datos de Trama (creación, ingesta, validación y score)

> Pega este documento entero como encargo a un agente orquestador (Claude Code) abierto en la raíz del repo
> `trama-startcamp/`. El orquestador lanza subagentes en paralelo según la sección 5.
> Fecha de referencia: domingo 8-nov-2026. Pitch: 17:45. **La ruta de la demo actual no se puede romper.**

---

## 0. Tu papel

Eres un **científico de datos senior** que dirige un equipo pequeño de agentes. Tienes experiencia en
datos sintéticos realistas, ingesta y calidad de datos, y en evaluar una métrica de riesgo. Tu trabajo es que Trama
pueda **enseñar en el MVP cómo funciona su cadena de datos**, de la fuente al semáforo, con datos sintéticos
calibrados con estadísticas públicas reales, y medir con honestidad qué tal detecta el score.

Lo que se entrega sirve para vender la idea en el pitch. Por eso cada cifra que se pueda enseñar tiene que salir de un
cálculo reproducible y llevar su etiqueta: **real (con fuente)**, **supuesto** o **sintético**.

## 1. Contexto mínimo (lee esto antes de tocar nada)

**Qué hace Trama.** Cada mes compara la carga de trabajo que una marca encarga a un taller con las horas de alta de
ese taller.
- Carga = pedidos × minutos por pieza ÷ 60.
- Horas de alta = plantilla en alta en la Seguridad Social × jornada de cada contrato.
- Ventana móvil de 3 meses: ratio = carga ÷ horas.
- Umbrales: verde ≤ 0,85 · ámbar ≤ 1,10 (≤ 1,25 si el taller tiene ≤ 3 personas) · rojo por encima.
- Si faltan las horas del taller principal: «sin datos», nunca rojo.
- Es una alerta, no una prueba.

**Leer obligatoriamente:**
- `trama-mvp/src/lib/calculo/semaforo.ts` y `trama-mvp/src/lib/calculo/tipos.ts`: el motor actual y los tipos.
  Los tipos solo admiten cambios **aditivos**.
- `specs/DATA_MODEL.md` §2: el algoritmo.
- `investigacion/fuentes_horas.md` (§1, §2, §5, §7, §8): de dónde salen las horas en España e Italia.
- `problemas/c_informe_complaciente.md`: suelo de minutos = 126 min para una americana forrada; 180 min es la
  referencia premium, no un suelo.
- `problemas/b_varias_marcas.md`: varias marcas en un taller; la estimación por cuota abre una revisión, nunca da rojo.
- `problemas/g_datos.md` y `specs/LEGAL.md` §1.1-1.3: privacidad y competencia.
- `HOJA_DATOS.md`: cifras públicas con su fuente.

**Huecos conocidos del motor que este trabajo debe cubrir (en módulos nuevos, sin cambiar el comportamiento actual):**
1. El suelo de minutos (`max(escandallo, suelo de la categoría)`) **no está implementado**, y los minutos no tienen
   versión ni autor.
2. Las horas llegan ya calculadas (`horasTotalesCotizadas`). No se guardan los datos brutos: plantilla media
   ponderada y jornada de convenio.
3. Italia: `firmanteValido` exige `viaAsseCo`, pero según la investigación la fuente mensual es el **LUL**. Asse.Co
   (anual) y DURC deberían ser indicadores de calidad.
4. No hay procedencia ni calidad por dato (oficial / declarado / estimado; fecha; firmante).
5. La cuota de facturación (modelos 303/347) solo existe en el simulador.

## 2. Reglas innegociables

1. **No romper la demo.**
   - No modificar `src/data/seed.json`, `src/lib/calculo/semaforo.ts`, `simular.ts` ni los tests existentes.
   - No modificar las rutas `/escenas`, `/taller/[id]`, `/panel` ni `/como-calculamos`.
   - Todo el trabajo va en la rama **`datos`**: cada subagente en su propio worktree, y la fusión la hace solo el
     orquestador.
   - `main` no se toca hasta después del pitch, salvo orden expresa del usuario.
2. **Solo datos inventados dentro de `trama-mvp/`.**
   - Ninguna marca, taller, gestoría ni persona real. Las ciudades sí son reales.
   - Los nombres generados se cotejan contra una lista de exclusión hecha con los nombres reales que aparecen en
     `MARCAS.md`, `LLAMADAS.md`, `HOJA_DATOS.md`, `investigacion/*.md` y `specs/BRIEF.md`.
   - Todo nombre ficticio lleva el sufijo «(ficticio)» o «(ficticia)» en los datos visibles.
3. **Privacidad desde el diseño.**
   - Solo totales por taller y mes: nunca nombres, DNI/NIE, horas por persona ni situación migratoria, tampoco en los
     datos sintéticos crudos.
   - En talleres de menos de 4 personas, la vista de la marca solo muestra el estado.
   - Cada marca ve solo lo suyo.
4. **Lenguaje.**
   - Nunca «certificado legal», «certifica», «demuestra que no hay trabajo forzoso», «evita multas», «explotación»,
     «ilegal» ni «fraude» aplicado a un taller.
   - Se dice «informe mensual de plantilla», «horas de alta», «posible desajuste» y «revisión abierta».
   - El score no decide nada: «Trama propone; decide una persona» (art. 22 RGPD).
5. **Honestidad estadística.**
   - Toda métrica de detección se calcula **sobre datos sintéticos** y se dice así: «en datos sintéticos». Nunca se
     presenta como validación con clientes.
   - Los supuestos van con su nombre (`S1…Sn`) y su rango.
6. **Funciona sin internet.**
   - Las APIs públicas se consultan solo en el script de captura.
   - Su resultado se guarda como instantánea versionada en el repo, con la URL, la fecha y el hash de la respuesta.
   - El build y la demo no hacen ninguna llamada de red.
7. **Sin dependencias nuevas** salvo que sea imprescindible, y entonces solo con licencia MIT, ISC, Apache-2.0, BSD u
   OFL, apuntado en `DECISIONES.md`.
   - Scripts en TypeScript ejecutados con `node --experimental-strip-types`.
   - En los scripts, imports relativos (el alias `@/` solo funciona dentro de Next y Vitest).
   - Validación de esquemas escrita a mano. `zod` solo está como dependencia transitiva: no se usa.
8. **Determinismo.**
   - Generador con PRNG con semilla (mulberry32 o similar) y `Date` fija.
   - Dos ejecuciones con la misma semilla producen bytes idénticos (se comprueba con un hash en un test).
9. **Sin secretos ni datos personales** en código ni commits. Commits pequeños en `datos`, en español, con la línea de
   coautoría que indique el sistema. Nada de push salvo orden del usuario.

## 3. Arquitectura objetivo

```
trama-mvp/
├── datos/
│   ├── publicos/          # instantáneas de APIs públicas + parametros_publicos.json (con fuente)
│   ├── crudo/             # archivos sintéticos con el formato de la fuente real (lo que "llega" a Trama)
│   ├── verdad/            # verdad oculta del generador (NUNCA la lee la ingesta ni el score)
│   └── salida/            # dataset ingerido (compatible con Seed) + informe de calidad + evaluación
├── scripts/datos/
│   ├── contratos.ts       # tipos y formatos compartidos (lo escribe el orquestador en la fase 0)
│   ├── capturar-publicos.ts
│   ├── generar.ts
│   ├── ingerir.ts
│   └── evaluar.ts
└── src/lib/datos/         # funciones puras con tests (vitest): prng, distribuciones, parsers, validadores, score v2
```

**Flujo:** `capturar-publicos` → `generar` → `crudo/` → `ingerir` (parsear, validar, normalizar, procedencia) →
`salida/dataset.json` → `score v2` → `evaluar` (comparar con `verdad/`) → informe y vista del pitch.

**Separación estricta** entre lo que «llega» (`crudo/`) y la verdad oculta (`verdad/`). Si la ingesta o el score leen
`verdad/`, hay fuga de información y la evaluación no vale. Un test lo comprueba buscando importaciones o lecturas de esa
ruta.

## 4. Contratos (fase 0, los escribe el orquestador antes de lanzar a nadie)

En `scripts/datos/contratos.ts` y `src/lib/datos/contratos.ts`, la misma fuente reexportada:

1. **`ParametrosPublicos`.** Cada valor es `{ valor, unidad, fuente: { url, consultado: ISODate, sha256 }, nota }`.
   Valores:
   - distribución de empresas por tramo de asalariados (CNAE 14 y 15, España);
   - jornada anual de convenio (textil, marroquinería) y horas al mes derivadas;
   - horas medias trabajadas por semana en la industria, España e Italia;
   - suelo de minutos por categoría (126 para americana forrada; piel y calzado = `null`, «sin contrastar»);
   - referencia premium (180).
2. **Formatos crudos** (CSV con separador `;`, UTF-8, cabecera fija, decimales con punto):
   - `pedidos_erp.csv`: `pedido_id;marca_id;taller_id;referencia;tipo_pieza_id;unidades;inicio;fin;origen;pedido_origen_id`
   - `escandallo.csv`: `tipo_pieza_id;version;minutos;vigente_desde;autor;categoria`
     (versionado: la ingesta usa la versión vigente en cada mes)
   - `informe_plantilla_es.csv`: `taller_id;ccc_ficticio;mes;plantilla_media_ponderada;num_trabajadores;num_titulares;horas_titulares;firmante_tipo;despacho;fecha_emision`
     (imita el *Informe de Plantilla Media de Trabajadores en Alta*; SIMULADO)
   - `lul_agregado_it.csv`: `taller_id;mes;ore_registrate_totali;num_lavoratori;durc_regolare;durc_scadenza;asseco_vigente;consulente;fecha_emision`
   - `cuota_facturacion.csv`: `taller_id;marca_id;periodo;cuota_pct;fuente(303|347|declarada)`
   - `talleres.csv`: `taller_id;nombre;pais;ciudad;provincia;nivel;padre_id;especialidad;convenio`
3. **`Procedencia`** de cada dato ingerido: `{ archivo, fila, tipoFuente: 'oficial'|'declarado'|'estimado'|'publico', fechaDato, firmante? }`.
4. **`Incidencia`** de calidad: `{ codigo, gravedad: 'bloqueante'|'aviso'|'info', entidad, detalle }`.
   Códigos cerrados, por ejemplo: `FALTA_INFORME`, `INFORME_TARDIO`, `RECTIFICACION`, `MINUTOS_BAJO_SUELO`,
   `MINUTOS_SIN_CONTRASTAR`, `SUBENCARGO_EXCEDE`, `FECHAS_INVALIDAS`, `DUPLICADO`, `TALLER_MICRO`, `DURC_CADUCADO`,
   `JORNADA_FUERA_RANGO`.
5. **`DatasetIngerido`**: un `Seed` válido (tipos actuales, sin romperlos) + `procedencia` + `incidencias` +
   `metaIngesta { semilla, versionGenerador, hashCrudo }`.
6. **`ResultadoScore`**: `{ tallerId, mes, ratio, estado, confianza: 'alta'|'media'|'baja', motivosConfianza[], minutosUsados: 'escandallo'|'suelo', horasFuente: 'informe_es'|'lul_it'|'ninguna', explicacion[] }`.
   **La confianza no se mezcla con el ratio**: son dos ejes distintos.

En N1 basta con la parte de los contratos que usa el esqueleto (`talleres`, `pedidos_erp`, `informe_plantilla_es`,
`Incidencia` y `DatasetIngerido`). El resto se completa antes de lanzar N2. Cuando estén: `git commit` en `datos`. Los
subagentes se lanzan solo con el tag `datos-n1` (sección 6).

## 5. Sistema multiagente

### 5.1 Reparto

| Agente | Fase | Depende de | Escribe en (exclusivo) | Entrega |
|---|---|---|---|---|
| **A0 Orquestador** (tú) | 0, 2, 3 | — | `scripts/datos/contratos.ts`, `src/lib/datos/contratos.ts`, `DECISIONES.md`, `datos/README.md` | Contratos, lanzamiento, fusión, verificación final, informe |
| **A1 Datos públicos** | 1 | Contratos | `scripts/datos/capturar-publicos.ts`, `datos/publicos/` | Instantáneas + `parametros_publicos.json` |
| **A2 Generador sintético** | 1 | Contratos (y valores provisionales de A1) | `scripts/datos/generar.ts`, `src/lib/datos/{prng,distribuciones,generador,nombres}.ts` + tests, `datos/crudo/`, `datos/verdad/` | Escenarios reproducibles |
| **A3 Ingesta y calidad** | 1 | Contratos (y su propio fichero de ejemplo) | `scripts/datos/ingerir.ts`, `src/lib/datos/{parsers,validacion,normalizar}.ts` + tests | `datos/salida/dataset.json` + `informe_calidad.md` |
| **A4 Score v2 y evaluación** | 1 → 2 | Contratos (y su propio fichero de ejemplo) | `src/lib/datos/score.ts` + tests, `scripts/datos/evaluar.ts`, `datos/salida/evaluacion.*` | Score v2 + métricas de detección |
| **A5 Auditor** | 3 | Todo fusionado | Solo informes en `datos/salida/auditoria.md` | Lista de incumplimientos (no arregla nada) |
| **A6 Vista del pitch** (opcional) | 3 | Dataset y evaluación | `src/app/datos/page.tsx` y componentes nuevos con prefijo `Datos*` | Ruta `/datos` |

**Paralelismo:** los subagentes solo se lanzan cuando existe el tag `datos-n1` (sección 6.1). Antes, A0 construye solo
el esqueleto mínimo. Después, A1, A2, A3 y A4 trabajan a la vez, cada uno en su worktree (`isolation: "worktree"`),
enriqueciendo el esqueleto que ya funciona. Cada uno recibe con su encargo su tiempo máximo, sus criterios de parada
(6.3) y su alternativa mínima (6.4).
- A2 usa al principio los valores provisionales de los contratos y se recalibra cuando A1 entrega.
- A3 y A4 empiezan con un fichero de ejemplo pequeño hecho a mano a partir de los contratos, sin esperar a A2.
- Si hay un límite de uso, máximo 2 agentes a la vez, en este orden: (A2 + A3) → (A1 + A4) → A5 → A6.

**Archivos compartidos:** nadie salvo A0 edita `contratos.ts`, `tipos.ts`, `package.json` ni `DECISIONES.md`. Si un
agente necesita un cambio de contrato, lo pide a A0 por mensaje y espera.

### 5.2 Encargos de cada subagente (A0 los copia literalmente al lanzarlos, junto con las secciones 1-4)

**A1 · Datos públicos**
- **INE** (`https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/73019?nult=1`; probado el 8-nov: devuelve DIRCE 2025):
  número de empresas por tramo de asalariados (sin asalariados, 1-2, 3-5, 6-9, 10-19, 20-49, 50+) para CNAE 14, 141,
  143, 15 y 151. Con eso, la distribución de tamaño de taller truncada a 1-49 asalariados, que es la que vigila Trama.
- **BOE**, API de datos abiertos (`https://www.boe.es/datosabiertos/api/...`). Localizar los convenios
  BOE-A-2025-20177 (textil y confección) y BOE-A-2024-6193 (marroquinería). La jornada anual (1.789 h y 1.768 h según
  `HOJA_DATOS.md`) se **verifica** en el texto y se guarda con el artículo exacto. Si no se puede verificar, se marca
  `verificado: false`.
- **Eurostat** (`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/lfsa_ewhan2?...`): horas medias
  semanales en la sección C (industria manufacturera), España e Italia, último año. Sirve de control de verosimilitud
  de las horas generadas. Si existe desglose C13-C15, mejor.
- **Opcional:** proporción de tiempo parcial en la industria (Eurostat `lfsa_eppga` o equivalente), para el
  generador.
- **ISTAT** (`esploradati.istat.it`) no respondió el 8-nov: no se bloquea por ella; Eurostat cubre Italia.
- **Suelo de minutos** y referencia premium: no hay API. Se copian de `problemas/c_informe_complaciente.md` con su URL.
- **Salida:** cada respuesta cruda en `datos/publicos/raw/` (recortada a lo que se usa si pesa más de 1 MB), su
  `sha256`, y `parametros_publicos.json` según el contrato.
- **Modo sin red:** `--offline` reconstruye `parametros_publicos.json` desde `raw/`. Si una API falla, se conserva la
  instantánea anterior y se avisa; nunca se inventa un valor.

**A2 · Generador sintético** (el núcleo del realismo)
- **Escenarios configurables** (`datos/escenarios/*.json`): `pitch` (≈ 40 talleres, 1 marca, 6-9 meses) y `estres`
  (≈ 300 talleres, 3 marcas, 12 meses).
- **Talleres:**
  - tamaño muestreado de la distribución del INE (de A1);
  - país ES/IT según el escenario;
  - ciudades reales de distritos del sector (Ubrique, Elche, Igualada, Arnedo, Almansa; Scandicci, Rozzano,
    Abbiategrasso, Fermo, Solofra);
  - cadenas de 1 a 3 niveles con probabilidad configurable.
- **Nombres ficticios:** combinatoria de oficio + nombre botánico o de ave (como los del seed: Lince, Bagolaro,
  Almendro, Alcotán, Ontano…) + forma jurídica. Se cotejan contra la lista de exclusión (regla 2) y entre sí: no puede
  haber duplicados.
- **Capacidad real** (la verdad): plantilla × jornada de convenio ÷ 12 × factor de parcialidad, con bajas y vacaciones
  (aproximadamente 8-10 % de absentismo como supuesto S-n, con rango).
- **Pedidos:**
  - estacionalidad por campañas (primavera-verano y otoño-invierno, con picos de entrega);
  - unidades log-normales;
  - tipo de pieza según la especialidad;
  - ventanas de producción de 4 a 12 semanas.
- **Minutos:** escandallo con versiones; algunas marcas los rebajan con el tiempo (para probar el suelo); minutos
  reales = escandallo × ruido.
- **Arquetipos de taller con verdad oculta** (en `verdad/talleres.json`):
  - `sano`: carga ≤ capacidad;
  - `pico_legitimo`: un mes alto, la ventana absorbe;
  - `subcontrata_oculta`: pasa trabajo a un taller no declarado;
  - `personal_sin_alta`: trabaja más gente de la que figura;
  - `media_jornada_falsa`: alta a tiempo parcial, trabajo a jornada completa;
  - `informe_tardio_o_ausente`;
  - `rectificacion`;
  - `minutos_rebajados`;
  - `varias_marcas`: carga total repartida entre marcas, cada una en verde por separado;
  - `micro`: 3 personas o menos.
  Proporciones configurables (por defecto, en torno a un 10-15 % problemáticos: supuesto S-n con rango 5-20 %, igual
  que `HOJA_DATOS.md`).
- **Lo que «llega» a Trama** se deriva de la verdad con las distorsiones de cada arquetipo: no se ve la subcontrata
  oculta, la plantilla declarada es menor que la real, etc. Así el score tiene algo realista que detectar.
- **Salida:** los CSV del contrato en `datos/crudo/<escenario>/` y la verdad en `datos/verdad/<escenario>/`.
- **Tests:**
  - determinismo (hash idéntico con la misma semilla);
  - invariantes (subencargos ≤ pedido de origen; `padreId` coherente; fechas válidas);
  - la distribución de tamaños generada no se aleja de la del INE (chi-cuadrado o comparación de proporciones con
    tolerancia);
  - ningún nombre en la lista de exclusión.

**A3 · Ingesta y calidad**
- **Parsers estrictos** de cada CSV: cabecera exacta, tipos, fechas ISO, decimales, BOM y líneas vacías. Un archivo
  mal formado produce una incidencia **bloqueante** con fila y columna; nunca se descarta en silencio.
- **Validaciones de negocio:**
  - firmante coherente con el país;
  - informe de un mes posterior a su fecha de emisión;
  - plantilla media ≤ número de trabajadores + titulares;
  - jornada implícita (horas ÷ personas) dentro del rango de convenio ± tolerancia → `JORNADA_FUERA_RANGO`;
  - subencargos que exceden el pedido;
  - duplicados y rectificaciones (gana la de emisión más reciente, como en el motor);
  - DURC caducado (Italia);
  - minutos por debajo del suelo;
  - minutos sin suelo publicado (piel y calzado).
- **Normalización a `Seed`:**
  - horas de alta (España) = plantilla media ponderada × horas al mes del convenio del taller;
  - Italia = `ore_registrate_totali` del LUL;
  - la versión vigente del escandallo se resuelve por mes;
  - se rellena `procedencia` por dato.
  - El `Seed` resultante pasa por **las mismas funciones** de `semaforo.ts` sin cambiarlas. En Italia, para que el
    motor actual acepte el informe, se marca `viaAsseCo` con el valor del CSV y la incidencia se documenta: el motor v1
    lo exige, y el score v2 de A4 no.
- **Privacidad:** el dataset de salida no puede contener ningún campo por persona (test que recorre las claves).
- **Salida:** `datos/salida/<escenario>/dataset.json` e `informe_calidad.md`:
  - recuento por código de incidencia;
  - completitud por taller y mes;
  - el 5 % peor;
  - qué se bloqueó y por qué.
- **Tests:** un caso por código de incidencia y un recorrido completo con el fichero de ejemplo.

**A4 · Score v2 y evaluación** (ciencia de datos)
- **`score.ts`, funciones puras que reutilizan `clasificar()` de `semaforo.ts`** (mismos umbrales):
  1. `minutosEfectivos = max(escandallo vigente, suelo de la categoría)`. Sin suelo: se usa el escandallo con
     confianza «media» y el motivo «minutos sin contrastar».
  2. Horas: informe de España o LUL de Italia (Asse.Co y DURC solo bajan la confianza; no invalidan el dato).
  3. Varias marcas: la estimación por cuota (`carga ÷ cuota`) puede abrir una «revisión abierta», **nunca rojo**; la
     suma entre marcas solo se calcula si hay 3 marcas o más en Trama (`MIN_MARCAS_SUMA`).
  4. **Confianza** por reglas transparentes, no por un modelo opaco: alta / media / baja, con `motivosConfianza`
     legibles (informe tardío, rectificado, minutos bajo el suelo, sin suelo, DURC caducado, micro…).
  5. `explicacion[]` en lenguaje llano, con las cifras («Tus pedidos necesitan X h; el informe recoge Y h…»).
- **Compatibilidad:** con el `seed.json` actual, el score v2 da **el mismo estado** que el v1 en T1-T6, salvo donde el
  suelo o Italia cambien algo, que se documenta caso a caso. Hay un test que lo comprueba.
- **`evaluar.ts`** contra `verdad/`, por escenario y semilla (al menos 20 semillas, para dar intervalos):
  - matriz de confusión con «problema real» = arquetipos problemáticos frente a «alerta» = rojo y frente a
    «rojo o ámbar»;
  - sensibilidad, precisión y tasa de falsos rojos en `sano` y `pico_legitimo`;
  - **detección por arquetipo** (qué casos ve y cuáles no: por ejemplo, `varias_marcas` sin cuota no se ve, y
    `media_jornada_falsa` depende de la ponderación);
  - curva de sensibilidad del umbral rojo (1,00 a 1,30);
  - efecto del suelo de minutos frente a `minutos_rebajados`;
  - meses hasta la detección.
  - Todo con intervalo (percentiles 5-95 entre semillas) y la etiqueta «datos sintéticos».
- **Límites que se dicen sin maquillar:** lo que el score **no puede** ver por construcción (es un mínimo con los
  pedidos de una marca; si el generador hace el problema invisible en los datos, ningún score lo ve).
- **Salida:** `datos/salida/<escenario>/evaluacion.json` + `evaluacion.md` (tablas + 5 frases listas para el pitch,
  cada una con su número, su intervalo y «en datos sintéticos»).

**A5 · Auditor** (solo lectura; informa a A0 y no arregla nada)
- Ejecuta en la rama `datos`: `npm run lint`, `npm test`, `npm run build`, `npx playwright test --project=recorrido`.
  **No** ejecuta `npm run capturas`, que sobrescribe `demo-backup/`.
- Determinismo: genera e ingiere dos veces y compara hashes.
- Sin red durante el build y la demo.
- Grep en `trama-mvp/` de la lista de exclusión de nombres reales y de las frases prohibidas (regla 4).
- Ningún campo por persona.
- `verdad/` no se lee desde la ingesta ni desde el score.
- Licencias de cualquier dependencia nueva.
- Que `seed.json`, `semaforo.ts`, `simular.ts` y los tests originales están intactos (`git diff main -- <rutas>`).
- Cada cifra de `evaluacion.md` se recalcula a partir de su JSON.

**A6 · Vista del pitch** (opcional; solo si A5 sale limpio y queda tiempo)
- Ruta nueva `/datos` (sin tocar las demás; enlace en la navegación solo si A0 lo aprueba). Una sola pantalla
  pensada para proyector a 1280×720:
  1. **Fuentes:** qué llega, de quién, cada cuánto (oficial / declarado / público), con la etiqueta SIMULADO.
  2. **Ingesta:** N archivos → N filas → incidencias por código.
  3. **Score:** distribución de estados en el panel sintético y confianza.
  4. **Evaluación:** detección por arquetipo con intervalo y «en datos sintéticos».
- Con datos estáticos importados de `datos/salida/pitch/`, sin cálculo en el navegador más allá de lo que ya hacen
  otras rutas.
- Mismo estilo que `/escenas` (componentes y tokens existentes).
- Un caso e2e nuevo: sin errores de consola, sin internet, sin scroll horizontal.

## 6. Entrega por niveles, criterios de parada y rollback

**Principio:** primero algo mínimo que funcione de principio a fin; después, mejoras que se añaden solo si pasan su
puerta. Nunca se esperan horas para comprobarlo todo al final. En cualquier momento tiene que existir un último estado
bueno que se pueda enseñar.

### 6.1 Niveles de entrega

Cada nivel funciona por sí solo y se puede enseñar. Se cierra con un **tag** en la rama `datos`. No se empieza el
siguiente nivel sin el tag del anterior.

| Nivel | Qué contiene | Quién | Tiempo máximo | Puerta de salida (todo en verde) | Tag |
|---|---|---|---|---|---|
| **N0 · Red de seguridad** (ya existe) | La demo actual: `seed.json`, `/escenas`, plan B en `demo-backup/` | — | 0 | `npm test` 101/101 y build OK en `main` | `datos-n0` sobre `main`, antes de crear la rama |
| **N1 · Esqueleto que funciona** | Contratos mínimos. Generador con 4 arquetipos (`sano`, `pico_legitimo`, `subcontrata_oculta`, `informe_tardio_o_ausente`) y ≈ 20 talleres. Solo `pedidos_erp.csv`, `talleres.csv` e `informe_plantilla_es.csv` (solo España). Ingesta con validaciones bloqueantes. Score = el **motor actual** (`evaluarCadena`/`estadoPanel`) sin cambios. Evaluación con 1 semilla: matriz de confusión y detección por arquetipo | **A0 solo, sin subagentes** | **45 min** | Pipeline de principio a fin con un comando; resultado reproducible (hash idéntico); tests nuevos y los 101 originales en verde; `evaluacion.md` generado | `datos-n1` |
| **N2 · Realismo** (en paralelo) | A1: parámetros públicos reales. A2: los 10 arquetipos + Italia + escandallo con versiones + cuota de facturación. A3: todas las validaciones + procedencia + `informe_calidad.md`. A4: score v2 (suelo, LUL, confianza) + evaluación con 20 semillas e intervalos | A1-A4 | **75 min** por agente | La puerta de cada agente (6.3) en su worktree. Se fusiona agente a agente; tras cada fusión, el pipeline completo y todos los tests siguen en verde | `datos-n2-a1`, `datos-n2-a2`, … (uno por fusión aceptada) |
| **N3 · Escaparate** (opcional) | Auditoría completa (A5) + vista `/datos` (A6) + escenario `estres` | A5, A6 | **40 min** | Auditoría sin incumplimientos bloqueantes; e2e de `recorrido` + `/datos` en verde, sin internet | `datos-n3` |

Si N1 no está en verde a los 45 min, **no se lanza ningún subagente**: se recorta N1 (por ejemplo, 3 arquetipos y
sin evaluación) hasta que funcione, o se para y se informa. Paralelizar sobre un esqueleto roto multiplica el problema.

### 6.2 Rollback

- **Unidad de rollback = la fusión de un agente.** Cada subagente trabaja en su worktree. Lo que no pasa su puerta
  **no se fusiona**: el worktree se descarta y `datos` se queda en el último tag bueno. No hace falta deshacer nada.
- **Si una fusión ya hecha rompe algo** (tests, build, pipeline o hash): `git revert -m 1 <merge>` en `datos` de
  inmediato, sin intentar arreglarlo encima. Después se decide si el agente lo reintenta en su worktree.
- **Solo dentro de la rama `datos`.** `main` nunca se toca, así que la demo del pitch (N0) es siempre el rollback
  final. Nada de `reset --hard` sobre trabajo de otros, `push --force` ni borrar tags.
- **Cada agente hace commit en su worktree como mínimo cada 20 min** con su estado en verde, para que su propio
  rollback sea volver a su último commit bueno y no empezar de cero.
- **Tras cualquier rollback**, A0 apunta una línea en `DECISIONES.md`: qué se revirtió, por qué y a qué tag se volvió.

### 6.3 Criterios de parada

**De cada subagente** (para, hace commit de lo que esté en verde e informa a A0 con estado, causa y propuesta):
1. Llega a su **tiempo máximo** (75 min en N2, 40 min en N3).
2. **Dos intentos fallidos** de arreglar el mismo error, o 15 min seguidos con tests en rojo.
3. Necesita algo fuera de su carpeta exclusiva o un cambio de contrato: lo pide a A0 y espera; no lo hace por su
   cuenta.
4. Una API, una dependencia o una herramienta falla tres veces: usa la alternativa de 6.4 y sigue.
5. Rompe algo protegido (los 101 tests, `seed.json`, `semaforo.ts`, `simular.ts`, rutas existentes): para en el acto
   y vuelve a su último commit bueno.

**Del orquestador sobre el conjunto:**
1. **Corte duro a las 16:30:** se congela lo que haya en el último tag. Lo que no tenga tag no se enseña.
2. **Corte blando a las 15:30:** no se lanza ningún agente nuevo. Solo se fusiona lo que ya está en verde y se pasa a
   N3 si da tiempo.
3. Si dos agentes de N2 paran por el mismo motivo (por ejemplo, el contrato no da para lo que piden), se para N2, se
   corrige el contrato y se relanza solo lo necesario.
4. Si el límite de uso avisa, se para lo que esté en marcha tras su próximo commit en verde y se sigue con 1 o 2
   agentes, por orden de valor: A4 (evaluación) → A2 → A3 → A1 → A5 → A6.
5. No se repite un agente con el mismo encargo si ya paró una vez por la misma causa: se cambia el encargo (se recorta)
   o se acepta la alternativa.

### 6.4 Alternativa mínima de cada pieza (si para, se usa esto y se sigue)

| Pieza | Si no llega a su puerta | Lo que se enseña entonces |
|---|---|---|
| A1 Datos públicos | Valores de `HOJA_DATOS.md` con su URL (DIRCE, BOE, 126/180 min) escritos a mano en `parametros_publicos.json`, con `capturado: false` | Las mismas cifras, con la fuente citada |
| A2 Generador | Los 4 arquetipos de N1 y solo España | Detección en 4 tipos de taller |
| A3 Ingesta | Solo las validaciones bloqueantes de N1, sin procedencia por dato | Recuento de incidencias bloqueantes |
| A4 Score v2 | Score = motor actual + suelo de minutos como función aparte; evaluación con 5 semillas en lugar de 20 | Matriz de confusión y detección por arquetipo con un rango simple |
| A5 Auditor | A0 ejecuta a mano lint, tests, build, e2e y el grep de nombres y frases | Lista de comprobación en `datos/salida/auditoria.md` |
| A6 Vista `/datos` | Una captura de `evaluacion.md` renderizado, o una tabla en las diapositivas | La captura |

### 6.5 Calendario de control (A0 lo revisa en cada punto)

| Hora orientativa | Control | Si no se cumple |
|---|---|---|
| Inicio + 45 min | Tag `datos-n1` | Recortar N1 o parar; no se paraleliza |
| Inicio + 1 h 15 | Cada agente de N2 con un commit en verde en su worktree | Ese agente pasa a su alternativa (6.4) |
| Inicio + 2 h | Fusiones de N2 hechas, una a una | Lo no fusionado se descarta |
| 15:30 | Corte blando | Sin agentes nuevos |
| 16:30 | Corte duro | Se enseña el último tag; si no hay ninguno de N1, la demo de siempre (N0) |

## 7. Definición de hecho

**Mínimo aceptable = N1 con tag.** Todo lo de abajo es el objetivo completo (N2-N3). Lo que falte se declara en el
informe; nunca se presenta como hecho.

- `node --experimental-strip-types scripts/datos/capturar-publicos.ts --offline && ... generar.ts --escenario pitch --semilla 2026 && ... ingerir.ts --escenario pitch && ... evaluar.ts --escenario pitch`
  funciona de principio a fin sin red y es reproducible (hash idéntico).
- Scripts npm nuevos: `datos:capturar`, `datos:generar`, `datos:ingerir`, `datos:evaluar`, `datos:todo`.
- `npm run lint` con 0 errores. `npm test` en verde: los 101 tests originales intactos más los nuevos. `npm run build`
  OK. e2e de `recorrido` en verde.
- `datos/README.md`: cómo se ejecuta, qué es real, qué es supuesto (con `S1…Sn`) y qué es sintético; diagrama del
  flujo; limitaciones.
- `DECISIONES.md`: una línea por decisión tomada sin preguntar.
- Ningún cambio en `main`.

## 8. Informe final para el usuario (lo escribe A0, máximo 25 líneas)

0. **Nivel alcanzado** (N1, N2 parcial con los agentes fusionados, o N3), el último tag bueno y cada rollback o
   alternativa que se usó, con su causa.
1. Qué se ha construido y cómo se ejecuta (3 comandos).
2. Qué cifras públicas reales lo calibran (con fuente) y qué supuestos usa.
3. Resultados de la evaluación con intervalo y la etiqueta «en datos sintéticos»: detección por arquetipo y falsos
   rojos.
4. Qué **no** detecta el score y por qué.
5. Qué se puede enseñar hoy en el pitch (ruta o captura) y qué frase usar.
6. Riesgos abiertos y qué falta para pasar de sintético a real (gestoría que dé un informe de plantilla real, una marca
   que exporte pedidos y escandallo, un LUL agregado en Italia).
7. Estado de la rama `datos`: commits, sin fusionar en `main`, y el comando para fusionarla después del pitch.
