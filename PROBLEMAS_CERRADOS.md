# PROBLEMAS CERRADOS — críticas del jurado y cómo se cierran

Índice generado a partir de `problemas/*.md` (el detalle, las fuentes y los cálculos están en cada archivo). Formato de cada punto: **decisión** · **respuesta de 25 s** · **qué sigue abierto**. Lo que no se puede cerrar esta noche se dice.

| Crítica | Dónde se cierra |
|---|---|
| **J1 Profesora** — no se ha probado nada; no declarado ≠ forzoso | d · i (piloto) · `LLAMADAS.md` |
| **J2 Inversor** — precio, mercado, validación; «horas cotizadas» no es un documento estándar | h · a · i |
| **J3 Mentor** — taller con varias marcas; gestor pagado por el taller; demo que calcule; equipo; venta lenta | b · c · demo (`/escenas`, simulador) · h §5 · j (equipo: diapositiva con huecos en `PRESENTACION_LOVABLE.md`) |
| **J4 Impacto** — verde como coartada; rojo para abandonar; tercero que verifique | e · f · b · métricas |
| **J5 Innovación corporativa** — varias marcas; certificado complaciente; competencia; piloto 3 meses 5-10 talleres; RGPD y cláusula | b · c · g · i · f |

## a) De dónde salen las horas
*Críticas: J2, J3 · detalle: [`problemas/a_fuentes_horas.md`](problemas/a_fuentes_horas.md)*

**Decisión.** 1. **España, cada mes.** Se usa el *Informe de Plantilla Media de Trabajadores en Alta* de la TGSS: agregado, por código de cuenta de cotización (CCC) y por periodo, y ya pondera la jornada parcial. Lo descarga del Sistema RED el gestor del taller (autorizado RED) y lo envía tal cual.
   **Horas de alta = plantilla media × jornada anual del convenio ÷ 12.** Confección: 1.789 h → 149 h/mes. Marroquinería: 1.768 h → 147 h/mes.
2. **El ITA (la lista nominal) solo se usa tras una alerta.** Lo mira el revisor en la gestoría y no sale de allí.
3. **Registro de jornada: hoy no es una fuente.** El actual lo guarda la empresa en formato libre. El registro digital sigue sin aprobarse y, aunque se aprobara, no da acceso a terceros.
4. **Italia.** Las horas reales salen del LUL mensual (horas por persona y día). El DURC prueba que el taller está al corriente de cotizaciones, pero no da horas. La Asse.Co es anual: sirve como control de regularidad, no como fuente de horas.
5. **Nombre: se mantiene «horas de alta»** en la app y en el pitch. No se cambia a «capacidad en alta». Se arregla otra cosa: **el documento deja de llamarse «informe de horas de alta»**, porque ese documento no existe (la crítica J2 de nuevo). Pasa a ser «informe mensual de plantilla» (España: plantilla media de la Seguridad Social; Italia: LUL).

**Respuesta de 25 s.** > «Tiene razón: en España se cotiza por base, no por horas. Por eso no pedimos horas a nadie. El gestor descarga de la Seguridad Social la plantilla media en alta del taller, que ya tiene en cuenta la jornada parcial. La multiplicamos por la jornada del convenio: es capacidad, no horas fichadas. La lista con nombres solo la mira el revisor, en la gestoría, tras una alerta.»

**Qué sigue abierto.** - Ver un informe de plantilla media real y comprobar que pondera la parcialidad.
- Cuánto cobra la gestoría por emitirlo cada mes.
- Los convenios de Ubrique, Cataluña, Valencia y el del calzado.
- **Personal que no cose.** Oficina o tienda en el mismo CCC inflan la capacidad: hay que pedir el CCC del centro de producción.
- **Italia.** El cálculo exige un firmante «vía Asse.Co», así que un taller sin Asse.Co queda «sin datos». Es una regla exigente que conviene revisar después del piloto.

## b) Taller que trabaja para varias marcas, sin cruzar datos entre ellas
*Críticas: J3, J4, J5 · detalle: [`problemas/b_varias_marcas.md`](problemas/b_varias_marcas.md)*

**Decisión.** **En una frase:** para la parte de la marca usamos sus propios pedidos; para el resto del taller, su facturación. Si no cabe, se abre una revisión, sin ver nunca los datos de otra marca.

