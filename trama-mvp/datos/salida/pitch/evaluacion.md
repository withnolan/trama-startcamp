# Evaluación del score · escenario «pitch» · semilla 2026 · **en datos sintéticos**

> Todas las cifras salen de talleres INVENTADOS por el generador, cuya verdad conocemos. No es una validación con clientes ni con datos reales. Score = motor actual del MVP (`semaforo.ts`), ventana de 3 meses que termina en 2026-10.

## Resumen

- Talleres: 26 · con problema real de capacidad: 3
- Detectados en **rojo**: 3 de 3 (100 %) · en rojo o ámbar: 100 %
- Precisión del rojo: 100 % · **falsos rojos** en talleres sin problema: 0
- Talleres sin informe que acaban en rojo: 0 (regla: nunca rojo por falta de datos)

## Por arquetipo

| Arquetipo | ¿Problema real? | Talleres | Verde | Ámbar | Rojo | Sin datos |
|---|---|---|---|---|---|---|
| sano | no | 12 | 10 | 2 | 0 | 0 |
| silencio_alta_rotacion | no | 2 | 2 | 0 | 0 | 0 |
| informe_tardio_o_ausente | no | 2 | 0 | 0 | 0 | 2 |
| pico_legitimo | no | 3 | 1 | 2 | 0 | 0 |
| subcontrata_oculta | sí | 3 | 0 | 0 | 3 | 0 |
| salario_retenido | no | 2 | 2 | 0 | 0 | 0 |
| horas_extra_excesivas | no | 2 | 2 | 0 | 0 | 0 |

## Matriz de confusión (alerta = rojo)

| | Rojo | No rojo |
|---|---|---|
| Problema real | 3 | 0 |
| Sin problema | 0 | 23 |

## Detalle por taller

| Taller | Arquetipo (verdad) | Ratio de pedidos sobre capacidad (verdad) | Score | Estado |
|---|---|---|---|---|
| TS-01 | sano | 0.53 | 0.53 | verde |
| TS-02 | silencio_alta_rotacion | 0.48 | 0.48 | verde |
| TS-03 | silencio_alta_rotacion | 0.85 | 0.85 | verde |
| TS-04 | sano | 0.85 | 0.86 | ámbar |
| TS-05 | informe_tardio_o_ausente | 0.72 | — | sin datos |
| TS-06 | pico_legitimo | 0.85 | 0.85 | ámbar |
| TS-07 | subcontrata_oculta | 1.33 | 1.33 | rojo |
| TS-08 | salario_retenido | 0.62 | 0.62 | verde |
| TS-09 | sano | 0.88 | 0.88 | ámbar |
| TS-10 | horas_extra_excesivas | 0.83 | 0.83 | verde |
| TS-11 | horas_extra_excesivas | 0.83 | 0.83 | verde |
| TS-12 | sano | 0.60 | 0.60 | verde |
| TS-13 | informe_tardio_o_ausente | 0.66 | — | sin datos |
| TS-14 | subcontrata_oculta | 1.44 | 1.44 | rojo |
| TS-15 | sano | 0.57 | 0.57 | verde |
| TS-16 | sano | 0.52 | 0.52 | verde |
| TS-17 | sano | 0.74 | 0.74 | verde |
| TS-18 | sano | 0.77 | 0.77 | verde |
| TS-19 | salario_retenido | 0.60 | 0.60 | verde |
| TS-20 | pico_legitimo | 0.86 | 0.86 | ámbar |
| TS-21 | sano | 0.45 | 0.45 | verde |
| TS-22 | sano | 0.66 | 0.66 | verde |
| TS-23 | pico_legitimo | 0.79 | 0.80 | verde |
| TS-24 | subcontrata_oculta | 1.48 | 1.48 | rojo |
| TS-25 | sano | 0.69 | 0.69 | verde |
| TS-26 | sano | 0.58 | 0.58 | verde |

## Límites (se dicen tal cual)

- Una sola semilla (N1): las cifras son ilustrativas, sin intervalo. N2 repite con 20 semillas.
- El score es un mínimo: solo ve los pedidos de esta marca. Una subcontrata oculta con poco exceso (ratio entre 1,0 y 1,1) sale en ámbar, no en rojo.
- Los minutos son los del escandallo sintético; en marroquinería no hay suelo público con el que contrastarlos.
