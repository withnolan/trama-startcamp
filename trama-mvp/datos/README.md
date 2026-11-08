# Pipeline de datos de Trama (datos SINTÉTICOS)

> Todo lo que describe talleres, pedidos y plantillas es **inventado** por un generador con semilla. Solo son reales los
> parámetros públicos que lo calibran (INE, BOE), cada uno con su URL. Encargo completo: `../../SUPERPROMPT_DATOS.md`.

## Ejecutar (sin internet)

```bash
npm run datos:todo          # generar → ingerir → evaluar el escenario «pitch» con la semilla 2026
```

Por pasos: `npm run datos:generar -- --escenario pitch --semilla 2026` · `npm run datos:ingerir -- --escenario pitch` ·
`npm run datos:evaluar -- --escenario pitch`. Misma semilla → mismos bytes (comprobado con hash).

## Flujo

```
parámetros públicos (INE, BOE) ─┐
                                ▼
generador (semilla) ──► crudo/<esc>/*.csv ──► ingesta (parsear, validar, procedencia) ──► salida/<esc>/dataset.json
        │                (lo que «llega» a Trama)          │                                   │
        │                                                  └──► informe_calidad.md             ▼
        └──► verdad/<esc>/verdad.json ─────────────────────────────────────────► evaluación ◄── score (semaforo.ts)
             (nunca la leen ni la ingesta ni el score)                            │
                                                                                  └──► evaluacion.md / .json
```

## Carpetas

| Carpeta | Qué hay |
|---|---|
| `crudo/<esc>/` | `talleres.csv`, `escandallo.csv`, `pedidos_erp.csv`, `informe_plantilla_es.csv` (imita el informe de plantilla media en alta; SIMULADO) |
| `verdad/<esc>/` | Arquetipo real de cada taller (sano, pico legítimo, subcontrata oculta, informe ausente…) |
| `salida/<esc>/` | `dataset.json` (Seed compatible con el motor del MVP + procedencia + incidencias), `informe_calidad.md`, `scores.json`, `evaluacion.json`, `evaluacion.md` |
| `exclusion_nombres.txt` | Nombres reales que el generador nunca puede producir |

## Qué es real, qué es supuesto y qué es sintético

- **Real (con fuente):** distribución de empresas de cuero y calzado por tramo de asalariados (INE, DIRCE 2025, tabla
  73019); jornada anual del convenio de marroquinería, 1.768 h (BOE-A-2024-6193; pendiente de verificar en el texto).
- **Supuestos (N1):** parcialidad media del 85-100 %; carga de un taller sano del 45-85 % de su capacidad; pico legítimo de
  1,3-1,6× en un solo mes; subcontrata oculta de 1,0-2,0×; minutos por pieza del escandallo sintético.
- **Sintético:** talleres, nombres (todos «(ficticio)»), pedidos, informes y gestorías.

## Estado: nivel N1 (esqueleto que funciona)

España, 20 talleres, 4 arquetipos, 1 semilla, score = motor actual (`src/lib/calculo/semaforo.ts`, sin cambios).
N2 añade parámetros capturados por API, los 10 arquetipos, Italia, versiones del escandallo, todas las validaciones,
score v2 (suelo de minutos, LUL, confianza) y evaluación con 20 semillas e intervalos.

**Todas las cifras de la evaluación son «en datos sintéticos»**: no son una validación con clientes ni con datos reales.
