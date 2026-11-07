# LEGAL.md — Trama (MVP)

> Documento de trabajo del equipo; no es asesoramiento jurídico. **[Probable]** = no verificado en fuente primaria. Fuentes numeradas al final [n].

## 1. Riesgos legales y mitigación en el diseño

**1.1 RGPD: certificado de horas totales**
- **Minimización** (art. 5.1.c [1]): el certificado solo lleva taller, mes, nº de trabajadores en alta y horas totales. Nunca nombres, DNI/NIE ni horas por persona. Trama no recibe nóminas.
- **Talleres de 1-3 trabajadores**: total + plantilla revela las horas de una persona identificable → dato personal (art. 4.1 y cdo. 26 [1]). Diseño: por debajo de 4 trabajadores la marca solo ve el semáforo; las cifras se ocultan y los KPI de impacto se muestran solo agregados entre talleres. El umbral 4 es decisión de diseño, no cifra legal.
- **Base jurídica**: interés legítimo (art. 6.1.f [1]) en verificar la cadena, con ponderación documentada; test de compatibilidad para reutilizar datos de nómina (art. 6.4 [1]); el taller informa a su plantilla (art. 14 [1]).
- **Roles**: taller = responsable de la nómina; gestor/consulente = su encargado; marca = responsable del control de su cadena; Trama = encargado de cada marca (contrato art. 28 [1]), con separación estricta por marca. Si Trama usara los datos para fines propios pasaría a ser responsable: no hacerlo.
- **Talleres unipersonales**: el semáforo afecta a una persona física; ninguna consecuencia sin revisión humana (art. 22 [1]).

**1.2 Competencia (art. 101 TFUE [2])**
Trama podría ser el "hub" que traslada información sensible entre marcas que comparten taller, y el tercero también puede responder (Directrices horizontales, §§ 401-404 [3]). Diseño: cada marca ve solo sus pedidos y su semáforo, calculado con sus propios pedidos frente a las horas totales, sin que se puedan inferir volúmenes ajenos. La saturación agregada del taller solo la ven el taller y el revisor independiente; a las marcas solo se les notifica "revisión abierta". Nunca mostrar número ni nombres de otras marcas, precios, volúmenes ni cuotas. Estadísticas sectoriales: solo agregadas e históricas (§§ 408, 411 [3]).

**1.3 Lenguaje: indicio, no prueba**
Un rojo es una discrepancia entre dos fuentes con posibles explicaciones legítimas (subcontrata declarada, minutos estándar mal fijados, picos, errores de datos). Afirmar "explotación" o "fraude" de un taller identificable puede lesionar su honor (España: LO 1/1982 [4]; Italia: diffamazione, art. 595 c.p. [5]). Redacción: describir el dato, la fuente y el periodo, decir que no prueba infracción e indicar el siguiente paso. El semáforo no sale del protocolo.

**1.4 Marca que "sabe" un rojo: protocolo de escalado**
Tras ver el rojo, el riesgo es no actuar: en Milán se reprochó a una marca haber "colposamente agevolato" la explotación, con auditorías "più formali che sostanziali" y sin verificar la capacidad productiva [8]. Protocolo (plazos orientativos, no legales):
1. Día 0: alerta registrada con responsable y fecha; no se cortan pedidos.
2. ≤10 días: el proveedor explica el desajuste y declara sus subcontratas.
3. ≤30 días: el revisor independiente valida un plan de corrección.
4. Indicios de delito (trabajadores sin alta, art. 311 CP; extranjeros sin permiso en condiciones lesivas, art. 312.2 CP [6]; índices del art. 603-bis.3 c.p., p. ej. alojamiento degradante [7]): asesoría penal externa y valorar comunicación a Inspección de Trabajo / Ispettorato o Fiscalía / Procura. La marca no investiga por su cuenta ni pide documentos a los trabajadores.
5. Trazabilidad: quién vio qué y cuándo.

**1.5 Cláusula anti-despido y límite de reducción de pedidos**
Viables como pactos entre empresas (art. 1255 CC [9]; art. 1322 c.c. [10]). No pueden impedir despidos legalmente justificados ni convertir a la marca en empleadora de hecho [Probable]: se formulan como compromisos del proveedor con penalización, no como veto de la marca. Para que trabajadores o sindicato puedan exigirlos, en España cabe la estipulación a favor de tercero (art. 1257 CC [9]); en Italia, figura análoga [Probable]. El límite de reducción también protege a la marca: frente a un proveedor dependiente, la ruptura "aunque sea de forma parcial" sin preaviso de seis meses es desleal (art. 16.3.a LCD [11]); en Italia, la "interruzione arbitraria" puede ser abuso (art. 9 L. 192/1998 [12]). Subcontratas: sin contrato directo con la marca, el proveedor debe trasladarles la cláusula como condición para subcontratar.