**Respuesta de 25 s.** **«¿Y si el taller trabaja para cinco marcas?»** (67 palabras)
> «Para tu parte usamos tus pedidos; para el resto, la facturación del taller. Si tus pedidos llenan media plantilla y eres el 20 % de lo que factura, para que todo quepa las demás marcas tendrían que pagarle cuatro veces más por hora que tú. No vemos sus datos y no es una prueba: abre una revisión. Si tus pedidos solos ya no caben, es rojo directo.»

**Qué sigue abierto.** - Cuánto se parecen de verdad los precios por hora entre marcas, y cuántos talleres trabajan a façon frente a paquete completo: **NO SÉ** (preguntarlo en las llamadas).
- La regla de las 3 marcas es un criterio de diseño, no una cifra legal. Lo tiene que revisar un abogado de competencia.
- El papel de Trama en la suma conjunta (responsable o encargado del taller): decidirlo con un DPD.
- Que el 347 excluye las intracomunitarias y las exportaciones lo dicen fuentes secundarias: comprobarlo en las instrucciones oficiales.
- Que el 347 sirva para detectar subcontratas: lo tiene que confirmar un asesor fiscal.

## c) Integridad de los dos datos: horas (fuente TGSS) y minutos por pieza
*Críticas: J3, J5 · detalle: [`problemas/c_informe_complaciente.md`](problemas/c_informe_complaciente.md)*

**Decisión.** **1. Horas: el dato lo emite la Tesorería, no lo firma nadie.**
- **Fuente mensual en España.** El *Informe de Plantilla Media de Trabajadores en Alta* de la TGSS, que el gestor del taller (autorizado RED) descarga del Sistema RED y envía tal cual, con su huella.
- **Trama no acepta cifras tecleadas ni certificados redactados por el gestor.** El gestor no certifica nada, así que no tiene nada que «complacer».
- **Tras una alerta,** el revisor coteja en la gestoría la lista nominal (ITA o vida laboral del código de cuenta de cotización). Los nombres no salen de allí.

**Respuesta de 25 s.** **«¿Y si el gestor firma lo que le pide el taller?»** (69 palabras)
> «No le pedimos a nadie que firme horas. El dato es un informe de la Tesorería de la Seguridad Social que el gestor descarga y nos envía sin tocar. Para inflarlo, el taller tendría que dar de alta a gente que no trabaja allí y pagar sus cotizaciones. Y tras una alerta, el revisor, pagado por la marca, coteja la lista nominal en la gestoría y visita sin avisar.»

**Qué sigue abierto.** - Ver un informe de plantilla media real. Comprobar que pondera la parcialidad (prueba: una persona al 50 % todo el mes debe dar 0,50) y si un tercero puede verificar su huella.
- Coste real para la gestoría: no hay tarifa publicada; validarlo con 2-3 gestorías (`LLAMADAS.md`).
- Si la consulta de alta del art. 16.6 LGSS funciona con autorización voluntaria cuando el encargo no es de la «propia actividad».
- **El suelo de minutos solo existe para la americana forrada.** No tenemos referencia de cachemir, de chaqueta de mujer ni de bolsos y cinturones: esas piezas quedan «sin contrastar» hasta tener una fuente.
- Italia: el LUL no tiene verificación pública. La integridad allí depende del consulente y de la Asse.Co.

## d) Trabajo no declarado ≠ trabajo forzoso, y por qué pagaría una marca española ya
*Críticas: J1, J2 · detalle: [`problemas/d_no_declarado_vs_forzoso.md`](problemas/d_no_declarado_vs_forzoso.md)*

**Decisión.** 1. **Trama mide un riesgo de capacidad, no trabajo forzoso.** No lo detecta, no lo descarta y no lo insinúa.
2. **El «por qué ya» se apoya en España, no en Milán ni en 2027.** Hay dos hechos que se pueden comprobar: el problema existe aquí y tiene tamaño (datos de la Inspección), y la ley española ya pone deberes a quien encarga su propia actividad. Milán se queda como ejemplo de lo que reprocha un tribunal. 2027 es horizonte y va en una sola frase.
3. **El art. 42 ET sale del guion hablado.** No aguanta una pregunta: no sabemos si cubre un encargo de confección. Pasa a la respuesta de 25 s, con el «si» delante y la consulta al laboralista como siguiente paso.

