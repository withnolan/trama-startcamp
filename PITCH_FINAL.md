# PITCH FINAL · Trama · 4:00 + 2:00 de preguntas

Start Camp UC3M · domingo 8-nov-2026, 17:45-20:00 · versión 1 (mentor de Pitch). Preguntas en `PREGUNTAS.md`; cifras y supuestos en `HOJA_DATOS.md`.

**Cómo leer este archivo.** Lo que se dice en voz alta va en las líneas que empiezan por «>». El resto son instrucciones. [RELLENAR] es un hueco que solo se llena con algo real; si no hay nada real, se dice la versión B. Recuento al final: **≤ 560 palabras**.

**Antes de las 17:30 hay que decidir tres cosas** (reglas en `LLAMADAS.md` §4, «Decisión rápida»):
1. **Llamada** ([3:23]): versión A solo con un dato real, apuntado y con permiso para citarlo. Si no, versión B.
2. **Marcas** ([3:23]): versión A si alguna marca ha contestado (un «no» también cuenta); versión B si se les escribió y nadie ha contestado; si no se escribió a ninguna, no se dice nada de marcas.
3. **Equipo** ([3:38]): nombres y estudios reales. «Derecho laboral, Informática, ADE y Diseño» viene del v5 y está **[confirmar]**.

**Reparto propuesto [confirmar]:** Orador 1 abre, cierra y maneja el portátil durante la demo · Orador 2 cuenta la solución y pone voz a la demo · Orador 3 explica qué pasa tras un rojo y la parte legal · Orador 4 negocio, validación y petición.

---

## Guion

### [0:00–0:30] El caso, con números · Orador 1
*Pantalla: el titular y las fuentes (Il Giorno 14-7-2025 · Il Post 15-7-2025 · Startmag 28-7-2025 · Milano Finanza 17-4-2026).*

> Julio de 2025: el Tribunal de Milán pone a Loro Piana bajo administración judicial por no comprobar la capacidad real de quien le fabricaba. Hicimos la cuenta. Su proveedor directo no tenía taller. Las chaquetas las entregaba un subproveedor con siete trabajadores: unas 6.000 al año. A jornada completa: dos horas por chaqueta, con corte y plancha. Una fábrica premium tarda hasta tres solo en coserla. No cabía, y su cotitular lo admitió: subcontrataba.

### [0:30–0:47] El problema · Orador 1

> Antes pasó con Alviero Martini, Armani, Dior y Valentino. Loro Piana auditaba, pero, según la Fiscalía, sin medir la capacidad. En abril de 2026 salió cortando, dice la empresa, con más de cien proveedores. ¿Y la gente de esos talleres?

*Un segundo de pausa.*

### [0:47–1:12] La solución · Orador 2

> Somos Trama: hacemos esa cuenta cada mes, en toda la cadena. Las horas que piden tus pedidos frente a las horas de alta del taller: su plantilla en la Seguridad Social por la jornada de convenio. Lo saca su gestoría, que solo nos manda el total. Para falsearlo, habría que dar de alta a gente que no trabaja allí y pagar sus cotizaciones.

### [1:12–2:02] Demo (50 s) · habla Orador 2 · clica Orador 1

> Antes, lo simulado: marca, talleres y cifras son inventados; el caso Milán usa datos de prensa anonimizados y minutos estimados por nosotros.

**Clic 1** · «Caso Milán 2025 (datos públicos)» (en pantalla también sale el proveedor A, sin taller: capacidad 0, rojo)

> Subproveedor B, con 180 minutos por chaqueta: casi una vez y media sus horas, rojo. Y rojo aunque bajes a 135.

**Clic 2** · «Taller con 4 marcas»

> Taller con cuatro marcas: cada una, sola, en verde; Trama suma como tercero: rojo. Cada marca solo ve su semáforo y «revisión abierta», nunca los pedidos de otra.

**Clic 3** · pestaña 2, la alerta del taller T1

> La alerta dice qué comprobar —nóminas, visita sin avisar, entrevistas confidenciales— y decide una persona.

**Qué se clica, según lo que funcione** (nombres de `/escenas` por comprobar cuando Producto la termine):

