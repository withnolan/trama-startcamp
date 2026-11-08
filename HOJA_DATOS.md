# HOJA DE DATOS · Trama

Una página para el jurado y para el equipo · 8-nov-2026 · todo lo marcado «por validar» es un supuesto nuestro.

**Qué es.** Cada mes, Trama compara las horas que necesitan los pedidos de una marca (pedidos × minutos por pieza) con las horas de alta de cada taller de su cadena (plantilla en la Seguridad Social × jornada del convenio, sacada por su gestoría del Sistema RED; a Trama solo llega el total). Si no caben, abre una revisión y un plan de corrección que la marca firmó al contratar. Ayuda a decidir dónde mirar y documenta que la marca vigiló. **No detecta trabajo forzoso ni da sellos: mide un riesgo de capacidad.**

## Cifras clave

| Dato | Cifra | Fuente |
|---|---|---|
| Marcas puestas bajo administración judicial en Milán por no controlar su cadena | 5 en 18 meses (ene-2024 a jul-2025): Alviero Martini, Giorgio Armani Operations, Manufactures Dior, Valentino Bags Lab y Loro Piana. Medida preventiva, no multa | [Il Post](https://www.ilpost.it/2025/07/14/loro-piana-amministrazione-giudiziaria/) |
| Loro Piana: subproveedor | 7 trabajadores, 6.000-7.000 chaquetas al año (según su cotitular) → con 7 × 1.750 h, unas 2 h por chaqueta | [Startmag](https://www.startmag.it/economia/che-cosa-ha-combinato-loro-piana/) · cálculo |
| Referencias de tiempo | Americana forrada industrial: ≈ 75 min solo de costura · fábrica premium: hasta 180 min de costura · Brioni: más de 16 h | [BUFT 2023](https://buft.edu.bd/upload/_page/P-7.pdf) · [Création Gross](https://fashionunited.uk/press/fashion/creation-gross-fashion-made-in-germany/2021111559279) · [Il Sole 24 Ore](https://en.ilsole24ore.com/art/in-the-abruzzi-village-where-brioni-grow-new-tailors-AGeai4aB) |
| Salida de Loro Piana (abril de 2026) | 2.400 auditorías desde 2024 y más de 100 proveedores cortados (**cifras de la empresa**) | [Milano Finanza](https://www.milanofinanza.it/fashion/loro-piana-si-conclude-in-anticipo-il-procedimento-di-amministrazione-giudiziaria-202604171313344253) |
| Marcas a las que la Fiscalía de Milán pidió documentos (**no investigadas**) | 13 en dic-2025 y 9 en jul-2026 | [AGI](https://www.agi.it/cronaca/news/2025-12-04/sfruttamento-cinese-capolarato-brand-di-lusso-inchiesta-34483372/) · [Milano Finanza](https://www.milanofinanza.it/fashion/pm-milano-acquisizioni-di-atti-presso-nove-case-di-moda-202607161854071180) |
| España: art. 42 ET | La empresa que subcontrata su propia actividad responde de las deudas de Seguridad Social (3 años) y salarios (1 año) de su contrata. **Si alcanza a un encargo de confección: abierto** | [BOE](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430) |
| Mercado: España / Italia | 2.131 fábricas de calzado (2025) / 4.223 empresas de marroquinería con 46.803 empleados (mar-2026) | [DIRCE vía AEC](https://fashionunited.es/noticias/empresas/la-industria-espanola-del-calzado-pierde-mas-de-1-100-empresas-desde-2020-aec-reclama-un-plan-de-accion-urgente/2026061849741) · [Assopellettieri](https://www.gonews.it/wp-content/uploads/2026/07/Nota-Assopellettieri_Primo-Trimestre-2026.pdf) |
| Horizonte | Reglamento (UE) 2024/3015: prohíbe productos hechos con trabajo forzoso desde el 14-12-2027 | [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/3015/oj/spa) |

## Qué es simulado en la demo
La marca (Ordessa), los talleres, los pedidos, las plantillas y las horas son **inventados**; las ciudades son reales. «Caso Milán 2025» usa cifras de prensa **anonimizadas** (7 personas, 6.000 chaquetas al año) y **minutos por chaqueta estimados por nosotros** (180 min → 1,47 → rojo; rojo por encima de 135 min). «Taller con 4 marcas» es inventado. No hay backend, login ni datos reales; el cálculo sí es el de verdad (con tests automáticos) y funciona sin internet.

## Qué está validado y qué no
- **Comprobado con fuentes:** que el informe de plantilla media en alta y el ITA existen y los saca el gestor (Sistema RED); la jornada de cada convenio (BOE); el caso de Milán; 18 herramientas, normas y plataformas revisadas: ninguna, que sepamos, cruza pedidos con horas de alta (la más cercana, la plataforma de la Prefectura de Milán, usa datos que declara el taller cada 6 meses).
- **Sin validar:** ninguna marca, gestoría ni taller consultado todavía; el precio; que el gestor saque el informe cada mes y cuánto cobra; que las marcas tengan minutos estándar en sus fichas; si el art. 42 ET alcanza a la confección; quién hace de revisor (propuesta: sindicato sectorial u ONG laboral); el efecto de la cláusula de no despido ante un juez; el tamaño del trabajo no declarado en el sector en España (no tenemos el dato de la Inspección de Trabajo).

## Precio y cuentas (por validar)
| Concepto | Supuesto |
|---|---|
| Cuota de vigilancia (la decide cumplimiento) | **60 € por taller y mes** + informe de la gestoría **a coste** (15-30 €), pagado por la marca. 90 € solo como opción «todo incluido» |
| Coste de operar | ≈ 12 € por taller y mes → **margen bruto ≈ 80 %** · alta de cliente ≈ 2.000 € |
| Coste de corregir (aparte, solo si hay alerta) | **1.000-3.000 € por alerta** (2-3 jornadas de revisor a 500-1.000 €), pagado por la marca directo al revisor; Trama no cobra margen. Subir el precio por pieza lo decide compras |
| Una marca con 30 talleres | 21.600 €/año de cuota + 5.400-10.800 €/año de informes a coste |
| Mercado, cada taller una sola vez | España: 2.131 × 720 € = **1,5 M€/año** (sin marroquinería ni punto: no hay cifra verificada) · Italia, fase 2: 4.223 × 720 € = 3,0 M€/año |
| Año 1 | Piloto gratuito de 3 meses con 5-10 talleres → objetivo: 3 marcas × 30 talleres = 64.800 €/año |

## Impacto: cómo se mide (punto de partida: el día de la alerta)
1. Personas de alta en el taller a los 6 meses, frente al día de la alerta.
2. Cómo se cerró el hueco: horas de alta añadidas (altas nuevas o más jornada) frente a carga retirada (pedidos quitados). Solo lo primero cuenta como impacto.
3. Pedidos que mantiene la marca durante el plan, frente a la media de los 6 meses anteriores.
4. Personas derivadas a regularización, incluidas las que no cumplen los requisitos del arraigo.

ODS 8, meta 8.8 (derechos laborales, trabajadores migrantes, empleo precario); a la 8.7 contribuye como prevención.

## Petición
Una **carta de intención para un piloto gratuito de 3 meses con 5-10 talleres**, con el precio pactado si sigue después; **dos gestorías** que quieran sacar el informe cada mes; y una **presentación al responsable de cumplimiento** de una marca que fabrique en España.
