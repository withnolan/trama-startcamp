# i) Piloto de 3 meses con 5-10 talleres

> Mentor 3 · Negocio · 8-nov-2026. Diseño nuestro: **no hay ninguna marca, gestoría ni taller comprometido**. Todo lo numérico es un supuesto por validar. Al final va la carta de intención de una página, con [huecos].

## Decisión
- **Formato.** Piloto de **13 semanas** con **5-10 talleres** de **una marca o un fabricante principal** que produzca en España: piel y calzado (Ubrique, Elche) o confección (Igualada, Mataró).
- **Coste.** **Gratis para la marca**. Trama paga los informes de las gestorías. La marca paga solo el revisor o las visitas sin aviso que decida pedir.
- **Arranque rápido.** El primer resultado llega en la **semana 1**, sin pedir nada al taller: precio por pieza frente a coste de convenio (`v5_segunda_cuenta.md`).
- **Historial.** En la **semana 2** se cargan **12 meses de historia**. Con 3 meses en vivo solo habría una ventana de 3 meses completa; con un año hay 10.
- **Firmas.** La carta de intención la firman **cumplimiento y compras**. Sin compras, ni el tope de reducción de pedidos ni un cambio de precio son creíbles.
- **Salvaguarda.** Ningún dato del piloto sirve para cortar con un taller durante el piloto ni los 3 meses siguientes, salvo las excepciones tasadas.

## Por qué

### Semana a semana

| Semana | Marca | Taller y gestoría | Trama | Se mide |
|---|---|---|---|---|
| **0** (antes) | Firma la carta de intención (cumplimiento + compras). Elige los talleres: al menos 2 que trabajen para varias marcas, 1-2 de menos de 4 personas y 1 con subcontratas conocidas | — | Encargo de tratamiento (art. 28 RGPD) firmado. Evaluación de impacto si hay talleres de menos de 4 personas o autónomos (`investigacion/encaje_legal.md` §g) | Punto de partida: plantilla en alta de cada taller el día 0 |
| **1** | Entrega pedidos de 12 meses y en curso (taller, referencia, unidades, inicio y entrega), **minutos de mano de obra y precio por pieza** de cada referencia y la lista de talleres y subcontratas. Envía a cada taller una carta de invitación voluntaria | — | Carga los datos. **Primer entregable: precio por pieza frente a coste de convenio**, solo con datos de la marca | Horas de la persona de cumplimiento; calidad de los datos |
| **2** | — | Reunión de 30 min por taller. Firma voluntaria del anexo (autorización a su gestoría y declaración de subcontratas). **La gestoría envía el informe de plantilla media de los últimos 12 meses** (por CCC), el convenio aplicable y, si hay parcialidad, las horas complementarias | Recibe totales, nunca nóminas ni listas de personas | **% de talleres que aceptan**; minutos del gestor |
| **3** | Revisa con Trama cada ámbar y rojo | — | **Semáforo histórico** (10 ventanas) | Alertas revisadas en ≤10 días laborables |
| **4** | Persona de compras: revisa las referencias pagadas por debajo del coste de convenio | El taller puede discutir los minutos de una referencia (queda escrito) | Calibra los minutos. En talleres con varias marcas: total del 303 del último trimestre → estimación (`b_varias_marcas.md`) | Falsos positivos explicados, con su causa |
| **5-8** (mes 2) | Si hay un rojo confirmado: decide si pide revisión con visita sin aviso (la paga ella) | Informe del mes M antes del día 15 de M+1 | Primer ciclo en vivo | Cobertura de informes a tiempo |
| **9-12** (mes 3) | Si se confirma un rojo, se aplica la cláusula: plan, tope de reducción y revisor | Declaración de subcontratas. Segundo informe | Segundo ciclo. Si la marca lo paga, el revisor visita **1 taller en verde elegido al azar** para buscar falsos negativos | Plantilla en alta frente al día 0. Altas nuevas frente a pedidos retirados |
| **13** | Decide: contrato de pago, ampliación o no | Encuesta anónima | Informe final: métricas, coste real y lo que falló | Conversión |

Más allá del piloto: Trama mide **gratis** la plantilla en alta de cada taller con alerta **a los 6 meses**, que es la métrica de impacto (la define el mentor de Impacto).

### Qué pedimos a cada uno
- **A la marca:**
  1. Pedidos de 12 meses y en curso, por taller y referencia (exportación de su ERP o PLM en CSV).
  2. Minutos de mano de obra y precio por pieza (escandallo o ficha de costes).
  3. Lista de talleres y subcontratas conocidas.
  4. Una persona de cumplimiento (≈2 h/semana, supuesto).
  5. Una persona de compras (≈3 h en total, supuesto).
  6. La cláusula como anexo del contrato marco, o del pedido, con cada taller participante. Recoge la participación voluntaria y los compromisos de la marca (apartado 5 de la carta).
  7. Permiso para contar los resultados de forma anónima.
