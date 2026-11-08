# Evaluación del score · escenario «pitch» · semilla 2026 · **en datos sintéticos**

> Todas las cifras salen de talleres INVENTADOS por el generador, cuya verdad conocemos. No es una validación con clientes ni con datos reales. Score = motor actual del MVP (`semaforo.ts`), ventana de 3 meses que termina en 2026-10.

## Resumen

- Talleres: 20 · con problema real de capacidad: 3
- Detectados en **rojo**: 2 de 3 (67 %) · en rojo o ámbar: 100 %
- Precisión del rojo: 100 % · **falsos rojos** en talleres sin problema: 0
- Talleres sin informe que acaban en rojo: 0 (regla: nunca rojo por falta de datos)

## Por arquetipo

| Arquetipo | ¿Problema real? | Talleres | Verde | Ámbar | Rojo | Sin datos |
|---|---|---|---|---|---|---|
| sano | no | 12 | 12 | 0 | 0 | 0 |
| subcontrata_oculta | sí | 3 | 0 | 1 | 2 | 0 |
| pico_legitimo | no | 3 | 2 | 1 | 0 | 0 |
| informe_tardio_o_ausente | no | 2 | 0 | 0 | 0 | 2 |

## Matriz de confusión (alerta = rojo)

| | Rojo | No rojo |
|---|---|---|
| Problema real | 2 | 1 |
| Sin problema | 0 | 17 |

## Detalle por taller

| Taller | Arquetipo (verdad) | Ratio de pedidos sobre capacidad (verdad) | Score | Estado |
|---|---|---|---|---|
| TS-01 | sano | 0.47 | 0.47 | verde |
| TS-02 | sano | 0.52 | 0.52 | verde |
| TS-03 | subcontrata_oculta | 1.04 | 1.04 | ámbar |
| TS-04 | sano | 0.66 | 0.67 | verde |
| TS-05 | sano | 0.56 | 0.56 | verde |
| TS-06 | sano | 0.72 | 0.72 | verde |
| TS-07 | pico_legitimo | 0.80 | 0.80 | verde |
| TS-08 | subcontrata_oculta | 1.73 | 1.73 | rojo |
| TS-09 | informe_tardio_o_ausente | 0.86 | — | sin datos |
| TS-10 | pico_legitimo | 0.94 | 0.93 | ámbar |
| TS-11 | sano | 0.61 | 0.61 | verde |
| TS-12 | pico_legitimo | 0.82 | 0.82 | verde |
| TS-13 | subcontrata_oculta | 1.50 | 1.50 | rojo |
| TS-14 | informe_tardio_o_ausente | 0.54 | — | sin datos |
| TS-15 | sano | 0.48 | 0.48 | verde |
| TS-16 | sano | 0.53 | 0.53 | verde |
| TS-17 | sano | 0.47 | 0.47 | verde |
| TS-18 | sano | 0.74 | 0.74 | verde |
| TS-19 | sano | 0.47 | 0.47 | verde |
| TS-20 | sano | 0.64 | 0.64 | verde |

## Límites (se dicen tal cual)

- Una sola semilla (N1): las cifras son ilustrativas, sin intervalo. N2 repite con 20 semillas.
- El score es un mínimo: solo ve los pedidos de esta marca. Una subcontrata oculta con poco exceso (ratio entre 1,0 y 1,1) sale en ámbar, no en rojo.
- Los minutos son los del escandallo sintético; en marroquinería no hay suelo público con el que contrastarlos.
