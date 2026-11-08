/** Utilidades de E/S de los scripts del pipeline (solo Node). Rutas relativas a `trama-mvp/`. */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ARCHIVO, type ArchivosCrudos, type NombreArchivo } from "../../src/lib/datos/contratos.ts";

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const ruta = (...p: string[]) => join(RAIZ, "datos", ...p);

export function argumento(nombre: string, porDefecto: string): string {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto;
}

export function escribir(archivo: string, contenido: string): void {
  mkdirSync(dirname(archivo), { recursive: true });
  writeFileSync(archivo, contenido, "utf8");
}

export const leer = (archivo: string) => readFileSync(archivo, "utf8");
export const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

/** Hash de un conjunto de archivos crudos en orden fijo (nombre + contenido). */
export function hashArchivos(a: ArchivosCrudos): string {
  const nombres = (Object.keys(ARCHIVO) as NombreArchivo[]).filter((n) => a[n] !== undefined);
  return sha256(nombres.map((n) => `${ARCHIVO[n]}\n${a[n]}`).join("\n---\n"));
}

/** Lee de `datos/crudo/<escenario>/` los archivos que existan. */
export function leerCrudos(escenario: string): ArchivosCrudos {
  const a: ArchivosCrudos = {};
  for (const n of Object.keys(ARCHIVO) as NombreArchivo[]) {
    const f = ruta("crudo", escenario, ARCHIVO[n]);
    if (existsSync(f)) a[n] = leer(f);
  }
  return a;
}

export function leerExclusion(): string[] {
  return leer(ruta("exclusion_nombres.txt"))
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

/** JSON estable (claves en el orden de creación, sangría de 2) con salto de línea final. */
export const json = (x: unknown) => JSON.stringify(x, null, 2) + "\n";