- **Al taller:**
  - firmar el anexo, de forma voluntaria;
  - autorizar a su gestoría a enviar cada mes **solo el total** de plantilla media en alta por CCC, y cada trimestre el **total de ventas** del 303 si trabaja para varias marcas;
  - declarar sus subcontratas.
  - Opcional: autorizar la consulta de altas en una visita (art. 16.6 LGSS, `investigacion/fuentes_horas.md` §8).
- **A la gestoría:**
  - el informe de plantilla media (Sistema RED) de los últimos 12 meses y después uno al mes;
  - la jornada del convenio y las horas complementarias;
  - apuntar los minutos que le lleva.
  - Trama le paga cada informe (supuesto: 15-30 €).

### Métricas de éxito

| Métrica | Meta | Cómo se mide | Punto de partida |
|---|---|---|---|
| Talleres que aceptan participar | ≥ 70 % de los invitados | Anexos firmados / invitados | 0 (no se ha invitado a ninguno) |
| Informes mensuales a tiempo | ≥ 90 % antes del día 15 | Registro de Trama | — |
| Tiempo del gestor por informe | Mediana ≤ 15 min | Lo apunta la gestoría | NO SÉ (P1 de `LLAMADAS.md`) |
| Alertas revisadas por una persona | 100 %, en ≤ 10 días laborables y con decisión escrita | Expediente | — |
| Falsos positivos explicados | 100 % de las alertas con causa (minutos, temporada, parcialidad, datos) o «sin determinar» | Expediente | — |
| Falsos negativos buscados | ≥ 1 verde visitado al azar (si la marca lo paga); se publica lo encontrado | Informe del revisor | — |
| Plantilla en talleres con alerta | Al final del piloto, ≥ la del día de la alerta; 0 despidos ligados a la alerta | Informe de plantilla media; revisor | Plantilla del día de la alerta |
| Cómo se cierra el hueco | Más horas por altas nuevas que por pedidos retirados | Plantilla frente a pedidos | Ratio del día de la alerta |
| Pedidos mantenidos | ≥ 80 % de la media de los 6 meses anteriores en talleres con alerta | Pedidos de la marca | Media de los 6 meses anteriores |
| Conversión | Contrato de pago o ampliación firmados ≤ 30 días después | Contrato | — |

### Coste del piloto (supuestos) y quién lo paga

| Partida | Estimación | Paga |
|---|---|---|
| Informes de gestoría: 10 talleres × (1 informe histórico ≈50 € + 3 mensuales ≈25 €) | ≈ 1.250 € | Trama |
| Tiempo del equipo: ≈230 h (3 personas × 6 h/semana × 13 semanas) | Sin cobrar (≈5.000 € a 22 €/h, coste de oportunidad) | Equipo |
| Infraestructura y firma electrónica | < 200 € | Trama |
| Revisión jurídica del anexo, el encargo de tratamiento y la evaluación de impacto | NO SÉ: presupuesto por pedir | Trama |
| Revisor o visita sin aviso, si hay un rojo | ≈ 1.000-3.000 € por alerta (`h_precio_mercado.md`) | Marca, directo al revisor |
| **Caja de Trama** | **≈ 1.500 € + abogado** | Equipo (sin financiación confirmada) |

