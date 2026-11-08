/**
 * Parámetros públicos REALES (A1). Funciones PURAS: transforman las respuestas crudas de las APIs (INE, Eurostat, BOE)
 * en `ParametrosPublicos`. La E/S (descarga, hash, recortes en `datos/publicos/raw/`) vive en
 * `scripts/datos/capturar-publicos.ts`. Nunca se inventa un valor: si una fuente falta o no se puede leer, se usa el
 * valor provisional (copiado a mano con su URL, `capturado: false`) y se deja un aviso.
 */
import type { ISODate } from "../calculo/tipos.ts";
import type { Convenio, FuentePublica, ParametrosPublicos, TramoAsalariados, ValorPublico } from "./contratos.ts";
import { PARAMETROS_PUBLICOS_PROVISIONALES } from "./parametros.ts";

// ---------- Fuentes ----------
export const URL_INE_DIRCE = "https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/73019?nult=1";
export const URL_EUROSTAT_HORAS =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/lfsa_ewhun2" +
  "?geo=ES&geo=IT&nace_r2=C&wstatus=SAL&worktime=FT&sex=T&age=Y15-64&unit=HR&format=JSON&lang=EN&lastTimePeriod=1";
export const urlBoe = (id: string) => `https://www.boe.es/diario_boe/txt.php?id=${id}`;

/** Metadatos de una captura (lo que se guarda en `raw/capturas.json`). */
export interface MetaCaptura {
  url: string;
  consultado: ISODate;
  sha256: string; // de la respuesta COMPLETA (bytes tal como llegaron)
  bytes: number;
  archivo: string; // recorte guardado en raw/
}

// ---------- INE · DIRCE (tabla 73019) ----------
export interface DatoIne { Fecha: number; Anyo: number; Valor: number | null; Secreto?: boolean; [k: string]: unknown }
export interface SerieIne { COD: string; Nombre: string; Data: DatoIne[]; [k: string]: unknown }

export const TRAMOS: readonly TramoAsalariados[] = ["1-2", "3-5", "6-9", "10-19", "20-49"];
const ETIQUETA_TRAMO: Record<TramoAsalariados, string> = {
  "1-2": "De 1 a 2 asalariados", "3-5": "De 3 a 5 asalariados", "6-9": "De 6 a 9 asalariados",
  "10-19": "De 10 a 19 asalariados", "20-49": "De 20 a 49 asalariados",
};
export const CNAE = { cnae14: "14 Confección de prendas de vestir.", cnae15: "15 Industria del cuero y del calzado." } as const;
export type ClaveCnae = keyof typeof CNAE;

export const nombreSerieDirce = (cnae: ClaveCnae, tramo: TramoAsalariados) =>
  `Nacional. ${ETIQUETA_TRAMO[tramo]}. Total. ${CNAE[cnae]}`;

/** Solo las series que usa Trama (10), en orden fijo: es el recorte que se guarda en raw/. */
export function recortarDirce(series: SerieIne[]): SerieIne[] {
  const out: SerieIne[] = [];
  for (const cnae of Object.keys(CNAE) as ClaveCnae[])
    for (const t of TRAMOS) {
      const s = series.find((x) => x.Nombre === nombreSerieDirce(cnae, t));
      if (!s) throw new Error(`DIRCE: falta la serie «${nombreSerieDirce(cnae, t)}»`);
      out.push(s);
    }
  return out;
}

/** Último dato (año más reciente) de cada tramo para un CNAE. Lanza si falta una serie o un valor. */
export function tramosDirce(series: SerieIne[], cnae: ClaveCnae): { valor: Record<TramoAsalariados, number>; anyo: number; codigos: string[] } {
  const valor = {} as Record<TramoAsalariados, number>;
  const codigos: string[] = [];
  let anyo = 0;
  for (const t of TRAMOS) {
    const s = series.find((x) => x.Nombre === nombreSerieDirce(cnae, t));
    if (!s || !s.Data?.length) throw new Error(`DIRCE: falta la serie «${nombreSerieDirce(cnae, t)}»`);
    const d = [...s.Data].sort((a, b) => b.Anyo - a.Anyo)[0];
    if (typeof d.Valor !== "number" || !Number.isFinite(d.Valor) || d.Secreto) throw new Error(`DIRCE: valor no válido en ${s.COD}`);
    valor[t] = d.Valor;
    codigos.push(s.COD);
    anyo = Math.max(anyo, d.Anyo);
  }
  return { valor, anyo, codigos };
}

