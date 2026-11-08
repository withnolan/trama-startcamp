# PITCH FINAL · Trama · 4:00 + 2:00 de preguntas

Start Camp UC3M · domingo 8-nov-2026, 17:45-20:00 · **versión 4, final** (mentor de Pitch, tras la ronda 3 del jurado: v3 = 6,73, la mejor; v2 = 6,43; v1 = 6,52). Preguntas en `PREGUNTAS.md`; cifras y supuestos en `HOJA_DATOS.md`; qué cambió y por qué en `mentores/v4_pitch.md`.

**Cómo leer este archivo.** Lo que se dice en voz alta va en las líneas que empiezan por «>». El resto son instrucciones. [RELLENAR] es un hueco que solo se llena con algo real; si no hay nada real, se dice la versión B. Recuento al final: **≤ 560 palabras**.

**Antes de las 17:30 hay que decidir tres cosas** (reglas en `LLAMADAS.md` §4 y `MARCAS.md`):
1. **Llamada** ([3:21]): versión A solo con un dato real, apuntado y con permiso para citarlo. Si no, versión B.
2. **Marcas** ([3:21]): versión A si alguna marca ha contestado (un «no» también cuenta); versión B si se les escribió y nadie ha contestado; si no se escribió a ninguna, no se dice nada de marcas.
3. **Equipo** ([3:37]): nombres y estudios reales. «Derecho laboral, Informática, ADE y Diseño» viene del v5 y está **[confirmar]**.

**Reparto propuesto [confirmar]:** Orador 1 abre, cierra y maneja el portátil durante la demo · Orador 2 cuenta la solución y pone voz a la demo · Orador 3 explica qué pasa tras un rojo y el «por qué ya» · Orador 4 negocio, validación y petición.

---

## Guion

### [0:00–0:29] El caso, con números · Orador 1
*Pantalla: el titular y las fuentes (Il Giorno 14-7-2025 · Il Post 15-7-2025 · Startmag 28-7-2025 · Milano Finanza 17-4-2026).*

> Julio de 2025: el Tribunal de Milán pone a Loro Piana bajo administración judicial por no comprobar la capacidad real de quien le fabricaba. Su proveedor directo no tenía taller. Las chaquetas las entregaba un subproveedor con siete trabajadores: unas 6.000 al año. A jornada completa: dos horas por chaqueta, con corte y plancha. Una fábrica premium tarda hasta tres solo en coserla. No cabía, y su cotitular lo admitió: subcontrataba.

### [0:29–0:42] El problema · Orador 1

> Loro Piana auditaba, pero, según la Fiscalía, sin medir la capacidad. En abril de 2026 salió cortando, dice la empresa, con más de cien proveedores. ¿Y la gente de esos talleres?

*Un segundo de pausa.*

### [0:42–1:16] La solución · Orador 2

> Somos Trama: hacemos esa cuenta cada mes, en toda la cadena. Los minutos de tus pedidos salen de tu escandallo, nunca por debajo del mínimo industrial publicado de cada prenda. Las horas de alta, con la jornada de cada contrato, las saca su gestoría de la Seguridad Social; solo nos llega el total. En Italia, del registro de horas del gestor. Inflarlas exige cotizar por gente que no trabaja allí, y dar de alta a media jornada a quien hace la completa no tapa el hueco.

### [1:16–2:00] Demo (44 s) · habla Orador 2 · clica Orador 1

> Lo simulado: marca, talleres y cifras son inventados; el caso Milán usa datos de prensa anonimizados.

**Clic 1** · «1 · Caso Milán 2025» (en pantalla también sale el proveedor A, sin taller propio: rojo desde el primer pedido)

> Subproveedor B: con el mínimo industrial, 126 minutos, ya está al límite; con los de una fábrica premium, casi una vez y media: rojo.

**Clic 2** · «2 · Taller con 4 marcas»

> Taller con cuatro marcas, todas en Trama: cada una, sola, en verde; Trama suma como tercero: rojo. Cada una solo ve su semáforo y «revisión abierta».

**Clic 3** · Ctrl+Tab a la pestaña 2, la alerta del taller T1

> La alerta dice qué comprobar; decide una persona.

**Qué se clica, según lo que funcione:**

