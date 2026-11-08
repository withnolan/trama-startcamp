import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Convenio, ParametrosPublicos } from "./contratos";
import { PARAMETROS_PUBLICOS_PROVISIONALES as P } from "./parametros";
import {
  CONVENIOS, FILTRO_EUROSTAT, celdaEurostat, construirParametros, extraerArticulo, extraerJornada, numeroEnLetras,
  numeroEs, recortarConvenio, recortarDirce, textoPlano, tramosDirce, validarParametros,
  type CapturasPublicas, type DatasetJsonStat, type MetaCaptura, type SerieIne,
} from "./publicos";

const RAIZ = join(__dirname, "..", "..", "..");
const RAW = (f: string) => join(RAIZ, "datos", "publicos", "raw", f);
const leerJson = <T,>(f: string) => JSON.parse(readFileSync(f, "utf8")) as T;

const manifiesto = leerJson<Record<string, MetaCaptura>>(RAW("capturas.json"));
const dirce = leerJson<SerieIne[]>(RAW(manifiesto.ine_dirce.archivo));
const eurostat = leerJson<DatasetJsonStat>(RAW(manifiesto.eurostat_horas.archivo));
const boe = (c: Convenio) => readFileSync(RAW(manifiesto[`boe_${c}`].archivo), "utf8");

const capturas = (): CapturasPublicas => ({
  ine: { meta: manifiesto.ine_dirce, series: dirce },
  eurostat: { meta: manifiesto.eurostat_horas, dataset: eurostat },
  boe: {
    textil: { meta: manifiesto.boe_textil, texto: boe("textil") },
    marroquineria: { meta: manifiesto.boe_marroquineria, texto: boe("marroquineria") },
  },
});