**Respuesta de 25 s.** **«¿Por qué pagaría una marca española ya?»** (68 palabras)
> «Porque el problema está aquí: en 2025 la Inspección afloró más de 120.000 empleos irregulares y, según la Policía, en Valencia un taller con 26 personas sin alta cosía para varias empresas del sector. Y si el encargo es de su propia actividad, la marca ya debe comprobar las altas de su contrata y responde de sus cuotas. Si eso cubre la confección, lo confirmaremos con un laboralista.»

**Qué sigue abierto.** - **Art. 42 ET y art. 22.11 LISOS en un encargo de confección o de aparado.** Sin sentencia del sector. Es la primera pregunta para el laboralista.
- **Si la TGSS deriva en la práctica deudas de un taller a la marca.** Lo que pidió Les Corts en 2022 sugiere que no es lo habitual.
- **Cifras de la ITSS:** no sabemos por qué difieren 122.146 y 131.645, y no tenemos el desglose de textil y calzado.
- **No hay en España un equivalente verificado del art. 34 italiano.** El dolor legal directo de la marca española depende del «si» de la propia actividad. Mientras no se confirme, el «por qué ya» es el tamaño del problema más ese «si», y no una obligación de usar Trama.

## e) Que el verde no sirva de coartada
*Críticas: J4 · detalle: [`problemas/e_verde_coartada.md`](problemas/e_verde_coartada.md)*

**Decisión.** 1. **Verde significa «las horas cuadran con tus pedidos», y nada más.** No dice nada de salarios, coacción, seguridad ni de los pedidos de otras marcas.
2. **Sin sello y sin uso publicitario, por contrato.** La marca no puede usar el semáforo, el nombre de Trama ni la palabra «verde» en etiquetas, webs para el consumidor, publicidad ni sellos. Sí puede usarlo internamente y ante auditores o autoridades. En un informe de sostenibilidad, solo con un texto fijo que explica el método y sus límites.
3. **El verde vale solo para su periodo y nunca tapa otros avisos:** un informe que falta, una subcontrata no declarada o una revisión abierta.

**Respuesta de 25 s.** > «El verde no sale de la empresa: el contrato prohíbe usarlo en publicidad, etiquetas o sellos. Y la ley va en la misma línea: la Directiva europea de 2024 prohíbe los distintivos sociales sin certificación independiente. Verde solo significa que las horas cuadran con tus pedidos; no dice nada de salarios ni de coacción. Italia quitó este año de su ley un sello así.»

**Qué sigue abierto.** - El estado de la transposición en España y en Italia.
- Si citar Trama en un informe de sostenibilidad cuenta como comunicación comercial a efectos de la Directiva. Mientras no se aclare, solo con el texto descriptivo fijo.
- **Riesgo de fondo.** Un verde puede convivir con una subcontrata no declarada en un taller grande cuyas horas de alta la tapan (ya está en «Límites del método»). Por eso el verde nunca se presenta como garantía.

## f) Que la marca no use el rojo para abandonar al proveedor
*Críticas: J4, J5 · detalle: [`problemas/f_rojo_abandono.md`](problemas/f_rojo_abandono.md)*

**Decisión.** 1. **El plan de corrección es una cláusula, no una promesa.** La marca se obliga a incluirla en su contrato marco con cada proveedor cuando contrata Trama. Sin cláusula firmada no hay servicio.
2. **Se quita «la marca no puede irse».** No aguanta una pregunta: ningún contrato impide salir para siempre. En su lugar:
   - **durante el plan:** ni resolución del contrato ni recortes por encima del tope, salvo excepciones tasadas;
   - **después, si el plan fracasa:** salida responsable, con plan y preaviso.
3. **Quién decide.** Cumplimiento compra Trama. Compras decide el precio por pieza y los volúmenes. Por eso la cláusula va en el contrato que ejecuta compras, y Trama enseña cada mes cuánto se ha usado del tope.
4. **Quién verifica.** Un revisor independiente (sindicato sectorial, ONG laboral o, en Italia, consulente asseveratore) que paga la marca con una tarifa fija, pactada antes de la alerta y que no depende del resultado. Es una **propuesta**: no hay ningún revisor confirmado.

