/** Puntúa el dataset ingerido y lo compara con la verdad oculta. Uso: --escenario pitch */
import type { DatasetIngerido, Verdad } from "../../src/lib/datos/contratos.ts";
import { evaluacionMarkdown, evaluar, puntuar } from "../../src/lib/datos/evaluacion.ts";
import { argumento, escribir, json, leer, ruta } from "./comun.ts";

const nombre = argumento("escenario", "pitch");
const dataset = JSON.parse(leer(ruta("salida", nombre, "dataset.json"))) as DatasetIngerido;
const scores = puntuar(dataset); // el score se calcula ANTES de abrir la verdad
const verdad = JSON.parse(leer(ruta("verdad", nombre, "verdad.json"))) as Verdad;
const ev = evaluar(scores, verdad);
escribir(ruta("salida", nombre, "scores.json"), json(scores));
escribir(ruta("salida", nombre, "evaluacion.json"), json(ev));
escribir(ruta("salida", nombre, "evaluacion.md"), evaluacionMarkdown(ev));
console.log(
  `Evaluación «${nombre}» (datos sintéticos): rojo en ${ev.matriz.vp}/${ev.matriz.vp + ev.matriz.fn} problemas reales · falsos rojos ${ev.falsosRojosEnSanos} · sin datos en rojo ${ev.sinDatosEnRojo}`,
);
