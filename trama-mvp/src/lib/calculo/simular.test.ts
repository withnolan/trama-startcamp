import { describe, expect, it } from "vitest";
import { SIMULACION_CASO_PUBLICO, SIMULACION_DEMO, simular } from "./simular";

describe("simular", () => {
  it("caso público: 1.500 chaquetas × 240 min = 6.000 h frente a 7 × 146 × 3 = 3.066 h → 1,9569 rojo", () => {
    expect(simular(SIMULACION_CASO_PUBLICO)).toMatchObject({ horasNecesarias: 6000, horasDeAlta: 3066, ratio: 1.9569, estado: "rojo", micro: false });
    // Límite rojo: 1,10 × 3.066 h / 1.500 uds = 134,9 min por chaqueta → 134 min ámbar, 135 min rojo.
    const con = (minutosPorPieza: number) => simular({ ...SIMULACION_CASO_PUBLICO, minutosPorPieza });
    expect(con(130)).toMatchObject({ ratio: 1.06, estado: "ambar" });
    expect(con(134)).toMatchObject({ ratio: 1.0926, estado: "ambar" });
    expect(con(135)).toMatchObject({ ratio: 1.1008, estado: "rojo" });
    expect(con(140)).toMatchObject({ ratio: 1.1416, estado: "rojo" });
  });

  it("SIMULACION_DEMO (T1 en la alerta) → 8.000 / 3.360 = 2,381 rojo", () => {
    expect(simular(SIMULACION_DEMO)).toEqual({
      horasNecesarias: 8000,
      horasDeAlta: 3360,
      ratio: 2.381,
      estado: "rojo",
      micro: false,
      cargaTotalEstimada: 8000,
      ratioTotalEstimado: 2.381,
      estadoTotalEstimado: "rojo",
    });
  });

  it("700 uds → 0,8333 verde; 800 uds → 0,9524 ámbar", () => {
    expect(simular({ ...SIMULACION_DEMO, unidades: 700 })).toMatchObject({ ratio: 0.8333, estado: "verde" });
    expect(simular({ ...SIMULACION_DEMO, unidades: 800 })).toMatchObject({ ratio: 0.9524, estado: "ambar" });
  });

  it("cuota del 20 % con 0,5× propio → carga total estimada 2,5× rojo", () => {
    const r = simular({ ...SIMULACION_DEMO, unidades: 420, cuotaFacturacionPct: 20 });
    expect(r).toMatchObject({ horasNecesarias: 1680, ratio: 0.5, estado: "verde", cargaTotalEstimada: 8400, ratioTotalEstimado: 2.5, estadoTotalEstimado: "rojo" });
  });

  it("3 personas → micro, umbral rojo 1,25 (1,1806 es ámbar; con 4 personas sería rojo)", () => {
    const micro = { unidades: 2550, minutosPorPieza: 40, personasDeAlta: 3, horasMesPorPersona: 160 };
    expect(simular(micro)).toMatchObject({ micro: true, horasDeAlta: 1440, ratio: 1.1806, estado: "ambar" });
    expect(simular({ ...micro, personasDeAlta: 4, horasMesPorPersona: 120 })).toMatchObject({ micro: false, ratio: 1.1806, estado: "rojo" });
  });

  it("0 personas de alta con carga → ratio null (∞) rojo", () => {
    expect(simular({ ...SIMULACION_DEMO, personasDeAlta: 0 })).toMatchObject({ horasDeAlta: 0, ratio: null, estado: "rojo", ratioTotalEstimado: null });
  });

  it("entradas de formulario no válidas: NaN o negativas cuentan 0 y la cuota se acota a 1-100", () => {
    expect(simular({ ...SIMULACION_DEMO, unidades: Number.NaN })).toMatchObject({ horasNecesarias: 0, ratio: 0, estado: "verde" });
    expect(simular({ ...SIMULACION_DEMO, cuotaFacturacionPct: 0 }).cargaTotalEstimada).toBe(800000);
    expect(simular({ ...SIMULACION_DEMO, cuotaFacturacionPct: 250 }).cargaTotalEstimada).toBe(8000);
  });
});
