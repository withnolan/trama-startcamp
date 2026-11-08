/** Ingiere `datos/crudo/<escenario>/` → `datos/salida/<escenario>/`. NO lee la verdad oculta del generador. Uso: --escenario pitch */
import { ESCENARIOS } from "../../src/lib/datos/escenarios.ts";
import { VERSION_GENERADOR } from "../../src/lib/datos/generador.ts";
import { informeCalidad, ingerir } from "../../src/lib/datos/ingesta.ts";
import { PARAMETROS_PUBLICOS_PROVISIONALES } from "../../src/lib/datos/parametros.ts";
import { argumento, escribir, hashArchivos, json, leerCrudos, ruta } from "./comun.ts";
import { cargarParametros } from "./parametros.ts";

const nombre = argumento("escenario", "pitch");
const escenario = ESCENARIOS[nombre];
if (!escenario) throw new Error(`Escenario desconocido: ${nombre}`);

const archivos = leerCrudos(nombre);
const { ok, dataset } = ingerir(archivos, {
  escenario: nombre,
  marcaId: escenario.marcaId,
  marcaNombre: escenario.marcaNombre,
  parametros: cargarParametros() ?? PARAMETROS_PUBLICOS_PROVISIONALES,
  hashCrudo: hashArchivos(archivos),
  versionGenerador: VERSION_GENERADOR,
});
escribir(ruta("salida", nombre, "dataset.json"), json(dataset));
escribir(ruta("salida", nombre, "informe_calidad.md"), informeCalidad(dataset, ok));
const bloq = dataset.incidencias.filter((i) => i.gravedad === "bloqueante").length;
console.log(`Ingesta «${nombre}»: ${ok ? "OK" : "BLOQUEADA"} · ${dataset.seed.talleres.length} talleres · ${dataset.seed.pedidos.length} pedidos · ${dataset.seed.certificadosHoras.length} informes · ${bloq} bloqueantes · ${dataset.incidencias.length} incidencias`);
if (!ok) process.exit(1);