| | Ruta A · `/escenas` (la buena) | Ruta B · simulador | Plan C · sin app |
|---|---|---|---|
| Preparar | Pestaña 1: `http://localhost:3000/escenas`. Pestaña 2: `http://localhost:3000/taller/T1` (sin `?demo=1`), con «Por qué salta» y «Qué comprobaría una persona» a la vista. | Pestaña 1: `/taller/T1#simulador`. Pestaña 2: igual que en A. | `demo-backup/1280x720/`: capturas 15, 16 y 04, en ese orden. |
| Clic 1 | «1 · Caso Milán 2025» (ya está a la vista: el clic se puede omitir). Proveedor A: ∞, rojo. Subproveedor B: 1,03× con el mínimo industrial (126 min, ámbar) y 1,47× con minutos de fábrica premium (180 min, rojo). Producto está alineando la escena con esta regla: si la pantalla solo enseña 180 min, se dicen igual las dos cifras. | «Caso reconstruido con datos públicos»: escribir **126** en «Minutos por chaqueta» (≈ 1,0×, ámbar) y luego **180** (1,5×, rojo); si el simulador no baja de 180, quedarse en 180. Decir «El subproveedor» en vez de «Subproveedor B». | Captura 15. |
| Clic 2 | «2 · Taller con 4 marcas»: cuatro verdes (0,40 · 0,35 · 0,30 · 0,25), suma 1,30× «Revisar»; Ordessa solo ve su verde y «Revisión abierta». | «Taller de la demo» → **700** en «Chaquetas en el trimestre» (verde) → «Parte de la facturación del taller que es de Ordessa» al **20 %**. Decir: «Con sus pedidos, verde. Pero es el 20 % de la facturación del taller: Trama estima la carga total: no cabe, y abre una revisión, sin ver los pedidos de nadie más». | Captura 16. |
| Clic 3 | Ctrl+Tab a la pestaña 2. | Igual. | Captura 04. |

Si preguntan de dónde salen los datos: botón «3 · Documentos» (plantilla media, escandallo y modelo 347, marcados SIMULADO).

### [2:00–2:33] Si sale rojo · Orador 3

> Un rojo abre el plan de corrección firmado al contratar Trama. La corrección la paga la marca aparte: un revisor independiente, unos mil a tres mil euros por alerta. A quien trabaja sin alta lo cuenta el revisor, sin avisar y sin dar nombres. El taller no pierde al cliente de golpe: si la marca se va, con plan y preaviso. Medimos cuánta gente sigue de alta a los seis meses, y si el hueco se cerró con altas o quitando pedidos.

### [2:33–2:49] Lo que no hacemos, y por qué ya · Orador 3

> No detectamos trabajo forzoso ni damos sellos: medimos un riesgo de capacidad y documentamos que la marca vigiló. En España, la Inspección afloró en 2025 más de 120.000 empleos irregulares; en 2027 la UE prohibirá los productos con trabajo forzoso.

### [2:49–3:21] Negocio · Orador 4

> Paga la marca: 60 euros por taller y mes y el informe del gestor a coste; margen bruto del 80 %, por validar. Empezamos por marcas que fabrican en Italia y en España: allí, la Fiscalía de Milán pidió documentos a 22, ninguna investigada; aquí, el piloto mira sus talleres. Mercado: 165 fabricantes españoles medianos y grandes y 175 grupos italianos; con 30 a 40 talleres cada uno, 8,6 millones al año. Meta 2030: 40 marcas, unos 1.150 talleres y 11.500 personas.

### [3:21–3:37] Lo que hemos validado, y lo que no · Orador 4

**Llamada · versión B** (por defecto):

> Lo que falta: aún no hemos hablado con ninguna marca, gestoría, taller, sindicato ni ONG; el lunes llamamos a veinte contactos.

**Llamada · versión A** (solo con una respuesta real, apuntada y con permiso): «Esta mañana hemos hablado con [RELLENAR: tipo y zona, por ejemplo «una gestoría laboral de Igualada»]. Nos ha confirmado que [RELLENAR: un solo dato, con su número y su condición]. Y nos ha dicho algo que no esperábamos: “[RELLENAR: frase literal, máximo 20 palabras]”.» Si no fue un sí claro, cambiar «Nos ha confirmado que» por «Nos ha dicho que cree que». Si fue por escrito o anoche, decirlo así.

**Marcas · versión B** (se escribió y nadie ha contestado):

> Y anoche escribimos a [RELLENAR: N] marcas que fabrican en España; aún no ha contestado ninguna.

**Marcas · versión A**: «Anoche escribimos a [RELLENAR: N] marcas que fabrican en España. [RELLENAR: M] han contestado: [RELLENAR: lo que dijeron de verdad, también si es un no].» Si no se escribió a ninguna marca (`MARCAS.md` dice que a las 01:40 no se había enviado nada), esta frase no se dice.

### [3:37–3:51] Equipo y petición · Orador 4

