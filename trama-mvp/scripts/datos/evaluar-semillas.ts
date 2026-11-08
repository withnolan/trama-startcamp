/**
 * Evaluación con muchas semillas, en memoria: generar → ingerir → puntuar (v1 y v2) → comparar.
 * Uso: --escenario pitch --semillas 20  (semillas 1…N). Salida: datos/salida/<esc>/evaluacion_semillas.{json,md}.
 * Disciplina: en cada semilla el score se calcula ANTES de abrir la situación real que guarda el generador.
 */
import { ESCENARIOS } from "../../src/lib/datos/escenarios.ts";
import { agregarSemillas, evaluacionSemillasMarkdown, metricasCorrida, puntuar, type MetricasCorrida } from "../../src/lib/datos/evaluacion.ts";
import { generar, VERSION_GENERADOR } from "../../src/lib/datos/generador.ts";
import { ingerir } from "../../src/lib/datos/ingesta.ts";
import { PARAMETROS_PUBLICOS_PROVISIONALES } from "../../src/lib/datos/parametros.ts";
import { puntuarV2 } from "../../src/lib/datos/score.ts";
import { argumento, escribir, hashArchivos, json, leerExclusion, ruta } from "./comun.ts";
import { cargarParametros } from "./parametros.ts";

const nombre = argumento("escenario", "pitch");
const n = Number(argumento("semillas", "20"));
const escenario = ESCENARIOS[nombre];
if (!escenario) throw new Error(`Escenario desconocido: ${nombre}`);
if (!(Number.isInteger(n) && n > 0)) throw new Error(`--semillas debe ser un entero positivo (recibido «${n}»)`);

const parametros = cargarParametros() ?? PARAMETROS_PUBLICOS_PROVISIONALES;
const exclusion = leerExclusion();

const corridas: MetricasCorrida[] = [];
for (let semilla = 1; semilla <= n; semilla++) {
  const salida = generar(escenario, semilla, parametros, exclusion);
  const { ok, dataset } = ingerir(salida.archivos, {
    escenario: nombre,
    marcaId: escenario.marcaId,
    marcaNombre: escenario.marcaNombre,
    parametros,
    hashCrudo: hashArchivos(salida.archivos),
    semilla,
    versionGenerador: VERSION_GENERADOR,
  });
  if (!ok) throw new Error(`Ingesta bloqueada con la semilla ${semilla}`);
  const v1 = puntuar(dataset); // primero el score…
  const v2 = puntuarV2(dataset, parametros);
  corridas.push(metricasCorrida(semilla, v1, v2, salida.verdad, dataset.seed.parametros)); // …después la comparación
}

const ev = agregarSemillas(nombre, corridas);
escribir(ruta("salida", nombre, "evaluacion_semillas.json"), json({ ...ev, versionGenerador: VERSION_GENERADOR, parametros: parametros.version }));
escribir(ruta("salida", nombre, "evaluacion_semillas.md"), evaluacionSemillasMarkdown(ev));
const g = ev.global.v2;
console.log(
  `Evaluación «${nombre}» con ${n} semillas (datos sintéticos) · v2: rojo en problemas ${g.sensibilidadRojo.media} (${g.sensibilidadRojo.p5}-${g.sensibilidadRojo.p95}) · falsos rojos ${g.tasaFalsosRojos.media} · sin datos en rojo ${ev.sinDatosEnRojoTotal.v2}`,
);
