# BRIEF del Equipo B — Trama · Start Camp UC3M 2026

Contexto común para los 5 agentes del Equipo B (no para el jurado del simulacro). Es una copia fiel de las secciones 0, 1, 3 y 4 del encargo original y del encargo complementario. Si algo de aquí choca con lo que encontréis al investigar, mandan los hechos con fuente: apuntadlo en `DECISIONES.md` (una línea: qué cambia y por qué).

## 0. Misión
Ganar el 1.er premio del Start Camp 2026 de Start UC3M con la startup **Trama**. Pitch final: **domingo 8 de noviembre de 2026**. Hoy es sábado 7 por la noche.
- El MVP es un **prototipo de demo** (datos ficticios, sin backend, sin login). Debe verse real y no fallar en el escenario.
- La presentación (diapositivas) la hará el equipo humano en **Lovable**: se entrega el contenido y un prompt listo para Lovable.
- **Nunca presentéis como hecho algo que no lo está** (entrevistas, cartas de intención, clientes, validación legal, llamadas). Lo no hecho se dice como «siguiente paso».
- Trabajad de forma autónoma; ante una duda, elegid lo más razonable y apuntadlo en `DECISIONES.md`.
- **El equipo humano no hará nada más mañana por la mañana**: todo tiene que quedar listo para usar.

## 1. Reglas que no se rompen
1. **Solo local.** Git local sí (ramas y commits locales). Nada de remotos, `git push`, GitHub ni Vercel.
2. **Solo datos inventados en la app.** Ninguna marca, empresa ni persona real dentro del MVP (`trama-mvp/src/`). Las ciudades sí. Los casos reales (Milán, etc.) solo en los documentos y el guion, con fuente.
3. **Licencias permisivas** (MIT, ISC, Apache-2.0, BSD, OFL). Nada GPL/AGPL/LGPL/MPL.
4. Sin secretos ni datos personales en código o commits. Nada fuera de la carpeta del proyecto.
5. **Lenguaje no acusatorio** en la app: «posible desajuste», «revisión abierta», «sin datos». Nunca «explotación», «ilegal» ni «fraude» aplicado a un taller. Una alerta no es una prueba.
6. **Frases prohibidas** (app, pitch y documentos): «certificado legal», «demuestra que no hay trabajo forzoso», «evita multas». Usad «ayuda a decidir dónde mirar» y «documenta que la empresa vigiló».
7. **No inventar validaciones ni el resultado de las llamadas.**

## 3. El evento (actualizado a 7-nov-2026; ver `investigacion/evento.md` y `investigacion/jurado.md`)
- **Start Camp 2026**, organizado por Start UC3M. Del viernes 6 al domingo 8 de noviembre de 2026, en **Mad Tech Campus (Matadero Madrid)**. Horario provisional; mentoría del domingo de 15:30 a 17:45.
- **Pitch final: 4 minutos de presentación + 2 minutos de preguntas.**
- **Premios:** 1.º pase a la **UNEC** (clasificatoria nacional del **Hult Prize**) + viaje Waynabox + túnel de viento Windobona; 2.º Impact Social Cup (2.000 €) + entradas South Summit 2027; 3.º mentorías, un año de socios y un libro.
- **Jurado: 7 personas.** Confirmados: Borja Vega, Alfredo Raya Bejarano y Raúl Marcos. Ganador de 2025: Komplot (app que conecta comunidades de vecinos con productores locales).
- **No hay rúbrica oficial.** Referencias: rúbrica de otros programas UC3M (Impacto 30 · Innovación 20 · Viabilidad 15 · Escalabilidad 15 · Ventaja competitiva 10 · Equipo 10) y los criterios del Hult Prize: **Team**, **Idea**, **Impact** (al menos un ODS, cambio real antes de 2030), **Business** (ingresos, crecimiento, sostenibilidad); en la fase nacional, **encaje producto-mercado** y **salida al mercado**. Tema Hult 2026: «UNLIMITED».

## 4. Trama: la idea (punto de partida, no dogma)
**Una frase:** Trama cruza cada mes los pedidos de una marca de lujo con las horas del personal dado de alta en sus talleres, para detectar a tiempo cuándo la carga no cabe en la plantilla y corregirlo sin castigar a los trabajadores.

