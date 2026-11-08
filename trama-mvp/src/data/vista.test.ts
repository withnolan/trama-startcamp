import { describe, expect, it } from "vitest";
import { MES_ACTUAL, PERIODO_ACTUAL, contarEstados, detalleTaller, idsTalleres, kpisMarca, resumenPanel } from "./vista";

describe("vista", () => {
  it("periodo actual", () => {
    expect(MES_ACTUAL).toBe("2026-10");
    expect(PERIODO_ACTUAL).toBe("ago–oct 2026");
  });

  it("panel: T1 rojo primero (ratio de la cadena) con T2 anidada; orden rojo › ámbar › verde", () => {
    const filas = resumenPanel();
    expect(filas.map((f) => [f.id, f.estado])).toEqual([
      ["T1", "rojo"],
      ["T3", "ambar"],
      ["T4", "verde"],
      ["T5", "verde"],
      ["T6", "verde"],
    ]);
    expect(filas[0]).toMatchObject({ ratio: 1.125, horasNecesarias: 7200, horasCotizadas: 6400, tienePlan: true, ultimoCertificado: "2026-10" });
    expect(filas[0].subcontratas.map((s) => [s.id, s.estado, s.ratio])).toEqual([["T2", "rojo", 1.3235]]);
    expect(contarEstados()).toEqual({ todos: 5, rojo: 1, ambar: 1, sin_datos: 0, verde: 3 });
  });

  it("T6 (2 + 1 titular) va sin cifras: solo semáforo", () => {
    const t6 = resumenPanel().find((f) => f.id === "T6")!;
    expect(t6).toMatchObject({ estado: "verde", micro: true, ocultarCifras: true, ratio: undefined, horasNecesarias: undefined, horasCotizadas: undefined });
    const d = detalleTaller("T6")!;
    expect(d.ocultarCifras).toBe(true);
    expect(d.resumen).toMatchObject({ necesarias: null, cotizadas: null, diferencia: null, plantilla: null });
    expect(d.evaluacion.ratio).toBeUndefined();
    expect(d.ventanas.every((v) => v.cotizadas === null && v.ratio === undefined)).toBe(true);
    expect(d.nodos.find((n) => n.id === "T6")!.plantilla).toBeNull();
    expect(d.plan).toBeNull();
    expect(d.impacto).toEqual([]);
    expect(d.porQue).toEqual([]);
  });

  it("KPIs de marca: 5 en orden, con punto de partida (problemas/metricas_impacto.md)", () => {
    const k = kpisMarca();
    expect(k.map((x) => x.id)).toEqual(["principal", "horasRegularizadas", "acompanados", "pedidosMantenidos", "fallos"]);
    expect(k.map((x) => x.valor)).toEqual([77.78, 58.33, 7, 90, 0]);
    expect(k[0].contexto).toBe("14 de 18 personas · al abrir la alerta, 11 de alta · provisional (mes 3 de 6) · definitiva el 7 feb 2027");
    // Hueco de la cadena: 2.720 h → 800 h; de las 1.920 h cerradas, 1.120 h con altas (58 %) y 800 h retirando pedidos.
    expect(k[1]).toMatchObject({ formato: "porcentaje", contexto: "1.120 h con altas nuevas · 800 h con pedidos retirados · faltaban 2.720 h, hoy 800 h" });
    expect(k[2].contexto).toBe("3 ya de alta · 4 en trámite · 0 sin vía de regularización");
    expect(k[3].contexto).toBe("Reducción del 10 % · límite pactado 20 % · partida: 2.667 h al mes (may–jul 2026)");
    expect(k[4]).toMatchObject({ variante: "fallo", contexto: "de 14 personas que han estado de alta · lo cuenta el revisor con la lista de la gestoría" });
  });

  it("detalle T1: cadena, alerta 8.000 / 3.360, 4 ventanas, plan con límite 20 y usado 10", () => {
    const d = detalleTaller("T1")!;
    expect(d.estado).toBe("rojo");
    expect(d.evaluacion).toMatchObject({ tipo: "cadena", ratio: 1.125, estado: "rojo" });
    expect(d.evaluacionIndividual).toMatchObject({ tipo: "taller", ratio: 0.9783, estado: "ambar" });
    expect(d.alerta).toMatchObject({ id: "AL-001", horasNecesarias: 8000, horasCotizadas: 3360, ratio: 2.381 });
    expect(d.ventanas.map((v) => [v.etiqueta, v.ratio, v.estado])).toEqual([
      ["may–jul 26", 1.5152, "rojo"],
      ["jun–ago 26", 1.4641, "rojo"],
      ["jul–sep 26", 1.2968, "rojo"],
      ["ago–oct 26", 1.125, "rojo"],
    ]);
    expect(d.ventanas[0].limiteAmbar).toBeCloseTo(0.85 * 5280, 6);
    expect(d.ventanas[0].limiteRojo).toBeCloseTo(1.1 * 5280, 6);
    expect(d.resumen).toMatchObject({ periodo: "ago–oct 2026", necesarias: 7200, cotizadas: 6400, diferencia: 800, plantilla: 15, fechaCertificado: "2026-11-05" });
    expect(d.resumen.firmante).toBe("Consulente del lavoro · Studio Paglierino (ficticio), Studio Ventaglio (ficticio) · a partir del LUL");
    expect(d.nodos.map((n) => [n.id, n.tipo, n.estado, n.momento])).toEqual([
      ["MARCA-DEMO", "marca", undefined, undefined],
      ["T1", "proveedor", "ambar", undefined],
      ["T2", "subcontrata", "rojo", "tras_alerta"],
    ]);
    expect(d.plan).toMatchObject({ id: "PC-001", limiteReduccionPct: 20, reduccionUsadaPct: 10, revisorTipo: "ONG" });
    expect(d.plan!.hitos.map((h) => h.estado)).toEqual(["hecho", "hecho", "hecho", "hecho", "hecho", "en-curso", "en-curso", "pendiente"]);
    expect(d.plan!.extensiones).toEqual([{ tallerId: "T2", nombre: "Laboratorio Bagolaro", fecha: "2026-08-20", motivo: "Subcontrata declarada tras la alerta" }]);
    expect(d.impacto.map((k) => k.valor)).toEqual([77.78, 58.33, 7, 90]);
    expect(d.porQue).toEqual([
      "Los pedidos de Ordessa a esta cadena necesitan 7.200 h en ago–oct 2026; el personal de alta suma 6.400 h (1,13×).",
      "Supera el límite rojo de 1,10× para talleres de más de 3 personas.",
      "En la alerta del 7 ago 2026 la diferencia era de 8.000 h frente a 3.360 h (2,38×).",
      "La subcontrata Laboratorio Bagolaro se declaró el 20 ago 2026, después de la alerta.",
    ]);
    expect(d.comprobaciones).toHaveLength(5);
  });

  it("detalle T2 (subcontrata): su propia evaluación, misma alerta y mismo plan", () => {
    const d = detalleTaller("T2")!;
    expect(d.estado).toBe("rojo");
    expect(d.evaluacion).toMatchObject({ tipo: "taller", ratio: 1.3235 });
    expect(d.alerta?.id).toBe("AL-001");
    expect(d.plan?.id).toBe("PC-001");
    expect(d.resumen.firmante).toBe("Consulente del lavoro · Studio Ventaglio (ficticio) · a partir del LUL");
  });

  it("detalle T3 ámbar: porQue y comprobaciones; sin alerta ni plan", () => {
    const d = detalleTaller("T3")!;
    expect(d).toMatchObject({ estado: "ambar", alerta: null, plan: null, impacto: [] });
    expect(d.resumen.firmante).toBe("Gestor laboral o graduado social · Gestoría Lagunilla (ficticia) · a partir del informe de plantilla media de la Seguridad Social");
    expect(d.porQue[1]).toBe("Supera 0,85× sin llegar al límite rojo de 1,10×: margen para picos de trabajo.");
    expect(d.comprobaciones).toHaveLength(5);
    expect(detalleTaller("T4")!.comprobaciones).toEqual([]);
  });

  it("id inexistente → null; ids para generateStaticParams", () => {
    expect(detalleTaller("NO-EXISTE")).toBeNull();
    expect(idsTalleres()).toEqual(["T1", "T2", "T3", "T4", "T5", "T6"]);
  });
});
