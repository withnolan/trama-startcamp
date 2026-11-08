# PITCH FINAL · Trama · 4:00 + 2:00 de preguntas

Start Camp UC3M · domingo 8-nov-2026, 17:45-20:00 · **versión 2** (mentor de Pitch, tras la ronda 1 del jurado: v1 = 6,52). Preguntas en `PREGUNTAS.md`; cifras y supuestos en `HOJA_DATOS.md`; qué cambió y por qué en `mentores/v2_pitch.md`.

**Cómo leer este archivo.** Lo que se dice en voz alta va en las líneas que empiezan por «>». El resto son instrucciones. [RELLENAR] es un hueco que solo se llena con algo real; si no hay nada real, se dice la versión B. Recuento al final: **≤ 560 palabras**.

**Antes de las 17:30 hay que decidir tres cosas** (reglas en `LLAMADAS.md` §4 y `MARCAS.md`):
1. **Llamada** ([3:24]): versión A solo con un dato real, apuntado y con permiso para citarlo. Si no, versión B.
2. **Marcas** ([3:24]): versión A si alguna marca ha contestado (un «no» también cuenta); versión B si se les escribió y nadie ha contestado; si no se escribió a ninguna, no se dice nada de marcas.
3. **Equipo** ([3:38]): nombres y estudios reales. «Derecho laboral, Informática, ADE y Diseño» viene del v5 y está **[confirmar]**.

**Reparto propuesto [confirmar]:** Orador 1 abre, cierra y maneja el portátil durante la demo · Orador 2 cuenta la solución y pone voz a la demo · Orador 3 explica qué pasa tras un rojo y el «por qué ya» · Orador 4 negocio, validación y petición.

---

## Guion

### [0:00–0:30] El caso, con números · Orador 1
*Pantalla: el titular y las fuentes (Il Giorno 14-7-2025 · Il Post 15-7-2025 · Startmag 28-7-2025 · Milano Finanza 17-4-2026).*

> Julio de 2025: el Tribunal de Milán pone a Loro Piana bajo administración judicial por no comprobar la capacidad real de quien le fabricaba. Hicimos la cuenta. Su proveedor directo no tenía taller. Las chaquetas las entregaba un subproveedor con siete trabajadores: unas 6.000 al año. A jornada completa: dos horas por chaqueta, con corte y plancha. Una fábrica premium tarda hasta tres solo en coserla. No cabía, y su cotitular lo admitió: subcontrataba.

### [0:30–0:43] El problema · Orador 1

> Loro Piana auditaba, pero, según la Fiscalía, sin medir la capacidad. En abril de 2026 salió cortando, dice la empresa, con más de cien proveedores. ¿Y la gente de esos talleres?

*Un segundo de pausa.*

### [0:43–1:13] La solución · Orador 2

> Somos Trama: hacemos esa cuenta cada mes, en toda la cadena. Las horas que piden tus pedidos, con los minutos de tu escandallo, frente a las horas de alta del taller, con la jornada de cada contrato. Lo saca su gestoría de la Seguridad Social; solo nos llega el total. Inflarlo exige cotizar por gente que no trabaja allí, y dar de alta a media jornada a quien hace la completa no tapa el hueco.

### [1:13–2:01] Demo (48 s) · habla Orador 2 · clica Orador 1

> Lo simulado: marca, talleres y cifras son inventados; el caso Milán usa datos de prensa anonimizados y minutos estimados por nosotros.

**Clic 1** · «1 · Caso Milán 2025» (en pantalla también sale el proveedor A, sin taller propio: rojo desde el primer pedido)

> Subproveedor B, con 180 minutos por chaqueta: casi una vez y media sus horas, rojo.

**Clic 2** · «2 · Taller con 4 marcas»

> Taller con cuatro marcas, todas en Trama: cada una, sola, en verde; Trama suma como tercero: rojo. Cada una solo ve su semáforo y «revisión abierta»; nunca los pedidos de otra.

**Clic 3** · Ctrl+Tab a la pestaña 2, la alerta del taller T1

> La alerta dice qué comprobar —nóminas, visita sin avisar, entrevistas confidenciales— y decide una persona.

**Qué se clica, según lo que funcione:**

