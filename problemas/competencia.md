# Competencia

> Mentor 3 · Negocio · 8-nov-2026. Base: `investigacion/mercado_competencia.md` §3, más dos comprobaciones de esta noche (cómo se comparten las auditorías Sedex y el estado de la plataforma de Milán). En la columna «¿Cruza…?», «No» significa que **no encontramos evidencia** en sus webs ni en la prensa revisada.

## Decisión

**Frase del pitch, verificada y ajustada:**
> «Sedex y amfori auditan, TrusTrace traza materiales; ninguno, que sepamos, cruza cada mes pedidos con horas de alta.»

La frase propuesta («Sedex, amfori y TrusTrace auditan o trazan cada relación por separado; nadie suma la carga de un taller») **no es exacta**, por cuatro motivos:
1. Sedex y amfori **comparten una misma auditoría entre todos los clientes** del taller («una auditoría, muchos clientes»: [BSI](https://bsigroup.com/en-US/our-services/auditing-and-verification-services/supplier-audits-second-party-verification-for-supply-chains/bsi-sedex-assessments/smeta), [DNV](https://www.dnv.us/services/sedex-members-ethical-trade-audits-smeta-37205)). No miran relación por relación.
2. Esas auditorías sí revisan las horas del taller entero, pero **el día de la visita, con los registros del taller y sin compararlas con los pedidos**.
3. **La plataforma de Milán sí pide horas por cliente y el % de facturación por cliente**, aunque declarados por el taller.
4. **Trama tampoco suma la carga de todo el taller** salvo que al menos 3 marcas del taller la usen (`b_varias_marcas.md`).

**La plataforma de Milán es sobre todo una validación de la idea y un canal posible. Solo es una amenaza en Italia**, si se vuelve obligatoria o empieza a usar los pedidos de la marca.

## Por qué

| Competidor | Dato que usa | Frecuencia | ¿Cruza pedidos reales con horas de alta? | Amenaza / canal |
|---|---|---|---|---|
| **Statu quo**: auditoría + hoja de cálculo de compras | Auditoría puntual; volúmenes en el ERP de la marca | Anual o menos | No | **El competidor real**: no hacer nada nuevo |
| **Piattaforma di filiera** (Prefectura de Milán, Regione Lombardia, Tribunal, Fiscalía, Inspección de Trabajo; apoyo científico del Politecnico) | Lo que sube el taller: LUL, «ore di lavoro mensili dedicate al cliente», % de facturación por cliente, máquinas en «tiempos estándar», consumo eléctrico ✅ ([protocolo, anexo I](https://www.eticanews.it/wp-content/uploads/2025/06/protocollo-moda-26.05.2025.pdf)) | **Al menos cada 6 meses** | **Parcial**: horas frente a capacidad declarada. **Sin los pedidos de la marca**: las marcas «non saranno oggetto di profilazione» (art. 2.8) | **Validación** (las instituciones de Milán ya plantean el control como horas frente a capacidad). **Canal**: Trama como herramienta de la marca para el alta y seguimiento de proveedores (art. 3.3), la auditoría del 40 % (3.4) y las anomalías entre plataforma y auditoría (3.6). **Amenaza** solo en Italia. ¿Funciona a 8-nov-2026? **NO SÉ** ([Altalex](https://www.altalex.com/documents/news/2026/02/04/moda-legalita-piattaforma-digitale-segue-tutta-filiera-produttiva) la dio por «pronta» en feb-2026; [Il Giorno](https://www.ilgiorno.it/milano/cronaca/laccordo-va-avanti-portale-con-b578fc7f) anunció el portal para abril; no hemos encontrado ni el lanzamiento ni cuántos talleres se han adherido) |
| **Sedex (SMETA)** | Auditoría en el taller + cuestionario; una auditoría compartida entre clientes | Puntual | No | Complemento: Trama dice a qué taller mandarla |
| **amfori BSCI** | Auditoría en el taller | Cada 2 años ⚠ | No | Complemento |
| **SA8000** | Certificación del sistema | Ciclo de 3 años | No | Complemento |
| **EcoVadis (+ Ulula)** | Cuestionario y documentos; encuestas a trabajadores y canal de quejas por WhatsApp o QR (oct-2025) ✅ | Anual; voz de los trabajadores continua | No | Media: ya tiene el presupuesto de la marca. Posible socio para la voz de los trabajadores |
| **Fair Wear** | Auditorías, revisión anual de cada marca, quejas; **calculadora de coste por minuto** ✅ ([Fair Wear](https://www.fairwear.org/programmes/lw-tools-and-benchmarks/)) | Anual o continua | No (usa los minutos para el salario, no para la capacidad) | Aliado de método: el sector ya trabaja con minutos estándar (`v5_segunda_cuenta.md`) |
| **TrusTrace / Retraced** | Pedidos y proveedores de cada marca; trazabilidad de material y certificados | Por pedido o lote | No (pedidos frente a material, no frente a horas) | Baja-media. **Integrables**: ya tienen los pedidos |
| **osapiens / IntegrityNext** | Cuestionarios, certificados, noticias; diligencia debida (LkSG, CSDDD) | Continua | No | Baja-media |
| **Prewave / Exiger / Altana / Sourcemap** | Noticias y redes con IA, datos de comercio, mapas de cadena | Continua | No (no tienen horas de trabajo) | Baja: complementarios |
| **Asse.Co (Italia)** | Asseverazione del consulente del lavoro: contratos, horario, cotizaciones | Anual, con revisión cada 4 meses | No (no usa pedidos) | **Canal**: quien firmaría en Italia |
| **Open Supply Hub** | Ubicación de centros (OS ID) | Datos abiertos | No | Fuente de datos para identificar talleres |

### Tres frases de diferenciación honesta
1. Que sepamos, Trama es la única herramienta que **cruza cada mes los pedidos reales de la marca, por sus minutos, con la plantilla en alta del taller**. Ese dato sale de la Seguridad Social, no de una declaración del taller.
2. Lo más parecido es la plataforma de Milán. Ya pide horas por cliente y capacidad, pero declaradas por el taller cada 6 meses, sin los pedidos de la marca y solo en Lombardía. **Trama puede ser su herramienta del lado de la marca**, en vez de competir con ella.
3. No sustituimos las auditorías ni la voz de los trabajadores: **decimos adónde mandarlas**. Nuestros puntos débiles son tres:
   - la calidad de los minutos estándar;
   - que el informe del gestor funcione en la práctica (falta validarlo);
   - que repartir la carga entre varias marcas es una estimación.

## Respuesta de 25 s

**«¿No lo hace ya Sedex, EcoVadis o la plataforma de Milán?»** (61 palabras)
> «Sedex y amfori hacen una auditoría puntual que se comparte entre clientes; EcoVadis puntúa cuestionarios; TrusTrace traza materiales. Ninguno, que sepamos, cruza cada mes tus pedidos con las horas de alta del taller. Lo más parecido es Milán: pide horas por cliente, pero las declara el taller cada seis meses y sin pedidos. No competimos con ellos: les decimos dónde mirar.»

## Qué cambia en la app o en el pitch
- **Pitch [2:54-3:23]:**
  - Sustituir «…ninguno, que sepamos, suma cada mes la carga de un taller».
  - Por «…ninguno, que sepamos, cruza cada mes pedidos con horas de alta» (mismas palabras; ver `mentores/v1_negocio.md`).
- **PREGUNTAS 3:** ya está bien. Se puede añadir «Sedex comparte una misma auditoría entre clientes».
- **App:** nada.

## Qué sigue abierto
- Si la plataforma de Milán funciona hoy y cuántos talleres tiene.
- Si TrusTrace o Retraced podrían añadir horas: tienen los pedidos, así que son el competidor que más rápido podría copiarnos.
- Precios reales de SMETA y BSCI en España (no publicados).
- Que «ninguno cruza» se apoya en no haber encontrado evidencia, no en una prueba: por eso siempre va con «que sepamos».
