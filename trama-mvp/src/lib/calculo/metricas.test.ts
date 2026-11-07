import { describe, expect, it } from "vitest";
import { seed } from "@/data";
import { calcularMetricas } from "./metricas";
import type { Seed } from "./tipos";

const corte = seed.meta.fechaCorte;
const conPed003 = (unidades: number): Seed => ({
  ...seed,
  pedidos: seed.pedidos.map((p) => (p.id === "PED-003" ? { ...p, unidades } : p)),
});

describe("métricas de impacto (seed.metricasImpacto)", () => {
  it("reproduce el bloque completo del seed", () => {
    expect(calcularMetricas(seed, corte)).toEqual(seed.metricasImpacto);
  });

  it("cifras del guion: 77,78 % provisional, 1.120 h, 4 iniciados, 90 %, 0 despidos", () => {
    const m = calcularMetricas(seed, corte);
    expect(m.principal).toMatchObject({ trabajadoresLineaBase: 18, siguenEmpleadosYDeAlta: 14, porcentaje: 77.78, mesesDesdeAlerta: 3, definitiva: false, fechaDefinitiva: "2027-02-07" });
    expect(m.horasRegularizadas).toBe(1120);
    expect(m.trabajadoresAcompanados).toEqual({ iniciados: 4, resueltosFavorables: 0, altasDirectas: 3 });
    expect(m.pedidosMantenidos.porcentajeMantenido).toBe(90);
    expect(m.fallos).toEqual({ despidosTrasAlerta: 0, planesConCaidaPedidosSobreLimite: 0 });
  });

  it("TM-01 pedidos mantenidos: 2.400 / 2.666,67 h/mes = 90 %, reducción 10 % ≤ 20 % → cumple", () => {
    expect(calcularMetricas(conPed003(1800), corte).pedidosMantenidos).toEqual({
      horasMensualesReferencia: 2666.67,
      horasMensualesDurantePlan: 2400,
      porcentajeMantenido: 90,
      reduccionPct: 10,
      limiteReduccionPct: 20,
      cumpleLimite: true,
    });
  });

  it("TM-02 caída de pedidos: PED-003 = 1.500 → 2.000 h/mes, 75 %, reducción 25 % > 20 % → fallo", () => {
    const m = calcularMetricas(conPed003(1500), corte);
    expect(m.pedidosMantenidos).toMatchObject({ horasMensualesDurantePlan: 2000, porcentajeMantenido: 75, reduccionPct: 25, cumpleLimite: false });
    expect(m.fallos.planesConCaidaPedidosSobreLimite).toBe(1);
  });

  it("solo usa certificados emitidos hasta la fecha de corte", () => {
    const m = calcularMetricas(seed, "2026-10-31"); // aún no hay certificados de oct
    expect(m.ultimoMesCertificado).toBe("2026-09");
    expect(m.principal).toMatchObject({ mesesDesdeAlerta: 2, siguenEmpleadosYDeAlta: 13 });
    expect(m.horasRegularizadas).toBe(160 + 320);
  });

  it("un despido en el plan cuenta como fallo", () => {
    const d: Seed = { ...seed, certificadosHoras: seed.certificadosHoras.map((c) => (c.id === "CH-T2-2026-09" ? { ...c, despidosEnMes: 1 } : c)) };
    expect(calcularMetricas(d, corte).fallos.despidosTrasAlerta).toBe(1);
  });
});
