// Medias del jurado simulado por ronda. Uso: node jurado/medias.mjs  → imprime y escribe jurado/medias.md
// Entrada: jurado/rN/notas.json = [{ perfil, fijo, notas: {clave: 1-10}, global, fuerte, fallo, pregunta, subiria }]
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const PESOS = {
  problema_impacto: 25,
  solucion_innovacion: 20,
  negocio_viabilidad: 20,
  validacion_gtm: 15,
  equipo_ejecucion: 10,
  pitch_demo: 10,
};
const CLAVES = Object.keys(PESOS);

export const ponderada = (n) => CLAVES.reduce((s, k) => s + n[k] * PESOS[k], 0) / 100;
const media = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const f = (x) => (Number.isNaN(x) ? "—" : x.toFixed(2));

function validar(j, archivo) {
  for (const k of CLAVES) {
    const v = j.notas?.[k];
    if (typeof v !== "number" || v < 1 || v > 10) throw new Error(`${archivo}: ${j.perfil} sin nota válida en ${k}`);
  }
  if (typeof j.global !== "number" || j.global < 1 || j.global > 10) throw new Error(`${archivo}: ${j.perfil} sin global`);
}

// Autocomprobación de la ponderación (todo 10 → 10; mezcla conocida → 6,4).
console.assert(ponderada(Object.fromEntries(CLAVES.map((k) => [k, 10]))) === 10, "ponderada(10) != 10");
console.assert(
  Math.abs(ponderada({ problema_impacto: 8, solucion_innovacion: 7, negocio_viabilidad: 5, validacion_gtm: 4, equipo_ejecucion: 6, pitch_demo: 8 }) - 6.4) < 1e-9,
  "ponderada(mezcla) != 6,4",
);

const rondas = readdirSync(DIR)
  .filter((d) => /^r\d+$/.test(d) && existsSync(join(DIR, d, "notas.json")))
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

const filas = [];
for (const r of rondas) {
  const archivo = join(r, "notas.json");
  const js = JSON.parse(readFileSync(join(DIR, archivo), "utf8"));
  js.forEach((j) => validar(j, archivo));
  const fijos = js.filter((j) => j.fijo);
  filas.push({
    ronda: r,
    n: js.length,
    porCriterio: Object.fromEntries(CLAVES.map((k) => [k, media(js.map((j) => j.notas[k]))])),
    ponderada: media(js.map((j) => ponderada(j.notas))),
    global: media(js.map((j) => j.global)),
    ponderadaFijos: media(fijos.map((j) => ponderada(j.notas))),
    globalFijos: media(fijos.map((j) => j.global)),
    jurados: js.map((j) => `${j.perfil}${j.fijo ? " (fijo)" : ""}: ${f(ponderada(j.notas))} / ${j.global}`),
  });
}

const cab = `| Ronda | n | ${CLAVES.map((k) => `${k} (${PESOS[k]})`).join(" | ")} | Ponderada | Global | Ponderada fijos | Global fijos |`;
const sep = `|${"---|".repeat(CLAVES.length + 6)}`;
const cuerpo = filas.map(
  (x) =>
    `| ${x.ronda} | ${x.n} | ${CLAVES.map((k) => f(x.porCriterio[k])).join(" | ")} | **${f(x.ponderada)}** | ${f(x.global)} | ${f(x.ponderadaFijos)} | ${f(x.globalFijos)} |`,
);
const detalle = filas.map((x) => `- **${x.ronda}**: ${x.jurados.join(" · ")}`);
const md = [`# Medias del jurado simulado`, ``, `Generado con \`node jurado/medias.mjs\`.`, ``, cab, sep, ...cuerpo, ``, `Por jurado (ponderada / global):`, ...detalle, ``].join("\n");
writeFileSync(join(DIR, "medias.md"), md);
console.log(md);
