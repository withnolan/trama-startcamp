# c) Integridad de los dos datos: horas (fuente TGSS) y minutos por pieza

Mentor 4 · Impacto y regulación · 8-nov-2026. No es asesoramiento jurídico. ✅ = leído en fuente · ⚠ = secundaria o lectura nuestra · ❓ = sin resolver.

El semáforo divide dos cifras y cada una se puede falsear desde un lado distinto. **El taller** puede inflar el denominador (las horas). **La marca** puede rebajar el numerador (los minutos). Las dos defensas tienen que funcionar sin fiarse de nadie.

## Decisión

**1. Horas: el dato lo emite la Tesorería, no lo firma nadie.**
- **Fuente mensual en España.** El *Informe de Plantilla Media de Trabajadores en Alta* de la TGSS, que el gestor del taller (autorizado RED) descarga del Sistema RED y envía tal cual, con su huella.
- **Trama no acepta cifras tecleadas ni certificados redactados por el gestor.** El gestor no certifica nada, así que no tiene nada que «complacer».
- **Tras una alerta,** el revisor coteja en la gestoría la lista nominal (ITA o vida laboral del código de cuenta de cotización). Los nombres no salen de allí.

**2. Minutos: los del escandallo con el que la marca paga, con historial, y con suelo.**
- **De dónde salen.** Los minutos de cada pieza son los de la ficha de costes que compras usa para fijar el precio. No se escriben aparte para Trama.
- **Historial.** Cada versión queda guardada con fecha y autor.
- **Suelo.** El semáforo usa el mayor de dos valores: los minutos de la marca o el suelo público de la categoría, si existe. Para una americana forrada, el suelo es de unos 126 min. Si no hay referencia, la pieza se marca «minutos sin contrastar».
- **El revisor** contrasta los minutos en cada alerta y cuando la marca los rebaja.

**3. La frase del v5 se mantiene, con un matiz.** Se dice «gente que no trabaja allí» (como ya dice el v1), no «gente que no existe». En preguntas se reconoce el hueco del personal que no cose (abajo).

## Por qué

**Horas**