**Gancho (verificar con `investigacion/hechos_legales.md`):** Loro Piana, administración judicial del Tribunal de Milán en julio de 2025 (la quinta marca, tras Alviero Martini, Giorgio Armani Operations y Manufactures Dior en 2024), levantada el 17-abr-2026 tras más de 2.400 auditorías y la ruptura con más de 100 proveedores. Lo que reprochó el tribunal no es que la marca explotara, sino que **no verificara la capacidad real de sus contratistas**: medida preventiva (art. 34 d.lgs. 159/2011), no una multa. La Fiscalía usó el consumo eléctrico para demostrar que se producía de día y de noche. Prada y otras 12 marcas (dic-2025) solo recibieron una petición de documentos: no mezclarlas. La macroinvestigación identificó 203 trabajadores presuntamente explotados. Tod's: medida solicitada, en curso; la empresa lo niega.

**Problema:** la marca ve a su proveedor directo, pero el riesgo está en subcontratas en cascada que nadie ve. Las auditorías son puntuales, avisadas y las paga el auditado. La señal que nadie cruza: **si los pedidos necesitan más horas de las que el taller tiene dadas de alta, alguien trabaja sin contrato o sin límite.**

**Por qué ahora (horizonte, no argumento principal):** Reglamento (UE) 2024/3015 (prohibición de productos con trabajo forzoso), aplicable desde el 14-12-2027; guías y Portal Único publicados el 30-jun-2026; base de datos de riesgos con retraso. CSDDD: Directiva (UE) 2026/470, de 24-feb-2026; transposición antes del 26-jul-2028, aplicación desde el 26-jul-2029, solo grandes empresas. España: LISOS. Italia: art. 603-bis CP (*caporalato*), D.Lgs. 231/2001, Protocolo de Milán (26-05-2025).

**Cómo funciona (estado actual del MVP: ver `MVP_ESTADO.md`):**
1. **Carga mínima** = pedidos de la marca × minutos estándar por pieza (fichas de costes de la marca).
2. **Horas de alta** = personas dadas de alta (Informe de Trabajadores en Alta de la Seguridad Social) × jornada pactada, sumadas por taller, nunca por persona; Italia: LUL + asseverazione Asse.Co. (Antes se llamaba «horas cotizadas»; se renombró porque en España se cotiza por base, no por horas.)
3. Ventana móvil de 3 meses. Ratio = necesarias / de alta. Verde ≤ 0,85; ámbar ≤ 1,10; rojo > 1,10; micro (1-3 personas) rojo > 1,25. Sin informe: «sin datos», nunca verde.
4. Toda la cadena: el proveedor declara sus subcontratas; subcontrata sin informe = 0 h; el panel muestra el peor estado.
5. Una alerta no es una prueba: abre una revisión; dice **por qué salta** y **qué comprobaría una persona** (nóminas y registro de jornada, visita sin avisar, entrevistas confidenciales, consumo eléctrico por franjas). La herramienta propone y decide una persona.
6. Plan de corrección con revisor independiente (ONG o sindicato); cláusula de no despido; límite a la reducción de pedidos durante el plan (20 %); acompañamiento para regularizar (España: arraigo sociolaboral, RD 1155/2024; Italia: art. 18 y 18-ter TU Inmigración).
7. Impacto medido: trabajadores que siguen empleados y de alta 6 meses después de la alerta, horas regularizadas, regularizaciones iniciadas, pedidos mantenidos, despidos (objetivo 0).
8. Talleres con varias marcas: el semáforo usa solo los pedidos de la marca (mínimo) + estimación de la carga total con la cuota de facturación de la marca (carga ÷ cuota); sin compartir datos entre marcas. Hay un **simulador en directo** en la demo.
- Salvaguardas: competencia (art. 101 TFUE: cada marca ve solo su semáforo; saturación conjunta → solo «revisión abierta»); RGPD (solo agregados; < 4 personas → solo semáforo). El verde no es un sello: sin uso publicitario por contrato.

