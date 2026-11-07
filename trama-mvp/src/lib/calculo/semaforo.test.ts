import { describe, expect, it } from "vitest";
import { seed } from "@/data";
import {
  estadoPanel,
  evaluarCadena,
  evaluarTaller,
  horasPedido,
  repartoMensual,
} from "./semaforo";
import type { CertificadoHoras, EstadoSemaforo, Firmante, Pedido, Seed, Taller } from "./tipos";

const esperado = seed.esperado as {
  reparto: Record<string, Record<string, number>>;
  evaluaciones: { tipo: "taller" | "cadena"; tallerId: string; mes: string; horasNecesarias: number; horasCotizadas: number; ratio: number; micro: boolean; estado: EstadoSemaforo }[];
  panel: Record<string, EstadoSemaforo>;
};
const tipo = (id: string) => seed.tiposPieza.find((t) => t.id === id)!;

// ---------- Seeds mínimos (DATA_MODEL §5: IT con firmante válido, ventana may–jul 2026) ----------
const IT: Firmante = { tipo: "consulente_del_lavoro", despacho: "Studio Demo (ficticio)", numeroColegiado: "DEMO-IT-1", viaAsseCo: true };
const ES: Firmante = { tipo: "gestor_laboral", despacho: "Gestoría Demo (ficticia)", numeroColegiado: "DEMO-ES-1", viaAsseCo: false };
const MAY_JUL = ["2026-05", "2026-06", "2026-07"];

const taller = (id: string, extra: Partial<Taller> = {}): Taller => ({
  id, nombre: id, pais: "IT", ciudad: "X", provincia: "X", nivel: 1, padreId: null, subcontrataIds: [], declaracionSubcontrata: null, especialidad: "X", ...extra,
});
const cert = (tallerId: string, mes: string, horas: number, trab: number, extra: Partial<CertificadoHoras> = {}): CertificadoHoras => ({
  id: `C-${tallerId}-${mes}`, tallerId, mes, horasTotalesCotizadas: horas, numTrabajadores: trab, firmante: IT, fechaEmision: `${mes}-28`, ...extra,
});
const certs = (tallerId: string, horas: number, trab: number, meses = MAY_JUL, extra: Partial<CertificadoHoras> = {}) =>
  meses.map((m) => cert(tallerId, m, horas, trab, extra));
const pedido = (id: string, tallerId: string, tipoPiezaId: string, unidades: number, extra: Partial<Pedido> = {}): Pedido => ({
  id, marcaId: seed.marca.id, tallerId, tipoPiezaId, unidades, inicio: "2026-05-01", fin: "2026-07-31", referencia: id, origen: "marca", pedidoOrigenId: null, ...extra,
});
const mini = (over: Partial<Seed>): Seed => ({ ...seed, talleres: [taller("T")], pedidos: [], certificadosHoras: [], alertas: [], planesCorreccion: [], ...over });
/** Taller T con 7 trab. × 1.120 h/mes (3.360 h) y `chaquetas` del 01-may al 31-jul. */
const tc = (chaquetas: number, over: Partial<Seed> = {}) =>
  mini({ pedidos: chaquetas ? [pedido("P", "T", "TP-CHAQ-CACH", chaquetas)] : [], certificadosHoras: certs("T", 1120, 7), ...over });
/** Cadena TC-09/TC-10: T1 recibe PED-001 (2.000 chaq.) y pasa 1.300 a T2 (subencargo). */
const cadena = (certsT2: CertificadoHoras[]) =>
  mini({
    talleres: [taller("T1", { subcontrataIds: ["T2"] }), taller("T2", { nivel: 2, padreId: "T1", declaracionSubcontrata: { momento: "tras_alerta", fecha: "2026-08-20", alertaId: "AL" } })],
    pedidos: [
      pedido("PED-001", "T1", "TP-CHAQ-CACH", 2000),
      pedido("PED-002", "T2", "TP-CHAQ-CACH", 1300, { origen: "subencargo", pedidoOrigenId: "PED-001", fechaDeclaracion: "2026-08-20" }),
    ],
    certificadosHoras: [...certs("T1", 1120, 7), ...certsT2],
  });

