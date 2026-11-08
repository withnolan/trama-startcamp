# EVOLUCIÓN — bucle de mentores y jurado simulado

Rúbrica fija: `jurado/rubrica.md` (Problema e impacto 25 · Solución e innovación 20 · Negocio y viabilidad 20 · Validación y salida al mercado 15 · Equipo y ejecución 10 · Pitch y demo 10). Medias con `node jurado/medias.mjs`. Jurados nuevos en cada ronda (3 por límite de uso: 2 fijos + 1 rotatorio, `jurado/perfiles.md`); solo ven el texto hablado del pitch, `HOJA_DATOS.md` y 9 capturas.

> **Aviso:** todos los jurados son el mismo modelo; sirven para detectar fallos, no para predecir la nota real.

## Notas por ronda

| Ronda | Pitch evaluado | Problema 25 | Solución 20 | Negocio 20 | Validación 15 | Equipo 10 | Pitch/demo 10 | **Ponderada** | Global | Ponderada fijos |
|---|---|---|---|---|---|---|---|---|---|---|
| r1 | v1 (Equipo B) | 7,00 | 7,00 | 6,00 | 4,67 | 7,00 | 7,67 | **6,52** | 7,00 | 6,47 |
| r2 | v2 | 7,33 | 7,00 | 5,33 | 4,00 | 7,33 | 8,00 | **6,43** | 6,33 | 6,25 |
| r3 | v3 | 8,00 | 7,00 | 6,00 | 4,00 | 8,00 | 7,33 | **6,73** | 7,00 | 6,70 |
| r1 | v5 del usuario (llamada → versión B) | 6,00 | 5,67 | 4,00 | 2,67 | 6,67 | 3,33 | **4,83** | 4,67 | — |

**Ronda 1 (01:45): v1 frente a v5, a ciegas.** Los 3 jurados prefieren v1. v5 cuenta mejor la historia, el «por qué ahora» (Reglamento europeo de 2027) y qué gana el taller, pero pierde por cifras que su propia hoja desmiente («46.000 empresas» eran 46.803 empleados de 4.223 empresas; «10 % = 5 M€» de arriba abajo) y por prometer lo que la demo no hace (cuenta de precio frente a convenio, subida de precio obligatoria). Lección confirmada: una promesa que no aguanta una pregunta hunde la confianza en todo lo demás.

**Fallos de v1 que repiten los jurados (r1):**
1. Validación cero con quien paga (marca, gestoría) — no tiene arreglo esta noche: respuesta honesta + petición concreta (`LLAMADAS.md`, `MARCAS.md`).
2. «Por qué pagaría una marca española ya»: el dolor probado es italiano, el art. 42 ET está abierto, falta una cifra del problema en España y v1 ni menciona el Reglamento 2024/3015 como horizonte (3 de 3).
3. Integridad de los minutos por pieza: si la marca los baja, no ve rojos (con 130 min el caso Milán ya no es rojo).
4. «Plantilla × jornada de convenio» se entiende como jornada completa para todos; hay que decir «la jornada de cada contrato», que precisamente delata el alta a media jornada de quien trabaja la completa.
5. Mercado pequeño o mal contado (1,5 M€ con todo el calzado): Negocio lo rehízo (≈6.083 empresas de 1-49 asalariados en confección, piel y calzado → 4,4 M€ de techo, cada taller una vez).
6. Qué gana el taller (lo tenía v5).

## Cambios por ronda
- **v1 (antes de r1):** pitch del mentor de Pitch con la investigación verificada; demo con `/escenas` (caso Milán anonimizado y taller con 4 marcas).
- **v2 (tras r1):** «por qué ya» con dato de la Inspección (más de 120.000 empleos irregulares aflorados en 2025) y el Reglamento 2027 como horizonte; «la jornada de cada contrato» (dar de alta a media jornada a quien hace la completa no tapa el hueco); minutos del escandallo; qué gana el taller; mercado del INE contado una vez (≈6.000 empresas, 4,4 M€ de techo); competidores corregidos. Detalle en `mentores/v2_pitch.md`, `mentores/v1_negocio.md`, `mentores/v1_impacto.md`.

**Ronda 2 (02:05): 6,43 (−0,09); fijos 6,25 (−0,22).** Sube Pitch y demo (8,0) y Problema e impacto; baja Negocio (6,0 → 5,3) porque el mercado corregido, ahora honesto, es pequeño y está contado en talleres, no en marcas que compran; Validación 4,0. Fallos repetidos: (1) los minutos los pone quien paga (3 de 3); (2) cero validación con quien paga (3 de 3, sin arreglo esta noche); (3) mercado en marcas y motivo de compra en España; (4) nuevo, de la experta en impacto: quién cuenta a quien trabaja sin alta, cómo se sabe que a los 6 meses son las mismas personas, qué pasa con quien no tiene vía de regularización; (5) meta agregada a 2030.
- **v3 (tras r2):** suelo externo de minutos por prenda y segmento (126 industrial / 180 premium) en pitch, hoja y app; mercado contado en marcas (165 fabricantes españoles de ≥ 50 asalariados + 175 grupos italianos de > 100 M€ → ≈ 8,6 M€/año, talleres por marca supuestos) y primeras clientas las que fabrican en Italia y España; personas sin alta contadas por el revisor en una visita sin aviso (censo confidencial; a Trama solo llegan recuentos firmados); cláusula 0 «desde la entrada»; meta 2030 (40 marcas, ≈ 1.500 talleres, ≈ 15.000 personas); KPIs de la app con punto de partida; la estimación por cuota «abre una revisión», no rojo. Detalle en `mentores/v3_*.md`.

**Ronda 3 (03:00): 6,73 (+0,30); fijos 6,70 (+0,45); global 7,00.** Mejor ronda. Sube Problema e impacto (8,0), Equipo (8,0) y Negocio vuelve a 6,0. Fallos que quedan: (1) validación cero con quien paga y con quien da el dato (3 de 3; sin arreglo esta noche); (2) de dónde sale el dato de horas en Italia (2 de 3); (3) 180 min se presenta como «suelo» cuando es el techo de una fábrica premium (profesora); (4) «nos fabricáis la prueba en contra» (mentora); (5) primer cliente con nombre y canal.
- **v4 (tras r3, última):** en curso — suelo = mínimo industrial (126) y 180 como referencia premium; Italia: LUL del consulente del lavoro; respuesta a «prueba en contra»; canal de entrada (fabricante principal de Ubrique/Elche).

## Fallos que siguen abiertos
Ver la última ronda.