**Respuesta de 25 s.** > «El rojo no da permiso para irse: abre un plan que ya está firmado en el contrato con el proveedor. Mientras dura, la marca no puede recortar más del 20 % ni romper. Si al final se va, lo hace con plan y preaviso, como pide la OCDE. Lo verifica un revisor independiente con tarifa fija. Y como el precio lo decide compras, la cláusula va en su contrato.»

**Qué sigue abierto.** - **No hay ninguna marca que la haya firmado.** La cláusula vale lo que valga el contrato que no tenemos.
- Qué efecto tendría ante un juez de lo social si la invoca un trabajador. Pregunta para el laboralista.
- **Riesgo de que la marca parezca empleadora de hecho.** Nunca decide sobre personas: eso queda para el taller y el revisor.
- Si la marca es una parte pequeña del taller, el tope del 20 % le protege poco.
- No hay revisores confirmados en España: la lista es una **propuesta**.
- Al vencer el contrato marco, la marca puede no renovarlo. La cláusula solo cubre el plan y los 6 meses siguientes.

## g) Protección de datos y competencia
*Críticas: J5 · detalle: [`problemas/g_datos.md`](problemas/g_datos.md)*

**Decisión.** **RGPD**
1. **Minimización.** A Trama solo llega el informe de plantilla media del taller: taller, periodo y una cifra agregada. El ITA, la RNT y las nóminas no salen de la gestoría. Trama no trata situación migratoria; del revisor solo recibe recuentos agregados.
2. **Base jurídica.**
   - Cuando el encargo es de la «propia actividad», obligación legal (art. 6.1.c): art. 42 ET y art. 16.6 LGSS, todavía ❓ para la confección.
   - En el resto, interés legítimo (art. 6.1.f), con la ponderación documentada en tres pasos.
3. **Roles.**
   - El taller es responsable del tratamiento y su gestoría, encargada.
   - Trama es encargada de cada marca para el semáforo de esa marca.

**Respuesta de 25 s.** > «Trama nunca ve nombres. La Seguridad Social da la plantilla del taller en una cifra; el ITA y las nóminas no salen de la gestoría. En talleres de menos de cuatro personas, la marca solo ve el semáforo. Haremos una evaluación de impacto antes del piloto. Y entre marcas no circula nada: con tres o más, solo reciben "revisión abierta", sin cifras.»

**Qué sigue abierto.** - El papel de Trama en el cálculo conjunto. Decidirlo con un delegado de protección de datos o un abogado.
- Si el rojo de un autónomo cuenta como dato de infracciones (art. 27 LOPDGDD).
- Italia (Garante): sin revisar.
- **El umbral de 3 marcas es un criterio de diseño.** Lo tiene que validar un abogado de competencia, sobre todo si en una zona hay muy pocos talleres.

## h) Precio, margen y mercado
*Críticas: J2, J3 · detalle: [`problemas/h_precio_mercado.md`](problemas/h_precio_mercado.md)*

**Decisión.** 1. **Cuota de vigilancia: 60 € por taller y mes** (supuesto), que paga la marca. **El informe mensual de la gestoría se repercute a coste** (supuesto: 15-30 €/taller/mes). Lo paga la marca a través de Trama, **nunca el taller**. Se mantiene lo que ya dice el pitch.
2. **Corregir se paga aparte**, en cada alerta, **directamente al revisor**, con una tarifa fija pactada antes de que salte. Estimación: **1.000-3.000 € por alerta revisada** (supuesto). **Trama no cobra margen sobre la corrección**: no gana más con más rojos.
3. **Piloto gratuito** de 3 meses con 5-10 talleres. La carta de intención lleva un precio orientativo para después (60 €), sin compromiso de compra (`i_piloto.md`).
4. **Quién decide.** El presupuesto de la cuota es de cumplimiento o sostenibilidad. El precio por pieza, los pedidos y el tope de reducción los decide compras. Por eso **la cláusula va como anexo del contrato marco que negocia compras**, y la carta de intención la firman las dos áreas.
5. **Mercado de abajo arriba: España primero y cada taller contado una sola vez.**
   - Techo: **6.083 empresas** de confección, piel y calzado con 1 a 49 asalariados (INE, DIRCE a 1-1-2025) × 720 €/año = **4,4 M€/año**.
   - Fase 1, piel y calzado (Ubrique y Elche): **2.217 empresas → 1,6 M€/año**.
   - Italia, en la fase 2: 4.223 empresas de marroquinería → 3,0 M€/año.