| Afirmación | Estado | Fuente |
|---|---|---|
| El informe de plantilla media da la plantilla de un código de cuenta de cotización (CCC) en un periodo. Pondera la jornada parcial, por remisión a la DA 12.ª del TRLIS. | ✅ (metodología de 2011: hay que validarlo con un informe real) | [Noticias RED 2011/13](https://www.seg-social.es/descarga/es/160888) · [TRLIS, DA 12.ª](https://www.boe.es/buscar/act.php?id=BOE-A-2004-4456) |
| Lo impreso desde RED tiene la misma validez frente a terceros que una certificación de la TGSS y es verificable con huella o CEA. | ✅ en general · ⚠ no consta que el servicio público de verificación admita este informe | [Orden ESS/484/2013, art. 9](https://www.boe.es/buscar/act.php?id=BOE-A-2013-3362) · [Sede: verificación con huella](https://sede.seg-social.gob.es/wps/portal/sede/sede/Ciudadanos/Otros+Procedimientos/202287) |
| El autorizado RED responde de todo lo que transmite, y la TGSS le retira la autorización por uso abusivo o fraudulento. | ✅ | [Orden ESS/484/2013, arts. 5.2 y 7](https://www.boe.es/buscar/act.php?id=BOE-A-2013-3362) |
| Retocar un informe de la TGSS sería alterar un documento oficial (art. 392 CP). Un certificado «complaciente» con firma auténtica, en cambio, difícilmente es falsedad: a un particular no se le castiga por faltar a la verdad (art. 390.1.4.º). | ⚠ lectura nuestra | [Código Penal (BOE)](https://www.boe.es/buscar/act.php?id=BOE-A-1995-25444) · `investigacion/fuentes_horas.md` §8 |
| **¿Es exacta la frase «para falsearlo habría que dar de alta a gente que no existe y pagar sus cotizaciones»?** En lo esencial, sí. Más capacidad en alta exige más altas o más jornada declarada, es decir, cotizaciones reales cada mes, y el documento no se puede editar sin romper la huella. Pero tiene **dos matices**. (a) Se dice «gente que no trabaja allí», no «que no existe». (b) Hay una vía barata que no es fraude: si el CCC incluye personal que no cose (oficina, tienda u otro centro), la capacidad sale inflada. Por eso se pide el CCC del centro de producción, el revisor lo mira en la visita y el resultado se presenta como un mínimo. | ⚠ razonamiento propio | `investigacion/fuentes_horas.md` §8 |
| **Consulta del art. 16.6 LGSS.** Quien contrata obras o servicios de su propia actividad debe comprobar el alta de cada trabajador de la contrata antes de que empiece (no hacerlo es infracción grave, art. 22.11 LISOS). La transacción RED «Consulta de alta de trabajadores en otra empresa» permite, con autorización previa del taller (cesión tipo 03), saber si una persona estaba de alta en una fecha. Uso en Trama: solo tras una alerta, solo para las personas vistas en la visita sin aviso, y el resultado no entra en Trama. | ✅ norma y transacción · ⚠ que sirva fuera de la «propia actividad» si el taller lo autoriza | [LGSS, art. 16.6 (BOE)](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724) · [Noticias RED 2012/07](https://www.seg-social.es/descarga/es/169745) · [LISOS, art. 22.11](https://www.cuestioneslaborales.es/ley-infracciones-sanciones-orden-social/articulo-22/) |
| **Quién paga al gestor.** La marca, a través de Trama: el informe se paga a coste, aparte de la cuota (`problemas/h_precio_mercado.md`). Aun así, el gestor sigue siendo el gestor del taller. Por eso la defensa no es quién le paga, sino que no firma nada: entrega un documento ajeno. | diseño · ⚠ coste por validar con 2-3 gestorías | `LLAMADAS.md` |
| **Italia es más débil.** El LUL lo lleva el empleador o su consulente y no tiene verificación pública. Ahí sí vale lo que su firmante, y se apoya en la Asse.Co si el taller la tiene (anual, con revisión cuatrimestral). | ✅ | `investigacion/fuentes_horas.md` §7 |

**Comprobaciones cruzadas** (solo las baratas; ninguna es una prueba)
1. Huella del informe y CCC del centro de producción.
2. Tendencia: si la carga sube y la plantilla no se mueve, es una señal (ya está en el cálculo de la ventana).
3. Facturación del taller frente a capacidad (modelo 347, `problemas/b_varias_marcas.md`).
4. Tras una alerta: lista nominal en la gestoría, visita sin aviso y consulta de alta (art. 16.6 LGSS) de las personas vistas.
5. Consumo eléctrico por franjas: señal débil (se usó en el caso Dior, según Reuters).

**Minutos por pieza**

| Afirmación | Estado | Fuente |
|---|---|---|
| Referencias públicas para una americana forrada: 73-76 min estándar solo de costura en producción masiva, ≈126 min reales con la eficiencia normal de una línea (60 %), hasta 180 min en una fábrica premium y más de 960 min en el lujo artesanal. **Ningún dato de cachemir.** | ✅ fuentes · ⚠ son declaraciones comerciales salvo el estudio de BUFT | [BUFT 2023](https://buft.edu.bd/upload/_page/P-7.pdf) · [Création Gross](https://fashionunited.uk/press/fashion/creation-gross-fashion-made-in-germany/2021111559279) · [Brioni, Il Sole 24 Ore](https://en.ilsole24ore.com/art/in-the-abruzzi-village-where-brioni-grow-new-tailors-AGeai4aB) · `investigacion/minutos_chaqueta.md` |
| **La objeción del jurado es cierta en parte.** Subproveedor con 7 personas (≈ 12.250 h al año): con 6.000 chaquetas, 130 min dan 13.000 h → **1,06×, ámbar**. Con 7.000 chaquetas dan 15.167 h → 1,24×, rojo. Con el suelo de 126 min y 6.000 chaquetas: 1,03×, ámbar. Con 180 min: 1,47×, rojo. El rojo empieza en ≈135 min con 6.000 al año y en ≈116 min con 7.000. | cálculo (umbral rojo 1,10) | `DATA_MODEL.md` §2.5 |
| **Por qué no se cae el caso.** (1) El proveedor directo no tenía taller: sin plantilla de producción, sale rojo con cualquier minutaje. Límite: si tuviera personal de oficina de alta, contaría como capacidad. (2) Un ámbar no es «nada»: obliga a pedir una explicación al proveedor. (3) 126-130 min es el estándar de una línea de producción masiva y solo de costura; una chaqueta de lujo no baja de ahí. | ⚠ razonamiento propio | — |
| **Rebajar minutos deja rastro y tiene coste.** Son los minutos con los que compras paga: rebajarlos rebaja el precio al taller, y el taller lo ve en lo que cobra. Además, cada versión queda guardada con fecha y autor en el mismo expediente que «documenta que la empresa vigiló». Ese expediente documenta también si la marca rebajó los minutos justo después de un ámbar. | diseño | — |

## Respuesta de 25 s

**«¿Y si el gestor firma lo que le pide el taller?»** (69 palabras)
> «No le pedimos a nadie que firme horas. El dato es un informe de la Tesorería de la Seguridad Social que el gestor descarga y nos envía sin tocar. Para inflarlo, el taller tendría que dar de alta a gente que no trabaja allí y pagar sus cotizaciones. Y tras una alerta, el revisor, pagado por la marca, coteja la lista nominal en la gestoría y visita sin avisar.»

**«¿Y si la marca baja los minutos para no ver rojos?»** (67 palabras)
> «Los minutos no se teclean para Trama: son los del escandallo con el que la marca paga cada pieza, y cada cambio queda guardado con fecha y autor. Si bajan de la referencia pública de su categoría (una americana forrada, unos 126 minutos en producción masiva), Trama calcula con la referencia. Y en el caso Milán, el proveedor directo sale rojo con cualquier minutaje: no tenía taller.»

## Qué cambia en la app o en el pitch

**Pitch.** Nada nuevo en el guion. «Para falsearlo, habría que dar de alta a gente que no trabaja allí y pagar sus cotizaciones» ya está bien en el v1. En la demo, «Y rojo aunque bajes a 135» es exacto (umbral 134,75 min). **No decir «rojo con cualquier minutaje» del subproveedor:** eso solo vale para el proveedor directo.

**App (Producto; solo textos, sin tocar el cálculo ni el seed).** P1 = imprescindible; P2 = si hay tiempo.

| Prioridad | Archivo y clave | Hoy dice | Debe decir |
|---|---|---|---|
| P1 | `src/content/como-calculamos.ts` · `horas`, línea España | «España: el gestor laboral o graduado social las saca del Informe de Trabajadores en Alta (ITA) […] y firma solo el total.» | «España: sale del Informe de Plantilla Media de Trabajadores en Alta de la Seguridad Social (Sistema RED), que ya tiene en cuenta la jornada parcial. El gestor lo descarga y lo envía tal cual: nadie firma una cifra. Horas de alta = plantilla media × jornada anual de convenio ÷ 12. La lista nominal (ITA) solo la mira el revisor tras una alerta, en la gestoría.» |
| P1 | `como-calculamos.ts` · `limites` | «El informe vale lo que su firmante: se apoya en la responsabilidad profesional del gestor laboral, del graduado social o del consulente del lavoro.» | «España: el informe es de la Seguridad Social; el gestor solo lo descarga. Italia: el LUL lo lleva el taller o su consulente y no tiene verificación pública, así que ahí el dato vale lo que su firmante.» |
| P1 | `como-calculamos.ts` · `carga`, tras «…para fijar el precio.» | — | Añadir: «Cada cambio de minutos queda guardado con fecha y autor. Si están por debajo de la referencia pública de su categoría (americana forrada: unos 126 min en producción masiva; hasta 180 en una fábrica premium), se calcula con la referencia.» |
| P1 | `textos.ts` · `TEXTOS_ESCENAS.casoMilan`, junto a `umbral` | «Rojo a partir de ≈135 min por chaqueta (con 6.000 al año).» | Añadir debajo: «Entre 126 y 134 min sale ámbar: se pide una explicación al proveedor. El proveedor A sale rojo con cualquier minutaje.» |
| P2 | `textos.ts` · `ORIGEN_HORAS.ES` | «Personas de alta en la Seguridad Social (ITA) × jornada pactada» | «Plantilla media en alta (Seguridad Social, Sistema RED) × jornada de convenio» |
| P2 | `src/data/vista.ts:55` · `fuente` de `gestor_laboral` | «a partir del ITA de la Seguridad Social» | «a partir del informe de plantilla media de la Seguridad Social». **Hay que actualizar también `src/data/vista.test.ts:92`**, que espera el texto antiguo. |
| P2 | Simulador (`TEXTOS_SIMULADOR` + `SimuladorSemaforo`) | — | Si los minutos son menos de 126: «Por debajo de la referencia pública (≈126 min): en producción, Trama calcularía con la referencia». Solo un aviso; el cálculo no cambia. |

## Qué sigue abierto
- Ver un informe de plantilla media real. Comprobar que pondera la parcialidad (prueba: una persona al 50 % todo el mes debe dar 0,50) y si un tercero puede verificar su huella.
- Coste real para la gestoría: no hay tarifa publicada; validarlo con 2-3 gestorías (`LLAMADAS.md`).
- Si la consulta de alta del art. 16.6 LGSS funciona con autorización voluntaria cuando el encargo no es de la «propia actividad».
- **El suelo de minutos solo existe para la americana forrada.** No tenemos referencia de cachemir, de chaqueta de mujer ni de bolsos y cinturones: esas piezas quedan «sin contrastar» hasta tener una fuente.
- Italia: el LUL no tiene verificación pública. La integridad allí depende del consulente y de la Asse.Co.