| | Ruta A · `/escenas` | Ruta B · simulador actual | Plan C · sin app |
|---|---|---|---|
| Preparar | Pestaña 1: `http://localhost:3000/escenas`. Pestaña 2: `http://localhost:3000/taller/T1` (sin `?demo=1`), con «Por qué salta» y «Qué comprobaría una persona» a la vista. | Pestaña 1: `/taller/T1#simulador` con «Caso reconstruido con datos públicos» ya pulsado. Pestaña 2: igual que en A. | `demo-backup/1280x720/`: capturas 07, 06 y 04, en ese orden. |
| Clic 1 | «Caso Milán 2025 (datos públicos)»: A en rojo (capacidad 0), B en rojo (≈ 1,47). | Escribir **180** en «Minutos por chaqueta»: 4.500 h necesarias · 3.066 h de alta · 1,5× (rojo). Decir «El subproveedor» en vez de «Subproveedor B». | Captura 07. Sale con 240 min y 2,0×: decir «con 240 minutos, el doble; con 180, casi una vez y media». |
| Clic 2 | «Taller con 4 marcas»: verde por marca, rojo al sumar, cada marca ve «revisión abierta». | «Taller de la demo» → **700** en «Chaquetas en el trimestre» (verde) → «Parte de la facturación del taller que es de Ordessa» al **20 %** (rojo). Decir: «Con sus pedidos, verde. Pero es el 20 % de la facturación del taller: Trama estima la carga total y sale rojo, sin ver los pedidos de nadie más». | Captura 06 y contarlo con palabras. |
| Clic 3 | Ctrl+Tab a la pestaña 2. | Igual. | Captura 04. |

### [2:02–2:36] Si sale rojo · Orador 3

> Un rojo no castiga: abre un plan de corrección, una cláusula que la marca firma al contratar Trama. La corrección la paga la marca, aparte de la cuota: un revisor independiente con tarifa fija; estimamos de mil a tres mil euros por alerta. Si hay que subir el precio por pieza, lo decide compras. Si la marca se va, con plan y preaviso. Medimos cuánta gente sigue de alta a los seis meses, y si el hueco se cerró con altas o quitando pedidos.

### [2:36–2:54] Lo que no hacemos, y por qué ya · Orador 3

> No detectamos trabajo forzoso ni damos sellos: medimos un riesgo de capacidad y documentamos que la marca vigiló. En España, quien subcontrata su propia actividad responde de las cotizaciones que deba su contrata; si alcanza a la confección, lo comprobaremos con un laboralista.

### [2:54–3:23] Negocio · Orador 4

> Paga la marca y decide cumplimiento: 60 euros por taller y mes, más el informe de la gestoría a coste. Con 30 talleres, 21.600 euros al año; margen bruto del 80 %, por validar. En España, contando cada taller una vez, solo las 2.131 fábricas de calzado son 1,5 millones al año. Italia, después. Sedex y amfori auditan, TrusTrace traza materiales; ninguno, que sepamos, suma cada mes la carga de un taller.

### [3:23–3:38] Lo que hemos validado, y lo que no · Orador 4

**Llamada · versión B** (por defecto):

> Lo que nos falta: aún no hemos hablado con ningún taller ni gestoría; el lunes llamamos a veinte contactos ya comprobados.

**Llamada · versión A** (solo con una respuesta real, apuntada y con permiso): «Esta mañana hemos hablado con [RELLENAR: tipo y zona, por ejemplo «una gestoría laboral de Igualada»]. Nos ha confirmado que [RELLENAR: un solo dato, con su número y su condición]. Y nos ha dicho algo que no esperábamos: “[RELLENAR: frase literal, máximo 20 palabras]”.» Si no fue un sí claro, cambiar «Nos ha confirmado que» por «Nos ha dicho que cree que». Si fue por escrito o anoche, decirlo así.

**Marcas · versión B** (se escribió y nadie ha contestado):

> Y anoche escribimos a [RELLENAR: N] marcas que fabrican en España; aún no ha contestado ninguna.

**Marcas · versión A**: «Anoche escribimos a [RELLENAR: N] marcas que fabrican en España. [RELLENAR: M] han contestado: [RELLENAR: lo que dijeron de verdad, también si es un no].» Si no se escribió a ninguna marca, esta frase no se dice.

### [3:38–3:51] Equipo y petición · Orador 4

> Somos [RELLENAR: nombre 1], [nombre 2], [nombre 3] y [nombre 4], estudiantes de la UC3M: Derecho laboral, Informática, ADE y Diseño. Pedimos una carta de intención para un piloto gratuito de tres meses con 5 a 10 talleres.

*[confirmar] estudios y roles. Si hay un asesor real, añadir «y nos asesora [nombre, cargo]»; si no lo hay, nada.*

### [3:51–4:00] Cierre · Orador 1

> Queremos que la próxima vez no haga falta cortar con nadie. Trama: ver a tiempo, corregir antes de cortar.

---