// ---------- Eurostat · JSON-stat 2.0 ----------
export interface DatasetJsonStat {
  label?: string;
  updated?: string;
  id: string[];
  size: number[];
  value: Record<string, number> | number[];
  status?: Record<string, string> | string[];
  dimension: Record<string, { category: { index: Record<string, number> | string[]; label?: Record<string, string> } }>;
  extension?: { id?: string; status?: { label?: Record<string, string> } };
}

/** Filtros que dan las horas semanales HABITUALES de asalariados a tiempo completo en la industria manufacturera. */
export const FILTRO_EUROSTAT: Record<string, string> = {
  freq: "A", nace_r2: "C", wstatus: "SAL", worktime: "FT", age: "Y15-64", sex: "T", unit: "HR",
};

const indiceCategoria = (ds: DatasetJsonStat, dim: string, cod: string): number => {
  const idx = ds.dimension[dim]?.category.index;
  if (!idx) return -1;
  return Array.isArray(idx) ? idx.indexOf(cod) : (idx[cod] ?? -1);
};

/** Último periodo de la dimensión `time`. */
export function ultimoPeriodo(ds: DatasetJsonStat): string {
  const idx = ds.dimension.time?.category.index;
  if (!idx) throw new Error("Eurostat: sin dimensión time");
  const cods = Array.isArray(idx) ? idx : Object.keys(idx).sort((a, b) => idx[a] - idx[b]);
  return cods[cods.length - 1];
}

/** Valor de una celda del cubo (filtros por dimensión; time = último periodo si no se da). */
export function celdaEurostat(ds: DatasetJsonStat, filtro: Record<string, string>): { valor: number; estado: string | null; periodo: string } {
  const periodo = filtro.time ?? ultimoPeriodo(ds);
  const f: Record<string, string> = { ...filtro, time: periodo };
  let plano = 0;
  for (let i = 0; i < ds.id.length; i++) {
    const dim = ds.id[i];
    const n = ds.size[i];
    let k: number;
    if (f[dim] !== undefined) k = indiceCategoria(ds, dim, f[dim]);
    else if (n === 1) k = 0;
    else throw new Error(`Eurostat: falta filtro para la dimensión ${dim}`);
    if (k < 0) throw new Error(`Eurostat: ${dim}=${f[dim]} no está en el dataset`);
    plano = plano * n + k;
  }
  const v = (ds.value as Record<string, number>)[String(plano)];
  if (typeof v !== "number" || !Number.isFinite(v)) throw new Error(`Eurostat: sin valor para ${JSON.stringify(f)}`);
  const st = ds.status ? ((ds.status as Record<string, string>)[String(plano)] ?? null) : null;
  return { valor: v, estado: st, periodo };
}

// ---------- BOE · texto de los convenios ----------
const ENTIDADES: Record<string, string> = { nbsp: " ", amp: "&", quot: '"', lt: "<", gt: ">", apos: "'" };