**1.6 Trabajadores en situación irregular**
Vías (las gestiona la ONG o el sindicato, no Trama):
- **España**, RD 1155/2024 [13]: arraigo sociolaboral, que exige dos años de permanencia continuada (art. 126.b) y contrato(s) de al menos el SMI o el salario de convenio, con un mínimo de 20 h/semana en total (art. 127.b). Un plan que ofrezca contrato real facilita esta vía. También: autorización por colaboración con autoridades laborales o judiciales tras ≥6 meses de trabajo irregular (art. 129.2) y protección de víctimas de explotación laboral que colaboran (arts. 142-144).
- **Italia**: art. 18 TU Immigrazione ("protezione sociale"), que según la doctrina admite una vía social a propuesta de servicios sociales o asociaciones inscritas, sin denuncia [14] [Probable en los requisitos prácticos]; art. 18-ter (DL 145/2024, conv. L. 187/2024): permiso de un año, renovable y convertible, para víctimas del 603-bis que cooperan, a propuesta de la autoridad judicial [15].

**Por qué Trama no trata datos migratorios**: no hacen falta para comparar horas (art. 5.1.c [1]); en Italia la estancia irregular es delito (art. 10-bis TU [16]), por lo que el dato podría ser relativo a infracciones penales (art. 10 [1]) [Probable]; y ese registro podría volverse contra los propios trabajadores y romper su confianza. Trama solo recibe del revisor recuentos agregados ("n trabajadores acompañados"), con el mismo umbral de privacidad.

## 2. Textos para la interfaz

**Aviso permanente**
> Demo con datos ficticios: todas las empresas, talleres, personas y cifras son inventados.

**Términos de la demo**
> Esta es una demostración de producto para el StartCamp UC3M. Todos los datos son ficticios; cualquier parecido con empresas o personas reales es casual. Los cálculos ilustran el método y no son una auditoría, un informe pericial ni asesoramiento jurídico. Un semáforo rojo señala un desajuste entre la carga estimada y las horas certificadas que requiere revisión; nunca prueba una infracción. Las cláusulas mostradas son borradores no vinculantes. No introduzcas datos reales, ni personales ni de empresas. La demo se ofrece tal cual, sin garantías.

**Privacidad**
> Esta demo no recoge datos personales: no tiene registro, formularios ni analítica, y todos los datos mostrados son ficticios y forman parte del propio código. No la uses con datos reales. En el producto real, Trama solo trataría certificados de horas totales por taller, nunca datos por trabajador ni de situación migratoria, y en talleres muy pequeños mostraría únicamente el semáforo.

*(Nota para desarrollo: este texto solo es cierto si no se añade analítica, cookies de seguimiento ni formularios.)*

**Microcopy del semáforo**
- **Verde**: "Sin desajuste: las horas certificadas cubren la carga estimada de tus pedidos en los últimos 3 meses."
- **Ámbar**: "Desajuste dentro del margen previsto para picos. Recomendamos seguimiento."
- **Rojo**: "Desajuste por encima del margen. Es un indicio que requiere revisión, no una conclusión."
- **Sin datos**: "No hay certificado de horas para este periodo. No podemos calcular el semáforo."
- **Taller pequeño**: "Taller de menos de 4 personas: solo mostramos el semáforo para proteger su privacidad."
- **Revisión abierta**: "El revisor independiente ha abierto una revisión en este taller. No mostramos datos de otros clientes."

**Alerta roja**
> **Revisión necesaria en [Taller]**
> Entre [mes] y [mes], tus pedidos a este taller requieren unas [X] h según los minutos estándar; el certificado del gestor laboral recoge [Y] h para toda la plantilla. La diferencia puede deberse a subcontratas no declaradas, horas no cotizadas o errores en los datos. Esto no prueba ninguna infracción.
> **Siguiente paso:** pedir al proveedor la declaración de subcontratas. Mantén los pedidos dentro del límite pactado mientras dure la revisión.

## 3. Lo que la interfaz NO debe decir

