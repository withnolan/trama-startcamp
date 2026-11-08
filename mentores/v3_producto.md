# Mentor 2 · Producto y demo — ronda 3 (8-nov, 02:10–02:55)

## Qué he aplicado (solo los P1 de Impacto; rama `pulido`, fusionada en `main`)
1. **KPIs con punto de partida** (`problemas/metricas_impacto.md`). Se calculan en `vista.ts` con el seed y `evaluarCadena`; `lib/calculo` no cambia. `vista.test.ts` usa los valores de Impacto `[77.78, 58.33, 7, 90, 0]`.
   - Personas de la línea base que siguen de alta: **77,8 %** (14 de 18; al abrir la alerta, 11 de alta).
   - Hueco cerrado con altas nuevas: **58,3 %**. 1.120 h con altas y 800 h con pedidos retirados; faltaban 2.720 h y hoy faltan 800 h.
   - Personas sin alta al abrir la alerta: **7** (3 de alta, 4 en trámite, 0 sin vía). Los grupos de 1 a 3 personas se muestran como «menos de 4».
   - Pedidos mantenidos: **90 %**, con su partida (2.667 h al mes, may–jul 2026).
   - Bajas en la línea base: **0 de 14**.
2. **Suelo de minutos.**
   - En `/como-calculamos`: 126 min (industrial) y 180 min (premium y lujo); Trama usa el mayor; queda historial de cambios; piel y calzado, «sin contrastar».
   - En la escena del caso Milán: «si declara menos, Trama calcula con 180: 1,47×, rojo; sin suelo, el rojo empezaría en ≈135 min». La línea va a tamaño de cuerpo porque el pitch la dice en voz alta.
3. **Las horas de España salen del informe de plantilla media.**
   - Nadie firma una cifra. El ITA solo lo ve el revisor, tras una alerta.
   - He quitado «vale lo que su firmante». Para Italia ahora pone «depende de quien lo firma», que es cierto.
4. **`/legal`.**
   - «Desde la entrada» va la primera de la lista.
   - Art. 18 con sus requisitos («grave sfruttamento»; en `src/` sigue sin aparecer ninguna palabra vetada).
   - Protocolo con nuevos plazos: visita sin aviso y censo confidencial del revisor en ≤ 7 días; el proveedor, en ≤ 15; el plan, en ≤ 30.
5. **Quién cuenta a las personas sin alta.** `KPI_AYUDA` no aparece en ninguna pantalla, así que he puesto la frase también en la nota visible bajo los KPI del taller (captura 10).

6. **Ajustes del pitch v3** (pedidos por el director durante la ronda):
   - **«Suelo externo», no «suelo público»** de minutos, en todos los textos de la app: 126 min industrial y 180 min premium o lujo.
   - **La estimación por cuota de facturación no da rojo: abre una revisión.**
     - Simulador: la píldora «Revisar» de la carga total pasa a ser «Abre una revisión», con el motivo (el precio por hora cambia entre clientes).
     - `/como-calculamos#varias-marcas`, la tarjeta de la cuota de la escena de las 4 marcas, el modelo 347 de ejemplo y `/legal#competencia` dicen lo mismo.
     - El rojo directo solo sale si los pedidos de una sola marca superan 1,10× la capacidad.
     - El e2e del simulador lo comprueba: con la cuota al 20 %, sale «Abre una revisión» y nunca «Revisar».
   - **Lo que no he cambiado:** la fila interna «Suma de las 4: 1,30× Revisar» de la escena. Es la vista de Trama como tercero, ninguna marca la ve, y la escena se pidió así («al sumar sale rojo»).

## Extensiones mínimas por coherencia (fuera de la lista P1)
- `vista.ts`: la ficha de los talleres españoles decía «a partir del ITA». Ahora dice «a partir del informe de plantilla media»; si no, contradecía a `/como-calculamos`. Test ajustado.
- «Si firma alguien que no corresponde al país» → «Si lo envía alguien…».
- Nota del escenario «Caso reconstruido» del simulador: dice que 180 min es el suelo y que, con menos minutos declarados, Trama calcula con 180. Añade que el control sirve para ver dónde dejaría de caber sin suelo.

## Descartado
- **P2 del simulador** (forzar `Math.max(minutos, 180)`). O bien el control deja de enseñar dónde deja de caber y hay que rehacer el e2e, o bien el resultado contradice la nota. Me he quedado con marcar el suelo en la nota del escenario. La ruta B del pitch escribe 180, así que es coherente.
- **P2 pendientes:**
  - Renombrar «informe (mensual) de horas de alta» como «informe mensual de plantilla» (8 textos). Se ve en el panel: «fuente: informes mensuales de horas de alta».
  - `ORIGEN_HORAS`, que no se usa.
  - Los textos de los hitos H6 y H8 del seed.
  - La nota de 160 h frente a las ≈149 h del convenio.
  - Las precisiones de la cláusula (DA 44.ª.10 y salida responsable, `problemas/f_…`).

## Riesgos
- **El suelo está en el texto, no en el cálculo.** Ninguna pieza de la demo queda por debajo: T1 usa 240 min. Pero si alguien baja el control del simulador a 130 min verá ámbar, como avisa la nota: es el cálculo sin suelo.
- **Orden de los hitos.** En la demo, la visita (H3) sigue yendo después de la declaración del proveedor (H1): el seed es anterior a la regla.
- **Verificación:** lint 0 · tests 101/101 · build OK · e2e 25/25 sin internet · capturas 35/35, revisadas (02, 10, 13, 15, más legal y simulador).