/** HTML → texto plano en una línea (idempotente sobre texto ya plano). */
export function textoPlano(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, e: string) => ENTIDADES[e.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

/** Texto de un artículo: desde «Artículo N. Título» hasta el siguiente «Artículo M.» (o «CAPÍTULO»/«Sección»). */
export function extraerArticulo(texto: string, encabezado: string): string | null {
  const i = texto.indexOf(encabezado);
  if (i < 0) return null;
  const resto = texto.slice(i + encabezado.length);
  const fin = resto.search(/ (Artículo \d+\. [A-ZÁÉÍÓÚÑ]|CAPÍTULO [IVXL]+ |Sección [a-z]+\. )/);
  return (encabezado + (fin < 0 ? resto : resto.slice(0, fin))).trim();
}

const NUM: Record<string, number> = {
  un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9,
  diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciséis: 16, diecisiete: 17, dieciocho: 18,
  diecinueve: 19, veinte: 20, veintiuno: 21, veintiuna: 21, veintidós: 22, veintitrés: 23, veinticuatro: 24,
  veinticinco: 25, veintiséis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29, treinta: 30, cuarenta: 40,
  cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90, cien: 100, ciento: 100,
  doscientos: 200, doscientas: 200, trescientos: 300, trescientas: 300, cuatrocientos: 400, cuatrocientas: 400,
  quinientos: 500, quinientas: 500, seiscientos: 600, seiscientas: 600, setecientos: 700, setecientas: 700,
  ochocientos: 800, ochocientas: 800, novecientos: 900, novecientas: 900,
};

/** «mil setecientas ochenta y nueve» → 1789. Lanza si hay una palabra que no es un número (hasta 999 999). */
export function numeroEnLetras(s: string): number {
  let total = 0, actual = 0, alguno = false;
  for (const p of s.toLowerCase().trim().split(/\s+/)) {
    if (p === "y") continue;
    if (p === "mil") { total += (actual || 1) * 1000; actual = 0; alguno = true; continue; }
    const v = NUM[p];
    if (v === undefined) throw new Error(`número en letras no reconocido: «${p}» en «${s}»`);
    actual += v;
    alguno = true;
  }
  if (!alguno) throw new Error(`número en letras vacío: «${s}»`);
  return total + actual;
}

/** «1.768» → 1768 · «1.751,5» → 1751.5 */
export const numeroEs = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));

export interface ReglaConvenio {
  boeId: string;
  titulo: string;
  articuloJornada: string;
  /** Artículos que se guardan con el de jornada para justificar cuál es la vigente en 2026. */
  articulosContexto: string[];
  /** Captura la jornada anual: grupo 1 en letras o en cifras según `enLetras`. */
  patron: RegExp;
  enLetras: boolean;
  /** Contexto que se apunta en la nota (por qué es la vigente en 2026). */
  contexto: string;
}

export const CONVENIOS: Record<Convenio, ReglaConvenio> = {
  textil: {
    boeId: "BOE-A-2025-20177",
    titulo: "Convenio colectivo general de trabajo de la industria textil y de la confección, años 2024 a 2026",
    articuloJornada: "Artículo 28. Jornada.",
    articulosContexto: ["Artículo 4. Vigencia y duración."],
    patron: /[^.]*superarán las ([a-záéíóúñ ]+?) horas anuales de trabajo\./,
    enLetras: true,
    contexto:
      "Es el máximo anual de la jornada partida (40 h/semana), sin cambios por año; vigente hasta el 31-12-2026 (art. 4). " +
      "En jornada continuada el art. 28.2 fija para 2026 1.798 h de presencia = 1.742 h de trabajo efectivo.",
  },
  marroquineria: {
    boeId: "BOE-A-2024-6193",
    titulo: "Convenio colectivo del grupo de marroquinería, cueros repujados y similares (Madrid, Castilla-La Mancha y otras)",
    articuloJornada: "Artículo 50. Jornada.",
    articulosContexto: ["Artículo 12. Vigencia y duración.", "Artículo 13. Denuncia."],
    patron: /[^.]*cómputo anual de (\d{1,2}\.\d{3}) horas de trabajo efectivo[^.]*\./,
    enLetras: false,
    contexto:
      "Vigencia hasta el 31-12-2025 (art. 12); en 2026 sigue aplicándose por prórroga o ultraactividad indefinida (art. 13) " +
      "mientras no se publique uno nuevo.",
  },
};

/** Recorte que se guarda en raw/: texto plano de los artículos de contexto y del de jornada (null si no aparece este). */
export function recortarConvenio(html: string, c: Convenio): string | null {
  const t = textoPlano(html);
  const r = CONVENIOS[c];
  const jornada = extraerArticulo(t, r.articuloJornada);
  if (!jornada) return null;
  const contexto = r.articulosContexto.map((a) => extraerArticulo(t, a)).filter((a): a is string => a !== null);
  return [...contexto, jornada].join("\n\n") + "\n";
}

export interface JornadaExtraida { horas: number; articulo: string; cita: string }

