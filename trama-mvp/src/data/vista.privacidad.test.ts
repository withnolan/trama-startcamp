// RGPD: con un miembro de < 4 personas, las cifras de la cadena se ocultan (cadena − proveedor = sus horas).
import { describe, expect, it, vi } from "vitest";
import type { CertificadoHoras, Pedido, Seed, Taller } from "@/lib/calculo/tipos";
import { detalleTaller, resumenPanel } from "./vista"; // vi.mock se eleva por encima de los imports

// Seed mínimo: proveedor P (8 personas) con subcontrata S (3 personas) y una alerta sobre la cadena.
vi.mock("@/data", async (importOriginal) => {
  const { seed } = await importOriginal<{ seed: Seed }>();
  const firmante = { tipo: "consulente_del_lavoro", despacho: "Studio Demo (ficticio)", numeroColegiado: "DEMO-IT-1", viaAsseCo: true } as const;
  const taller = (id: string, extra: Partial<Taller> = {}): Taller => ({
    id, nombre: id, pais: "IT", ciudad: "X", provincia: "X", nivel: 1, padreId: null, subcontrataIds: [], declaracionSubcontrata: null, especialidad: "X", ...extra,
  });
  const certs = (tallerId: string, horas: number, trab: number): CertificadoHoras[] =>
    seed.meta.mesesConCertificado.map((mes) => ({ id: `C-${tallerId}-${mes}`, tallerId, mes, horasTotalesCotizadas: horas, numTrabajadores: trab, firmante, fechaEmision: `${mes}-28` }));
  const pedido = (id: string, tallerId: string, unidades: number, extra: Partial<Pedido> = {}): Pedido => ({
    id, marcaId: seed.marca.id, tallerId, tipoPiezaId: "TP-CHAQ-CACH", unidades, inicio: "2026-08-01", fin: "2026-10-31", referencia: id, origen: "marca", pedidoOrigenId: null, ...extra,
  });
  const mini: Seed = {
    ...seed,
    talleres: [taller("P", { subcontrataIds: ["S"] }), taller("S", { nivel: 2, padreId: "P", declaracionSubcontrata: { momento: "previa", fecha: "2026-04-01", alertaId: null } })],
    pedidos: [pedido("PED-P", "P", 2000), pedido("PED-S", "S", 300, { origen: "subencargo", pedidoOrigenId: "PED-P" })],
    certificadosHoras: [...certs("P", 1280, 8), ...certs("S", 480, 3)],
    alertas: [{ ...seed.alertas[0], tallerId: "P" }],
    planesCorreccion: [],
  };
  return { seed: mini };
});

describe("privacidad de la cadena", () => {
  it("panel: la fila del proveedor muestra el estado de la cadena sin cifras", () => {
    const [p] = resumenPanel();
    expect(p).toMatchObject({ id: "P", estado: "rojo", ocultarCifras: true, ratio: undefined, horasNecesarias: undefined, horasCotizadas: undefined });
    expect(p.subcontratas[0]).toMatchObject({ id: "S", ocultarCifras: true, ratio: undefined });
  });

  it("detalle del proveedor: estado sí; cifras de la cadena, alerta y frases con horas no", () => {
    const d = detalleTaller("P")!;
    expect(d).toMatchObject({ estado: "rojo", ocultarCifras: true, alerta: null });
    expect(d.evaluacion).toMatchObject({ tipo: "cadena", estado: "rojo", ratio: undefined, horasCotizadas: undefined });
    expect(d.resumen).toMatchObject({ necesarias: null, cotizadas: null, diferencia: null, plantilla: null });
    expect(d.ventanas.every((v) => v.cotizadas === null && v.limiteRojo === null)).toBe(true);
    expect(d.porQue.some((f) => / h\b/.test(f))).toBe(false);
    expect(d.nodos.find((n) => n.id === "S")!.plantilla).toBeNull();
  });
});