**Cliente:** paga la marca (cumplimiento, sostenibilidad o compras). Piloto en España (Ubrique, Elche, Igualada), fase 2 Italia vía consulenti del lavoro y Asse.Co. **Precio NO cerrado** (hipótesis de partida: 90 € por taller y mes, por validar).
**Competencia:** EcoVadis (+Ulula), osapiens, Prewave, Altana, Sedex, Sourcemap, Exiger, IntegrityNext, TrusTrace, Retraced, TextileGenesis; SA8000, SMETA, amfori BSCI; Asse.Co (canal); certificación única italiana; atestación MIMIT; plataforma voluntaria del Tribunal y la Prefectura de Milán; plataforma del Politecnico di Milano con lista blanca. Datos públicos: Open Supply Hub, US DoL ILAB, CBP WRO, Walk Free.
**Huecos reales** (se dicen con honestidad): no hay entrevistas ni carta de intención; no hay confirmación escrita de un gestor; no hay datos de talleres reales; los minutos estándar de la demo son estimación; riesgo de informe complaciente.

## Críticas del jurado simulado previo (hay que cerrarlas una a una)
- **J1 Profesora:** no se ha probado nada; trabajo no declarado ≠ trabajo forzoso, el argumento del Reglamento se estira. Pide una conversación real con una marca y con un gestor.
- **J2 Inversor:** no hay precio, tamaño de mercado ni validación; en España se cotiza por base, no por horas: el «certificado de horas cotizadas» no es un documento estándar. Pide carta de intención, un gestor que confirme y un precio con su margen.
- **J3 Mentor:** el taller que trabaja para varias marcas; un gestor pagado por el propio taller; no hay demo ni equipo; vender a cumplimiento en el lujo es lento. Pide carta de intención, un gestor que lo confirme por escrito y una demo que calcule el semáforo.
- **J4 Impacto:** un verde falso puede servir de coartada; la marca puede usar el rojo para abandonar al proveedor. Pide cerrar lo del taller con varias marcas y que un tercero verifique las protecciones.
- **J5 Innovación corporativa:** taller con varias marcas, certificado complaciente, cruzar datos entre marcas choca con competencia. Pide carta de intención para un piloto de 3 meses con 5-10 talleres, y el encaje legal de la protección de datos y de la cláusula de no despido.

**Pistas (verificadas o no en `investigacion/`; si no se sostienen, abandonadlas y buscad otra vía):** a) fuentes de horas (ITA y coeficiente de parcialidad, jornada pactada, registro de jornada art. 34.9 ET y registro digital; Italia LUL y DURC); b) varias marcas con la cuota de facturación; c) certificado complaciente: fuente oficial, comprobaciones cruzadas, responsabilidad del firmante; d) no declarado vs forzoso: indicadores OIT, reproche de Milán por no verificar capacidad, LISOS, 603-bis; 2027 como horizonte; e) el verde no es sello; f) el rojo para abandonar: Loro Piana (>100 proveedores cortados), cláusulas, tercero verificador, validez en España; g) RGPD; h) precio y margen («por validar») y mercado de abajo arriba; i) piloto de 3 meses con 5-10 talleres; j) diapositiva de equipo con huecos [nombre, rol, por qué].
Para cada punto: **la decisión, por qué, una respuesta de 25 s para preguntas y qué cambia en la app o en el pitch**. Si algo no se puede cerrar, se dice.

