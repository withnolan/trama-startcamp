# Métricas de impacto: rediseño (petición del último jurado)

Mentor 4 · Impacto y regulación · 8-nov-2026. Cifras = seed de la demo (ficticias). Las fórmulas actuales están en `specs/DATA_MODEL.md` §4 y `trama-mvp/src/lib/calculo/metricas.ts`.

## Decisión
1. **Cinco tarjetas, como ahora.** Cada una dice **de dónde partía → dónde está → meta**. Los `id` no cambian.
2. **Altas nuevas y pedidos retirados, por separado.** El hueco de horas se puede «cerrar» quitando pedidos, así que la tarjeta de «horas regularizadas» pasa a decir cuánto del hueco se cerró con altas y cuánto retirando pedidos.
3. **«Ningún despido» se sustituye por «bajas en la línea base».** Las bajas se miden con la lista de la gestoría: sale de ahí, no lo declara el taller. Quien trabajaba sin contrato no puede ser «despedido», solo dejar de venir; por eso solo vale contar quién sigue de alta.
4. **Nadie sale de la línea base.** Las personas sin alta se cuentan en tres grupos: ya de alta, en trámite y **sin vía** (no cumplen los requisitos del arraigo o se les denegó). Quien no tiene vía sigue en el denominador de la métrica principal y cuenta como no logrado.
5. **Se quitan dos promesas de la app:** «empleados» (solo vemos el alta) y «horas regularizadas» (320 de las 1.120 h son una contratación nueva, no una regularización).

## Por qué

**Lo que dicen los datos del seed** (plan PC-001: T1 Abbiategrasso + T2 Rozzano, alerta del 7-ago-2026, corte en oct-2026, mes 3 de 6)

| Métrica | Punto de partida (al abrir la alerta) | Hoy (provisional) | Meta (propuesta) |
|---|---|---|---|
| **1. Personas de la línea base que siguen de alta** | 11 de 18 de alta (61,1 %): 7 en T1 y 4 en T2, más 7 sin alta en T2 | **14 de 18 (77,8 %)** | 18 de 18 a los 6 meses (7-feb-2027) |
| **2. Hueco cerrado con altas nuevas** | Faltaban **2.720 h** en may–jul: 8.000 h necesarias frente a 5.280 h de alta, **1,52×** | Faltan **800 h** en ago–oct: 7.200 frente a 6.400, **1,13×**. De las 1.920 h cerradas, **1.120 h (58 %) con altas nuevas** y **800 h (42 %) con pedidos retirados** | Bajar de 1,10× cerrando el hueco con altas; los pedidos retirados, siempre dentro del límite |
| **3. Personas sin alta al abrir la alerta** | 7 (todas en T2) | **3 ya de alta** (altas directas, con permiso válido) · **4 en trámite** (Italia, art. 18) · **0 sin vía** | 7 de 7 de alta o con el trámite resuelto. Las que no tengan vía se cuentan, no se restan |
| **4. Pedidos mantenidos** | 2.666,67 h estándar al mes (may–jul) | 2.400 h al mes: **90 %**, reducción del 10 % | Reducción ≤ 20 % (≥ 2.133 h al mes) |
| **5. Bajas en la línea base** | 0 | **0** de las 14 personas que han estado de alta | 0 |