**Respuesta de 25 s.** **«¿Cuántas marcas os pueden comprar?»** (67 palabras)
> «En España, 165 fabricantes de moda, piel y calzado con 50 o más asalariados, según el INE; en Italia, 175 grupos de moda de más de 100 millones. Con 30 a 40 talleres cada uno, son unos 8,6 millones al año. Empezamos por las marcas que fabrican en los dos países, y la meta para 2030 es de 40 marcas y 1.500 talleres. Todo, supuestos por validar.»

**Qué sigue abierto.** - **Talleres por marca:** no hay ningún dato para España (los 30 son un supuesto). Tampoco sabemos cuántas casas extranjeras fabrican en España ni cuántas marcas españolas sin fábrica subcontratan aquí.
- Si las marcas que fabrican en Italia y en España comprarían: no hemos hablado con ninguna.
- **Lo que cobra una gestoría por el informe mensual** (P1 de `LLAMADAS.md`). Es la única partida que mueve el margen.
- **Si una marca pagaría 60 €:** no hemos hablado con ninguna. Por eso la carta de intención lleva el precio orientativo.
- Tarifa por jornada de un revisor en España, y qué ONG o sindicato haría de revisor (no hay ninguno confirmado).
- Cuántas alertas salen al año (se calibra en el piloto) y cuántas de las 6.083 empresas trabajan para marcas.

## i) Piloto de 3 meses con 5-10 talleres
*Críticas: J1, J2, J3, J5 · detalle: [`problemas/i_piloto.md`](problemas/i_piloto.md)*

**Decisión.** - **Formato.** Piloto de **13 semanas** con **5-10 talleres** de **una marca o un fabricante principal** que produzca en España: piel y calzado (Ubrique, Elche) o confección (Igualada, Mataró).
- **Coste.** **Gratis para la marca**. Trama paga los informes de las gestorías. La marca paga solo el revisor o las visitas sin aviso que decida pedir.
- **Arranque rápido.** El primer resultado llega en la **semana 1**, sin pedir nada al taller: precio por pieza frente a coste de convenio (`v5_segunda_cuenta.md`).
- **Historial.** En la **semana 2** se cargan **12 meses de historia**. Con 3 meses en vivo solo habría una ventana de 3 meses completa; con un año hay 10.
- **Firmas.** La carta de intención la firman **cumplimiento y compras**. Sin compras, ni el tope de reducción de pedidos ni un cambio de precio son creíbles.
- **Salvaguarda.** Ningún dato del piloto sirve para cortar con un taller durante el piloto ni los 3 meses siguientes, salvo las excepciones tasadas.

**Respuesta de 25 s.** **«¿Cómo es el piloto y qué le pedís a la marca?»** (67 palabras)
> «Tres meses, de 5 a 10 talleres, gratis para la marca. Nos da un año de pedidos con los minutos y el precio de cada pieza. En la semana uno, sin pedir nada al taller, le decimos qué piezas paga por debajo del coste de convenio; en la tres, el semáforo con un año de historia. Éxito: informes a tiempo, alertas explicadas, plantilla mantenida y un contrato.»

**Qué sigue abierto.** - Ninguna marca ha aceptado. Tampoco sabemos si un taller firmaría ni cuánto cobra una gestoría.
- Cuántos meses atrás deja sacar el RED el informe de plantilla media.
- Revisor independiente: ninguno confirmado.
- Quién paga al abogado. Financiación del equipo durante el piloto: NO SÉ.
- La carta de abajo es un **borrador nuestro, no revisado por un abogado**.

## Métricas de impacto: rediseño (petición del último jurado)
*Críticas: J4 y jurado externo · detalle: [`problemas/metricas_impacto.md`](problemas/metricas_impacto.md)*