describe("reparto mensual (esperado.reparto)", () => {
  it("PED-014: 915 tarjeteros = 610 h → 160 / 310 / 140", () => {
    const p = seed.pedidos.find((x) => x.id === "PED-014")!;
    expect(horasPedido(p, tipo(p.tipoPiezaId))).toBeCloseTo(610, 10);
    const r = repartoMensual(p, tipo(p.tipoPiezaId));
    expect(r["2026-06"]).toBeCloseTo(160, 10);
    expect(r["2026-07"]).toBeCloseTo(310, 10);
    expect(r["2026-08"]).toBeCloseTo(140, 10);
  });

  it.each(Object.entries(esperado.reparto))("%s", (id, meses) => {
    const p = seed.pedidos.find((x) => x.id === id)!;
    const r = repartoMensual(p, tipo(p.tipoPiezaId));
    expect(Object.keys(r).sort()).toEqual(Object.keys(meses).sort());
    for (const [m, h] of Object.entries(meses)) expect(r[m]).toBeCloseTo(h, 2);
  });
});

describe("evaluaciones del seed (esperado.evaluaciones)", () => {
  it.each(esperado.evaluaciones.map((e) => [`${e.tipo} ${e.tallerId} ${e.mes}`, e] as const))("%s", (_, e) => {
    const ev = (e.tipo === "cadena" ? evaluarCadena : evaluarTaller)(seed, e.tallerId, e.mes);
    expect(ev.tipo).toBe(e.tipo);
    expect(ev.estado).toBe(e.estado);
    expect(ev.ratio).toBe(e.ratio); // exacto a 4 decimales
    expect(ev.micro).toBe(e.micro);
    expect(ev.horasNecesarias).toBeCloseTo(e.horasNecesarias, 2);
    expect(ev.horasCotizadas).toBeCloseTo(e.horasCotizadas, 2);
    expect(ev.ventana).toHaveLength(3);
    expect(ev.ventana[2]).toBe(e.mes);
  });

  it.each(Object.entries(esperado.panel))("panel oct %s", (id, estado) => {
    expect(estadoPanel(seed, id, seed.meta.mesEvaluacionActual)).toBe(estado);
  });

  it("AL-001 es la instantánea del 07-ago (antes de declarar T2): 8.000 / 3.360 = 2,381 rojo", () => {
    const corte = "2026-08-07";
    const entonces: Seed = {
      ...seed,
      talleres: seed.talleres
        .filter((t) => !t.declaracionSubcontrata || t.declaracionSubcontrata.fecha <= corte)
        .map((t) => ({ ...t, subcontrataIds: t.subcontrataIds.filter((id) => seed.talleres.find((x) => x.id === id)!.declaracionSubcontrata!.fecha <= corte) })),
      pedidos: seed.pedidos.filter((p) => !p.fechaDeclaracion || p.fechaDeclaracion <= corte),
      certificadosHoras: seed.certificadosHoras.filter((c) => c.fechaEmision <= corte),
    };
    const a = seed.alertas[0];
    const ev = evaluarCadena(entonces, a.tallerId, a.mesEvaluado);
    expect(ev).toMatchObject({ estado: "rojo", ratio: a.ratio, ventana: a.ventana });
    expect(ev.horasNecesarias).toBeCloseTo(a.horasNecesarias, 2);
    expect(ev.horasCotizadas).toBe(a.horasCotizadas);
  });
});

