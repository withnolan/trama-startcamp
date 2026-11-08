# b) Taller que trabaja para varias marcas, sin cruzar datos entre ellas

> Mentor 3 · Negocio · 8-nov-2026. Las fórmulas son diseño nuestro. Las fuentes fiscales están enlazadas; lo no comprobado lleva ⚠ o NO SÉ.

## Decisión

**En una frase:** para la parte de la marca usamos sus propios pedidos; para el resto del taller, su facturación. Si no cabe, se abre una revisión, sin ver nunca los datos de otra marca.

Cuatro reglas:

1. **Rojo directo, sin reparto.** Si los pedidos de una sola marca ya superan 1,10 veces **todas** las horas de alta del taller, es rojo. Las demás marcas solo pueden añadir carga, así que aquí no hay error por varias marcas. **Se mantiene.**
2. **Estimación de la carga total con la facturación** (modelo 303 trimestral; en Italia, LIPE):
   - carga total ≈ horas de la marca ÷ su parte de la facturación;
   - **solo abre una «revisión abierta», nunca da un rojo**;
   - la marca no ve la facturación del taller ni su cuota, solo el estado.
3. **Si 3 marcas o más del taller usan Trama, se resta** (Trama actúa como tercero):
   - las horas de las marcas de Trama son exactas, salen de sus pedidos;
   - solo se estima el resto: (facturación del 303 − lo que pagan las marcas de Trama) ÷ su precio medio por hora;
   - cada marca recibe solo «revisión abierta», con el mismo texto sea cual sea la causa.
4. **El modelo 347 sirve para comprobar una vez al año, no para calcular cada mes.**

## Por qué

### Ejemplo para el pitch (cifras inventadas)
- Un taller de 9 personas tiene **unas 4.000 h de alta** en el trimestre (9 × 148 h × 3).
- Tus pedidos necesitan **2.000 h**: la mitad.
- Pero tú eres solo el **20 %** de lo que factura (su IVA trimestral).
- Carga total estimada: 2.000 ÷ 0,20 = **10.000 h, 2,5 veces su plantilla**.
- **Para que todo cupiera, las demás marcas tendrían que pagarle 4 veces más por hora que tú.**
- No vemos sus datos; vemos que la cuenta no sale y abrimos una revisión.
- Si tus pedidos solos pasaran de 4.400 h (1,10 × 4.000), sería rojo directo.

Fórmula del «multiplicador de equilibrio», m*:
- m* = H_marca × (1 − s) ÷ [ s × (C − H_marca) ], donde s es la parte de la facturación y C la capacidad.
- Con 2.000, 0,2 y 4.000: m* = 4. Con el límite rojo (C × 1,10): 3,3.
- **Solo lo ven el revisor y el taller, no la marca.** La marca conoce sus horas y la capacidad: con m* podría despejar la facturación total del taller y usarla para apretarle el precio.

### Por qué la estimación es un mínimo… solo si tú pagas por hora al menos lo mismo que los demás
- Sea p el precio por hora de trabajo que paga cada cliente: lo facturado ÷ las horas que exige, **con el material incluido si lo compra el taller**.
- Horas estimadas del resto = su facturación ÷ tu p. Horas reales = su facturación ÷ su p.
- **El error es exactamente la diferencia de precio por hora.** Si el resto paga un 25 % más por hora que tú, sobrestimamos su carga un 25 %; si paga un 25 % menos, la subestimamos un 25 %.

| Da **falsos verdes** (subestima) | Da **falsos rojos** (sobrestima) |
|---|---|
| Los demás pagan menos por hora que tú | Los demás pagan más por hora que tú |
| Tu precio incluye material y el de los demás no | El taller compra el material para los demás y tú le das el tuyo (trabajo «a façon», habitual en el lujo, según `investigacion/encaje_legal.md` §d, [Probable]) |
| Ventas sin factura (el 303 no las ve) | Ventas que no son producción en el 303 (una máquina, un alquiler) |
| Facturas que llegan tarde: trabajo de este trimestre facturado en el siguiente | Producción de otro trimestre facturada en este |

Por eso la regla 2 nunca da un rojo. El rojo solo sale con la regla 1, o con la regla 3 cuando todas las marcas del taller usan Trama, porque entonces no hay nada que estimar.