| | Ruta A · `/escenas` (la buena) | Ruta B · simulador | Plan C · sin app |
|---|---|---|---|
| Preparar | Pestaña 1: `http://localhost:3000/escenas`. Pestaña 2: `http://localhost:3000/taller/T1` (sin `?demo=1`), con «Por qué salta» y «Qué comprobaría una persona» a la vista. | Pestaña 1: `/taller/T1#simulador`. Pestaña 2: igual que en A. | `demo-backup/1280x720/`: capturas 15, 16 y 04, en ese orden. |
| Clic 1 | «1 · Caso Milán 2025» (ya está a la vista: el clic se puede omitir). Proveedor A: ∞, rojo. Subproveedor B: 1,47×, rojo. | «Caso reconstruido con datos públicos»: 180 min → 1,5×, rojo. Decir «El subproveedor» en vez de «Subproveedor B». | Captura 15. |
| Clic 2 | «2 · Taller con 4 marcas»: cuatro verdes (0,40 · 0,35 · 0,30 · 0,25), suma 1,30× «Revisar»; Ordessa solo ve su verde y «Revisión abierta». | «Taller de la demo» → **700** en «Chaquetas en el trimestre» (verde) → «Parte de la facturación del taller que es de Ordessa» al **20 %**. Decir: «Con sus pedidos, verde. Pero es el 20 % de la facturación del taller: Trama estima la carga total: no cabe, y abre una revisión, sin ver los pedidos de nadie más». | Captura 16. |
| Clic 3 | Ctrl+Tab a la pestaña 2. | Igual. | Captura 04. |

Si preguntan de dónde salen los datos: botón «3 · Documentos» (plantilla media, escandallo y modelo 347, marcados SIMULADO).

### [2:01–2:35] Si sale rojo · Orador 3

> Un rojo abre un plan de corrección: una cláusula que la marca firma al contratar Trama. La corrección la paga la marca aparte, a un revisor independiente con tarifa fija; estimamos de mil a tres mil euros por alerta. Subir el precio por pieza lo decide compras. El taller no pierde al cliente de golpe: si la marca se va, con plan y preaviso. Medimos cuánta gente sigue de alta a los seis meses, y si el hueco se cerró con altas o quitando pedidos.

### [2:35–2:55] Lo que no hacemos, y por qué ya · Orador 3

> No detectamos trabajo forzoso ni damos sellos: medimos un riesgo de capacidad y documentamos que la marca vigiló. En España, la Inspección afloró en 2025 más de 120.000 empleos irregulares, y en 2027 la UE prohibirá los productos con trabajo forzoso; sus guías citan pedidos frente a capacidad de la fábrica.

### [2:55–3:24] Negocio · Orador 4

> Paga la marca y decide cumplimiento: 60 euros por taller y mes, más el informe del gestor, a coste. Con 30 talleres, 21.600 euros al año; margen bruto del 80 %, por validar. En España, unas 6.000 empresas de confección, piel y calzado con plantilla: contadas una vez, 4,4 millones al año de techo. Italia, después. Sedex y amfori auditan, TrusTrace traza materiales; ninguno, que sepamos, cruza cada mes pedidos con horas de alta.

### [3:24–3:38] Lo que hemos validado, y lo que no · Orador 4

**Llamada · versión B** (por defecto):

> Lo que falta: aún no hemos hablado con talleres ni gestorías; el lunes llamamos a veinte contactos comprobados.

**Llamada · versión A** (solo con una respuesta real, apuntada y con permiso): «Esta mañana hemos hablado con [RELLENAR: tipo y zona, por ejemplo «una gestoría laboral de Igualada»]. Nos ha confirmado que [RELLENAR: un solo dato, con su número y su condición]. Y nos ha dicho algo que no esperábamos: “[RELLENAR: frase literal, máximo 20 palabras]”.» Si no fue un sí claro, cambiar «Nos ha confirmado que» por «Nos ha dicho que cree que». Si fue por escrito o anoche, decirlo así.

**Marcas · versión B** (se escribió y nadie ha contestado):

> Y anoche escribimos a [RELLENAR: N] marcas que fabrican en España; aún no ha contestado ninguna.

**Marcas · versión A**: «Anoche escribimos a [RELLENAR: N] marcas que fabrican en España. [RELLENAR: M] han contestado: [RELLENAR: lo que dijeron de verdad, también si es un no].» Si no se escribió a ninguna marca (`MARCAS.md` dice que a las 01:40 no se había enviado nada), esta frase no se dice.

### [3:38–3:51] Equipo y petición · Orador 4