## Si vamos tarde (se corta en este orden)
1. Negocio: la frase de Sedex, amfori y TrusTrace (pasa a preguntas).
2. Demo: «Y rojo aunque bajes a 135».

**No se corta nunca:** la frase de lo simulado, la cláusula, quién paga la corrección, lo que nos falta y la petición.

## Recuento de palabras

| Bloque | Palabras | Segundos | Ritmo (palabras/min) |
|---|---|---|---|
| [0:00–0:30] El caso, con números | 74 | 30 | 148 |
| [0:30–0:47] El problema | 40 | 17 | 141 |
| [0:47–1:12] La solución | 63 | 25 | 151 |
| [1:12–2:02] Demo | 86 | 50 | 103 (deja tiempo a los clics) |
| [2:02–2:36] Si sale rojo | 84 | 34 | 148 |
| [2:36–2:54] Lo que no hacemos, y por qué ya | 43 | 18 | 143 |
| [2:54–3:23] Negocio | 71 | 29 | 147 |
| [3:23–3:38] Validación (versión B de llamada y marcas) | 36 | 15 | 144 |
| [3:38–3:51] Equipo y petición | 33 | 13 | 152 |
| [3:51–4:00] Cierre | 19 | 9 | 127 |
| **Total** | **549** | **240** | **≈ 137** |

Método: cuenta automática de las líneas «>», con la versión B en llamada y marcas; cada hueco [..] cuenta como una palabra y no cuentan los signos sueltos (—, %). **Con la versión A de la llamada (unas 25-30 palabras más) hay que cortar los puntos 1 y 2 de «Si vamos tarde» (−24)** para seguir por debajo de 560. Ensayar dos veces con cronómetro: si pasa de 4:00, cortar en ese orden.

## Afirmación → fuente (cada cifra o hecho que se dice)

