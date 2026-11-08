# HOJA DE DATOS · Trama

Una página para el jurado y para el equipo · 8-nov-2026 · versión 2 · todo lo marcado «por validar» es un supuesto nuestro.

**Qué es.** Cada mes, Trama compara las horas que necesitan los pedidos de una marca (pedidos × minutos por pieza de su escandallo) con las horas de alta de cada taller de su cadena: la plantilla media en alta en la Seguridad Social, que pondera la jornada de cada contrato, sacada por su gestoría del Sistema RED; a Trama solo llega el total. Si no caben, abre una revisión y un plan de corrección que la marca firmó al contratar. Ayuda a decidir dónde mirar y documenta que la marca vigiló. **No detecta trabajo forzoso ni da sellos: mide un riesgo de capacidad.**

## Cifras clave

| Dato | Cifra | Fuente |
|---|---|---|
| Marcas puestas bajo administración judicial en Milán por no controlar su cadena | 5 en 18 meses (ene-2024 a jul-2025): Alviero Martini, Giorgio Armani Operations, Manufactures Dior, Valentino Bags Lab y Loro Piana. Medida preventiva, no multa | [Il Post](https://www.ilpost.it/2025/07/14/loro-piana-amministrazione-giudiziaria/) |
| Loro Piana: subproveedor | 7 trabajadores, 6.000-7.000 chaquetas al año (según su cotitular) → con 7 × 1.750 h, unas 2 h por chaqueta | [Startmag](https://www.startmag.it/economia/che-cosa-ha-combinato-loro-piana/) · cálculo |
| Referencias de tiempo | Americana forrada industrial: ≈ 75 min solo de costura · fábrica premium: hasta 180 min de costura · Brioni: más de 16 h | [BUFT 2023](https://buft.edu.bd/upload/_page/P-7.pdf) · [Création Gross](https://fashionunited.uk/press/fashion/creation-gross-fashion-made-in-germany/2021111559279) · [Il Sole 24 Ore](https://en.ilsole24ore.com/art/in-the-abruzzi-village-where-brioni-grow-new-tailors-AGeai4aB) |
| Salida de Loro Piana (abril de 2026) | 2.400 auditorías desde 2024 y más de 100 proveedores cortados (**cifras de la empresa**) | [Milano Finanza](https://www.milanofinanza.it/fashion/loro-piana-si-conclude-in-anticipo-il-procedimento-di-amministrazione-giudiziaria-202604171313344253) |
| **España: tamaño del problema** | **Más de 120.000 empleos irregulares aflorados por la Inspección de Trabajo en 2025** (131.645 en la memoria; 122.146 en el balance de marzo), en todos los sectores. Caso: según la Policía, un taller de Valencia con 26 personas sin alta cosía para varias empresas del sector (2025) | [Europa Press vía El Derecho](https://elderecho.com/la-inspeccion-de-trabajo-propuso-multas-por-valor-de-858-millones-en-2025-y-afloro-un-68-mas-de-empleos) · [Bolsamanía](https://www.bolsamania.com/noticias/economia/economia--la-inspeccion-de-trabajo-afloro-mas-de-122000-empleos-en-2025-y-recupero-51-millones-de-euros-en-salarios--22024440.html) · [El Debate](https://www.eldebate.com/espana/comunidad-valenciana/20260407/taller-textil-clandestino-empleaba-inmigrantes-regularizar-trabajar-60-horas-semana-mil-euros-sueldo-mes_404204.html) |
| España: deberes de quien encarga su propia actividad | Comprobar el alta de cada trabajador de la contrata (art. 16 LGSS) y responder de sus cuotas (3 años) y salarios (1 año) (art. 42 ET). **Si alcanza a un encargo de confección: abierto** (laboralista) | [BOE, ET](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430) · [BOE, LGSS](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724) |
| Horizonte UE | Reglamento (UE) 2024/3015: prohíbe comercializar productos hechos con trabajo forzoso desde el 14-12-2027. Sus directrices (no vinculantes) citan, entre lo que puede pedir la autoridad, órdenes de producción e informes de capacidad de la fábrica | [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/3015/oj/spa) · `investigacion/encaje_legal.md` [4] |
| Mercado España (INE, DIRCE a 1-1-2025) | **6.083 empresas de confección, piel y calzado con 1-49 asalariados**; piel y calzado: 2.217 | [INE, tabla 73019](https://www.ine.es/jaxiT3/Tabla.htm?t=73019) |
| Italia (fase 2) | 4.223 empresas de marroquinería con 46.803 empleados (mar-2026) | [Assopellettieri](https://www.gonews.it/wp-content/uploads/2026/07/Nota-Assopellettieri_Primo-Trimestre-2026.pdf) |

## Qué es simulado en la demo
La marca (Ordessa), los talleres, los pedidos, las plantillas y las horas son **inventados**; las ciudades son reales. «Caso Milán 2025» usa cifras de prensa **anonimizadas** (7 personas, 6.000 chaquetas al año) y **minutos por chaqueta estimados por nosotros** (180 min → 1,47 → rojo; rojo por encima de ≈ 135 min). «Taller con 4 marcas» es inventado (0,40 · 0,35 · 0,30 · 0,25 → suma 1,30). Los documentos de «3 · Documentos» van marcados SIMULADO. No hay backend, login ni datos reales; el cálculo sí es el de verdad (con tests automáticos) y funciona sin internet.

## Qué está validado y qué no
- **Comprobado con fuentes:** que el informe de plantilla media en alta y el ITA existen y los saca el gestor (Sistema RED); la jornada de cada convenio (BOE); el caso de Milán; el tamaño del trabajo no declarado en España (Inspección); 18 herramientas, normas y plataformas revisadas: ninguna, que sepamos, cruza cada mes pedidos con horas de alta (la más cercana, la plataforma de la Prefectura de Milán, usa lo que declara el taller cada 6 meses).
- **Sin validar:** ninguna marca, gestoría ni taller consultado todavía; el precio; que el gestor saque el informe cada mes y cuánto cobra; que el informe pondere hoy la jornada parcial (ver uno real); que las marcas tengan minutos por modelo en el escandallo (en calzado, a veces solo los tiene el fabricante); si el art. 42 ET alcanza a la confección; quién hace de revisor (propuesta: sindicato sectorial u ONG laboral); el efecto de la cláusula de no despido ante un juez; el desglose de la Inspección por sector; cuántas de las 6.083 empresas trabajan para marcas.

## Precio y cuentas (por validar)
| Concepto | Supuesto |
|---|---|
| Cuota de vigilancia (la decide cumplimiento) | **60 € por taller y mes** + informe de la gestoría **a coste** (15-30 €), pagado por la marca, nunca por el taller |
| Margen | Coste de servir ≈ 12 € por taller y mes → **80 % de la cuota, a escala** (≈ 400 talleres por analista); sobre lo facturado, ≈ 56 %. Con 30 talleres no paga ni un analista; **equilibrio ≈ 182 talleres** |
| Coste de corregir (aparte, solo si hay alerta) | **1.000-3.000 € por alerta** (2-3 jornadas de revisor), pagado por la marca directo al revisor; Trama no cobra margen. Subir el precio por pieza lo decide compras; Trama no fija ni junta precios |
| Una marca con 30 talleres | 21.600 €/año de cuota + 5.400-10.800 €/año de informes a coste |
| Mercado, cada taller una sola vez | Techo España: 6.083 × 720 € = **4,4 M€/año**; fase 1, piel y calzado: 2.217 → 1,6 M€ · Italia, fase 2: 4.223 → 3,0 M€ |
| Año 1 | Piloto gratuito de 13 semanas con 5-10 talleres → objetivo: 3 marcas × 30 talleres = 64.800 €/año |

## Qué gana el taller
No paga el informe (lo paga la marca); da un total que su gestoría ya tiene, nunca nóminas ni nombres; y un rojo no le cuesta el cliente de golpe: la cláusula obliga a corregir primero y a salir, si acaso, con plan y preaviso.

## Impacto: cómo se mide (punto de partida: el día de la alerta)
1. **Personas de la línea base que siguen de alta** a los 6 meses (quienes trabajaban en el taller al abrir la alerta, con o sin alta). Meta: todas.
2. **Hueco cerrado con altas nuevas** frente a hueco cerrado retirando pedidos, por separado. Solo lo primero cuenta como impacto.
3. **Personas sin alta al abrir la alerta:** ya de alta, en trámite o sin vía (no cumplen los requisitos del arraigo). Quien no tiene vía se cuenta, no se resta.
4. **Pedidos mantenidos** durante el plan frente a la media de los 6 meses anteriores (reducción máxima propuesta: 20 %).
5. **Bajas en la línea base** (meta: 0), con la lista de la gestoría, no con lo que declara el taller.

Ejemplo con los datos ficticios de la demo: de 18 personas al abrir la alerta, 11 estaban de alta; hoy, 14. Del hueco cerrado, 1.120 h con altas nuevas y 800 h retirando pedidos (`problemas/metricas_impacto.md`).

ODS 8, meta 8.8 (derechos laborales, trabajadores migrantes, empleo precario); a la 8.7 contribuye como prevención.

## Petición
Una **carta de intención para un piloto gratuito de 3 meses con 5-10 talleres**, firmada por cumplimiento y compras, con el precio pactado si sigue después; **dos gestorías** que quieran sacar el informe cada mes; y una **presentación al responsable de cumplimiento** de una marca que fabrique en España.