**Decisión.** 1. **Cinco tarjetas, como ahora.** Cada una dice **de dónde partía → dónde está → meta**. Los `id` no cambian.
2. **Altas nuevas y pedidos retirados, por separado.** El hueco de horas se puede «cerrar» quitando pedidos, así que la tarjeta de «horas regularizadas» pasa a decir cuánto del hueco se cerró con altas y cuánto retirando pedidos.
3. **«Ningún despido» se sustituye por «bajas en la línea base».** Las bajas se miden con la lista de la gestoría: sale de ahí, no lo declara el taller. Quien trabajaba sin contrato no puede ser «despedido», solo dejar de venir; por eso solo vale contar quién sigue de alta.
4. **Nadie sale de la línea base.** Las personas sin alta se cuentan en tres grupos: ya de alta, en trámite y **sin vía** (no cumplen los requisitos del arraigo o se les denegó). Quien no tiene vía sigue en el denominador de la métrica principal y cuenta como no logrado.
5. **Se quitan dos promesas de la app:** «empleados» (solo vemos el alta) y «horas regularizadas» (320 de las 1.120 h son una contratación nueva, no una regularización).

**Respuesta de 25 s.** **«¿Y si cerráis el hueco quitando pedidos?»** (63 palabras)
> «Lo mostramos por separado. En la demo, con datos ficticios, a la cadena le faltaban 2.720 horas; hoy, 800. De lo cerrado, 1.120 horas son altas nuevas y 800, pedidos retirados, dentro del límite del 20 %. Y no medimos «cero despidos»: de 18 personas contadas al abrir la alerta, 11 estaban de alta; hoy lo están 14. Quien no puede regularizarse sigue contando.»

**Qué sigue abierto.** - **Las metas son propuesta nuestra.** Deben fijarse en cada plan con el revisor. Ningún sindicato ni ONG las ha validado.
- **Quién da los recuentos.** «Siguen de alta» y «sin vía» los da el revisor tras cotejar la lista nominal en la gestoría. Falta probar con una gestoría que se pueda hacer sin sacar nombres.
- **Trama no tiene solución para quien no cumple los requisitos de ninguna vía:** solo lo hace visible y vigila que se le pague lo trabajado.
- **Ningún sindicato ni ONG ha aceptado llevar el censo.** Es la conversación que pide el jurado: sin ella, el punto 1 de la ronda 3 es una propuesta.
- **En la demo, la visita sin aviso (H3, 15-sep) va después de la declaración del proveedor (H1, 21-ago).** El seed es anterior a esta regla y cambiar sus fechas rompe las pruebas, así que no se toca.
- **La meta 2030 depende de S1-S4,** que nadie ha medido.

## Competencia
*Críticas: J3, J5 · detalle: [`problemas/competencia.md`](problemas/competencia.md)*

**Decisión.** **Frase del pitch, verificada y ajustada:**
> «Sedex y amfori auditan, TrusTrace traza materiales; ninguno, que sepamos, cruza cada mes pedidos con horas de alta.»

**Respuesta de 25 s.** **«¿No lo hace ya Sedex, EcoVadis o la plataforma de Milán?»** (61 palabras)
> «Sedex y amfori hacen una auditoría puntual que se comparte entre clientes; EcoVadis puntúa cuestionarios; TrusTrace traza materiales. Ninguno, que sepamos, cruza cada mes tus pedidos con las horas de alta del taller. Lo más parecido es Milán: pide horas por cliente, pero las declara el taller cada seis meses y sin pedidos. No competimos con ellos: les decimos dónde mirar.»

**Qué sigue abierto.** - Si la plataforma de Milán funciona hoy y cuántos talleres tiene.
- Si TrusTrace o Retraced podrían añadir horas: tienen los pedidos, así que son el competidor que más rápido podría copiarnos.
- Precios reales de SMETA y BSCI en España (no publicados).
- Que «ninguno cruza» se apoya en no haber encontrado evidencia, no en una prueba: por eso siempre va con «que sepamos».

## Encaje con el Hult Prize y el ODS 8, y qué preparar si ganamos
*Críticas: — · detalle: [`problemas/hult_ods.md`](problemas/hult_ods.md)*

