# Informe de calidad · escenario «pitch» (datos SINTÉTICOS)

- Estado de la ingesta: **OK** · hash de los archivos crudos: `5565b588eee6648d…`
- Archivos: talleres.csv (20 filas) · escandallo.csv (5 filas) · pedidos_erp.csv (228 filas) · informe_plantilla_es.csv (117 filas)
- Ingeridos: 20 talleres · 228 pedidos · 117 informes de plantilla · 5 piezas
- Incidencias: 0 bloqueantes (filas descartadas) · 2 avisos · 11 informativas

## Incidencias por código

| Código | Gravedad | Nº |
|---|---|---|
| TALLER_MICRO | info | 6 |
| MINUTOS_SIN_CONTRASTAR | info | 5 |
| FALTA_INFORME | aviso | 2 |

## Detalle (bloqueantes y avisos)

- **FALTA_INFORME** · taller:TS-09 · Sin informe de 2026-10.
- **FALTA_INFORME** · taller:TS-14 · Sin informe de 2026-09, 2026-10.

> Privacidad: el dataset solo contiene totales por taller y mes; ningún dato por persona.