| Lo que se dice | Fuente | Estado |
|---|---|---|
| Julio de 2025: Loro Piana, bajo administración judicial por no comprobar la capacidad real de quien le fabricaba | [Il Giorno, 14-7-2025](https://www.ilgiorno.it/milano/cronaca/loro-piana-sfruttamento-lavoro-xebye3v7) · [Il Post, 15-7-2025](https://www.ilpost.it/2025/07/15/loro-piana-sfruttamento-caporalato-aziende-lusso/) | ✅ Medida preventiva (art. 34 d.lgs. 159/2011), no multa |
| El proveedor directo no tenía taller | Datos del usuario (Il Post, Startmag, L'Espresso). Il Giorno habla de «siete operarias y casi ninguna máquina» en el proveedor directo | ✅ / ⚠ la prensa no coincide |
| Un subproveedor con siete trabajadores y unas 6.000 chaquetas al año (6.000-7.000, según su cotitular), que admitió subcontratar | [Startmag, 28-7-2025](https://www.startmag.it/economia/che-cosa-ha-combinato-loro-piana/) | ✅ Sin nombrar la empresa: la atribución de los 7 varía |
| Dos horas por chaqueta | Cálculo propio: 7 × ≈ 1.750 h/año = 12.250 h ÷ 6.000 = 2,04 h. Jornada anual de convenio: textil 1.789 h ([BOE-A-2025-20177](https://www.boe.es/boe/dias/2025/10/09/pdfs/BOE-A-2025-20177.pdf)), marroquinería 1.768 h ([BOE-A-2024-6193](https://www.boe.es/boe/dias/2024/03/27/pdfs/BOE-A-2024-6193.pdf)) | ✅ cálculo |
| Una fábrica premium tarda hasta tres horas solo en coserla | [Création Gross, FashionUnited 2021](https://fashionunited.uk/press/fashion/creation-gross-fashion-made-in-germany/2021111559279): hasta 180 min de costura por chaqueta | ✅ declaración comercial. Sin dato de cachemir |
| Antes: Alviero Martini, Armani, Dior y Valentino | `investigacion/hechos_legales.md` §1.a; [Il Post, 14-7-2025](https://www.ilpost.it/2025/07/14/loro-piana-amministrazione-giudiziaria/) | ✅ (filiales: Giorgio Armani Operations, Manufactures Dior, Valentino Bags Lab) |
| Loro Piana auditaba; según la Fiscalía, sus controles no medían la capacidad | [Il Post, 15-7-2025](https://www.ilpost.it/2025/07/15/loro-piana-sfruttamento-caporalato-aziende-lusso/) («più formali che sostanziali») | ✅ |
| Abril de 2026; más de cien proveedores cortados | [Milano Finanza, 17-4-2026](https://www.milanofinanza.it/fashion/loro-piana-si-conclude-in-anticipo-il-procedimento-di-amministrazione-giudiziaria-202604171313344253) | ✅ cifra **de la empresa** |
| Horas de alta = plantilla en la Seguridad Social × jornada de convenio; la gestoría saca el informe | Informe de Plantilla Media de Trabajadores en Alta (TGSS, Sistema RED): [Noticias RED 2011/13](https://www.seg-social.es/descarga/es/160888), [Orden ESS/484/2013, art. 9](https://www.boe.es/buscar/act.php?id=BOE-A-2013-3362) | ✅ fuente / ⚠ por validar con un gestor: que lo saque cada mes y cuánto cobra |
| Para falsearlo, habría que dar de alta a gente que no trabaja allí y pagar sus cotizaciones | `investigacion/fuentes_horas.md` §8: inflar la capacidad en alta exige más altas o más jornada, es decir, más cotización | ⚠ razonamiento propio |
| Demo: 180 min → casi 1,5 veces; rojo aunque bajes a 135 min | Cálculo: 6.000 × 180 / 60 = 18.000 h ÷ 12.250 h = 1,47. Rojo > 1,10 → 1,10 × 12.250 = 13.475 h → 134,75 min. En la app: 1.500 chaquetas/trimestre y 7 × 146 h × 3 = 3.066 h | ✅ cálculo; los 180 min son estimación |
| Cada marca solo ve su semáforo y «revisión abierta» | Diseño; [Directrices horizontales](https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:52023XC0721(01)) §§391, 407-408; mínimo de 3 marcas para sumar (`investigacion/encaje_legal.md`) | diseño |
| Unos mil a tres mil euros por alerta | Estimación propia: 2-3 jornadas de revisor a 500-1.000 €. Referencias por jornada: [SA8000](https://sa-intl.org/resources/sa8000-certification-costs/) 400-1.500 USD; [SMETA](https://www.eurocert.asia/?p=842) 560-990 USD (tarifas de Asia) | ⚠ por validar |
| Si se va, con plan y preaviso | Cláusula propuesta. Base: [Ley de Competencia Desleal, art. 16.3.a](https://www.boe.es/buscar/act.php?id=BOE-A-1991-628): romper con un proveedor dependiente sin 6 meses de preaviso escrito es desleal | ✅ ley / cláusula sin probar |
| Plantilla de alta a los seis meses; altas frente a pedidos retirados | Métrica de impacto (`HOJA_DATOS.md`) | diseño |
| No detectamos trabajo forzoso | [OIT, indicadores 2025](https://www.ilo.org/sites/default/files/2025-11/ILO%20Indicators%20of%20Forced%20Labour%202025.pdf): ningún indicador aislado lo confirma | ✅ |
| En España, quien subcontrata su propia actividad responde de las cotizaciones de su contrata | [Estatuto de los Trabajadores, art. 42](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430) | ✅ ley / ❓ si alcanza a un encargo de confección: [Abierto] |
| 60 € por taller y mes + informe a coste; con 30 talleres, 21.600 €/año; margen del 80 % | `investigacion/mercado_competencia.md` §2.2: 30 × 60 × 12 = 21.600; coste variable ≈ 12 €/taller/mes → (60 − 12) / 60 = 80 % | ⚠ supuestos por validar |
| 2.131 fábricas de calzado en España | DIRCE 2025 vía AEC ([FashionUnited, jun-2026](https://fashionunited.es/noticias/empresas/la-industria-espanola-del-calzado-pierde-mas-de-1-100-empresas-desde-2020-aec-reclama-un-plan-de-accion-urgente/2026061849741)) | ✅ |
| 1,5 millones al año | 2.131 × 60 € × 12 = 1.534.320 €, cada taller contado una vez | ✅ cálculo con precio por validar |
| Italia, después | 4.223 empresas de marroquinería ([Assopellettieri, 1T-2026](https://www.gonews.it/wp-content/uploads/2026/07/Nota-Assopellettieri_Primo-Trimestre-2026.pdf)) → 3,0 M€/año al mismo precio | ✅ |
| Sedex y amfori auditan, TrusTrace traza; ninguno, que sepamos, suma la carga de un taller | `investigacion/mercado_competencia.md` §3.3 y §3.5 («No» = no encontramos evidencia) | ✅ con «que sepamos» |
| Veinte contactos comprobados en Ubrique, Elche, Igualada y Mataró | `LLAMADAS.md` §1 (comprobados el 7-nov en sus webs oficiales) | ✅ |
