/**
 * Captura de parámetros públicos reales (A1). Única pieza del pipeline que usa la red.
 *
 *   node --experimental-strip-types --no-warnings scripts/datos/capturar-publicos.ts            # descarga y guarda
 *   node --experimental-strip-types --no-warnings scripts/datos/capturar-publicos.ts --offline  # reconstruye desde raw/
 *
 * - Descarga INE (DIRCE 73019), Eurostat (lfsa_ewhun2) y BOE (texto de dos convenios), 3 intentos por fuente.
 * - Guarda en `datos/publicos/raw/` SOLO el recorte usado y, en `raw/capturas.json`, la URL, la fecha y el sha256 de la
 *   respuesta COMPLETA. Si una fuente falla, conserva su instantánea anterior; si no hay, el valor provisional
 *   (`capturado: false`). Nunca inventa un valor.
 * - `parametros_publicos.json` se construye SIEMPRE desde `raw/` (con o sin red), así ambos modos dan los mismos bytes.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import type { Convenio } from "../../src/lib/datos/contratos.ts";
import type { CapturasPublicas, DatasetJsonStat, MetaCaptura, SerieIne } from "../../src/lib/datos/publicos.ts";
import {
  CONVENIOS, FILTRO_EUROSTAT, URL_EUROSTAT_HORAS, URL_INE_DIRCE, celdaEurostat, construirParametros, extraerJornada,
  recortarConvenio, recortarDirce, tramosDirce, urlBoe, validarParametros,
} from "../../src/lib/datos/publicos.ts";
import { escribir, json, leer, ruta } from "./comun.ts";

const OFFLINE = process.argv.includes("--offline");
const INTENTOS = 3;
const RAW = (...p: string[]) => ruta("publicos", "raw", ...p);
const MANIFIESTO = RAW("capturas.json");
const SALIDA = ruta("publicos", "parametros_publicos.json");

type ClaveFuente = "ine_dirce" | "eurostat_horas" | `boe_${Convenio}`;
type Manifiesto = Partial<Record<ClaveFuente, MetaCaptura>>;

const hoy = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

async function descargar(url: string, accept: string, timeoutMs: number): Promise<Buffer> {
  let ultimo: unknown;
  for (let i = 1; i <= INTENTOS; i++) {
    try {
      const r = await fetch(url, {
        headers: { Accept: accept, "User-Agent": "trama-mvp/0.1 (captura de parametros publicos)" },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      ultimo = e;
      console.warn(`  intento ${i}/${INTENTOS} fallido: ${(e as Error).message}`);
    }
  }
  throw new Error(`${url}: ${INTENTOS} intentos fallidos (${(ultimo as Error)?.message})`);
}

const meta = (url: string, cuerpo: Buffer, archivo: string): MetaCaptura => ({
  url, consultado: hoy(), sha256: createHash("sha256").update(cuerpo).digest("hex"), bytes: cuerpo.length, archivo,
});

/** Descarga una fuente, la valida y guarda su recorte. Si algo falla, deja el manifiesto como estaba. */
async function capturar(m: Manifiesto, clave: ClaveFuente, fn: () => Promise<MetaCaptura>): Promise<void> {
  console.log(`· ${clave}`);
  try {
    m[clave] = await fn();
    console.log(`  OK · sha256 ${m[clave]!.sha256.slice(0, 12)}… · ${m[clave]!.bytes} bytes → raw/${m[clave]!.archivo}`);
  } catch (e) {
    console.warn(`  FALLO: ${(e as Error).message}`);
    console.warn(m[clave] ? `  se conserva la instantánea del ${m[clave]!.consultado}` : "  sin instantánea previa: valor provisional");
  }
}