> Somos [RELLENAR: nombre 1], [nombre 2], [nombre 3] y [nombre 4], estudiantes de la UC3M: Derecho laboral, Informática, ADE y Diseño. Pedimos una carta de intención para un piloto gratuito de tres meses con 5 a 10 talleres.

*[confirmar] estudios y roles. Si hay un asesor real, añadir «y nos asesora [nombre, cargo]»; si no lo hay, nada.*

### [3:51–4:00] Cierre · Orador 1

> Queremos que la próxima vez no haga falta cortar con nadie. Trama: ver a tiempo, corregir antes de cortar.

---

## Si vamos tarde (se corta en este orden)
1. Negocio: «Meta 2030: 40 marcas, unos 1.150 talleres y 11.500 personas» (está en la hoja y en la pregunta 17).
2. Por qué ya: «En España, la Inspección afloró en 2025 más de 120.000 empleos irregulares;» (preguntas 14 y R6).
3. Solución: «En Italia, del registro de horas del gestor» (pregunta 19).

**No se corta nunca:** la frase de lo simulado, el suelo de minutos, la jornada de cada contrato, la cláusula, quién paga la corrección, quién cuenta a las personas sin alta, lo que gana el taller, lo que nos falta y la petición.

## Recuento de palabras

| Bloque | Palabras | Segundos | Ritmo (palabras/min) |
|---|---|---|---|
| [0:00–0:29] El caso, con números | 71 | 29 | 147 |
| [0:29–0:42] El problema | 31 | 13 | 143 |
| [0:42–1:16] La solución | 86 | 34 | 152 |
| [1:16–2:00] Demo | 74 | 44 | 101 (deja tiempo a los clics) |
| [2:00–2:33] Si sale rojo | 82 | 33 | 149 |
| [2:33–2:49] Lo que no hacemos, y por qué ya | 40 | 16 | 150 |
| [2:49–3:21] Negocio | 81 | 32 | 152 |
| [3:21–3:37] Validación (versión B de llamada y marcas) | 36 | 16 | 135 |
| [3:37–3:51] Equipo y petición | 33 | 14 | 141 |
| [3:51–4:00] Cierre | 19 | 9 | 127 |
| **Total** | **553** | **240** | **≈ 138** |

Método: cuenta automática de las líneas «>», con la versión B en llamada y marcas; cada hueco [..] cuenta como una palabra y no cuentan los signos sueltos (—, %). Si no se escribió a ninguna marca, son 538. **Con la versión A de la llamada (unas 25-30 palabras más) hay que hacer los tres cortes de «Si vamos tarde» (−29)** para seguir por debajo de 560. Ensayar dos veces con cronómetro: si pasa de 4:00, cortar en ese orden.

## Afirmación → fuente (cada cifra o hecho que se dice)