- **La descomposición sale de dos cálculos que ya tiene la app** (`evaluarCadena` de T1 en jul y en oct). Altas nuevas = H_oct − H_jul = 6.400 − 5.280 = 1.120 h, que coincide con las «horas regularizadas» actuales. Pedidos retirados = C_jul − C_oct = 8.000 − 7.200 = 800 h, que coincide con la reducción del 10 %: 266,67 h al mes × 3 meses.
- **Por qué importa separarlo.** Sin las altas, el ratio habría bajado solo a 1,36× (7.200 / 5.280). Sin retirar pedidos, a 1,25× (8.000 / 6.400). Mostrando solo el ratio, retirar el 20 % de los pedidos se vería igual que regularizar a la gente.
- **Las 1.120 h no son todas regularización.** En T2, +3 personas de la línea base que estaban sin alta: 800 h. En T1, +1 persona que no estaba en la línea base (8 de alta, 7 de la línea base): 320 h. Por eso la etiqueta pasa a ser «altas nuevas».
- **Quien no cumple los requisitos del arraigo.** El arraigo sociolaboral exige dos años de permanencia continuada (art. 126.b RD 1155/2024) y uno o varios contratos que sumen al menos 20 h semanales (art. 127.b). El taller **no puede** darle de alta legalmente a quien no cumple, y la cláusula no puede obligarle a hacerlo. Lo que sí hace el plan:
  - la ONG o el sindicato le informa de otras vías: colaboración con autoridades (art. 129.2) y víctimas de explotación que colaboran (arts. 142-144);
  - el revisor comprueba que **se le paga lo trabajado**: la falta de autorización «no invalidará el contrato de trabajo respecto a los derechos del trabajador extranjero» ([LO 4/2000, art. 36.5](https://www.boe.es/buscar/act.php?id=BOE-A-2000-544));
  - se cuenta como «sin vía». Si pierde el trabajo, la métrica principal lo refleja.
  Fuentes del reglamento: [RD 1155/2024 (BOE)](https://www.boe.es/buscar/act.php?id=BOE-A-2024-24099) y `investigacion/hechos_legales.md` §4.
- **Privacidad.** «En trámite» y «sin vía» revelan situación migratoria en agregado. Por eso solo se muestran sumados por marca y, entre 1 y 3, como «menos de 4» (la misma regla que en el resto de la app; `problemas/g_datos.md`). Los recuentos los hace el revisor sin nombres.
- **ODS 8, texto oficial** ([ONU](https://www.un.org/sustainabledevelopment/es/economic-growth/)):
  - **8.8** «Proteger los derechos laborales y promover un entorno de trabajo seguro y sin riesgos para todos los trabajadores, incluidos los trabajadores migrantes, en particular las mujeres migrantes y las personas con empleos precarios». Es la meta principal: métricas 1, 3 y 5.
  - **8.7** «Adoptar medidas inmediatas y eficaces para erradicar el trabajo forzoso, poner fin a las formas contemporáneas de esclavitud y la trata de personas y asegurar la prohibición y eliminación de las peores formas de trabajo infantil, incluidos el reclutamiento y la utilización de niños soldados, y, de aquí a 2025, poner fin al trabajo infantil en todas sus formas». Trama solo contribuye como prevención; no decimos que la cumpla.
  - **Nuestras métricas no son los indicadores oficiales** (8.7.1 trabajo infantil; 8.8.1 lesiones laborales; 8.8.2 cumplimiento de derechos laborales; [lista de la ONU](https://unstats.un.org/sdgs/indicators/indicators-list/)). Son métricas de resultado propias.

## Respuesta de 25 s
**«¿Y si cerráis el hueco quitando pedidos?»** (63 palabras)
> «Lo mostramos por separado. En la demo, con datos ficticios, a la cadena le faltaban 2.720 horas; hoy, 800. De lo cerrado, 1.120 horas son altas nuevas y 800, pedidos retirados, dentro del límite del 20 %. Y no medimos «cero despidos»: de 18 personas contadas al abrir la alerta, 11 estaban de alta; hoy lo están 14. Quien no puede regularizarse sigue contando.»

## Ronda 3 · Personas sin alta: quién las cuenta, cómo se sigue a las mismas, y quién no tiene vía
**El problema (jurado R2, experta en impacto).** De la gestoría solo llega un total, y quien trabaja sin alta no figura en él. Si nadie las cuenta, pueden desaparecer del taller en silencio.

**Decisión**
1. **Las cuenta el revisor independiente (sindicato u ONG), no Trama ni la marca.**
   - Lo hace en una **visita sin aviso, antes de comunicar la alerta al proveedor**: como mucho 7 días después de la alerta, también en horario de tarde, y con entrevistas confidenciales.
   - Si se avisa primero al taller, las personas sin alta pueden no estar el día de la visita.
2. **Censo confidencial del revisor.**
   - Recoge quién trabaja allí ese día, con un código, y quién está de alta. Lo coteja con la lista nominal (ITA) en la gestoría, sin sacar copia.
   - La vía de regularización de cada persona la lleva la ONG en su propio expediente de acompañamiento, con el consentimiento de la persona.
   - **El censo nunca llega a la marca ni a Trama: a Trama solo llegan recuentos firmados por el revisor.** Con 1-3 personas en un grupo se muestra «menos de 4».
3. **Contraste con las horas.** El hueco dice cuántas personas faltan como mínimo. Si el censo encuentra menos, el revisor sigue buscando: otra subcontrata o trabajo a domicilio (el aparado).
   - En la demo: 2.720 h en 3 meses ÷ 160 h ≈ 5,7 personas a jornada completa; el censo encontró 7 sin alta.
4. **A los 6 meses, las mismas personas, sin nombres en Trama.** El revisor repasa su censo persona a persona: otra vez con la lista de la gestoría, una segunda visita y el contacto que mantiene la ONG. Firma recuentos en cinco grupos:
   - siguen de alta en el taller;
   - de alta en otro taller de la cadena;
   - en trámite;
   - sin vía;
   - **no localizadas.**
   «No localizadas» cuenta como no logrado en la métrica principal: así una salida silenciosa se ve.
5. **Quien no tiene vía de regularización.**
   - **Lo honesto:** el taller no puede darle de alta. Contratar a una persona extranjera sin autorización es infracción muy grave ([LO 4/2000, art. 54.1.d](https://www.boe.es/buscar/act.php?id=BOE-A-2000-544)), así que el plan **no puede prometerle un empleo legal**.
   - **Lo que sí hace el plan:**
     - la cláusula prohíbe que la alerta sea motivo de despido de quien está de alta;
     - para quien no tiene autorización, la ONG le acompaña: información de derechos, cobro de lo trabajado ([LO 4/2000, art. 36.5](https://www.boe.es/buscar/act.php?id=BOE-A-2000-544)), asistencia jurídica y servicios sociales;
     - la ONG le informa de las vías que se le puedan abrir: el arraigo al cumplir dos años de estancia, o colaborar con las autoridades si es víctima de explotación (arts. 142-144 RD 1155/2024). Esto último, solo si la persona decide hacerlo;
     - la marca paga ese acompañamiento como parte del coste de corregir.
   - La regularización extraordinaria del RD 316/2026 ya cerró su plazo: para casos nuevos queda el arraigo.
   - **Las cifras «sin vía» y «no localizadas» se publican** en el informe de impacto de cada plan, en agregado.

**Respuesta de 25 s** (64 palabras)
> «Las cuenta el revisor independiente en una visita sin aviso, antes de avisar al taller. Su censo es confidencial: ni la marca ni Trama ven nombres, solo recuentos. A los seis meses coteja ese censo con la lista de la gestoría y firma cuántas siguen. Quien no tiene vía de regularización se cuenta aparte y se publica: no podemos prometerle empleo legal, sí acompañamiento.»

## Ronda 3 · Meta agregada a 2030 (supuestos marcados, por validar)
Base de negocio, unificada con `problemas/h_precio_mercado.md` §6: **≈ 1.150 talleres distintos vigilados** en 2030 (40 marcas × ≈ 37 talleres ≈ 1.500 relaciones marca-taller, con ≈ 1,3 marcas de Trama por taller). Misma cuenta y mismos supuestos; solo cambia la base.

| Concepto | Cuenta | 2030 |
|---|---|---|
| Talleres vigilados cada mes | base de negocio | **≈ 1.150** |
| Personas en talleres vigilados («cubiertas» = su taller se vigila cada mes, no «protegidas») | 1.150 × **10 personas por taller** (S1) | **≈ 11.500** |
| Alertas rojas al año | 1.150 × **10 %** (S2) | **≈ 115** |
| Personas en planes de corrección al año (línea base) | 115 × (10 de alta + **3 sin alta**, S3) | **≈ 1.500** (1.495) |
| Personas sin alta identificadas al año | 115 × 3 | **≈ 345** |
| **Altas esperadas al año de quien trabajaba sin alta** | 345 × **50 %** (S4) | **≈ 170** (172,5) |
| Meta de resultado | personas de la línea base de alta a los 6 meses / bajas en la línea base / hueco cerrado con altas | **≥ 80 %** / **0** / **≥ 50 %** (S5) |

**Supuestos** (ninguno validado; el piloto mide los cuatro primeros):
- **S1.** Plantilla media de 10 personas por taller (el segmento es de 1-49 asalariados).
- **S2.** El 10 % de los talleres con un rojo al año. Rango 5-20 %, que da 85-345 altas al año.
- **S3.** 3 personas sin alta por alerta.
- **S4.** El 50 % de ellas, de alta a los 6 meses (en la demo, 3 de 7 en el mes 3).
- **S5.** Las metas de resultado son propuesta nuestra.

**Frase:** «Meta 2030, por validar: unos 1.150 talleres vigilados, unas 11.500 personas, y unas 170 altas al año de quien hoy trabaja sin alta.»

## Qué cambia en la app (para Producto)
Sin tocar `lib/calculo` ni el seed: solo `src/content/textos.ts`, `src/data/vista.ts` (función `kpis()`), `src/content/legal.ts` y la prueba `src/data/vista.test.ts`.

**1. `textos.ts` · `KPI_ETIQUETAS`**

| Clave | Hoy | Nuevo |
|---|---|---|
| `principal` | Siguen empleados y dados de alta 6 meses después de la alerta | **Personas de la línea base que siguen de alta** |
| `horasRegularizadas` | Horas regularizadas | **Hueco cerrado con altas nuevas** |
| `acompanados` | Trabajadores acompañados en su regularización | **Personas sin alta al abrir la alerta** |
| `pedidosMantenidos` | Pedidos mantenidos durante el plan | (igual) |
| `fallos` | Despidos o recortes por encima del límite | **Bajas en la línea base desde la alerta** |

**2. `textos.ts` · `KPI_CONTEXTO`** (el texto que debe salir con el seed)
- `principal`: «14 de 18 personas · al abrir la alerta, 11 de alta · provisional (mes 3 de 6)». vista.ts añade después «· definitiva el 7 feb 2027», como hoy. Necesita un parámetro nuevo: Σ `lineaBase.deAltaEnAlerta` del plan (11).
- `horasRegularizadas`: «1.120 h con altas nuevas · 800 h con pedidos retirados · faltaban 2.720 h, hoy 800 h».
- `acompanados`: «3 ya de alta · 4 en trámite · 0 sin vía de regularización».
- `pedidosMantenidos`: «Reducción del 10 % · límite pactado 20 % · partida: 2.667 h al mes (may–jul)».
- `fallos`: «de 14 personas que han estado de alta · lo cuenta el revisor con la lista de la gestoría».

**3. `textos.ts` · `KPI_AYUDA`**
- `principal`: «Personas contadas al abrir la alerta, con y sin alta. Solo cuenta como logro estar de alta, y nadie sale de la línea base. Provisional hasta los 6 meses.»
- `horasRegularizadas`: «Parte del hueco de horas de la cadena que se ha cerrado con más plantilla de alta, frente a la que se ha cerrado retirando pedidos.»
- `acompanados`: «Recuento agregado del revisor: ya de alta, en trámite (arraigo en España, art. 18 en Italia) o sin vía (no cumplen los requisitos o les fue denegada). Con 1-3 personas se muestra "menos de 4".»
- `fallos`: «Personas de la línea base que han estado de alta y ya no lo están. Sustituye al recuento de despidos, que declara el propio taller.»

**4. `vista.ts` · `kpis()`** (ids y orden iguales)
- `horasRegularizadas`: `valor` = altas / (altas + retirados) × 100 = **58,33** (`formato: "porcentaje"`).
  - altas = H(cadena, mes actual) − H(cadena, mes evaluado de la alerta);
  - retirados = C(cadena, mes de la alerta) − C(cadena, mes actual), con `evaluarCadena(seed, plan.tallerRaizId, …)`.
  - Si alguno sale negativo, se muestran las horas con su signo y el porcentaje no se calcula. *Shortcut: un solo plan en la demo; con varios, sumar por plan.*
- `acompanados`: `valor` = Σ `sinAltaIdentificados` = **7**.
  - ya de alta = `altasDirectas` + Σ `resueltasFavorables` = 3;
  - en trámite = Σ (`iniciadas` − `resueltasFavorables` − `denegadas`) = 4;
  - sin vía = 7 − 3 − 4 = 0 (incluye las denegadas).
- `fallos`: `valor` = bajas = (Σ `deAltaEnAlerta` + ya de alta) − siguen = (11 + 3) − 14 = **0**. «Planes con recorte sobre el límite» pasa al contexto de `pedidosMantenidos` como «cumple» o «supera el límite».
- `principal`: igual, más el parámetro de partida (11).

**5. `vista.test.ts`** («KPIs de marca»): `valor` → `[77.78, 58.33, 7, 90, 0]`. `contexto` de la principal → «14 de 18 personas · al abrir la alerta, 11 de alta · provisional (mes 3 de 6) · definitiva el 7 feb 2027».

**6. `legal.ts` · `proteccion`** (promesa que no aguanta una pregunta)
- Hoy: «Italia · permiso por protección social (art. 18 TU Inmigración): puede seguir la vía social, a propuesta de los servicios sociales o de asociaciones inscritas, sin necesidad de denuncia».
- Nuevo: «Italia · permiso por protección social (art. 18 TU Inmigración): exige violencia o "grave sfruttamento" y un peligro concreto para la persona. Según la doctrina, puede tramitarse por la vía social, a propuesta de servicios sociales o asociaciones inscritas».
- Se usa el término italiano porque «explotación» está vetada en `src/` (`trama-mvp/CONTRATO.md`).
- Es la vía de las 4 regularizaciones del seed (`investigacion/hechos_legales.md` §5).

**7. «Lista pactada con los sindicatos»: búsqueda en todo el repositorio** (sin `node_modules`; patrones «lista pactada», «pactad», «con los sindicatos», «acordada», «consensuad»)
- No aparece como afirmación en ningún sitio: ni en la app (`trama-mvp/src`), ni en `PITCH_FINAL.md`, `HOJA_DATOS.md` o `problemas/`.
- Solo aparece como aviso: `BRIEF_EQUIPO_B.md:98` («no existe: llamarla "propuesta"») y `PREGUNTAS.md:102` (frase prohibida).
- `problemas/h_precio_mercado.md:59` ya dice que la lista de revisores «está por construir». Correcto.
- Regla: cualquier lista de revisores, excepciones o cláusulas se llama **«propuesta»** mientras ningún sindicato ni ONG la haya firmado.
- No se pueden buscar con grep: las capturas y el vídeo de `demo-backup/`.

**7 bis. Ronda 3 (personas sin alta).**
- `textos.ts` · `KPI_AYUDA.acompanados`, añadir al principio: «Las cuenta el revisor en una visita sin aviso, con un censo confidencial: ni la marca ni Trama ven nombres.»
- `legal.ts` · `protocolo`, poner la visita primero:
  - «≤ 7 días · Revisor independiente: visita sin aviso antes de comunicar la alerta al proveedor y censo confidencial de quien trabaja allí, con y sin alta.»
  - «≤ 15 días · Proveedor: explica el desajuste y declara todas sus subcontratas.»
  - «≤ 30 días · Revisor: valida el plan.»
- P2, textos del seed (`src/data/seed.json`, sin tocar fechas ni cifras):
  - H6: «Permisos art. 18 (vía social) resueltos y alta de los 4 trabajadores restantes» → «Resolución de los permisos art. 18 (vía social) y alta de quien lo obtenga» (no se puede dar por hecho que los 4 lo consigan).
  - H8: «Revisión a 6 meses: trabajadores de la línea base siguen empleados y de alta» → «Revisión a 6 meses: el revisor coteja su censo y firma cuántas personas de la línea base siguen de alta».

**8. Pitch** (para el mentor de Pitch; no edito su archivo). Lo de [2:02–2:36] ya está bien: «Medimos cuánta gente sigue de alta a los seis meses, y si el hueco se cerró con altas o quitando pedidos». Si en la demo se enseña #impacto, decir: «de 18 personas, 11 estaban de alta al abrir la alerta; hoy, 14: datos ficticios».

## Qué sigue abierto
- **Las metas son propuesta nuestra.** Deben fijarse en cada plan con el revisor. Ningún sindicato ni ONG las ha validado.
- **Quién da los recuentos.** «Siguen de alta» y «sin vía» los da el revisor tras cotejar la lista nominal en la gestoría. Falta probar con una gestoría que se pueda hacer sin sacar nombres.
- **Trama no tiene solución para quien no cumple los requisitos de ninguna vía:** solo lo hace visible y vigila que se le pague lo trabajado.
- **Ningún sindicato ni ONG ha aceptado llevar el censo.** Es la conversación que pide el jurado: sin ella, el punto 1 de la ronda 3 es una propuesta.
- **En la demo, la visita sin aviso (H3, 15-sep) va después de la declaración del proveedor (H1, 21-ago).** El seed es anterior a esta regla y cambiar sus fechas rompe las pruebas, así que no se toca.
- **La meta 2030 depende de S1-S4,** que nadie ha medido.
- **El seed solo tiene un plan.** Con varios planes, la descomposición se suma plan a plan, y los meses de referencia y de plan pueden tener longitudes distintas.