> Somos [RELLENAR: nombre 1], [nombre 2], [nombre 3] y [nombre 4], estudiantes de la UC3M: Derecho laboral, Informática, ADE y Diseño. Pedimos una carta de intención para un piloto gratuito de tres meses con 5 a 10 talleres.

*[confirmar] estudios y roles. Si hay un asesor real, añadir «y nos asesora [nombre, cargo]»; si no lo hay, nada.*

### [3:51–4:00] Cierre · Orador 1

> Queremos que la próxima vez no haga falta cortar con nadie. Trama: ver a tiempo, corregir antes de cortar.

---

## Si vamos tarde (se corta en este orden)
1. Negocio: «Sedex y amfori auditan, TrusTrace traza materiales; ninguno, que sepamos, cruza cada mes pedidos con horas de alta» (pasa a la pregunta 3).
2. Por qué ya: «; sus guías citan pedidos frente a capacidad de la fábrica» (se queda «y en 2027 la UE prohibirá los productos con trabajo forzoso»).

**No se corta nunca:** la frase de lo simulado, la jornada de cada contrato, la cláusula, quién paga la corrección, lo que gana el taller, lo que nos falta y la petición.

## Recuento de palabras

| Bloque | Palabras | Segundos | Ritmo (palabras/min) |
|---|---|---|---|
| [0:00–0:30] El caso, con números | 74 | 30 | 148 |
| [0:30–0:43] El problema | 31 | 13 | 143 |
| [0:43–1:13] La solución | 75 | 30 | 150 |
| [1:13–2:01] Demo | 82 | 48 | 103 (deja tiempo a los clics) |
| [2:01–2:35] Si sale rojo | 85 | 34 | 150 |
| [2:35–2:55] Lo que no hacemos, y por qué ya | 51 | 20 | 153 |
| [2:55–3:24] Negocio | 73 | 29 | 151 |
| [3:24–3:38] Validación (versión B de llamada y marcas) | 33 | 14 | 141 |
| [3:38–3:51] Equipo y petición | 33 | 13 | 152 |
| [3:51–4:00] Cierre | 19 | 9 | 127 |
| **Total** | **556** | **240** | **≈ 139** |