| Lo que se dice | Fuente | Estado |
|---|---|---|
| Julio de 2025: Loro Piana, bajo administración judicial por no comprobar la capacidad real de quien le fabricaba | [Il Giorno, 14-7-2025](https://www.ilgiorno.it/milano/cronaca/loro-piana-sfruttamento-lavoro-xebye3v7) · [Il Post, 15-7-2025](https://www.ilpost.it/2025/07/15/loro-piana-sfruttamento-caporalato-aziende-lusso/) | ✅ Medida preventiva (art. 34 d.lgs. 159/2011), no multa |
| El proveedor directo no tenía taller | Datos del usuario (Il Post, Startmag, L'Espresso). Il Giorno habla de «siete operarias y casi ninguna máquina» en el proveedor directo | ✅ / ⚠ la prensa no coincide |
| Un subproveedor con siete trabajadores y unas 6.000 chaquetas al año (6.000-7.000, según su cotitular), que admitió subcontratar | [Startmag, 28-7-2025](https://www.startmag.it/economia/che-cosa-ha-combinato-loro-piana/) | ✅ Sin nombrar la empresa: la atribución de los 7 varía |
| Dos horas por chaqueta | Cálculo propio: 7 × ≈ 1.750 h/año = 12.250 h ÷ 6.000 = 2,04 h. Jornada anual de convenio: textil 1.789 h ([BOE-A-2025-20177](https://www.boe.es/boe/dias/2025/10/09/pdfs/BOE-A-2025-20177.pdf)), marroquinería 1.768 h ([BOE-A-2024-6193](https://www.boe.es/boe/dias/2024/03/27/pdfs/BOE-A-2024-6193.pdf)) | ✅ cálculo |
| Una fábrica premium tarda hasta tres horas solo en coserla | [Création Gross, FashionUnited 2021](https://fashionunited.uk/press/fashion/creation-gross-fashion-made-in-germany/2021111559279): hasta 180 min de costura por chaqueta | ✅ declaración comercial. Sin dato de cachemir |
| Loro Piana auditaba; según la Fiscalía, sin medir la capacidad | [Il Post, 15-7-2025](https://www.ilpost.it/2025/07/15/loro-piana-sfruttamento-caporalato-aziende-lusso/) («più formali che sostanziali») | ✅ |
| Abril de 2026; más de cien proveedores cortados | [Milano Finanza, 17-4-2026](https://www.milanofinanza.it/fashion/loro-piana-si-conclude-in-anticipo-il-procedimento-di-amministrazione-giudiziaria-202604171313344253) | ✅ cifra **de la empresa** |
| Minutos del escandallo, nunca por debajo del mínimo industrial publicado de cada prenda | Suelo: americana forrada, 126 min ([BUFT 2023](https://buft.edu.bd/upload/_page/P-7.pdf): línea industrial con la eficiencia real del 60 %). 180 min es la **referencia** de una fábrica premium ([Création Gross](https://fashionunited.uk/press/fashion/creation-gross-fashion-made-in-germany/2021111559279), «hasta 180»): es el techo de su rango, no un suelo. Trama calcula con el mayor entre escandallo y suelo, con historial de cambios (`problemas/c_informe_complaciente.md`) | ✅ referencias / ⚠ regla de diseño; piel y calzado aún sin suelo (lo construye el piloto) |
| Horas de alta con la jornada de cada contrato; las saca la gestoría de la Seguridad Social | Informe de Plantilla Media de Trabajadores en Alta (TGSS, Sistema RED), que pondera «la jornada contratada en relación con la jornada completa»: [Noticias RED 2011/13](https://www.seg-social.es/descarga/es/160888), [RDLeg 4/2004, DA 12.ª](https://www.boe.es/buscar/act.php?id=BOE-A-2004-4456) | ✅ por remisión normativa / ⚠ ver un informe real; que el gestor lo saque cada mes y cuánto cobra, por validar |
| En Italia, del registro de horas del gestor | LUL (art. 39 DL 112/2008): registra cada día las horas trabajadas de cada persona; lo lleva el empleador o su consulente del lavoro (`investigacion/fuentes_horas.md` §7, [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2008-06-25;112~art39)) | ✅ / ⚠ sin copia pública verificable: se cruza con DURC y Asse.Co |
| Inflarlas exige cotizar por gente que no trabaja allí; la media jornada de quien hace la completa no tapa el hueco | `investigacion/fuentes_horas.md` §8 (más altas o más jornada = más cotización) y la ponderación anterior: media jornada cuenta como 0,5 | ⚠ razonamiento propio |
| Demo: con el mínimo industrial, al límite; con minutos de fábrica premium, casi 1,5 veces | 6.000 × 126 / 60 = 12.600 h ÷ 12.250 h = 1,03 (ámbar, que obliga a pedir una explicación); con 180 min, 18.000 h → 1,47 (rojo > 1,10). El rojo empieza hacia 135 min con 6.000 chaquetas (116 con 7.000). El proveedor directo, sin taller, sale rojo con cualquier minutaje | ✅ cálculo |
| Cuatro marcas, todas en Trama; cada una solo ve su semáforo y «revisión abierta» | Escena ficticia (0,40 · 0,35 · 0,30 · 0,25 → 1,30). Diseño: mínimo de 3 marcas, mismo aviso sea cual sea la causa ([Directrices horizontales](https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:52023XC0721(01)) §§391, 407-408; `problemas/b_varias_marcas.md`) | diseño |
| Unos mil a tres mil euros por alerta | Estimación: 2-3 jornadas de revisor a 500-1.000 €; referencias por jornada: [SA8000](https://sa-intl.org/resources/sa8000-certification-costs/) 400-1.500 USD, [SMETA](https://www.eurocert.asia/?p=842) 560-990 USD (tarifas de Asia) | ⚠ por validar; Trama no cobra margen |
| A quien trabaja sin alta lo cuenta el revisor, sin avisar y sin dar nombres | Diseño de `problemas/metricas_impacto.md` (ronda 3): censo confidencial del revisor, visita sin aviso antes de comunicar la alerta (≤ 7 días), a Trama solo llegan recuentos firmados | ⚠ propuesta: ningún sindicato ni ONG ha aceptado aún |
| El taller no pierde al cliente de golpe: salida con plan y preaviso | Cláusula de `problemas/f_rojo_abandono.md`. Base: [Ley de Competencia Desleal, art. 16.3.a](https://www.boe.es/buscar/act.php?id=BOE-A-1991-628) (romper con un proveedor dependiente sin 6 meses de preaviso escrito es desleal) | ✅ ley / cláusula sin probar |
| Cuánta gente sigue de alta a los seis meses; altas frente a pedidos retirados | Métricas sobre las personas de la línea base (`problemas/metricas_impacto.md`) | diseño |
| No detectamos trabajo forzoso | [OIT, indicadores 2025](https://www.ilo.org/sites/default/files/2025-11/ILO%20Indicators%20of%20Forced%20Labour%202025.pdf): ningún indicador aislado lo confirma | ✅ |
| En 2025, la Inspección afloró en España más de 120.000 empleos irregulares | Memoria ITSS 2025: 131.645 ([Europa Press vía El Derecho, 7-10-2026](https://elderecho.com/la-inspeccion-de-trabajo-propuso-multas-por-valor-de-858-millones-en-2025-y-afloro-un-68-mas-de-empleos)); balance de marzo: 122.146 ([Bolsamanía](https://www.bolsamania.com/noticias/economia/economia--la-inspeccion-de-trabajo-afloro-mas-de-122000-empleos-en-2025-y-recupero-51-millones-de-euros-en-salarios--22024440.html)) | ✅ prensa / ⚠ PDF oficial sin abrir; todos los sectores, sin desglose textil |
| En 2027 la UE prohibirá los productos con trabajo forzoso | [Reglamento (UE) 2024/3015](https://eur-lex.europa.eu/eli/reg/2024/3015/oj/spa), aplicable desde el 14-12-2027 | ✅ / no obliga a usar ninguna herramienta |
| 60 € por taller y mes + informe a coste; margen bruto del 80 % | `problemas/h_precio_mercado.md`: coste de servir ≈ 12 €/taller/mes → 80 % de la cuota, a escala (≈ 400 talleres por analista) | ⚠ supuestos por validar |
| La Fiscalía de Milán pidió documentos a 22 [marcas], ninguna investigada | 13 órdenes de entrega de documentos (3-12-2025) y 9 peticiones (jul-2026); ninguna marca investigada (`investigacion/hechos_legales.md` §1.d: [AGI](https://www.agi.it/cronaca/news/2025-12-04/sfruttamento-cinese-capolarato-brand-di-lusso-inchiesta-34483372/), [Milano Finanza](https://www.milanofinanza.it/fashion/pm-milano-acquisizioni-di-atti-presso-nove-case-di-moda-202607161854071180)) | ✅ |
| Mercado: 165 fabricantes españoles medianos y grandes y 175 grupos italianos de moda; con 30 a 40 talleres cada uno, 8,6 M€ | España: 165 empresas de confección, piel y calzado con 50 o más asalariados ([INE, DIRCE a 1-1-2025, tabla 73019](https://www.ine.es/jaxiT3/Tabla.htm?t=73019)); Italia: 175 empresas de moda de más de 100 M€ ([Mediobanca](https://www.mediobanca.com/it/hp-media/eventi-iniziative/l-area-studi-mediobanca-pubblica-il-nuovo-report-sulla-moda.html)). 165 × 30 × 720 € + 175 × 40 × 720 € = 3,56 + 5,04 M€ | ✅ cifras / ⚠ talleres por cliente, supuesto |
| Meta 2030: 40 marcas, unos 1.150 talleres y 11.500 personas | 40 marcas × ≈ 37 talleres ≈ 1.500 relaciones marca-taller (× 720 € ≈ 1,08 M€/año); con ≈ 1,3 marcas de Trama por taller, ≈ 1.150 talleres distintos; × ≈ 10 personas por taller ≈ 11.500 (`problemas/h_precio_mercado.md` §6; cuenta completa en `HOJA_DATOS.md`) | ⚠ supuesto |
| No hemos hablado con ninguna marca, gestoría, taller, sindicato ni ONG; veinte contactos comprobados | `LLAMADAS.md` §1 y `MARCAS.md` (comprobados el 7-nov en sus webs oficiales) | ✅ (igual que la hoja) |

**Lo que ya no se dice en voz alta** (está en `PREGUNTAS.md` o en la hoja): el art. 42 ET (abierto), los competidores (pregunta 3), el mercado en talleres (6.083 empresas, 4,4 M€), «con 30 talleres, 21.600 €», las guías de la Comisión sobre pedidos y capacidad (R5), «Hicimos la cuenta», «nunca los pedidos de otra», «Subir el precio por pieza lo decide compras» (hoja y pregunta 12) y «suelo de lujo de 180» (180 es la referencia premium, no un suelo).