describe("casos de prueba DATA_MODEL §5", () => {
  it("TC-01 demo: 2.000 chaquetas, 3.360 h → 8.000 h, 2,3810 rojo", () => {
    const ev = evaluarTaller(tc(2000), "T", "2026-07");
    expect(ev).toMatchObject({ estado: "rojo", ratio: 2.381, horasCotizadas: 3360, micro: false, ventana: MAY_JUL });
    expect(ev.horasNecesarias).toBeCloseTo(8000, 6);
  });

  it("TC-02: ES, 10 trab., 4.800 h; 1.000 totes → 3.000 h, 0,6250 verde", () => {
    const d = mini({
      talleres: [taller("T", { pais: "ES" })],
      pedidos: [pedido("P", "T", "TP-BOLSO-TOTE", 1000)],
      certificadosHoras: certs("T", 1600, 10, MAY_JUL, { firmante: ES }),
    });
    const ev = evaluarTaller(d, "T", "2026-07");
    expect(ev).toMatchObject({ estado: "verde", ratio: 0.625, horasCotizadas: 4800 });
    expect(ev.horasNecesarias).toBeCloseTo(3000, 6);
  });

  it("TC-03 límite verde: 714 chaquetas → 2.856 h, 0,8500 verde (≤ es verde)", () => {
    const ev = evaluarTaller(tc(714), "T", "2026-07");
    expect(ev).toMatchObject({ estado: "verde", ratio: 0.85 });
    expect(ev.horasNecesarias).toBeCloseTo(2856, 6);
  });

  it("TC-04: 875 chaquetas → 3.500 h, 1,0417 ámbar", () => {
    expect(evaluarTaller(tc(875), "T", "2026-07")).toMatchObject({ estado: "ambar", ratio: 1.0417 });
  });

  it("TC-05 límite rojo: 924 → 1,1000 ámbar; 925 → 1,1012 rojo", () => {
    expect(evaluarTaller(tc(924), "T", "2026-07")).toMatchObject({ estado: "ambar", ratio: 1.1 });
    expect(evaluarTaller(tc(925), "T", "2026-07")).toMatchObject({ estado: "rojo", ratio: 1.1012 });
  });

  it("TC-06 falta certificado de jun → sin_datos (no rojo)", () => {
    const d = tc(2000);
    const ev = evaluarTaller({ ...d, certificadosHoras: d.certificadosHoras.filter((c) => c.mes !== "2026-06") }, "T", "2026-07");
    expect(ev.estado).toBe("sin_datos");
    expect(ev.mesesSinCertificado).toEqual(["2026-06"]);
    expect(ev.ratio).toBeUndefined();
  });

  it("TC-07 pedido que cruza meses: reparto 320/620/280 y tres ventanas en verde", () => {
    const meses = ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"];
    const p = pedido("P", "T", "TP-CHAQ-CACH", 305, { inicio: "2026-06-15", fin: "2026-08-14" });
    const d = mini({ talleres: [taller("T", { pais: "ES" })], pedidos: [p], certificadosHoras: certs("T", 640, 4, meses, { firmante: ES }) });
    const r = repartoMensual(p, tipo("TP-CHAQ-CACH"));
    expect(r).toEqual({ "2026-06": 320, "2026-07": 620, "2026-08": 280 });
    expect(evaluarTaller(d, "T", "2026-06")).toMatchObject({ estado: "verde", ratio: 0.1667, horasNecesarias: 320 });
    expect(evaluarTaller(d, "T", "2026-08")).toMatchObject({ estado: "verde", ratio: 0.6354, horasNecesarias: 1220 });
    expect(evaluarTaller(d, "T", "2026-09")).toMatchObject({ estado: "verde", ratio: 0.4688, horasNecesarias: 900 });
  });

  it("TC-08 micro: 2 trab. + 1 titular (180 h → cuentan 160); 2.550 → ámbar, 2.850 → rojo", () => {
    const d = (n: number) =>
      mini({
        talleres: [taller("T", { pais: "ES" })],
        pedidos: [pedido("P", "T", "TP-TARJETERO", n)],
        certificadosHoras: certs("T", 320, 2, MAY_JUL, { firmante: ES, numTitulares: 1, horasTitulares: 180 }),
      });
    const a = evaluarTaller(d(2550), "T", "2026-07");
    expect(a).toMatchObject({ estado: "ambar", ratio: 1.1806, micro: true, horasCotizadas: 1440 }); // tope de 160 h por titular
    expect(a.horasNecesarias).toBeCloseTo(1700, 6);
    expect(evaluarTaller(d(2850), "T", "2026-07")).toMatchObject({ estado: "rojo", ratio: 1.3194, micro: true });
    // El mismo ratio sin ser micro (4 personas) sería rojo.
    const noMicro = d(2550);
    noMicro.certificadosHoras = noMicro.certificadosHoras.map((c) => ({ ...c, numTitulares: 2, horasTitulares: 160 }));
    expect(evaluarTaller(noMicro, "T", "2026-07")).toMatchObject({ micro: false, horasCotizadas: 1440, estado: "rojo" });
  });

  it("TC-09 cadena: T1 0,8333 verde, T2 2,7083 rojo, cadena 8.000 / 5.280 = 1,5152 rojo, panel rojo", () => {
    const d = cadena(certs("T2", 640, 4));
    expect(evaluarTaller(d, "T1", "2026-07")).toMatchObject({ estado: "verde", ratio: 0.8333 });
    expect(evaluarTaller(d, "T2", "2026-07")).toMatchObject({ estado: "rojo", ratio: 2.7083 });
    const c = evaluarCadena(d, "T1", "2026-07");
    expect(c).toMatchObject({ tipo: "cadena", estado: "rojo", ratio: 1.5152, horasCotizadas: 5280, certificadosSubcontrataQueFaltan: [] });
    expect(c.horasNecesarias).toBeCloseTo(8000, 6);
    expect(estadoPanel(d, "T1", "2026-07")).toBe("rojo");
  });

  it("TC-10 subcontrata sin certificados: T2 sin_datos, cadena 8.000 / 3.360 = 2,3810 rojo (T2 cuenta 0 h)", () => {
    const d = cadena([]);
    expect(evaluarTaller(d, "T2", "2026-07").estado).toBe("sin_datos");
    expect(evaluarTaller(d, "T1", "2026-07")).toMatchObject({ estado: "verde", ratio: 0.8333 });
    const c = evaluarCadena(d, "T1", "2026-07");
    expect(c).toMatchObject({ estado: "rojo", ratio: 2.381, horasCotizadas: 3360 });
    expect(c.certificadosSubcontrataQueFaltan).toEqual(MAY_JUL.map((mes) => ({ tallerId: "T2", mes })));
    expect(estadoPanel(d, "T1", "2026-07")).toBe("rojo");
  });

  it("TC-11 sin pedidos → verde, ratio 0", () => {
    expect(evaluarTaller(tc(0), "T", "2026-07")).toMatchObject({ estado: "verde", ratio: 0, horasNecesarias: 0, horasCotizadas: 3360 });
  });

  it("TC-12 certificados de 0 h y 0 trab. con 100 chaquetas → rojo, ratio null (∞)", () => {
    const ev = evaluarTaller(tc(100, { certificadosHoras: certs("T", 0, 0) }), "T", "2026-07");
    expect(ev).toMatchObject({ estado: "rojo", ratio: null, horasCotizadas: 0 });
    expect(ev.horasNecesarias).toBeCloseTo(400, 6);
  });

  it("TC-13 firmante no válido (IT firmado por gestor_laboral) → sin_datos ['2026-06']", () => {
    const d = tc(2000);
    d.certificadosHoras = d.certificadosHoras.map((c) => (c.mes === "2026-06" ? { ...c, firmante: ES } : c));
    expect(evaluarTaller(d, "T", "2026-07")).toMatchObject({ estado: "sin_datos", mesesSinCertificado: ["2026-06"] });
  });

  it("TC-14 rectificación: vale el certificado de jun emitido más tarde (1.280 h) → 2,2727 rojo", () => {
    const d = tc(2000);
    d.certificadosHoras = [
      ...d.certificadosHoras.filter((c) => c.mes !== "2026-06"),
      cert("T", "2026-06", 1280, 8, { id: "C-B", fechaEmision: "2026-07-20" }),
      cert("T", "2026-06", 1120, 7, { id: "C-A", fechaEmision: "2026-07-06" }),
    ];
    expect(evaluarTaller(d, "T", "2026-07")).toMatchObject({ estado: "rojo", ratio: 2.2727, horasCotizadas: 3520 });
  });
});