### 303 frente a 347 frente a restar

| | **Modelo 303** (IVA trimestral) | **Modelo 347** (operaciones con terceros) | **Restar lo que pagan las marcas de Trama** |
|---|---|---|---|
| Qué da | **Total de ventas del trimestre.** Bases por tipo de IVA (casillas 01, 04, 07, 150), más las exentas y no sujetas: 59 intracomunitarias, 60 exportaciones, 120… ✅ ([AEAT](https://sede.agenciatributaria.gob.es/Sede/todas-gestiones/impuestos-tasas/iva/modelo-303-iva-autoliquidacion_/instrucciones-2026.html)) | **Ventas a cada cliente**, con desglose trimestral ✅ ([diseño de registro](https://sede.agenciatributaria.gob.es/static_files/Sede/Disenyo_registro/DR_300_399/archivos/347.pdf)); también las **compras** a cada proveedor | Horas exactas de las marcas de Trama + estimación solo del resto |
| Cuándo llega | Del 1 al 20 del mes siguiente al trimestre (el 4.º, hasta el 30-ene) ✅ ([AEAT](https://sede.agenciatributaria.gob.es/Sede/iva/presentar-declaracion-iva-modelo-303/plazo-presentacion-modelo-303.html)) | **Una vez al año**, en febrero ✅ ([AEAT](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/folleto-actividades-economicas/8-declaraciones-informativas/8_2-declaracion-anual-operaciones-terceros-347.html)): entre 1 y 14 meses tarde | Igual que el 303 |
| Límites | Total, no por cliente. Los talleres en módulos (régimen simplificado) no declaran base de ventas ✅ | Solo clientes de más de **3.005,06 € al año, IVA incluido** ✅. **Solo operaciones nacionales**: las intracomunitarias van al 349 y las exportaciones quedan fuera ⚠ (fuentes secundarias). No lo presentan quienes llevan el SII (empresas de más de 6 M€) ✅ ([AEAT](https://sede.agenciatributaria.gob.es/Sede/todas-gestiones/impuestos-tasas/declaraciones-informativas/modelo-347-decla_____racion-anual-operaciones-personas_/excluidos-obligacion-presentar-modelo-347.html)) | Exige al menos 3 marcas del taller en Trama, y que Trama actúe como tercero (competencia y RGPD) |
| Margen de error | La diferencia de precio por hora entre la marca y **todo el resto** | **No lo arregla:** sabe cuánto factura cada cliente, pero no cuántas horas pide. Además, si los clientes extranjeros no aparecen, la parte de la marca española sale inflada y da **falsos verdes** | La misma diferencia de precio, pero **solo sobre la parte que no está en Trama**. Si las marcas de Trama son el 75 % de lo facturado, el error afecta al 25 % restante |
| Uso en Trama | **Motor trimestral** | **Comprobación anual:** lo que el taller dice que facturó a la marca frente a lo que ella le pagó; cuántos clientes tiene en España; y **pagos a otros talleres** de más de 3.005,06 € (señal de una subcontrata no declarada; idea por validar con un asesor fiscal) | Motor cuando hay 3 o más marcas |

**Ejemplo de la resta (inventado):**
- El taller factura 200.000 € en el trimestre.
- Tres marcas de Trama le pagan 150.000 € por **3.000 h exactas** (50 €/h).
- La cuarta, que no está en Trama, le paga 50.000 €. A 50 €/h, eso son **1.000 h** más: en total, 4.000 h frente a 4.000 h de alta (1,0, ámbar).
- Si la cuarta paga 40 €/h, son 1.250 h (1,06); si paga 100 €/h, son 500 h (0,88).
- El error solo toca a esa cuarta parte.

### Límites que se dicen
- **Material:** si las marcas pagan con material y sin él mezclados, la facturación no refleja el trabajo. La primera pregunta del revisor es «¿qué otros clientes y con material o sin él?».
- **Autónomos:** su 303 o su 347 son datos personales.
  - Trama solo recibe la cifra total del trimestre, firmada por la gestoría; nunca el modelo.
  - Base jurídica: interés legítimo ponderado, con evaluación de impacto (`investigacion/encaje_legal.md` §g).
- **Módulos:** el 303 no lleva ventas. Hay que usar el libro de facturas emitidas, vía la gestoría.
- **Desfase:** el 303 es trimestral y llega en unas 3 semanas. La estimación va un trimestre por detrás del semáforo mensual.
- **Horas complementarias:** en contratos a tiempo parcial, la capacidad debe sumarlas. Las declara la empresa cada mes y salen en la RNT (`investigacion/fuentes_horas.md` §3). Si no se suman, puede salir un falso rojo.
- **El margen de 1,10 cubre las horas extra legales:** 80 h/año por persona (art. 35.2 ET) son ≈4,5 % de una jornada de 1.768-1.789 h. Quedan unos 5 puntos para ruido de datos.

### Trama como tercero, cuando varias marcas lo usan
- Lo que reduce el riesgo según las Directrices horizontales (§§391, 407-408), siguiendo `investigacion/encaje_legal.md`, apartado de competencia:
  - un mínimo de 3 marcas;
  - «revisión abierta» con el mismo texto sea cual sea la causa, sin cifras;
  - un cortafuegos interno;
  - una revisión anual por un abogado de competencia.
- Con 2 marcas, la otra podría deducirse. En ese caso la suma solo la ven el taller y el revisor.
- **En el piloto, con una sola marca, la resta no se aplica:** solo las reglas 1, 2 y 4.

### Alternativas consideradas
- **Horas por cliente declaradas por el taller**, como hace Milán: es menos independiente.
- **Factura electrónica italiana (SdI):** da las ventas cliente a cliente casi en tiempo real. Para la fase 2.
- **Veri\*factu** en España: aplazado, con fechas sin confirmar en el BOE ⚠.
- **Consumo eléctrico por franjas:** señal débil. Solo la usa el revisor.

## Respuesta de 25 s

**«¿Y si el taller trabaja para cinco marcas?»** (67 palabras)
> «Para tu parte usamos tus pedidos; para el resto, la facturación del taller. Si tus pedidos llenan media plantilla y eres el 20 % de lo que factura, para que todo quepa las demás marcas tendrían que pagarle cuatro veces más por hora que tú. No vemos sus datos y no es una prueba: abre una revisión. Si tus pedidos solos ya no caben, es rojo directo.»

**«¿De dónde sale la facturación? ¿El 347?»** (64 palabras)
> «Lo que factura el taller sale de su IVA trimestral, el modelo 303. Si otras marcas usan Trama, sus horas son exactas y solo estimamos el resto. El error es la diferencia de precio por hora entre clientes, y por eso esa estimación abre una revisión, nunca un rojo. El 347 es anual y deja fuera a los clientes extranjeros: solo sirve para comprobar.»

## Qué cambia en la app o en el pitch
- **Pitch** (frases en `mentores/v1_negocio.md`):
  - en la escena «Taller con 4 marcas», decir «todas en Trama»;
  - en la ruta B de la demo, «abre una revisión», no «sale rojo».
- **App** (lo decide Producto; no tocar el cálculo con tests esta noche):
  1. El estado estimado del simulador se etiqueta «Estimación: abre revisión» en lugar de un rojo más.
  2. En `/como-calculamos` (sección «varias marcas»), añadir la regla del rojo directo, «la estimación nunca es un rojo» y «si 3 marcas o más del taller usan Trama, sus horas son exactas».
  3. La escena «Taller con 4 marcas» dice que las 4 usan Trama.
- **PREGUNTAS R4:** sustituir la respuesta actual por la segunda respuesta de 25 s.

## Qué sigue abierto
- Cuánto se parecen de verdad los precios por hora entre marcas, y cuántos talleres trabajan a façon frente a paquete completo: **NO SÉ** (preguntarlo en las llamadas).
- La regla de las 3 marcas es un criterio de diseño, no una cifra legal. Lo tiene que revisar un abogado de competencia.
- El papel de Trama en la suma conjunta (responsable o encargado del taller): decidirlo con un DPD.
- Que el 347 excluye las intracomunitarias y las exportaciones lo dicen fuentes secundarias: comprobarlo en las instrucciones oficiales.
- Que el 347 sirva para detectar subcontratas: lo tiene que confirmar un asesor fiscal.
