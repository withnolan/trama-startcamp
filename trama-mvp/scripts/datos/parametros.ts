/** Carga `datos/publicos/parametros_publicos.json` si existe (lo produce A1); si no, null → se usan los provisionales. */
import { existsSync } from "node:fs";
import type { ParametrosPublicos } from "../../src/lib/datos/contratos.ts";
import { leer, ruta } from "./comun.ts";

export function cargarParametros(): ParametrosPublicos | null {
  const f = ruta("publicos", "parametros_publicos.json");
  return existsSync(f) ? (JSON.parse(leer(f)) as ParametrosPublicos) : null;
}