| No decir | Alternativa |
|---|---|
| "Explotación laboral detectada" | "Desajuste entre carga y horas cotizadas" |
| "Taller ilegal / fraudulento" | "Taller con revisión abierta" |
| "Trabajadores irregulares / sin papeles" | "Horas de trabajo no cubiertas por cotización" (nunca hablar de situación migratoria) |
| "Prueba", "confirmado", "culpable" | "Indicio", "pendiente de revisión" |
| Botón "Suspender pedidos" / "Cortar relación" | "Abrir plan de corrección" |
| "Este taller también trabaja para [otra marca]" | "Solo se muestran tus datos" |
| "Horas de [nombre del trabajador]" | "Horas totales del taller (certificado agregado)" |
| "Taller libre de explotación" / "Cumplimiento garantizado" | "Sin desajuste detectado en el periodo" |

## 4. Borrador de cláusula marca–proveedor

> **BORRADOR NO VINCULANTE**: solo para la demo; requiere revisión por abogado en cada jurisdicción.
> 1. El Proveedor entregará cada mes un certificado, firmado por su gestor laboral o consulente del lavoro, con el total de horas cotizadas de su plantilla, sin datos individuales.
> 2. El Proveedor declarará a sus subcontratistas y les trasladará esta cláusula y la obligación de certificar como condición del subcontrato.
> 3. Ante una alerta, las partes seguirán un plan de corrección validado por un tercero independiente.
> 4. Durante el plan y los 6 meses siguientes, el Proveedor y sus subcontratistas no extinguirán contratos por causas relacionadas con la alerta, salvo despidos disciplinarios justificados, y colaborarán en la regularización de quienes trabajen sin alta, incluida la oferta de contrato cuando la ley lo permita.
> 5. Durante el plan, la Marca no reducirá sus pedidos más de un [__] % sobre la media de los 6 meses anteriores ni resolverá el contrato, salvo negativa del Proveedor a cooperar o incumplimiento grave.
> 6. Los trabajadores afectados o sus representantes podrán exigir el punto 4 como terceros beneficiarios.

## Fuentes
1. RGPD (UE) 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj/spa
2. TFUE, art. 101: https://eur-lex.europa.eu/eli/treaty/tfeu_2016/art_101/oj
3. Directrices de cooperación horizontal (2023/C 259/01), cap. 6: https://www.boe.es/doue/2023/259/Z00001-00125.pdf
4. LO 1/1982 (derecho al honor): https://www.boe.es/eli/es/lo/1982/05/05/1
5. Art. 595 c.p.: https://brocardi.it/codice-penale/libro-secondo/titolo-xii/capo-ii/art595.html
6. Código Penal, arts. 311-312: https://boe.es/buscar/epub/1995/BOE-A-1995-25444-consolidado.epub
7. Art. 603-bis c.p.: https://www.brocardi.it/codice-penale/libro-secondo/titolo-xii/capo-iii/sezione-i/art603bis.html
8. Il Post, caso Loro Piana (2025): https://www.ilpost.it/2025/07/15/loro-piana-sfruttamento-caporalato-aziende-lusso/
9. Código Civil, arts. 1255 y 1257: https://www.civil-mercantil.com/codigo-civil-libro-iv-titulo-ii-contratos.html
10. Art. 1322 c.c.: https://www.brocardi.it/codice-civile/libro-quarto/titolo-ii/capo-i/art1322.html
11. Ley 3/1991 de Competencia Desleal, art. 16: https://boe.es/buscar/act.php?id=BOE-A-1991-628
12. L. 192/1998, art. 9 (fuente secundaria): https://www.diritto.it/abuso-dipendenza-economica-nozione-ambito-applicazione/
13. RD 1155/2024 (BOE-A-2024-24099): https://www.boe.es/eli/es/rd/2024/11/19/1155
14. Art. 18 TU Immigrazione: https://brocardi.it/testo-unico-immigrazione/titolo-ii/capo-iii/art18.html (vía social, comentario: https://leggeinchiaro.it/articolo-18-tui-soggiorno-per-motivi-di-protezione-sociale/)
15. Art. 18-ter TU Immigrazione: https://brocardi.it/testo-unico-immigrazione/titolo-ii/capo-iii/art18ter.html
16. Art. 10-bis TU Immigrazione: https://www.brocardi.it/testo-unico-immigrazione/titolo-ii/capo-ii/art10bis.html