/** Busca la jornada anual en el texto (HTML completo o recorte). null si no la encuentra. */
export function extraerJornada(textoOHtml: string, c: Convenio): JornadaExtraida | null {
  const r = CONVENIOS[c];
  const art = extraerArticulo(textoPlano(textoOHtml), r.articuloJornada);
  if (!art) return null;
  const m = art.slice(r.articuloJornada.length).match(r.patron);
  if (!m) return null;
  const horas = r.enLetras ? numeroEnLetras(m[1]) : numeroEs(m[1]);
  if (!Number.isFinite(horas) || horas < 1000 || horas > 2500) return null;
  return { horas, articulo: r.articuloJornada.replace(/\.$/, ""), cita: m[0].trim() };
}

// ---------- Ensamblado ----------
export interface CapturasPublicas {
  ine?: { meta: MetaCaptura; series: SerieIne[] };
  eurostat?: { meta: MetaCaptura; dataset: DatasetJsonStat };
  boe?: Partial<Record<Convenio, { meta: MetaCaptura; texto: string }>>;
}

const fuente = (m: MetaCaptura): FuentePublica => ({ url: m.url, consultado: m.consultado, sha256: m.sha256 });
const miles = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * Construye `ParametrosPublicos` a partir de lo capturado. Lo que falta o no se puede leer se toma de `base`
 * (por defecto, los provisionales con `capturado: false`) y se apunta en `avisos`. Determinista: mismas capturas → mismo
 * objeto (la `version` sale de la fecha de consulta más reciente, no del reloj).
 */
export function construirParametros(
  c: CapturasPublicas,
  base: ParametrosPublicos = PARAMETROS_PUBLICOS_PROVISIONALES,
): { parametros: ParametrosPublicos; avisos: string[] } {
  const avisos: string[] = [];
  const fechas: string[] = [];

  // INE
  const empresas = { ...base.empresasPorTramo };
  if (c.ine) {
    for (const k of Object.keys(CNAE) as ClaveCnae[]) {
      try {
        const r = tramosDirce(c.ine.series, k);
        empresas[k] = {
          valor: r.valor,
          unidad: "empresas",
          fuente: fuente(c.ine.meta),
          nota:
            `INE, DIRCE a 1-1-${r.anyo} (tabla 73019), CNAE ${CNAE[k].replace(/\.$/, "")}, empresas por tramo de asalariados. ` +
            `Series ${r.codigos.join(", ")}.`,
          capturado: true,
        };
        fechas.push(c.ine.meta.consultado);
      } catch (e) {
        avisos.push(`INE ${k}: ${(e as Error).message}; se usa el valor provisional.`);
      }
    }
  } else avisos.push("INE: sin captura; se usan los valores provisionales (capturado: false).");

  // BOE
  const jornada = { ...base.jornadaAnualConvenio };
  for (const conv of Object.keys(CONVENIOS) as Convenio[]) {
    const cap = c.boe?.[conv];
    const regla = CONVENIOS[conv];
    const prov = base.jornadaAnualConvenio[conv];
    if (!cap) { avisos.push(`BOE ${regla.boeId}: sin captura; se usa ${prov.valor} h sin verificar.`); continue; }
    const j = extraerJornada(cap.texto, conv);
    if (!j) {
      jornada[conv] = { ...prov, nota: `${prov.nota} No se encontró la jornada anual en ${regla.boeId}.`, verificado: false };
      avisos.push(`BOE ${regla.boeId}: no se encontró la jornada anual; se deja ${prov.valor} h sin verificar.`);
      continue;
    }
    const coincide = j.horas === prov.valor;
    if (!coincide) avisos.push(`BOE ${regla.boeId}: el texto dice ${j.horas} h y HOJA_DATOS ${prov.valor} h; se usa el BOE.`);
    jornada[conv] = {
      valor: j.horas,
      unidad: "h/año",
      fuente: fuente(cap.meta),
      nota:
        `${regla.titulo} (${regla.boeId}), ${j.articulo}: «${j.cita}» ${regla.contexto}` +
        (coincide ? ` Coincide con HOJA_DATOS.md (${miles(prov.valor)} h).` : ` HOJA_DATOS.md decía ${miles(prov.valor)} h.`),
      capturado: true,
      verificado: coincide,
    };
    fechas.push(cap.meta.consultado);
  }

  // Eurostat
  let horasSemanalesIndustria = base.horasSemanalesIndustria;
  if (c.eurostat) {
    try {
      const ds = c.eurostat.dataset;
      const etiquetaEstado = ds.extension?.status?.label ?? {};
      const valor = (geo: "ES" | "IT"): ValorPublico<number> => {
        const r = celdaEurostat(ds, { ...FILTRO_EUROSTAT, geo });
        const marca = r.estado
          ? ` Marca «${r.estado}» de Eurostat («${etiquetaEstado[r.estado] ?? "ver metadatos"}»): la definición nacional difiere; ver metadatos del dataset.`
          : "";
        return {
          valor: r.valor,
          unidad: "h/semana",
          fuente: fuente(c.eurostat!.meta),
          nota:
            `Eurostat lfsa_ewhun2 (EPA/LFS), ${r.periodo}, ${geo === "ES" ? "España" : "Italia"}: horas habituales por semana ` +
            `en el empleo principal, asalariados a tiempo completo de 15 a 64 años, industria manufacturera (NACE C).${marca}`,
          capturado: true,
        };
      };
      horasSemanalesIndustria = { ES: valor("ES"), IT: valor("IT") };
      fechas.push(c.eurostat.meta.consultado);
    } catch (e) {
      avisos.push(`Eurostat: ${(e as Error).message}; ${base.horasSemanalesIndustria ? "se usa el valor anterior" : "se omite el dato"}.`);
    }
  } else avisos.push(`Eurostat: sin captura; ${base.horasSemanalesIndustria ? "se usa el valor anterior" : "se omite el dato"}.`);

  const parametros: ParametrosPublicos = {
    version: fechas.length ? `capturado-${[...fechas].sort()[fechas.length - 1]}` : base.version,
    empresasPorTramo: empresas,
    jornadaAnualConvenio: jornada,
    ...(horasSemanalesIndustria ? { horasSemanalesIndustria } : {}),
    sueloMinutos: base.sueloMinutos,
    referenciaPremiumMinutos: base.referenciaPremiumMinutos,
  };
  return { parametros, avisos };
}

