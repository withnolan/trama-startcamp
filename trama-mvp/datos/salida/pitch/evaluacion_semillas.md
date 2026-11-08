# Evaluación con 20 semillas · escenario «pitch» · **en datos sintéticos**

> Talleres INVENTADOS por el generador, cuya situación real conocemos. No es una validación con clientes ni con datos reales. Semillas 1-20; 20 talleres por semilla. En las tablas, cada cifra es la media entre semillas y, entre paréntesis, los percentiles 5 y 95 (sin paréntesis: igual en todas las semillas). v1 = motor actual del MVP (`semaforo.ts`); v2 = score v2 (`score.ts`: suelo de minutos, LUL en Italia sin exigir Asse.Co, cuota de facturación que abre revisión). Mismos umbrales.

## 5 frases para el pitch

1. En datos sintéticos (20 semillas de 20 talleres inventados; 60 casos con un problema real de capacidad en total), Trama pone en rojo el 90 % (intervalo 5-95 % entre semillas: 65-100 %) de los talleres con problema.
2. En datos sintéticos, el 100 % (igual en las 20 semillas) de los talleres con un problema real queda al menos en ámbar, que ya obliga a pedir una explicación al proveedor.
3. En datos sintéticos, ninguno de los 340 talleres sin problema real (sano, pico_legitimo, informe_tardio_o_ausente) salió en rojo en las 20 semillas: 0 falsos rojos.
4. En datos sintéticos, ningún taller sin informe acabó en rojo en las 20 semillas (0 casos): si falta el dato, Trama dice «sin datos», no acusa.
5. En datos sintéticos, un pico legítimo de un mes acaba en rojo en el 0 % (igual en las 20 semillas) de los casos y en rojo o ámbar en el 20 % (intervalo 5-95 % entre semillas: 0-35 %): la ventana de 3 meses lo absorbe.

## Global (v1 frente a v2)

| Métrica | v1 | v2 |
|---|---|---|
| Talleres con problema real en rojo (sensibilidad) | 90 % (65-100) | 90 % (65-100) |
| Talleres con problema real en rojo o ámbar | 100 % | 100 % |
| Rojos que tienen un problema real (precisión) | 100 % | 100 % |
| Rojos entre talleres sin problema real (falsos rojos) | 0 % | 0 % |
| Talleres sin informe en rojo (casos en total; debe ser 0) | 0 | 0 |
| `varias_marcas` con revisión abierta | — | — |

Talleres que cambian de estado de v1 a v2 (todas las semillas): 0. Con este generador (España, piel sin suelo público, sin cuotas) v1 y v2 coinciden; las diferencias aparecerán con Italia sin Asse.Co, minutos rebajados con suelo y varias marcas.

## Por arquetipo (v1 → v2)

| Arquetipo | ¿Problema real? | Talleres (todas las semillas) | En rojo | En rojo o ámbar | Sin datos | Revisión abierta (v2) |
|---|---|---|---|---|---|---|
| sano | no | 240 | 0 % → 0 % | 2 % (0-9) → 2 % (0-9) | 0 % → 0 % | 0 % |
| pico_legitimo | no | 60 | 0 % → 0 % | 20 % (0-35) → 20 % (0-35) | 0 % → 0 % | 0 % |
| informe_tardio_o_ausente | no | 40 | 0 % → 0 % | 0 % → 0 % | 100 % → 100 % | 0 % |
| subcontrata_oculta | sí | 60 | 90 % (65-100) → 90 % (65-100) | 100 % → 100 % | 0 % → 0 % | 0 % |

## Curva del umbral rojo (score v2; el producto sigue en 1,10)

| Umbral rojo | Sensibilidad (rojo) | Falsos rojos en talleres sin problema |
|---|---|---|
| 1,00 | 97 % (67-100) | 0 % |
| 1,05 | 95 % (65-100) | 0 % |
| 1,10 (actual) | 90 % (65-100) | 0 % |
| 1,15 | 88 % (65-100) | 0 % |
| 1,20 | 83 % (33-100) | 0 % |
| 1,25 | 77 % (33-100) | 0 % |
| 1,30 | 73 % (33-100) | 0 % |

El umbral de los talleres de 3 personas o menos se mueve a la vez y conserva su margen (+0,15).

## Efecto del suelo de minutos (v1 frente a v2)

- Talleres por semilla en los que el suelo cambia el cálculo: 0; de ellos cambian de estado: 0; pasan a rojo: 0.
- El escenario de estas semillas no tiene el arquetipo `minutos_rebajados`: el efecto del suelo todavía no se puede medir con este generador.

## Qué NO detecta (por construcción)

- Personal sin alta o altas a media jornada falsas: si la carga de pedidos de la marca cabe en las horas declaradas, no hay ninguna señal. El score compara pedidos con horas de alta; no cuenta personas.
- Trabajo de otras marcas que no están en Trama: sin cuota de facturación es invisible; con cuota solo abre una revisión, nunca da rojo (por diseño).
- Subcontrata oculta con poco exceso (ratio entre 1,0 y 1,1): sale en ámbar, no en rojo.
- Minutos rebajados en piel y calzado: no hay suelo público, así que el suelo no actúa y la rebaja solo queda en el historial del escandallo.
- Talleres sin informe: «sin datos», nunca rojo. Es una regla del producto, no un fallo de detección.
- Es un mínimo con los pedidos de una marca: si el problema no deja huella en los datos que llegan, ningún score lo ve.

## Cómo se ha calculado

- Por cada semilla: el generador crea los archivos y la verdad oculta; la ingesta lee solo los archivos; v1 y v2 puntúan el dataset; solo después se compara con la verdad.
- Percentiles 5-95 con interpolación lineal entre semillas. Una tasa sin denominador (p. ej. un arquetipo ausente en una semilla) no cuenta para esa semilla.
- Meses hasta la detección: no medido (el generador evalúa un único mes).