describe("instantánea en raw/", () => {
  it("el manifiesto apunta a recortes que existen, con sha256 de la respuesta completa", () => {
    for (const m of Object.values(manifiesto)) {
      expect(existsSync(RAW(m.archivo))).toBe(true);
      expect(m.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(m.consultado).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(m.url).toMatch(/^https:\/\//);
    }
  });

  it("parametros_publicos.json = construirParametros(raw/) y cumple el contrato", () => {
    const enDisco = leerJson<ParametrosPublicos>(join(RAIZ, "datos", "publicos", "parametros_publicos.json"));
    const { parametros, avisos } = construirParametros(capturas());
    expect(avisos).toEqual([]);
    expect(parametros).toEqual(enDisco);
    expect(validarParametros(enDisco)).toEqual([]);
    // misma forma que los provisionales (mismas claves en el mismo orden, más horasSemanalesIndustria)
    expect(Object.keys(enDisco)).toEqual([
      "version", "empresasPorTramo", "jornadaAnualConvenio", "horasSemanalesIndustria", "sueloMinutos", "referenciaPremiumMinutos",
    ]);
    expect(Object.keys(enDisco.sueloMinutos)).toEqual(Object.keys(P.sueloMinutos));
  });

  it("el módulo es puro: sin E/S ni red", () => {
    const src = readFileSync(join(__dirname, "publicos.ts"), "utf8");
    expect(src).not.toMatch(/from "node:|require\(|fetch\(/);
  });
});

describe("INE · DIRCE 73019", () => {
  it("empresas por tramo de asalariados (valores de referencia del encargo)", () => {
    expect(tramosDirce(dirce, "cnae15").valor).toEqual({ "1-2": 800, "3-5": 434, "6-9": 308, "10-19": 371, "20-49": 304 });
    expect(tramosDirce(dirce, "cnae14").valor).toEqual({ "1-2": 2040, "3-5": 832, "6-9": 448, "10-19": 370, "20-49": 176 });
    expect(tramosDirce(dirce, "cnae14").anyo).toBe(2025);
  });

  it("coinciden con los provisionales copiados de HOJA_DATOS", () => {
    expect(tramosDirce(dirce, "cnae14").valor).toEqual(P.empresasPorTramo.cnae14.valor);
    expect(tramosDirce(dirce, "cnae15").valor).toEqual(P.empresasPorTramo.cnae15.valor);
  });

  it("el recorte es idempotente y falla si falta una serie", () => {
    expect(recortarDirce(dirce)).toEqual(dirce);
    expect(() => recortarDirce(dirce.slice(1))).toThrow(/falta la serie/);
    const secreto = dirce.map((s, i) => (i === 0 ? { ...s, Data: [{ ...s.Data[0], Valor: null }] } : s));
    expect(() => tramosDirce(secreto, "cnae14")).toThrow(/valor no válido/);
  });
});

describe("Eurostat · lfsa_ewhun2", () => {
  it("horas semanales habituales, asalariados a tiempo completo, industria (ES, IT)", () => {
    const es = celdaEurostat(eurostat, { ...FILTRO_EUROSTAT, geo: "ES" });
    const it_ = celdaEurostat(eurostat, { ...FILTRO_EUROSTAT, geo: "IT" });
    expect(es.valor).toBe(40);
    expect(es.estado).toBe("d");
    expect(it_.valor).toBe(40.3);
    expect(it_.periodo).toBe("2025");
  });

  it("falla con una categoría inexistente o una dimensión sin filtrar", () => {
    expect(() => celdaEurostat(eurostat, { ...FILTRO_EUROSTAT, geo: "FR" })).toThrow(/no está/);
    const { geo: _sinGeo, ...sinGeo } = { ...FILTRO_EUROSTAT, geo: "ES" };
    void _sinGeo;
    expect(() => celdaEurostat(eurostat, sinGeo)).toThrow(/falta filtro/);
  });
});

describe("BOE · jornada anual de convenio", () => {
  it("números en letras y en cifras", () => {
    expect(numeroEnLetras("mil setecientas ochenta y nueve")).toBe(1789);
    expect(numeroEnLetras("mil ochocientas dieciocho")).toBe(1818);
    expect(numeroEnLetras("cuarenta")).toBe(40);
    expect(numeroEnLetras("dos mil veintiséis")).toBe(2026);
    expect(() => numeroEnLetras("mil horas")).toThrow();
    expect(numeroEs("1.768")).toBe(1768);
    expect(numeroEs("1.751,5")).toBe(1751.5);
  });

  it("textoPlano decodifica entidades y es idempotente", () => {
    const t = textoPlano("<p>Art&iacute;culo&nbsp;1. <b>Jornada</b>.&#160;Hola &amp; adi&#243;s</p>");
    expect(t).toBe("Art&iacute;culo 1. Jornada . Hola & adiós");
    expect(textoPlano(t)).toBe(t);
  });

  it("textil (BOE-A-2025-20177): 1.789 h, art. 28, vigente en 2026", () => {
    const j = extraerJornada(boe("textil"), "textil")!;
    expect(j.horas).toBe(1789);
    expect(j.horas).toBe(P.jornadaAnualConvenio.textil.valor);
    expect(j.articulo).toBe("Artículo 28. Jornada");
    expect(j.cita).toMatch(/^La jornada ordinaria de trabajo, en turno partido/);
    expect(boe("textil")).toMatch(/vigencia hasta 31 de diciembre de 2026/);
  });

  it("marroquinería (BOE-A-2024-6193): 1.768 h, art. 50", () => {
    const j = extraerJornada(boe("marroquineria"), "marroquineria")!;
    expect(j.horas).toBe(1768);
    expect(j.horas).toBe(P.jornadaAnualConvenio.marroquineria.valor);
    expect(j.cita).toBe(
      "La jornada de trabajo será en cómputo anual de 1.768 horas de trabajo efectivo para los años de vigencia del presente convenio.",
    );
  });

  it("el recorte desde HTML conserva el artículo y la extracción da lo mismo", () => {
    const html = `<html><body><p>Artículo 49. Otra cosa.</p><p>${boe("marroquineria").replace(/\n/g, "</p><p>")}</p>` +
      `<p>Artículo 51. Vacaciones. Treinta días.</p></body></html>`;
    const r = recortarConvenio(html, "marroquineria")!;
    expect(r).not.toMatch(/Vacaciones|Otra cosa/);
    expect(extraerJornada(r, "marroquineria")).toEqual(extraerJornada(boe("marroquineria"), "marroquineria"));
    expect(recortarConvenio("<p>nada</p>", "textil")).toBeNull();
  });

  it("extraerArticulo corta en el siguiente artículo", () => {
    expect(extraerArticulo("Artículo 1. A. uno. Artículo 2. B. dos.", "Artículo 1. A.")).toBe("Artículo 1. A. uno.");
    expect(extraerArticulo("x", "Artículo 9. Z.")).toBeNull();
  });

  it("cada convenio del contrato tiene su regla", () => {
    expect(Object.keys(CONVENIOS).sort()).toEqual(Object.keys(P.jornadaAnualConvenio).sort());
  });
});

describe("construirParametros: alternativas sin inventar valores", () => {
  it("sin capturas → provisionales con capturado: false y sin horas semanales", () => {
    const { parametros, avisos } = construirParametros({});
    expect(parametros.version).toBe(P.version);
    expect(parametros.empresasPorTramo).toEqual(P.empresasPorTramo);
    expect(parametros.jornadaAnualConvenio).toEqual(P.jornadaAnualConvenio);
    expect(parametros.horasSemanalesIndustria).toBeUndefined();
    expect(avisos.length).toBeGreaterThanOrEqual(4);
    expect(validarParametros(parametros)).toEqual([]);
  });

  it("BOE sin la cifra → valor de HOJA_DATOS con verificado: false", () => {
    const c = capturas();
    c.boe!.textil = { meta: manifiesto.boe_textil, texto: "Artículo 28. Jornada. Se estará a lo que pacten las partes." };
    const { parametros, avisos } = construirParametros(c);
    expect(parametros.jornadaAnualConvenio.textil.valor).toBe(1789);
    expect(parametros.jornadaAnualConvenio.textil.verificado).toBe(false);
    expect(parametros.jornadaAnualConvenio.textil.capturado).toBe(false);
    expect(avisos.join(" ")).toMatch(/BOE-A-2025-20177/);
  });

  it("todo lo capturado lleva url, fecha, sha256 y capturado: true; lo copiado a mano, capturado: false", () => {
    const { parametros: p } = construirParametros(capturas());
    expect(p.version).toBe(`capturado-${manifiesto.ine_dirce.consultado}`);
    for (const v of [p.empresasPorTramo.cnae14, p.empresasPorTramo.cnae15, p.jornadaAnualConvenio.textil,
      p.jornadaAnualConvenio.marroquineria, p.horasSemanalesIndustria!.ES, p.horasSemanalesIndustria!.IT]) {
      expect(v.capturado).toBe(true);
      expect(v.fuente.sha256).toMatch(/^[0-9a-f]{64}$/);
    }
    expect(p.jornadaAnualConvenio.textil.verificado).toBe(true);
    expect(p.jornadaAnualConvenio.marroquineria.verificado).toBe(true);
    expect(p.sueloMinutos.americana_forrada.valor).toBe(126);
    expect(p.sueloMinutos.americana_forrada.capturado).toBe(false);
    expect(p.referenciaPremiumMinutos.valor).toBe(180);
    expect(p.referenciaPremiumMinutos.capturado).toBe(false);
  });
});
