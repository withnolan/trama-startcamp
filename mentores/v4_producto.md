# Mentor 2 · Producto y demo — ronda 4 (8-nov, 03:00–03:25)

**Qué cambia.** La profesora del jurado R3 tiene razón: 180 min no es un suelo, es lo que declara como máximo una fábrica premium. La regla nueva vale igual para el pitch y para la app. El **suelo externo es el mínimo industrial: 126 min** por americana forrada. **180 min queda como referencia premium o lujo.** Lo he aplicado en la escena del caso Milán, en `/como-calculamos` (`carga` y `caso-publico`) y en la nota del escenario del simulador.

**Cifras que muestra ahora la escena.** Salen de `clasificar` y las fija `escenas.test.ts`, no están supuestas:
- Proveedor A, sin taller propio: 18.000 h ÷ 0 h = **∞, rojo siempre**, con cualquier minutaje.
- Subproveedor B, con 180 min: 18.000 h ÷ 12.250 h = **1,47×, rojo**.
- Subproveedor B, con el suelo externo de 126 min: 12.600 h ÷ 12.250 h = **1,03×, ámbar**.
- El rojo empieza en **≈135 min**.
- En el simulador, que cuenta por trimestre: 126 min → 1,0×, ámbar; 180 min → 1,5×, rojo.

**Sin tocar.** `lib/calculo` y T1 (240 min, ficticio).

**Pruebas.** El e2e escribe 126 en el campo numérico, porque el deslizador va de 10 en 10 y lo llevaría a 130. La prueba de la escena exige «1,03×».

**Riesgo.** «Ámbar con el mínimo industrial» es una cifra honesta, pero quita dramatismo. El pitch debe decir «rojo con minutos de fábrica premium; ámbar incluso con el mínimo industrial», y recordar que el proveedor directo sale rojo siempre.

**Verificación.** lint 0 · tests 101/101 · build OK · e2e 25/25 · capturas 35/35. He mirado la 15, la 07 y las secciones de la 13.