/** Comprobación mínima de forma (escrita a mano; sin zod). Devuelve la lista de problemas. */
export function validarParametros(p: ParametrosPublicos): string[] {
  const err: string[] = [];
  const v = (nombre: string, x: ValorPublico<unknown> | undefined) => {
    if (!x) return err.push(`${nombre}: falta`);
    if (!x.fuente?.url) err.push(`${nombre}: sin url`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(x.fuente?.consultado ?? "")) err.push(`${nombre}: consultado no es ISODate`);
    if (x.capturado && !/^[0-9a-f]{64}$/.test(x.fuente.sha256 ?? "")) err.push(`${nombre}: capturado sin sha256`);
    if (typeof x.capturado !== "boolean") err.push(`${nombre}: capturado no es booleano`);
  };
  if (!p.version) err.push("version: falta");
  for (const k of ["cnae14", "cnae15"] as const) {
    v(`empresasPorTramo.${k}`, p.empresasPorTramo?.[k]);
    for (const t of TRAMOS) if (!(Number.isInteger(p.empresasPorTramo?.[k]?.valor?.[t]) && p.empresasPorTramo[k].valor[t] >= 0))
      err.push(`empresasPorTramo.${k}.${t}: no es un entero ≥ 0`);
  }
  for (const k of ["textil", "marroquineria"] as const) {
    v(`jornadaAnualConvenio.${k}`, p.jornadaAnualConvenio?.[k]);
    const h = p.jornadaAnualConvenio?.[k]?.valor;
    if (!(h >= 1000 && h <= 2500)) err.push(`jornadaAnualConvenio.${k}: fuera de rango`);
  }
  if (p.horasSemanalesIndustria) for (const g of ["ES", "IT"] as const) {
    v(`horasSemanalesIndustria.${g}`, p.horasSemanalesIndustria[g]);
    const h = p.horasSemanalesIndustria[g]?.valor;
    if (!(h >= 20 && h <= 60)) err.push(`horasSemanalesIndustria.${g}: fuera de rango`);
  }
  for (const [k, x] of Object.entries(p.sueloMinutos ?? {})) v(`sueloMinutos.${k}`, x);
  v("referenciaPremiumMinutos", p.referenciaPremiumMinutos);
  return err;
}
