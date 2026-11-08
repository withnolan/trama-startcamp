# Mentor 4 · Impacto y regulación · ronda 3 (tras el jurado R2: 6,43)

**Qué pedía el jurado.** Primero, los minutos: «los minutos los pone quien paga», 3 de 3. Después, la experta en impacto (R2): quién cuenta a quien trabaja sin alta, cómo se sabe que a los 6 meses son las mismas personas, qué pasa con quien no tiene vía, que la cláusula proteja desde la entrada y una meta a 2030.

**Criterio.** Cerrar con reglas que se puedan comprobar y decir lo que no se puede prometer: no hay empleo legal sin autorización. Detalle en `problemas/c_informe_complaciente.md`, `problemas/metricas_impacto.md` (ronda 3) y `problemas/f_rojo_abandono.md`.

## Frases exactas
Orden de prioridad si no caben todas: 1, 2, 3, 4. Las que no entren en el guion van a preguntas.

**1. Suelo de minutos** (bloque de la solución o de la demo)
- Pitch (20 palabras):
  > «Los minutos son los del escandallo de la marca, nunca por debajo de un suelo público por prenda y segmento.»
- Hoja:
  > «Minutos por pieza: los del escandallo con el que paga compras, con historial de cambios. Trama usa el mayor entre ese valor y un suelo público por prenda y segmento: americana forrada, industrial ≥ 126 min (BUFT 2023) y premium o lujo ≥ 180 min (Création Gross). El revisor los contrasta en cada alerta. Piel y calzado: sin suelo público todavía (lo construye el piloto).»
- En la demo, con el caso Milán: «Aunque la marca declare 130 minutos, Trama usa el suelo de lujo, 180: sigue rojo.» Esto **sustituye a «rojo aunque bajes a 135»**.

**2. Personas sin alta** ([2:02–2:36], después de «medimos cuánta gente sigue de alta»)
- Pitch (21 palabras):
  > «A quien trabaja sin alta lo cuenta el revisor en una visita sin aviso; ni la marca ni Trama ven nombres.»
- Hoja:
  > «Personas sin alta: las cuenta el revisor independiente (sindicato u ONG, propuesta) en una visita sin aviso, antes de comunicar la alerta al proveedor. Lleva un censo confidencial que nunca llega a la marca ni a Trama: solo recuentos firmados, y "menos de 4" si son pocas. A los 6 meses coteja el censo con la lista de la gestoría y firma cuántas siguen de alta, en otro taller de la cadena, en trámite, sin vía y no localizadas (cuenta como no logrado). Sin vía: no se puede prometer empleo legal (LO 4/2000, art. 54.1.d). La ONG acompaña (derechos, cobro de lo trabajado según el art. 36.5) y la cifra se publica.»

**3. Meta 2030** (bloque de negocio o cierre)
- Pitch (22 palabras):
  > «Meta 2030, por validar: 600 talleres vigilados, unas 6.000 personas, y 90 altas al año de quien hoy trabaja sin alta.»
- Hoja:
  > «Meta 2030 (supuestos por validar): 600 talleres (año 3 de Negocio: 15 marcas × 40) × 10 personas = 6.000 personas en talleres vigilados. Con un 10 % de rojos al año, 60 alertas; con 3 personas sin alta por alerta, 180; con el 50 % de alta a los 6 meses, 90 altas al año. Metas: ≥ 80 % de la línea base de alta a los 6 meses, 0 bajas y ≥ 50 % del hueco cerrado con altas.»
- `mentores/v3_negocio.md` no existía al escribir esto. Si Negocio cambia los 600 talleres, se recalcula con la misma cuenta.

**4. Protección desde la entrada** ([2:02–2:36] o preguntas)
- Pitch (21 palabras):
  > «Y, por contrato, entrar en Trama no le cuesta el cliente a ningún taller: seis meses sin bajas por el semáforo.»
- Hoja:
  > «Desde la entrada (cláusula 0): durante 6 meses, la marca no da de baja ni recorta más del 20 % a un taller por entrar en Trama, por un ámbar o por un "sin datos". Trama publica cuántos proveedores dejaron de recibir pedidos.»

**Respuesta de 25 s nueva, para quien trabaja sin alta:** la de `problemas/metricas_impacto.md` (ronda 3).

## Cambios en la app para Producto (ronda 3; solo textos salvo P2-1)
| Prioridad | Archivo y clave | Cambio |
|---|---|---|
| P1 | `src/content/como-calculamos.ts` · `carga` | Suelo de minutos por prenda y segmento (126 / 180 min), «Trama calcula con el mayor», historial y «sin contrastar» en piel y calzado. Texto exacto en `problemas/c_…`, tabla de la app |
| P1 | `src/content/textos.ts` · `TEXTOS_ESCENAS.casoMilan` | `umbral` → «Suelo de minutos para una marca de lujo: 180 min. Si declara menos, Trama calcula con 180: 1,47×, rojo. Sin suelo, el rojo empezaría en ≈135 min.» · `pedidos.minutosNota` → «180 min: suelo público para premium y lujo» |
| P1 | `src/content/legal.ts` · `protocolo` | La visita sin aviso con censo confidencial va primero (≤ 7 días), antes de pedir explicaciones al proveedor (≤ 15 días). El revisor valida el plan en ≤ 30 días |
| P1 | `legal.ts` · `proteccion` | Añadir al principio la línea «Desde la entrada…» (`problemas/f_…`, punto 4) |
| P1 | `textos.ts` · `KPI_AYUDA.acompanados` | Añadir al principio: «Las cuenta el revisor en una visita sin aviso, con un censo confidencial: ni la marca ni Trama ven nombres.» |
| P2-1 | Simulador, escenario «Caso reconstruido» | Calcular con `Math.max(minutos, 180)` y avisar. Prueba en `simular.test.ts` (130 min → 1,47×, rojo) y **ajustar el e2e** «caso reconstruido → rojo → ámbar → verde» si baja los minutos |
| P2 | `src/data/seed.json` · hitos H6 y H8 (solo texto) | H6 → «Resolución de los permisos art. 18 (vía social) y alta de quien lo obtenga» · H8 → «Revisión a 6 meses: el revisor coteja su censo y firma cuántas personas de la línea base siguen de alta» |

Si siguen pendientes, los cambios de la ronda 1 están en `problemas/metricas_impacto.md` (puntos 1-6) y en la tabla de `problemas/c_…`. En «Hueco cerrado con altas nuevas» ya no aparece la palabra «regularizadas».

## Lo que no se cierra esta noche
- Ningún sindicato ni ONG ha aceptado llevar el censo ni hacer de revisor.
- No hay suelo de minutos para piel y calzado, que es la fase 1.
- Los supuestos S1-S4 de la meta 2030 no los ha medido nadie.
- En la demo, la visita (H3) va después de la declaración del proveedor (H1): el seed es anterior a la regla.