**Decisión.** 1. **ODS principal: la meta 8.8**, en su texto oficial: «Proteger los derechos laborales y promover un entorno de trabajo seguro y sin riesgos para todos los trabajadores, incluidos los trabajadores migrantes, en particular las mujeres migrantes y las personas con empleos precarios».
2. **La 8.7, solo como prevención.** Nunca decimos que Trama «erradica el trabajo forzoso».
3. **No añadimos más ODS.** Uno bien medido vale más que tres nombrados de pasada.
4. **El impacto se mide con las cinco métricas de `problemas/metricas_impacto.md`**, cada una con su punto de partida. Son métricas propias, no los indicadores oficiales de la ONU.
5. **Si ganamos, la UNEC (temporada EF Hult Prize 2027, competiciones nacionales en abril y mayo de 2027) se juega en encaje producto-mercado y salida al mercado.** Hoy es justo lo que no tenemos. El plan hasta abril es conseguirlo, no pulir el pitch.

**Respuesta de 25 s.** **«¿Qué ODS y cómo lo medís?»** (65 palabras)
> «La meta 8.8: derechos laborales de los trabajadores migrantes y con empleo precario. No medimos alertas: medimos personas. Cuántas de las que había al abrir la alerta, con y sin alta, siguen de alta seis meses después, y si el hueco se cerró dando de alta a gente o quitando pedidos. Quien no puede regularizarse sigue contando. Las cifras de hoy son de la demo.»

**Qué sigue abierto.** - Fechas exactas de la UNEC y si aplica el baremo de Hult: no lo sabemos (`investigacion/evento.md`).
- Si el tema de la temporada 2027 sigue siendo abierto («cualquier ODS»): la web oficial no lo nombra.

## v5) La «segunda cuenta»: precio por pieza frente a coste de coserla a salario de convenio
*Críticas: pitch v5 · detalle: [`problemas/v5_segunda_cuenta.md`](problemas/v5_segunda_cuenta.md)*

**Decisión.** - **Se adopta**, pero **fuera de los 4 minutos**: va en las **preguntas** y como **entregable de la semana 1 del piloto**. La demo no la enseña, y el mentor de Pitch ya la quitó del guion; estoy de acuerdo.
- **En la app, más adelante** (fase 2): una columna por referencia, «precio frente a coste mínimo de mano de obra». Esta noche no.
- **Regla.** Si lo que la marca paga por pieza (sin el material que ponga el taller) no cubre sus propios minutos a **salario mínimo con cotizaciones**, se abre una revisión, **aunque el semáforo esté en verde**.
- **Es un umbral de revisión, no un precio.** Cada marca compara **su** precio con un coste público. Trama no fija, no publica ni junta precios de marcas distintas.

**Respuesta de 25 s.** **«¿Y si el taller tiene gente de alta pero les paga por debajo del convenio?»** (64 palabras)
> «Para eso hay una segunda cuenta, solo con datos de la marca: lo que paga por pieza frente a lo que cuesta coserla a salario mínimo con cotizaciones, unos 21 céntimos el minuto en 2026. Una pieza de tres horas por debajo de 38 € no paga ni eso. Entonces el verde no vale: se abre una revisión, y el precio lo decide compras.»

**Qué sigue abierto.** - Las tablas del convenio textil 2026 por subsector, sin leer, y el número de pagas del de marroquinería.
- Cuánto del precio se va en gastos generales: la regla usa solo el suelo, sin gastos generales.
- Los minutos reales del cachemir y del lujo.
- Si las marcas aceptarían una cláusula de «subir hasta cubrir el suelo»: por validar con compras.

## j) Equipo
**Decisión.** Diapositiva de equipo con huecos [nombre, rol, por qué] en `PRESENTACION_LOVABLE.md`; en el pitch, solo nombres y estudios reales («Derecho laboral, Informática, ADE y Diseño» viene del pitch v5 y está [confirmar]).

**Qué sigue abierto.** Nombres, roles y, si existe, un asesor real con nombre y cargo. Ningún dato del equipo se inventa.

## Lo que no se puede cerrar esta noche (dicho con honestidad)
- **Validación con quien paga**: ninguna marca, gestoría, taller, sindicato ni ONG ha confirmado nada. Petición concreta: carta de intención (`problemas/i_piloto.md`, anexo) y llamadas/mensajes (`LLAMADAS.md`, `MARCAS.md`).
- **Art. 42 ET en confección**: sin jurisprudencia; se confirma con un laboralista.
- **Coste real del informe mensual de plantilla** para la gestoría y si pondera hoy la parcialidad: se pregunta en las llamadas.
- **Suelo de minutos para piel y calzado**: no hay referencia pública; lo construiría el piloto.
