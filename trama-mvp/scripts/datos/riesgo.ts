/**
 * Riesgo laboral (muestra mínima): añade al dataset los agregados del revisor, calcula el riesgo por taller y escribe el
 * informe. La evaluación contra la verdad se hace después, en memoria, con N semillas. Uso: --escenario pitch --semillas 20
 */
import type { DatasetIngerido } from "../../src/lib/datos/contratos.ts";
import { ESCENARIOS } from "../../src/lib/datos/escenarios.ts";
import { generar } from "../../src/lib/datos/generador.ts";
import { ingerir } from "../../src/lib/datos/ingesta.ts";
import { ingerirLaboral } from "../../src/lib/datos/laboral.ts";
import { PARAMETROS_PUBLICOS_PROVISIONALES } from "../../src/lib/datos/parametros.ts";
import { evaluarRiesgo, evaluarRiesgoContraVerdad, informeRiesgoMarkdown } from "../../src/lib/datos/riesgo.ts";
import { puntuarV2 } from "../../src/lib/datos/score.ts";
import { argumento, escribir, json, leer, leerCrudos, leerExclusion, ruta } from "./comun.ts";
import { cargarParametros } from "./parametros.ts";

const nombre = argumento("escenario", "pitch");
const nSemillas = Number(argumento("semillas", "20"));
const escenario = ESCENARIOS[nombre];
if (!escenario) throw new Error(`Escenario desconocido: ${nombre}`);
const P = cargarParametros() ?? PARAMETROS_PUBLICOS_PROVISIONALES;

const conLaboral = (d: DatasetIngerido, archivos: ReturnType<typeof leerCrudos>): DatasetIngerido => {
  const { laboral, incidencias } = ingerirLaboral(archivos, d.seed.talleres.map((t) => t.id));
  return { ...d, laboral, incidencias: [...d.incidencias, ...incidencias] };
};

// 1) Escenario en disco: riesgo antes de cualquier verdad.
const dataset = conLaboral(JSON.parse(leer(ruta("salida", nombre, "dataset.json"))) as DatasetIngerido, leerCrudos(nombre));
const riesgo = evaluarRiesgo(dataset, puntuarV2(dataset, P));
escribir(ruta("salida", nombre, "riesgo.json"), json(riesgo));

// 2) Evaluación con N semillas en memoria (el riesgo se calcula sin mirar la verdad; se compara después).
const exclusion = leerExclusion();
const corridas = Array.from({ length: nSemillas }, (_, i) => {
  const g = generar(escenario, i + 1, P, exclusion);
  const { dataset: d0 } = ingerir(g.archivos, { escenario: nombre, marcaId: escenario.marcaId, marcaNombre: escenario.marcaNombre, parametros: P, hashCrudo: "memoria" });
  const d = conLaboral(d0, g.archivos);
  const r = evaluarRiesgo(d, puntuarV2(d, P));
  return { riesgo: r, verdad: g.verdad };
});
const ev = evaluarRiesgoContraVerdad(corridas);
escribir(ruta("salida", nombre, "evaluacion_riesgo.json"), json(ev));
escribir(ruta("salida", nombre, "informe_riesgo.md"), informeRiesgoMarkdown(dataset, riesgo, ev));

const cuenta = (n: string) => riesgo.filter((x) => x.nivel === n).length;
console.log(
  `Riesgo «${nombre}» (datos simulados): crítico ${cuenta("critico")} · alto ${cuenta("alto")} · medio ${cuenta("medio")} · bajo ${cuenta("bajo")} · ` +
    `${nSemillas} semillas: detección ${ev.deteccion}/${ev.problemas} · falsas alarmas ${ev.falsasAlarmas}/${ev.sinProblema}`,
);