## Pitch base (punto de partida; ≤ 560 palabras en la versión final; mantener el bloque de la llamada con [RELLENAR] y la versión B)
[0:00] En julio de 2025, el Tribunal de Milán intervino Loro Piana. No por explotar a nadie, sino por no comprobar que quien le fabricaba tenía capacidad real para hacer lo que le encargaba. Detrás había talleres con trabajadores sin contrato. En abril de este año el tribunal levantó la medida: Loro Piana hizo más de 2.400 auditorías y cortó con más de 100 proveedores. Problema resuelto para la marca. ¿Y para la gente que trabajaba en esos talleres?
[0:30] Una marca ve a su proveedor directo, pero el riesgo está dos niveles más abajo, en subcontratas que nadie ve. La auditoría es una vez al año, avisada y pagada por el auditado. Y hay una señal que nadie cruza: si los pedidos necesitan más horas de las que el taller tiene dadas de alta, alguien está trabajando sin contrato o sin límite.
[0:55] Somos Trama. Cada mes cruzamos dos datos que ya existen: los pedidos de la marca por los minutos que la propia marca calcula para cada pieza, y las horas del personal dado de alta en el taller, que salen de un informe oficial de la Seguridad Social y no de un papel del taller. [DEMO] Este taller está en rojo: en tres meses, sus pedidos necesitan 8.000 horas y solo hay 3.360 dadas de alta. Cuando salta la alerta, el taller declara una subcontrata que no conocíamos, y toda la cadena pasa a revisión. Trama dice qué comprobar: nóminas, una visita sin avisar, entrevistas con los trabajadores. Y decide una persona. ¿Y si el taller trabaja para cinco marcas? Usamos qué parte de su facturación es tuya: si eres el 20 % y tus pedidos ya llenan media plantilla, las cuentas no salen. Sin compartir datos entre competidores.
[2:00] LLAMADA. Versión A: Esta mañana hemos hablado con [quién]. Nos ha confirmado que [dato real]. Y nos ha dicho algo que no esperábamos: «[frase literal]». Versión B: Lo primero que haremos el lunes es llamar a la lista de talleres y gestorías que tenemos preparada en Ubrique, Elche e Igualada para confirmar [lo que falta validar].
[2:25] Desde el 14 de diciembre de 2027 no se podrá vender en la UE ningún producto hecho con trabajo forzoso, se fabrique donde se fabrique. Trama no certifica nada: le dice a la marca dónde mirar y deja constancia de que vigiló. Cobramos a la marca [90] € por taller y mes, menos que una auditoría al año [por validar]. Empezamos con marcas medianas que producen en España (Ubrique, Elche, Igualada) y después Italia, con más de 46.000 empresas de piel y confección.
[3:00] La alerta no castiga: abre un plan de corrección, y un revisor independiente, una ONG o un sindicato, comprueba que se cumple. Mientras dura el plan, la marca no puede marcharse ni recortar los pedidos más de un 20 %, y acompañamos a los trabajadores para que regularicen su situación. Medimos cuántos siguen trabajando y de alta seis meses después. Y el verde no es un sello: no se puede usar en publicidad.
[3:30] Somos [equipo]. Pedimos una marca para un piloto de tres meses con entre 5 y 10 talleres, y gestores laborales que quieran probarlo.
[3:50] Loro Piana cortó con 100 proveedores. Queremos que la próxima vez no haga falta cortar con nadie. Trama: ver a tiempo y corregir sin despedir.

## No os encerréis
Todo lo anterior es punto de partida, no guion obligatorio: el pitch base, la estructura de 4 minutos, las pistas, el precio de 90 €, los umbrales e incluso el enfoque se pueden cambiar o descartar si encontráis algo mejor para ganar. Si una pista no se sostiene, abandonadla y buscad otra vía. Si os atascáis más de 30 minutos, apuntad el bloqueo en `DECISIONES.md` y seguid. Lo único fijo son las reglas de la sección 1.

## Material disponible en el repositorio
`specs/` (fuente de verdad del MVP) · `MVP_ESTADO.md` · `trama-mvp/` (app) · `demo-backup/` (capturas y vídeo) · `investigacion/` (evento, jurado, nombres, hechos_legales, mercado_competencia, fuentes_horas, encaje_legal) · `LLAMADAS.md` · `DECISIONES.md` · `PLAN.md`.

