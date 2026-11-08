# a) De dónde salen las horas

Mentor 4 · 8-nov-2026. Detalle y fuentes en `investigacion/fuentes_horas.md`. ✅ = leído en fuente · ⚠ = por validar · ❓ = sin resolver.

## Decisión
1. **España, cada mes.** Se usa el *Informe de Plantilla Media de Trabajadores en Alta* de la TGSS: agregado, por código de cuenta de cotización (CCC) y por periodo, y ya pondera la jornada parcial. Lo descarga del Sistema RED el gestor del taller (autorizado RED) y lo envía tal cual.
   **Horas de alta = plantilla media × jornada anual del convenio ÷ 12.** Confección: 1.789 h → 149 h/mes. Marroquinería: 1.768 h → 147 h/mes.
2. **El ITA (la lista nominal) solo se usa tras una alerta.** Lo mira el revisor en la gestoría y no sale de allí.
3. **Registro de jornada: hoy no es una fuente.** El actual lo guarda la empresa en formato libre. El registro digital sigue sin aprobarse y, aunque se aprobara, no da acceso a terceros.
4. **Italia.** Las horas reales salen del LUL mensual (horas por persona y día). El DURC prueba que el taller está al corriente de cotizaciones, pero no da horas. La Asse.Co es anual: sirve como control de regularidad, no como fuente de horas.
5. **Nombre: se mantiene «horas de alta»** en la app y en el pitch. No se cambia a «capacidad en alta». Se arregla otra cosa: **el documento deja de llamarse «informe de horas de alta»**, porque ese documento no existe (la crítica J2 de nuevo). Pasa a ser «informe mensual de plantilla» (España: plantilla media de la Seguridad Social; Italia: LUL).

## Por qué
- **El dato correcto.** Plantilla media en vez de ITA: cubre un periodo y no una foto de un día, no lleva nombres (menos problemas de RGPD) y ya tiene en cuenta la parcialidad. Fuentes: [Noticias RED 2011/13](https://www.seg-social.es/descarga/es/160888) y [TRLIS, DA 12.ª](https://www.boe.es/buscar/act.php?id=BOE-A-2004-4456). ⚠ La metodología es de 2011: falta verlo en un informe real.
- **Validez.** Lo impreso desde RED vale como una certificación de la TGSS ([Orden ESS/484/2013, art. 9](https://www.boe.es/buscar/act.php?id=BOE-A-2013-3362)). El ITA es una foto del día en que se emite y lleva nombres y DNI o NIE ([especificación ITA](https://www.seg-social.es/descarga/es/214729)).
- **Jornada de convenio.** Textil y confección: [BOE-A-2025-20177](https://www.boe.es/boe/dias/2025/10/09/pdfs/BOE-A-2025-20177.pdf), art. 28. Marroquinería: [BOE-A-2024-6193](https://www.boe.es/boe/dias/2024/03/27/pdfs/BOE-A-2024-6193.pdf), art. 50. Los convenios de Ubrique, Cataluña, Valencia y el del calzado no los hemos localizado: cada taller indica el suyo. ❓
- **Registro de jornada digital.** El Consejo de Estado dictaminó el 19-3-2026 que «no procede aprobar» el proyecto ([dictamen 188/2026](https://www.laboral-social.com/sites/laboral-social.com/files/188_2026.pdf)). A 7-nov-2026 no estaba en el BOE, las Cortes están disueltas y hay elecciones el 29-nov-2026 ([RD 806/2026](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-20742)).
- **Italia.**
  - [LUL, art. 39 DL 112/2008](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2008-06-25;112~art39): horas por día, se completa antes de que acabe el mes siguiente.
  - [DURC](https://www.inps.it/it/it/dettaglio-scheda.it.schede-servizio-strumento.schede-servizi.50130.durc-online.html): vale 120 días y no da horas.
  - [Protocolo Asse.Co](https://ispettorato.gov.it/files/2023/02/Protocollo-CNO-IspettoratoNazionale-ASSECO.pdf): voluntaria, la paga el empleador; la Inspección prioriza a quien no la tiene.
- **Por qué no cambiar el nombre esta noche.** «Horas de alta» ya está en decenas de textos de la app y en el v1 («su plantilla en la Seguridad Social por la jornada de convenio»), y se entiende. «Capacidad en alta» es algo más precisa, pero cambiarla ahora cuesta tiempo de Producto y abre incoherencias entre la app y el pitch. Lo que sí no aguanta una pregunta es hablar de un «informe de horas de alta», y eso se corrige.

## Respuesta de 25 s (68 palabras)
> «Tiene razón: en España se cotiza por base, no por horas. Por eso no pedimos horas a nadie. El gestor descarga de la Seguridad Social la plantilla media en alta del taller, que ya tiene en cuenta la jornada parcial. La multiplicamos por la jornada del convenio: es capacidad, no horas fichadas. La lista con nombres solo la mira el revisor, en la gestoría, tras una alerta.»

## Qué cambia en la app o en el pitch
- **Pitch.** Nada. El v1 ya lo dice bien en [0:47].
- **App (Producto).**
  - El cambio de la línea de España en `como-calculamos.ts` (`horas`) está en `problemas/c_informe_complaciente.md` (P1).
  - P2, `src/content/textos.ts`: cambiar «informe (mensual) de horas de alta» por «informe mensual de plantilla» en `DESCRIPCION_ESTADO.sin_datos`, `ANUNCIO_ESTADO.sin_datos`, `NOTA_ESTADO.sin_datos`, `TEXTOS_PANEL.periodo`, `TEXTOS_TALLER.resumen.fuente`, `TEXTOS_TALLER.sinCertificado`, `TEXTOS_GRAFICO.pie` y `TEXTOS_CADENA.sinCertificadoCuentaCero`. Antes, comprobar con un grep que ningún e2e espera esos textos.
  - P2, `como-calculamos.ts`, sección `horas`, añadir: «Registro de jornada: hoy lo guarda la empresa en formato libre; solo lo mira el revisor en la visita. El registro digital no está aprobado.»
  - P2, `como-calculamos.ts`, sección `ejemplo`, pie: «160 h/mes por persona es una cifra de demo, por encima de la jornada del convenio textil (≈149 h/mes): favorece al taller, así que el rojo es prudente.»

## Qué sigue abierto
- Ver un informe de plantilla media real y comprobar que pondera la parcialidad.
- Cuánto cobra la gestoría por emitirlo cada mes.
- Los convenios de Ubrique, Cataluña, Valencia y el del calzado.
- **Personal que no cose.** Oficina o tienda en el mismo CCC inflan la capacidad: hay que pedir el CCC del centro de producción.
- **Italia.** El cálculo exige un firmante «vía Asse.Co», así que un taller sin Asse.Co queda «sin datos». Es una regla exigente que conviene revisar después del piloto.