Método: cuenta automática de las líneas «>», con la versión B en llamada y marcas; cada hueco [..] cuenta como una palabra y no cuentan los signos sueltos (—, %). Si no se escribió a ninguna marca, son 541. **Con la versión A de la llamada (unas 25-30 palabras más) hay que cortar los puntos 1 y 2 de «Si vamos tarde» (−27)** para seguir por debajo de 560. Ensayar dos veces con cronómetro: si pasa de 4:00, cortar en ese orden.

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
| Los minutos salen del escandallo de la marca | Supuesto de diseño (`problemas/i_piloto.md`: la marca entrega minutos y precio por pieza de su escandallo) | ⚠ por validar: en calzado a veces solo los tiene el fabricante |
| Horas de alta con la jornada de cada contrato; la gestoría lo saca de la Seguridad Social | Informe de Plantilla Media de Trabajadores en Alta (TGSS, Sistema RED), que pondera «la jornada contratada en relación con la jornada completa»: [Noticias RED 2011/13](https://www.seg-social.es/descarga/es/160888), [RDLeg 4/2004, DA 12.ª](https://www.boe.es/buscar/act.php?id=BOE-A-2004-4456) | ✅ por remisión normativa / ⚠ ver un informe real; que el gestor lo saque cada mes y cuánto cobra, por validar |
| Inflarlo exige cotizar por gente que no trabaja allí; la media jornada de quien hace la completa no tapa el hueco | `investigacion/fuentes_horas.md` §8 (más altas o más jornada = más cotización) y la ponderación anterior: media jornada cuenta como 0,5 | ⚠ razonamiento propio |
| Demo: 180 min → casi 1,5 veces | 6.000 × 180 / 60 = 18.000 h ÷ 12.250 h = 1,47 (rojo > 1,10; rojo a partir de ≈ 135 min). En el simulador: 1.500 chaquetas/trimestre y 3.066 h | ✅ cálculo; los 180 min son estimación |
| Cuatro marcas, todas en Trama; cada una solo ve su semáforo y «revisión abierta» | Escena ficticia (0,40 · 0,35 · 0,30 · 0,25 → 1,30). Diseño: mínimo de 3 marcas, mismo aviso sea cual sea la causa ([Directrices horizontales](https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:52023XC0721(01)) §§391, 407-408; `problemas/b_varias_marcas.md`) | diseño |
| De mil a tres mil euros por alerta | Estimación: 2-3 jornadas de revisor a 500-1.000 €; referencias por jornada: [SA8000](https://sa-intl.org/resources/sa8000-certification-costs/) 400-1.500 USD, [SMETA](https://www.eurocert.asia/?p=842) 560-990 USD (tarifas de Asia) | ⚠ por validar; Trama no cobra margen |
| El taller no pierde al cliente de golpe: salida con plan y preaviso | Cláusula propuesta. Base: [Ley de Competencia Desleal, art. 16.3.a](https://www.boe.es/buscar/act.php?id=BOE-A-1991-628) (romper con un proveedor dependiente sin 6 meses de preaviso escrito es desleal) | ✅ ley / cláusula sin probar |
| Cuánta gente sigue de alta a los seis meses; altas frente a pedidos retirados | Métricas de impacto sobre las personas de la línea base (`problemas/metricas_impacto.md`, `HOJA_DATOS.md`) | diseño |
| No detectamos trabajo forzoso | [OIT, indicadores 2025](https://www.ilo.org/sites/default/files/2025-11/ILO%20Indicators%20of%20Forced%20Labour%202025.pdf): ningún indicador aislado lo confirma | ✅ |
| En 2025, la Inspección afloró en España más de 120.000 empleos irregulares | Memoria ITSS 2025: 131.645 ([Europa Press vía El Derecho, 7-10-2026](https://elderecho.com/la-inspeccion-de-trabajo-propuso-multas-por-valor-de-858-millones-en-2025-y-afloro-un-68-mas-de-empleos)); balance de marzo: 122.146 ([Bolsamanía](https://www.bolsamania.com/noticias/economia/economia--la-inspeccion-de-trabajo-afloro-mas-de-122000-empleos-en-2025-y-recupero-51-millones-de-euros-en-salarios--22024440.html)) | ✅ prensa / ⚠ PDF oficial sin abrir; todos los sectores, sin desglose textil |
| En 2027 la UE prohibirá los productos con trabajo forzoso; sus guías citan los pedidos frente a la capacidad de la fábrica | [Reglamento (UE) 2024/3015](https://eur-lex.europa.eu/eli/reg/2024/3015/oj/spa), aplicable desde el 14-12-2027. Directrices de la Comisión (DO C 3-9-2026, §4.7.3.5): entre lo que puede pedir la autoridad, órdenes de producción e informes de capacidad (`investigacion/encaje_legal.md`, fuente [4]) | ✅ / las directrices no son vinculantes y el Reglamento no obliga a usar ninguna herramienta |
| 60 € por taller y mes + informe a coste; con 30 talleres, 21.600 €/año; margen bruto del 80 % | `problemas/h_precio_mercado.md`: 30 × 60 × 12; coste de servir ≈ 12 €/taller/mes → 80 % de la cuota, a escala (≈ 400 talleres por analista) | ⚠ supuestos por validar |
| Unas 6.000 empresas de confección, piel y calzado con plantilla: 4,4 M€ de techo | [INE, DIRCE a 1-1-2025, tabla 73019](https://www.ine.es/jaxiT3/Tabla.htm?t=73019): 6.083 empresas con 1-49 asalariados × 720 € = 4,38 M€, cada una contada una vez | ✅ dato / ⚠ no sabemos cuántas trabajan para marcas |
| Italia, después | 4.223 empresas de marroquinería ([Assopellettieri, 1T-2026](https://www.gonews.it/wp-content/uploads/2026/07/Nota-Assopellettieri_Primo-Trimestre-2026.pdf)) → 3,0 M€/año | ✅ |
| Sedex y amfori auditan, TrusTrace traza; ninguno, que sepamos, cruza cada mes pedidos con horas de alta | `problemas/competencia.md` («No» = no encontramos evidencia) | ✅ con «que sepamos» |
| Veinte contactos comprobados | `LLAMADAS.md` §1 (comprobados el 7-nov en sus webs oficiales) | ✅ |

**Lo que ya no se dice en voz alta** (está en `PREGUNTAS.md`): el art. 42 ET (si alcanza a la confección está abierto), la lista de marcas de Milán y «rojo aunque bajes a 135».