async function capturarTodo(m: Manifiesto): Promise<void> {
  await capturar(m, "ine_dirce", async () => {
    const cuerpo = await descargar(URL_INE_DIRCE, "application/json", 180_000);
    const recorte = recortarDirce(JSON.parse(cuerpo.toString("utf8")) as SerieIne[]);
    tramosDirce(recorte, "cnae14"); tramosDirce(recorte, "cnae15"); // valida antes de guardar
    const archivo = "ine_73019_recorte.json";
    escribir(RAW(archivo), json(recorte));
    return meta(URL_INE_DIRCE, cuerpo, archivo);
  });

  await capturar(m, "eurostat_horas", async () => {
    const cuerpo = await descargar(URL_EUROSTAT_HORAS, "application/json", 60_000);
    const ds = JSON.parse(cuerpo.toString("utf8")) as DatasetJsonStat;
    celdaEurostat(ds, { ...FILTRO_EUROSTAT, geo: "ES" }); celdaEurostat(ds, { ...FILTRO_EUROSTAT, geo: "IT" });
    const archivo = "eurostat_lfsa_ewhun2.json";
    escribir(RAW(archivo), json(ds)); // respuesta completa (pequeña), re-serializada con fin de línea LF
    return meta(URL_EUROSTAT_HORAS, cuerpo, archivo);
  });

  for (const c of Object.keys(CONVENIOS) as Convenio[]) {
    await capturar(m, `boe_${c}`, async () => {
      const id = CONVENIOS[c].boeId;
      const cuerpo = await descargar(urlBoe(id), "text/html", 60_000);
      const recorte = recortarConvenio(cuerpo.toString("utf8"), c);
      if (!recorte) throw new Error(`no aparece «${CONVENIOS[c].articuloJornada}» en ${id}`);
      if (!extraerJornada(recorte, c)) console.warn(`  aviso: no se encontró la cifra de jornada anual en ${id}`);
      const archivo = `boe_${id}_recorte.txt`;
      escribir(RAW(archivo), recorte);
      return meta(urlBoe(id), cuerpo, archivo);
    });
  }
}

/** Lee raw/ (manifiesto + recortes) y lo pasa a la función pura. */
function leerCapturas(m: Manifiesto): CapturasPublicas {
  const disponible = (k: ClaveFuente) => m[k] && existsSync(RAW(m[k]!.archivo)) ? m[k]! : undefined;
  const c: CapturasPublicas = { boe: {} };
  const ine = disponible("ine_dirce");
  if (ine) c.ine = { meta: ine, series: JSON.parse(leer(RAW(ine.archivo))) as SerieIne[] };
  const eu = disponible("eurostat_horas");
  if (eu) c.eurostat = { meta: eu, dataset: JSON.parse(leer(RAW(eu.archivo))) as DatasetJsonStat };
  for (const k of Object.keys(CONVENIOS) as Convenio[]) {
    const b = disponible(`boe_${k}`);
    if (b) c.boe![k] = { meta: b, texto: leer(RAW(b.archivo)) };
  }
  return c;
}

async function main(): Promise<void> {
  const m: Manifiesto = existsSync(MANIFIESTO) ? (JSON.parse(leer(MANIFIESTO)) as Manifiesto) : {};
  if (OFFLINE) console.log("Modo --offline: se reconstruye desde datos/publicos/raw/ sin red.");
  else {
    await capturarTodo(m);
    const ordenado: Manifiesto = {};
    for (const k of ["ine_dirce", "eurostat_horas", "boe_textil", "boe_marroquineria"] as ClaveFuente[]) if (m[k]) ordenado[k] = m[k];
    escribir(MANIFIESTO, json(ordenado));
  }

  const { parametros, avisos } = construirParametros(leerCapturas(m));
  const errores = validarParametros(parametros);
  if (errores.length) {
    console.error("parametros_publicos.json no válido; no se escribe:\n- " + errores.join("\n- "));
    process.exit(1);
  }
  const texto = json(parametros);
  escribir(SALIDA, texto);
  for (const a of avisos) console.warn(`aviso: ${a}`);
  const sha = createHash("sha256").update(texto, "utf8").digest("hex");
  console.log(`→ datos/publicos/parametros_publicos.json · ${parametros.version} · sha256 ${sha}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
