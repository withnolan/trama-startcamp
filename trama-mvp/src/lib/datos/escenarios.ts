/** Escenarios del generador. N1: solo España y 4 arquetipos (SUPERPROMPT_DATOS.md §6.1). */
import type { Escenario } from "./contratos.ts";

export const ESCENARIOS: Record<string, Escenario> = {
  pitch: {
    nombre: "pitch",
    descripcion: "Panel sintético de una marca ficticia con 20 talleres de marroquinería en España, 6 meses.",
    meses: ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"],
    marcaId: "MARCA-SINT",
    marcaNombre: "Marca sintética (ficticia)",
    pais: "ES",
    composicion: { sano: 12, pico_legitimo: 3, subcontrata_oculta: 3, informe_tardio_o_ausente: 2 },
  },
};
