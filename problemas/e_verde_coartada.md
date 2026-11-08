# e) Que el verde no sirva de coartada

Mentor 4 · 8-nov-2026. Fuentes completas en `investigacion/encaje_legal.md` §e.

## Decisión
1. **Verde significa «las horas cuadran con tus pedidos», y nada más.** No dice nada de salarios, coacción, seguridad ni de los pedidos de otras marcas.
2. **Sin sello y sin uso publicitario, por contrato.** La marca no puede usar el semáforo, el nombre de Trama ni la palabra «verde» en etiquetas, webs para el consumidor, publicidad ni sellos. Sí puede usarlo internamente y ante auditores o autoridades. En un informe de sostenibilidad, solo con un texto fijo que explica el método y sus límites.
3. **El verde vale solo para su periodo y nunca tapa otros avisos:** un informe que falta, una subcontrata no declarada o una revisión abierta.

## Por qué
- **[Directiva (UE) 2024/825](https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32024L0825).** Considera desleal «en todo caso» exhibir un distintivo de sostenibilidad que no se base en un sistema de certificación de terceros ni lo haya establecido una autoridad pública (anexo I, punto 2 bis). El distintivo incluye las características **sociales** (art. 2, letras q y r). Los Estados debían aplicarla desde el 27-9-2026. Trama no es un sistema de certificación, así que un «verde Trama» en una etiqueta entraría de lleno.
- **España.** La transposición va en el Anteproyecto de Ley de Consumo Sostenible ([2-7-2025](https://noticias.juridicas.com/actualidad/noticias/20391-aprobado-el-anteproyecto-de-ley-de-consumo-sostenible:-adios-a-los-anuncios-de-gasolina-y-a-la-reventa-de-entradas-inflada/)); no sabemos si ya está aprobada. ❓ Mientras tanto se aplican los arts. 5 y 21.2 de la [Ley de Competencia Desleal](https://www.boe.es/buscar/act.php?id=BOE-A-1991-628).
- **Precedente social, no ambiental.** La autoridad italiana de la competencia multó con 3,5 M€ a Armani porque sus declaraciones éticas no se correspondían con lo que pasaba en sus proveedores. Que se hubiera levantado la administración judicial no cambiaba nada ([Il Post, 1-8-2025](https://www.ilpost.it/2025/08/01/antitrust-multa-armani/)). Armani anunció recurso, y no sabemos cómo terminó.
- **Italia quitó el sello que funcionaba como escudo.** La certificación «filiera della moda certificata» salió de la ley PMI tras las críticas que la llamaban «escudo penal» ([Artribune](https://www.artribune.com/?p=1216669)).

## Respuesta de 25 s (65 palabras)
> «El verde no sale de la empresa: el contrato prohíbe usarlo en publicidad, etiquetas o sellos. Y la ley va en la misma línea: la Directiva europea de 2024 prohíbe los distintivos sociales sin certificación independiente. Verde solo significa que las horas cuadran con tus pedidos; no dice nada de salarios ni de coacción. Italia quitó este año de su ley un sello así.»

## Qué cambia en la app o en el pitch
- **Pitch.** Nada nuevo: el v1 dice «ni damos sellos». No decir nunca «taller verde» ni «taller limpio».
- **App.** Ya está bien: `VERDE_NO_ES_SELLO` y `/legal#encaje` lo dicen, y el verde no lleva ningún icono de aprobado. Solo se pide un cambio, en P2: en `textos.ts`, `NOTA_ESTADO.verde.texto`, añadir al final «No evalúa salarios, coacción ni condiciones de trabajo».

## Qué sigue abierto
- El estado de la transposición en España y en Italia.
- Si citar Trama en un informe de sostenibilidad cuenta como comunicación comercial a efectos de la Directiva. Mientras no se aclare, solo con el texto descriptivo fijo.
- **Riesgo de fondo.** Un verde puede convivir con una subcontrata no declarada en un taller grande cuyas horas de alta la tapan (ya está en «Límites del método»). Por eso el verde nunca se presenta como garantía.