## Datos verificados que aporta el usuario (7-nov, noche) — usar sin volver a buscarlos
- Loro Piana (jul-2025): el proveedor directo no tenía instalaciones de producción. El subproveedor tenía 7 empleados y entregaba entre 6.000 y 7.000 chaquetas al año (lo reconoció su cotitular, que también admitió que externalizaba a talleres chinos). La auditoría al proveedor no comprobó la capacidad (Il Post, Startmag, L'Espresso). Medida revocada el 17-abr-2026, tras 2.400 auditorías y la ruptura con más de 100 proveedores (Il Giorno, Milano Finanza; cifras de la propia empresa).
- Cuenta: 7 × unas 1.750 h ≈ 12.250 h/año → unas 2 h por chaqueta. El dato de minutos de una chaqueta de cachemir forrada se busca en `investigacion/minutos_chaqueta.md`; si no hay fuente, se dice así en el pitch.
- La certificación italiana de la cadena de la moda se suprimió del DDL PMI (Cámara, 18-dic-2025).
- La regularización extraordinaria española (RD 316/2026) ya cerró su plazo; para casos nuevos queda el arraigo.
- Antes de Loro Piana pasaron por lo mismo: Armani, Alviero Martini, Dior y Valentino.
- En la app el caso va anonimizado (simulador «Caso reconstruido con datos públicos» y sección `caso-publico` de /como-calculamos); las fuentes, solo en los documentos.

## Pitch v5 del usuario
`pitches/v5_usuario.md`. Se compara a ciegas con el vuestro en la ronda 1 del jurado y se queda el que más puntúe o una combinación. **Su bloque de la llamada es un ejemplo, no una llamada real**: en cualquier versión evaluada o presentada va con [RELLENAR] y versión B. Ideas de v5 a considerar: la «segunda cuenta» (precio por pieza frente a coste de convenio), «para falsearlo habría que dar de alta a gente que no existe y pagar sus cotizaciones», el plan lo paga la marca (revisor con tarifa fija), salida con plan y preaviso en lugar de «no puede irse», y la petición concreta (carta de intención para un piloto gratuito de 3 meses con 5-10 talleres).

## Contacto real esta noche y mañana
`LLAMADAS.md` (talleres, gestorías, asociaciones, sindicatos) y `MARCAS.md` (mensajes a marcas para enviar esta noche). Los envía el equipo humano, no los agentes. En el pitch solo se cuentan respuestas reales, también los «no»; si no hay, versión B.

## Último encargo del usuario (8-nov, 00:05) — fallos de un jurado simulado externo (6,12, estancado)
**Lección: sube más QUITAR promesas que no aguantan una pregunta que añadir mecanismos nuevos.**
- Separar la cuota de vigilancia (€/taller/mes) del coste de corregir (revisor, visita sin avisar, acompañamiento al arraigo), que la marca paga aparte en cada alerta, con precio estimado y supuesto; cuentas por taller y margen.
- Mercado de abajo arriba empezando por España, contando cada taller una sola vez (un cálculo de 12 M€ en Italia contaba dos veces a talleres con varias marcas). Italia, segunda fase.
- Taller con varias marcas explicado de forma sencilla; modelo 347 (por cliente, anual) frente a restar a la facturación total lo que pagan las marcas de Trama; margen de error.
- La «lista pactada con los sindicatos» no existe: llamarla «propuesta».
- Impacto: separar las altas nuevas de los pedidos retirados (el hueco se puede «cerrar» quitando pedidos); cambiar «ningún despido» por una métrica medible (plantilla a 6 meses); contar también a quien no cumple los requisitos del arraigo; punto de partida en cada meta.
- El plan de corrección es una cláusula que la marca firma al contratar, no una promesa.
- Quién decide: cumplimiento compra Trama; subir el precio por pieza lo decide compras.
- Por qué pagaría una marca española ya en 2026: encaje legal español (art. 42 ET, responsabilidad solidaria en contratas de la propia actividad: verificar si aplica) y tamaño del problema en España con datos públicos de la Inspección de Trabajo.
- Competidores en una frase: «Sedex, amfori y TrusTrace auditan o trazan cada relación por separado; nadie suma la carga de un taller» (verificar).
- En el pitch, decir en voz alta qué datos de la demo son simulados.
- Demo: dos escenas nuevas con datos ficticios/anonimizados — (a) «Taller con 4 marcas»: verde con cada marca por separado y rojo al sumar; cada marca solo ve su semáforo y «revisión abierta»; (b) «Caso Milán 2025 (datos públicos)», anonimizado: proveedor A sin taller (capacidad 0) y subproveedor B con 7 personas que entrega 6.000 chaquetas al año → rojo. Opcional: documentos de ejemplo con el formato real (informe de plantilla media / ITA, ficha de costes, modelo 347) marcados «SIMULADO».
- Repositorio: commits cada 20-30 min; repo GitHub PRIVADO `trama-startcamp` con push tras cada commit (lo gestiona el director); lint, tests y build en verde antes de cada push.
