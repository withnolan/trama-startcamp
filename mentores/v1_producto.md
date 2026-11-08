# Mentor 2 · Producto y demo — ronda 1 (8-nov, 00:40–01:20)

## Qué he cambiado (rama `pulido`, fusionada en `main`)
1. **Ruta nueva `/escenas`** (en la navegación y enlazada desde el panel), en el orden del pitch:
   - **Caso Milán 2025 (datos públicos)**, con el rótulo «Reconstrucción anonimizada a partir de información pública de prensa»: Marca → Proveedor A, sin taller propio (18.000 h ÷ 0 h = ∞, rojo desde el primer pedido) → Subproveedor B, 7 personas (18.000 h ÷ 12.250 h = 1,47×; rojo a partir de ≈135 min). Reutiliza `ChainDiagram` (nueva prop opcional `detalle`) y `clasificar`.
   - **Taller con 4 marcas** (ficticio): 0,40 · 0,35 · 0,30 · 0,25, todas verdes; la suma da 1,30, roja. A la izquierda, «Lo que ve Ordessa»: su verde y «Revisión abierta», con el texto legal que ya existía, igual para cualquier causa. A la derecha, «Lo que calcula Trama como tercero (no lo ve ninguna marca)». Debajo, tres salvaguardas: regla de 3 marcas (`sumarMarcas`, con tests), el mismo aviso siempre y la alternativa de la cuota (Ordessa 30 % → 1,33×, rojo), con enlace a `/como-calculamos#varias-marcas`.
   - **Documentos de ejemplo SIMULADO**: plantilla media (10,00 → 4.800 h), escandallo (240 min por chaqueta) y modelo 347 (30 %). Son la fuente de las cifras de la escena de las 4 marcas: explican de dónde sale cada número sin prometer nada nuevo.
2. **Caso público a 180 min** (taller premium, fuente pública) en el simulador, en `/como-calculamos` y en los tests. T1 sigue en 240 min y ahora pone que es ficticio.
3. **Coherencia legal**: `/legal` y `/como-calculamos` ya dicen «3 o más marcas» y «el mismo aviso sea cual sea la causa», como la escena.
4. **Demo**: la barra de escenas es pegajosa, así que los 3 clics del pitch funcionan en cualquier orden. El README recoge la ruta del pitch (3 clics, con el nombre exacto de cada botón) y el recorrido completo con sus clics. Plan B regenerado: 34 PNG y el vídeo.

## Por qué
- Ver «verde, verde, verde, verde → rojo» cierra las críticas J3, J4 y J5 (varias marcas, competencia) mejor que cualquier explicación.
- El caso Milán convierte el gancho del pitch en una cuenta que el jurado ve hacer.
- Quitar promesas que no aguantan una pregunta:
  - El proveedor A no muestra «0 personas de alta». Solo sabemos que no tenía taller propio, así que la app dice «0 h de producción propia». Aunque tuviera 3 personas de oficina de alta, saldría 3,4×, en rojo igual.
  - «Chaqueta de cachemir = 240 min» ya no aparece como dato real: ahora es un ejemplo ficticio.
  - No he escrito «revisión aleatoria»: no está en el diseño.

## Qué he descartado
- Meter las 4 marcas en el panel y en el seed: reabre el cálculo testado y todas las pantallas por una sola escena.
- Escenas interactivas: para eso ya está el simulador. Una escena fija se proyecta mejor y no falla.
- Imitar documentos oficiales (logotipos o maqueta de la TGSS o de Hacienda): solo esquemas marcados «SIMULADO».
- Métricas de impacto: `problemas/metricas_impacto.md` aún no existe, así que no las he tocado.

## Riesgos y pendientes
- **Ruta de la demo**: el recorrido pedido (entrada → panel → T1 → simulador → escenas) no cabe en 50 s con voz, así que el pitch usa la ruta A (3 clics). Recomiendo la ruta A y ensayarla con reloj. El recorrido completo queda en el README para la mentoría.
- **PITCH_FINAL** (no lo edito yo): los botones se llaman «1 · Caso Milán 2025» y «2 · Taller con 4 marcas». Para el plan C sin app, usar las capturas 15, 16 y 04.
- **Jornada**: la demo usa 160 h al mes y el convenio textil da unas 149 (`investigacion/fuentes_horas.md`). No cambia ningún color. Si lo preguntan: «es la jornada de la demo; en producción, la del convenio».
- **Git**: los commits del pitch (9fb49aa y 6b5e5bf) cayeron en `pulido` porque compartimos árbol de trabajo. Entran en `main` con la fusión.
- **Verificación**: lint 0 · tests 101/101 · build OK (15 páginas) · e2e 25/25 sin internet · capturas 35/35.
