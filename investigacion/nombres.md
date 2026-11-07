# Nombres ficticios: comprobación (sábado 7-nov-2026)

Los nombres salen de `specs/seed.json`; la app usa una copia en `trama-mvp/src/data/seed.json`. Las ciudades son reales y no se han comprobado. He buscado en la web cada nombre exacto junto con su sector y su ciudad. No he consultado registros mercantiles (BORME, Registro Imprese) ni de marcas (OEPM, EUIPO), así que un nombre podría estar registrado sin aparecer en la web.

| Nombre (papel en la demo) | ¿Existe algo real? | Acción |
|---|---|---|
| Ordessa (marca cliente, España) | No como marca de moda ni de cosmética. Hay nombres parecidos: [Laboratorios Ordesa](https://www.alimarket.es/sanidad/noticia_amp/312299/joan-permanyer-asume-la-presidencia-de-laboratorios-ordesa) (nutrición infantil, España) y el valle de Ordesa. | Dudoso, mantener |
| Manifattura Lince S.r.l. (T1, Abbiategrasso; confección de cachemir) | No. Solo hay nombres parecidos de otros sectores (Manifattura Lenci, cerámica histórica de Turín; productos «Lince»). | Mantener |
| Laboratorio Gelso (T2, Rozzano; subcontrata con indicios de explotación) | **Sí, y del sector:** [Gelso Milano](https://www.wolfandbadger.com/au/designers/gelso-milano/), marca italiana de moda centrada en la seda. Existe además [Il Gelso Cooperativa Sociale Onlus](https://atoka.io/public/it/azienda/il-gelso-cooperativa-sociale-onlus/b317b234ba5d), en Ghedi (Brescia), dedicada a la recogida de residuos. Coincide en sector (moda) y en zona (Milán), y en la demo es el taller con explotación. | **Cambiar por «Laboratorio Bagolaro»** |
| Marroquinería Alcotán S.L. (T3, Ubrique) | No. Lo más parecido es Alcott, una cadena italiana de moda con otro nombre. | Mantener |
| Taller del Almendro S.L. (T4, Elche) | No en piel. [El Almendro](https://www.gulfood.com/gulfood-2025-brands/el-almendro) es una marca de turrones (alimentación). | Dudoso, mantener |
| Pelletteria Ontano S.r.l. (T5, Scandicci) | No. | Mantener |
| Marroquinería Lentisco (T6, Igualada) | No como empresa. «Lentisco» es el nombre de un [color de Loro Piana](https://www.1stdibs.com/es/moda/bolsos-de-mano-y-monederos/bolsas-de-hombro/loro-piana-lentisco-claro-piel-de-becerro-granulada-bala-grande-hobo-con-correa/id-v_25994482) para bolsos de piel, no una empresa. | Dudoso, mantener |
| Studio Paglierino (despacho que firma los certificados de T1, Italia) | No. | Mantener |
| Studio Ventaglio (despacho que firma los certificados de T2, Italia) | No. | Mantener |
| Studio Pratolino (despacho que firma los certificados de T5, Italia) | No como despacho. Pratolino es una localidad cerca de Florencia. | Mantener |
| Gestoría Lagunilla (despacho que firma los certificados de T3, España) | No. «Lagunilla» solo aparece como topónimo y en empresas de otros sectores. | Mantener |
| Asesoría Laboral Salinar (despacho que firma los certificados de T4, España) | No. | Mantener |
| Gestoría Rierol (despacho que firma los certificados de T6, España) | No. Solo aparecen topónimos («La Rierola»). | Mantener |
| Associazione Navetta Solidale (revisor y entidad acompañante, Italia) | No. | Mantener |

## Otros nombres propios del seed

- **AsseCo** (campo `viaAsseCo`): es **real**. Se trata de [ASSE.CO](https://www.fiscal-focus.it/quotidiano/il-quotidiano/articoli-lavoro/asse-co-cos-e-la-certificazione-per-consulenti-del-lavoro-quanto-costa-e-come-averla,3,175948), la certificación de conformidad de las relaciones laborales («asseverazione di conformità dei rapporti di lavoro») del Consiglio Nazionale dell'Ordine dei Consulenti del Lavoro, que existe desde 2014. No es un nombre inventado y está bien usado: solo pueden emitirla los consulenti del lavoro, y en el seed solo aparece en los talleres italianos. Mantener.
- «línea Atelier», «Tote edición limitada» y «Tarjetero cápsula» son nombres genéricos. Mantener.
- Los números de colegiado `DEMO-…` y los identificadores no son nombres.

## Sustituto propuesto

- **«Laboratorio Bagolaro»**: el bagolaro es el almez, un árbol, así que sigue la serie de árboles del seed (gelso, ontano, almendro, lentisco). Lo he comprobado y no aparece ninguna empresa, marca ni cooperativa con ese nombre en moda o confección, ni en Milán o Rozzano. Si se prefiere otro, «Laboratorio Ligustro» también está libre (comprobado igual).
- Dónde cambiarlo (yo no he tocado nada): `specs/seed.json`, `trama-mvp/src/data/seed.json` y `specs/DATA_MODEL.md`. Aparece una vez en cada archivo.
