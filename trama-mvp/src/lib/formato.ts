// Formatos es-ES para toda la UI. Dueño: agente de Datos (cambios solo aditivos).
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const nf = (dec: number) =>
  new Intl.NumberFormat("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: true });

/** 8000 → "8.000". Ojo: es-ES no agrupa 4 cifras por defecto; forzamos el punto. */
export function fmtNumero(n: number, dec = 0): string {
  const s = nf(dec).format(n);
  // Intl es-ES deja "8000" sin separador (minimumGroupingDigits = 2): lo añadimos a mano.
  return s.replace(/^(-?)(\d)(\d{3})(?=$|,)/, "$1$2.$3");
}
/** 8000 → "8.000 h" */
export const fmtHoras = (h: number, dec = 0) => `${fmtNumero(h, dec)} h`;
/** 2.381 → "2,4×" */
export const fmtRatio = (r: number | null | undefined, dec = 1) =>
  r === undefined ? "—" : r === null ? "∞" : `${fmtNumero(r, dec)}×`;
/** 77.78 → "77,8 %" */
export const fmtPct = (p: number, dec = 0) => `${fmtNumero(p, dec)} %`;
/** "2026-10" → "oct 2026" */
export const fmtMes = (m: string) => `${MESES[Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`;
/** "2026-08-07" → "7 ago 2026" */
export const fmtFecha = (d: string) => `${Number(d.slice(8, 10))} ${MESES[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}`;
const mesCorto = (m: string) => MESES[Number(m.slice(5, 7)) - 1];
/** ["2026-08","2026-09","2026-10"] → "ago–oct 2026"; si cruza de año: "nov 2026–ene 2027" */
export const fmtVentana = (v: string[]) => {
  const [a, b] = [v[0], v[v.length - 1]];
  return a.slice(0, 4) === b.slice(0, 4) ? `${mesCorto(a)}–${fmtMes(b)}` : `${fmtMes(a)}–${fmtMes(b)}`;
};
/** ["2026-05","2026-06","2026-07"] → "may–jul 26" (eje del gráfico); si cruza de año: "nov 26–ene 27" */
export const fmtVentanaCorta = (v: string[]) => {
  const [a, b] = [v[0], v[v.length - 1]];
  return a.slice(0, 4) === b.slice(0, 4)
    ? `${mesCorto(a)}–${mesCorto(b)} ${b.slice(2, 4)}`
    : `${mesCorto(a)} ${a.slice(2, 4)}–${mesCorto(b)} ${b.slice(2, 4)}`;
};
