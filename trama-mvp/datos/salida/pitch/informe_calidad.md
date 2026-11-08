# Informe de calidad · escenario «pitch» · SINTÉTICO

> Datos SINTÉTICOS: talleres, pedidos, informes y cuotas inventados por el generador. Ninguna cifra describe un taller real.

## Resumen

- Estado de la ingesta: **OK** · mes de evaluación 2026-10 · hash de los archivos crudos: `5565b588eee6648d…`
- Archivos: talleres.csv (20 filas) · escandallo.csv (5 filas) · pedidos_erp.csv (228 filas) · informe_plantilla_es.csv (117 filas)
- Talleres: 20 (20 ES · 0 IT · 0 subcontratas declaradas)
- Pedidos de la marca: 228 (0 subencargos) · piezas: 5 · versiones de escandallo: 5
- Informes de horas: 117 (117 informes de plantilla ES · 0 LUL IT) · cuotas de facturación de la marca: 0
- Incidencias: 0 bloqueantes (filas descartadas) · 2 avisos · 11 informativas
- Completitud de informes: 117 de 120 taller·mes (98 %)

## Incidencias por código y gravedad

| Código | Bloqueante | Aviso | Info | Total |
|---|---|---|---|---|
| TALLER_MICRO | · | · | 6 | 6 |
| MINUTOS_SIN_CONTRASTAR | · | · | 5 | 5 |
| FALTA_INFORME | · | 2 | · | 2 |

## Completitud por taller y mes

✓ informe a tiempo · ✗ falta · R rectificado (gana la emisión más reciente) · T tardío (emitido después del mes siguiente)

| Taller | 05/26 | 06/26 | 07/26 | 08/26 | 09/26 | 10/26 |
|---|---|---|---|---|---|---|
| TS-01 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-02 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-03 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-04 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-05 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-06 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-07 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-08 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-09 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| TS-10 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-11 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-12 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-13 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-14 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| TS-15 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-16 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-17 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-18 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-19 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TS-20 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## El 5 % de talleres con más incidencias (1)

- **TS-14** · 2 incidencias (bloqueantes 0 · avisos 1) · FALTA_INFORME ×1, TALLER_MICRO ×1

## Filas descartadas por motivo

Ninguna fila descartada.

**0 filas de otras marcas descartadas por separación entre marcas** (pedidos y cuotas; no se dice de qué marca son).

## Detalle de bloqueantes

Ninguna.

## Detalle de avisos

- **FALTA_INFORME** · taller:TS-09 · Sin informe de horas de 2026-10.
- **FALTA_INFORME** · taller:TS-14 · Sin informe de horas de 2026-09, 2026-10.

## Notas

- Italia: las horas salen del LUL agregado (`ore_registrate_totali`). El motor v1 solo cuenta un informe italiano con Asse.Co vigente (`viaAsseCo`); el score v2 no lo exige y usa Asse.Co y DURC como indicadores de calidad.
- Códigos usados por cercanía (el contrato no tiene uno propio): rebaja de minutos > 20 % entre versiones → `MINUTOS_SIN_CONTRASTAR` (aviso); informe italiano sin Asse.Co → `FIRMANTE_INCOHERENTE` (info); nivel o padre incoherente en talleres → `TIPO_INVALIDO` / `REFERENCIA_DESCONOCIDA`; subencargo a un taller que no es subcontrata del taller origen → `REFERENCIA_DESCONOCIDA`; ninguna versión de escandallo vigente → `FECHAS_INVALIDAS` (aviso); falta el archivo → `CABECERA_INVALIDA`.
- Las incidencias son indicios de calidad del dato, no conclusiones sobre ningún taller. Trama propone; decide una persona.

> Privacidad: el dataset solo contiene totales por taller y mes; ningún dato por persona (ni nombres, ni DNI/NIE, ni horas por persona, ni situación migratoria). Cada marca ve solo sus pedidos y sus cuotas.
