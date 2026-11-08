# v4 · Mentor 1, Pitch y relato: razonamiento (última ronda)

Ronda 3: **v3 = 6,73, la mejor** (global 7; fijos 6,70). Validación sigue en 4 y no tiene arreglo esta noche, así que no se maquilla. **v4 = 553 palabras** (versión B), con cuatro cambios pequeños y sin tocar lo que funciona: el caso con números, la demo de 3 clics, lo simulado dicho en voz alta, la cláusula cero, la visita sin aviso y el impacto medido en altas.

## Los cuatro cambios
1. **Suelo de minutos honesto** (profesora: «180 es el techo de una fábrica premium, no un suelo»). Tiene razón. El suelo es el **mínimo industrial publicado de cada prenda: 126 min** para una chaqueta forrada (BUFT, con la eficiencia real de una línea). 180 queda como **referencia premium** para contrastar.
   - Solución: «nunca por debajo del mínimo industrial publicado de cada prenda».
   - Demo: «Subproveedor B: con el mínimo industrial, 126 minutos, ya está al límite; con los de una fábrica premium, casi una vez y media: rojo».
   - Cifras comprobadas con `problemas/c_informe_complaciente.md` y `trama-mvp/src/data/escenas.ts` (12.250 h): 126 min → 1,03×, ámbar; 130 → 1,06×; 180 → 1,47×, rojo; el rojo empieza hacia 135 min (116 con 7.000 chaquetas). El proveedor directo, sin taller, sale rojo con cualquier minutaje.
   - Producto está alineando la escena con esta regla; si no llega, la tabla de clics dice qué hacer.
2. **Italia, de dónde sale el dato.** En el pitch, 8 palabras: «En Italia, del registro de horas del gestor». La respuesta completa va en la pregunta 19 y en la hoja: el LUL registra cada día las horas trabajadas y lo lleva el empleador o su consulente del lavoro; se cruza con el DURC y, si existe, con la Asse.Co (`fuentes_horas.md` §7). Sin copia pública verificable: por eso es la fase 2.
3. **«Nos fabricáis la prueba en contra»**, en la pregunta 20. Milán reprochó no verificar la capacidad. Loro Piana salió de la medida, según la empresa, valorando sistemáticamente la capacidad de sus proveedores. Los pedidos y los minutos ya son de la marca y las altas, de la Seguridad Social. Trama documenta que se miró y qué se corrigió. **No prometemos protección jurídica.**
4. **Canal, carta y coherencia con la hoja.**
   - Canal de entrada (por validar): un fabricante principal de Ubrique o Elche que produce para varias marcas.
   - Carta de intención, por perfil y sin nombres: cumplimiento y compras de una marca que fabrique en Italia y en España, o la dirección de ese fabricante.
   - Ponderación de la jornada parcial: el pitch dice la regla («con la jornada de cada contrato»). La hoja, J2 y la pregunta 2 dicen lo mismo con su estado: «respaldada por el Boletín RED 2011/13, por confirmar que sigue vigente; si no, la gestoría la calcula con el ITA».
   - Validación: la inversora vio que el pitch solo admitía «talleres y gestorías». Ahora dice «ninguna marca, gestoría, taller, sindicato ni ONG», igual que la hoja.

## Lo que QUITÉ, y por qué
| Quitado | Por qué |
|---|---|
| «Suelo de lujo, 180» (pitch, hoja, preguntas) | 180 es el techo de una fábrica premium. Llamarlo suelo no aguanta la pregunta |
| «y minutos estimados por nosotros» en la frase de lo simulado | Ahora la frase de la demo dice de dónde sale cada cifra de minutos. La hoja añade que los minutos reales de esa chaqueta no se conocen |
| «Subir el precio por pieza lo decide compras» | Paga las 8 palabras de Italia, que pidió el jurado de la ronda 3. Sigue en la hoja y en la pregunta 12 |
| «que la marca firmó» → «firmado», «grupos italianos de moda» → «grupos italianos» | Para no pasar de 560 |

## Avisos
- **Margen:** 553 palabras con la versión B (538 si no se escribió a ninguna marca). Con la versión A de la llamada, los tres cortes de «Si vamos tarde» (meta 2030, Inspección, Italia: −29).
- **Validación (4/10):** lo único que la sube son conversaciones reales antes de las 17:45: una gestoría que confirme el informe mensual y su precio, y alguien de cumplimiento o un fabricante de Ubrique o Elche. Reglas en `LLAMADAS.md` §4.
- **Para Producto:** la escena del caso Milán debe enseñar 126 (1,03×, ámbar) y 180 (1,47×, rojo). Si sigue diciendo «suelo de 180», el guion contradice a la pantalla.