### Por qué así
- **Historial de 12 meses.** El informe de plantilla media se pide «fecha desde» y «fecha hasta» ✅ ([Noticias RED 2011/13](https://www.seg-social.es/descarga/es/160888)). Cuántos meses atrás deja pedirlo el RED está **por validar**: el servicio para administraciones admite 7 años (`investigacion/fuentes_horas.md` §2).
- **Una alerta sobre meses pasados** no castiga a nadie: se trata como una revisión, con las mismas protecciones (apartado 5 de la carta).
- **Semana 1 sin el taller.** Quita la fricción de arranque: la marca ve un resultado antes de pedir nada a nadie.
- **Mezcla de talleres.** Pone a prueba a propósito lo que más critica el jurado: varias marcas, talleres pequeños (RGPD) y subcontratas.

## Respuesta de 25 s

**«¿Cómo es el piloto y qué le pedís a la marca?»** (67 palabras)
> «Tres meses, de 5 a 10 talleres, gratis para la marca. Nos da un año de pedidos con los minutos y el precio de cada pieza. En la semana uno, sin pedir nada al taller, le decimos qué piezas paga por debajo del coste de convenio; en la tres, el semáforo con un año de historia. Éxito: informes a tiempo, alertas explicadas, plantilla mantenida y un contrato.»

## Qué cambia en la app o en el pitch
- **Pitch:** la petición se mantiene («carta de intención para un piloto gratuito de tres meses con 5 a 10 talleres»). Se puede añadir «que firmen cumplimiento y compras», si sobran 4 palabras.
- **PREGUNTAS:** añadir esta respuesta y «semana 1 sin el taller».
- **Lovable:** una diapositiva con la tabla semana a semana (versión corta: 0 · 1 · 2 · 3 · 5-12 · 13).
- **App:** nada esta noche.

## Qué sigue abierto
- Ninguna marca ha aceptado. Tampoco sabemos si un taller firmaría ni cuánto cobra una gestoría.
- Cuántos meses atrás deja sacar el RED el informe de plantilla media.
- Revisor independiente: ninguno confirmado.
- Quién paga al abogado. Financiación del equipo durante el piloto: NO SÉ.
- La carta de abajo es un **borrador nuestro, no revisado por un abogado**.

---

## Anexo · Carta de intención no vinculante (1 página)

**CARTA DE INTENCIÓN NO VINCULANTE · PILOTO DE TRAMA**

En [ciudad], a [fecha].

**Partes.**
- **[RAZÓN SOCIAL DE LA MARCA]**, NIF [ ], con domicilio en [ ], representada por [nombre], [cargo en cumplimiento o sostenibilidad], y por [nombre], [cargo en compras] («la Marca»).
- **[Equipo Trama / razón social cuando exista]**, representado por [nombre], [email] («Trama»).

1. **Objeto.**
   - Las partes tienen la intención de hacer un piloto de la herramienta Trama.
   - Trama compara cada mes la carga de trabajo de los pedidos de la Marca (unidades × minutos estándar) con las horas de la plantilla en alta de **[5-10] talleres**, para ayudar a decidir dónde mirar.
   - Trama no certifica ni audita, y sus alertas no son pruebas: abren una revisión que decide una persona.
2. **Duración.** Trece semanas, del [fecha de inicio] al [fecha de fin].
3. **La Marca aportará:**
   - (a) los pedidos de los últimos 12 meses y los que estén en curso, por taller y referencia;
   - (b) los minutos de mano de obra y el precio por pieza de cada referencia;
   - (c) la lista de talleres y de subcontratas conocidas;
   - (d) una persona de cumplimiento (≈2 h/semana) y una de compras (≈3 h en total);
   - (e) una carta a cada taller que lo invite a participar de forma voluntaria.
4. **Trama aportará** la herramienta, la carga de datos, un informe mensual y uno final con las métricas pactadas. **Pagará los informes de las gestorías** de los talleres participantes.
5. **Compromisos de la Marca** durante el piloto y los [3] meses siguientes:
   - (a) Ninguna alerta se usará por sí sola para terminar la relación con un taller ni para reducir sus pedidos más de un [20] % frente a la media de los 6 meses anteriores.
   - (b) Cada alerta la revisa una persona, después de oír al taller.
   - (c) El semáforo no se usará en publicidad, etiquetas ni sellos.
   - (d) Si una alerta necesita un revisor independiente, la Marca pagará su tarifa fija, pactada de antemano [importe orientativo: ] y que no depende del resultado.
   - (e) Excepciones: que el taller se niegue a cooperar, un peligro grave e inminente o una decisión de una autoridad.
6. **Datos.**
   - Trama actuará como encargada del tratamiento de la Marca, con el contrato del art. 28 RGPD que se firmará antes del inicio.
   - Solo recibirá totales por taller, nunca nóminas ni listas de trabajadores.
   - En talleres de menos de 4 personas, la Marca verá solo el semáforo.
   - Si procede, se hará una evaluación de impacto.
7. **Coste.**
   - El piloto es gratuito para la Marca.
   - Precio orientativo si decide continuar: **[60] € por taller y mes**, más el informe de la gestoría a coste.
   - Esta carta no obliga a comprar.
8. **Confidencialidad.**
   - Las partes guardarán confidencialidad sobre los datos del piloto.
   - Trama podrá citar los resultados de forma anónima («una marca de [sector] de [región]») [sí / no] con autorización escrita de la Marca.
9. **Naturaleza.**
   - Esta carta expresa una intención y no es vinculante, salvo los apartados 6 y 8.
   - Cualquiera de las partes puede desistir avisando por escrito con [15] días de antelación.

Por la Marca, cumplimiento: [firma]   Por la Marca, compras: [firma]   Por Trama: [firma]

*Borrador del equipo Trama (Start Camp UC3M 2026). No lo ha revisado un abogado.*
