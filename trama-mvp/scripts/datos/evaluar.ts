/** Puntúa el dataset ingerido (v1 y v2) y lo compara con la verdad oculta. Uso: --escenario pitch */
import type { DatasetIngerido, Verdad } from "../../src/lib/datos/contratos.ts";
import { evaluacionMarkdown, evaluar, puntuar } from "../../src/lib/datos/evaluacion.ts";
import { PARAMETROS_PUBLICOS_PROVISIONALES } from "../../src/lib/datos/parametros.ts";
import { puntuarV2 } from "../../src/lib/datos/score.ts";
import { argumento, escribir, json, leer, ruta } from "./comun.ts";
import { cargarParametros } from "./parametros.ts";

const nombre = argumento("escenario", "pitch");
const dataset = JSON.parse(leer(ruta("salida", nombre, "dataset.json"))) as DatasetIngerido;
const scores = puntuar(dataset); // el score se calcula ANTES de abrir la verdad
const scoresV2 = puntuarV2(dataset, cargarParametros() ?? PARAMETROS_PUBLICOS_PROVISIONALES);
const verdad = JSON.parse(leer(ruta("verdad", nombre, "verdad.json"))) as Verdad;
const ev = evaluar(scores, verdad);
const evV2 = evaluar(scoresV2, verdad);
escribir(ruta("salida", nombre, "scores.json"), json(scores));
escribir(ruta("salida", nombre, "scores_v2.json"), json(scoresV2));
escribir(ruta("salida", nombre, "evaluacion.json"), json(ev));
escribir(ruta("salida", nombre, "evaluacion_v2.json"), json(evV2));
escribir(ruta("salida", nombre, "evaluacion.md"), evaluacionMarkdown(ev));
console.log(
  `Evaluación «${nombre}» (datos sintéticos): rojo en ${ev.matriz.vp}/${ev.matriz.vp + ev.matriz.fn} problemas reales · falsos rojos ${ev.falsosRojosEnSanos} · sin datos en rojo ${ev.sinDatosEnRojo}` +
    ` · v2: rojo en ${evV2.matriz.vp}/${evV2.matriz.vp + evV2.matriz.fn} · falsos rojos ${evV2.falsosRojosEnSanos} · sin datos en rojo ${evV2.sinDatosEnRojo}`,
);
