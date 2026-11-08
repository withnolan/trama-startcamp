/**
 * Parámetros del pipeline.
 * - PARAMETROS_PUBLICOS_PROVISIONALES: cifras REALES con su fuente, copiadas a mano (capturado: false) hasta que A1 las
 *   sustituya por la instantánea de `datos/publicos/parametros_publicos.json`.
 * - PARAMETROS_SEMAFORO: los mismos umbrales que `src/data/seed.json` (un test lo comprueba).
 */
import type { Seed } from "../calculo/tipos.ts";
import type { Convenio, ParametrosPublicos } from "./contratos.ts";

const INE_73019 = "https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/73019?nult=1";

export const PARAMETROS_PUBLICOS_PROVISIONALES: ParametrosPublicos = {
  version: "provisional-N1",
  empresasPorTramo: {
    cnae14: {
      valor: { "1-2": 2040, "3-5": 832, "6-9": 448, "10-19": 370, "20-49": 176 },
      unidad: "empresas",
      fuente: { url: INE_73019, consultado: "2026-11-08", sha256: null },
      nota: "INE, DIRCE a 1-1-2025, CNAE 14 (confección), empresas por tramo de asalariados.",
      capturado: false,
    },
    cnae15: {
      valor: { "1-2": 800, "3-5": 434, "6-9": 308, "10-19": 371, "20-49": 304 },
      unidad: "empresas",
      fuente: { url: INE_73019, consultado: "2026-11-08", sha256: null },
      nota: "INE, DIRCE a 1-1-2025, CNAE 15 (cuero y calzado), empresas por tramo de asalariados.",
      capturado: false,
    },
  },
  jornadaAnualConvenio: {
    textil: {
      valor: 1789,
      unidad: "h/año",
      fuente: { url: "https://www.boe.es/boe/dias/2025/10/09/pdfs/BOE-A-2025-20177.pdf", consultado: "2026-11-08", sha256: null },
      nota: "Convenio general de la industria textil y de la confección (según HOJA_DATOS.md).",
      capturado: false,
      verificado: false,
    },
    marroquineria: {
      valor: 1768,
      unidad: "h/año",
      fuente: { url: "https://www.boe.es/boe/dias/2024/03/27/pdfs/BOE-A-2024-6193.pdf", consultado: "2026-11-08", sha256: null },
      nota: "Convenio de marroquinería, cueros repujados y similares (según HOJA_DATOS.md).",
      capturado: false,
      verificado: false,
    },
  },
  sueloMinutos: {
    americana_forrada: {
      valor: 126,
      unidad: "min/pieza",
      fuente: { url: "https://buft.edu.bd/upload/_page/P-7.pdf", consultado: "2026-11-08", sha256: null },
      nota: "Mínimo industrial con la eficiencia real de una línea (problemas/c_informe_complaciente.md).",
      capturado: false,
    },
    marroquineria: {
      valor: null,
      unidad: "min/pieza",
      fuente: { url: "problemas/c_informe_complaciente.md", consultado: "2026-11-08", sha256: null },
      nota: "Sin suelo publicado: minutos sin contrastar hasta que el piloto lo construya.",
      capturado: false,
    },
  },
  referenciaPremiumMinutos: {
    valor: 180,
    unidad: "min/pieza",
    fuente: {
      url: "https://fashionunited.uk/press/fashion/creation-gross-fashion-made-in-germany/2021111559279",
      consultado: "2026-11-08",
      sha256: null,
    },
    nota: "Referencia de fábrica premium («hasta 180 min»): es el techo de su rango, no un suelo.",
    capturado: false,
  },
};

/** Horas al mes de jornada completa según el convenio (jornada anual ÷ 12). */
export const horasMesConvenio = (p: ParametrosPublicos, c: Convenio): number => p.jornadaAnualConvenio[c].valor / 12;

/** Umbrales del semáforo: idénticos a `src/data/seed.json` (test en datos.test.ts). */
export const PARAMETROS_SEMAFORO: Seed["parametros"] = {
  mesesVentana: 3,
  umbralVerde: 0.85,
  umbralRojo: 1.1,
  umbralRojoMicro: 1.25,
  maxPersonasMicro: 3,
  topeHorasTitularMes: 160,
  decimalesRatio: 4,
  reparto: "proporcional a días naturales, fechas inclusivas",
};