describe("casos límite", () => {
  it("sin ningún certificado → sin_datos con los tres meses", () => {
    expect(evaluarTaller(tc(2000, { certificadosHoras: [] }), "T", "2026-07")).toMatchObject({ estado: "sin_datos", mesesSinCertificado: MAY_JUL });
  });

  it("certificado inválido: IT sin Asse.Co y ES firmado por consulente cuentan como inexistentes", () => {
    const sinAsseCo = tc(2000);
    sinAsseCo.certificadosHoras = sinAsseCo.certificadosHoras.map((c) => (c.mes === "2026-05" ? { ...c, firmante: { ...IT, viaAsseCo: false } } : c));
    expect(evaluarTaller(sinAsseCo, "T", "2026-07")).toMatchObject({ estado: "sin_datos", mesesSinCertificado: ["2026-05"] });
    const esConsulente = mini({ talleres: [taller("T", { pais: "ES" })], certificadosHoras: certs("T", 1120, 7) });
    expect(evaluarTaller(esConsulente, "T", "2026-07").mesesSinCertificado).toEqual(MAY_JUL);
  });

  it("una rectificación inválida no sustituye al certificado válido; con misma fecha gana el id mayor", () => {
    const d = tc(2000);
    d.certificadosHoras = [...d.certificadosHoras, cert("T", "2026-06", 5000, 30, { id: "C-Z", fechaEmision: "2026-12-01", firmante: ES })];
    expect(evaluarTaller(d, "T", "2026-07").horasCotizadas).toBe(3360);
    d.certificadosHoras = [...d.certificadosHoras, cert("T", "2026-06", 1280, 8, { id: "C-T-2026-06-b" })];
    expect(evaluarTaller(d, "T", "2026-07").horasCotizadas).toBe(3520);
  });

  it("tope de 160 h/mes por titular: 2 titulares con 300 h cuentan 300; con 400 h cuentan 320", () => {
    const d = (h: number) => mini({ talleres: [taller("T", { pais: "ES" })], pedidos: [pedido("P", "T", "TP-CARTERA", 100)], certificadosHoras: certs("T", 160, 1, MAY_JUL, { firmante: ES, numTitulares: 2, horasTitulares: h }) });
    expect(evaluarTaller(d(300), "T", "2026-07").horasCotizadas).toBe(3 * 460);
    expect(evaluarTaller(d(400), "T", "2026-07").horasCotizadas).toBe(3 * 480);
  });

  it("microtaller: umbral rojo 1,25 solo si hay ≤ 3 personas en los tres meses", () => {
    const d = (trabJul: number) =>
      mini({
        talleres: [taller("T", { pais: "ES" })],
        pedidos: [pedido("P", "T", "TP-TARJETERO", 2550)],
        certificadosHoras: MAY_JUL.map((m) => cert("T", m, 480, m === "2026-07" ? trabJul : 3, { firmante: ES })),
      });
    expect(evaluarTaller(d(3), "T", "2026-07")).toMatchObject({ micro: true, ratio: 1.1806, estado: "ambar" });
    expect(evaluarTaller(d(4), "T", "2026-07")).toMatchObject({ micro: false, ratio: 1.1806, estado: "rojo" });
  });

  it("subencargo con fechas distintas: la carga del emisor se acota a 0 en la ventana", () => {
    const d = cadena(certs("T2", 640, 4));
    d.pedidos = [
      pedido("PED-001", "T1", "TP-CHAQ-CACH", 100, { inicio: "2026-07-01", fin: "2026-07-31" }),
      pedido("PED-002", "T2", "TP-CHAQ-CACH", 100, { inicio: "2026-05-01", fin: "2026-05-31", origen: "subencargo", pedidoOrigenId: "PED-001" }),
    ];
    // ventana abr–jun: T1 emite −400 h en mayo y no recibe nada → 0 → verde
    const d2 = { ...d, certificadosHoras: [...d.certificadosHoras, cert("T1", "2026-04", 1120, 7), cert("T2", "2026-04", 640, 4)] };
    expect(evaluarTaller(d2, "T1", "2026-06")).toMatchObject({ estado: "verde", ratio: 0, horasNecesarias: 0 });
  });

  it("cadena: si falta un certificado de la raíz → sin_datos", () => {
    const d = cadena(certs("T2", 640, 4));
    d.certificadosHoras = d.certificadosHoras.filter((c) => !(c.tallerId === "T1" && c.mes === "2026-07"));
    expect(evaluarCadena(d, "T1", "2026-07")).toMatchObject({ estado: "sin_datos", mesesSinCertificado: ["2026-07"] });
    expect(estadoPanel(d, "T1", "2026-07")).toBe("rojo"); // T2 sigue en rojo por separado
  });

  it("taller desconocido → error explícito", () => {
    expect(() => evaluarTaller(seed, "NO-EXISTE", "2026-07")).toThrow(/desconocido/);
  });
});
