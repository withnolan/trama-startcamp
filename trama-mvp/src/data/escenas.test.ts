import { describe, expect, it } from "vitest";
import { ESCENA_CASO_MILAN, ESCENA_CUATRO_MARCAS } from "./escenas";

// Las cifras que se dicen en el escenario: si cambian los umbrales, esto avisa.
describe("escenas", () => {
  it("taller con 4 marcas: verde con cada una y rojo al sumar; con la cuota del 30 % también rojo", () => {
    const e = ESCENA_CUATRO_MARCAS;
    expect(e.ordessa).toMatchObject({ horasNecesarias: 1920, horasDeAlta: 4800, ratio: 0.4, estado: "verde" });
    expect(e.marcas.map((m) => [m.ratio, m.estado])).toEqual([
      [0.4, "verde"],
      [0.35, "verde"],
      [0.3, "verde"],
      [0.25, "verde"],
    ]);
    expect(e.conjunta).toEqual({ horas: 6240, ratio: 1.3, estado: "rojo" });
    expect(e.revisionAbierta).toBe(true);
    expect(e.conCuota).toMatchObject({ ratio: 0.4, ratioTotalEstimado: 1.3333, estadoTotalEstimado: "rojo" });
    // Los documentos simulados son la fuente: escandallo 240 min, plantilla media 10, modelo 347 → 30 %.
    expect([e.minutosChaqueta, e.personas, e.cuotaPct, e.importeTotal]).toEqual([240, 10, 30, 960000]);
  });

  it("caso Milán: proveedor A ∞ rojo; subproveedor B 18.000 h / 12.250 h = 1,4694 rojo; rojo desde ≈135 min", () => {
    const e = ESCENA_CASO_MILAN;
    expect(e.proveedorA).toEqual({ ratio: null, estado: "rojo" });
    expect([e.necesarias, e.deAltaB]).toEqual([18000, 12250]);
    expect(e.subproveedorB).toEqual({ ratio: 1.4694, estado: "rojo" });
    // Suelo externo = mínimo industrial (126 min): 12.600 h ÷ 12.250 h → 1,0286, ámbar (no rojo).
    expect(e.conSuelo).toEqual({ ratio: 1.0286, estado: "ambar" });
    expect(e.minutosRojo).toBe(135);
  });
});
