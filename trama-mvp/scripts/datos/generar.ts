/** Genera los archivos crudos SINTÉTICOS y la verdad oculta. Uso: --escenario pitch --semilla 2026 */
import { ARCHIVO, type NombreArchivo } from "../../src/lib/datos/contratos.ts";
import { ESCENARIOS } from "../../src/lib/datos/escenarios.ts";
import { generar, VERSION_GENERADOR } from "../../src/lib/datos/generador.ts";
import { PARAMETROS_PUBLICOS_PROVISIONALES } from "../../src/lib/datos/parametros.ts";
import { argumento, escribir, hashArchivos, json, leerExclusion, ruta } from "./comun.ts";
import { cargarParametros } from "./parametros.ts";

const nombre = argumento("escenario", "pitch");
const semilla = Number(argumento("semilla", "2026"));
const escenario = ESCENARIOS[nombre];
if (!escenario) throw new Error(`Escenario desconocido: ${nombre}`);

const parametros = cargarParametros() ?? PARAMETROS_PUBLICOS_PROVISIONALES;
const { archivos, verdad } = generar(escenario, semilla, parametros, leerExclusion());
for (const [n, texto] of Object.entries(archivos) as [NombreArchivo, string][]) escribir(ruta("crudo", nombre, ARCHIVO[n]), texto);
escribir(ruta("verdad", nombre, "verdad.json"), json({ ...verdad, versionGenerador: VERSION_GENERADOR, parametros: parametros.version }));
console.log(`Generado «${nombre}» (semilla ${semilla}, parámetros ${parametros.version}): ${verdad.talleres.length} talleres · hash ${hashArchivos(archivos).slice(0, 16)}`);
