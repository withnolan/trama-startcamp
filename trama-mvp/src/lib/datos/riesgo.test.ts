import { describe, expect, it } from "vitest";
import type { DatasetIngerido, IndicadoresLaborales } from "./contratos";
import { ESCENARIOS } from "./escenarios";
import { generar } from "./generador";
import { ingerir } from "./ingesta";
import { ingerirLaboral } from "./laboral";
import { PARAMETROS_PUBLICOS_PROVISIONALES as P } from "./parametros";
import { evaluarRiesgo, evaluarRiesgoContraVerdad } from "./riesgo";
import { puntuarV2 } from "./score";

const esc = ESCENARIOS.pitch;
function corrida(semilla: number) {
  const g = generar(esc, semilla, P, []);
  const { dataset } = ingerir(g.archivos, { escenario: "pitch", marcaId: esc.marcaId, marcaNombre: esc.marcaNombre, parametros: P, hashCrudo: "t" });
  const { laboral, incidencias } = ingerirLaboral(g.archivos, dataset.seed.talleres.map((t) => t.id));
  const d: DatasetIngerido = { ...dataset, laboral, incidencias: [...dataset.incidencias, ...incidencias] };
  return { g, d, riesgo: evaluarRiesgo(d, puntuarV2(d, P)) };
}

describe("muestra laboral", () => {
  const { g, d } = corrida(2026);

  it("una fila por taller, sin campos por persona ni palabras de la verdad en los CSV", () => {
    expect(d.laboral).toHaveLength(d.seed.talleres.length);
    const crudo = `${g.archivos.salarios_horas}${g.archivos.voz_quejas}`;
    for (const w of ["salario_retenido", "silencio", "arquetipo", "dni", "nacionalidad"]) expect(crudo).not.toContain(w);
  });

  it("con menos de 4 personas entrevistadas no hay cifras de entrevistas (privacidad)", () => {
    for (const l of d.laboral!.filter((x) => x.personasEntrevistadas < 4)) {
      expect(l.horasSemanaEntrevistas).toBeNull();
      expect(l.salarioMedianoMes).toBeNull();
    }
  });

  it("valores fuera de rango → fila descartada con incidencia bloqueante", () => {
    const [cab, f1] = g.archivos.voz_quejas!.split("\n");
    const v = f1.split(";");
    const mala = [...v.slice(0, 2), "quizas", ...v.slice(3)].join(";");
    const r = ingerirLaboral({ ...g.archivos, voz_quejas: `${cab}\n${mala}\n` }, d.seed.talleres.map((t) => t.id));
    expect(r.incidencias.some((i) => i.codigo === "TIPO_INVALIDO" && i.gravedad === "bloqueante")).toBe(true);
  });
});

describe("modelo de riesgo", () => {
  it("nunca da «evidencia confirmada» y el vacío de datos queda al menos en medio", () => {
    const { riesgo } = corrida(2026);
    expect(riesgo.some((r) => r.categoria === "evidencia_confirmada")).toBe(false);
    for (const r of riesgo.filter((x) => x.senales.some((s) => s.id === "OPACIDAD"))) expect(r.nivel).not.toBe("bajo");
  });

  it("retención de salario con fuentes coherentes → al menos alto, con remediación y sin cortar pedidos", () => {
    const { d } = corrida(2026);
    const id = d.seed.talleres[0].id;
    const l: IndicadoresLaborales = {
      tallerId: id, periodo: "x", personasEntrevistadas: 6, horasSemanaRegistro: 40, horasSemanaEntrevistas: 41, horasExtraSemana: 2,
      pctHorasExtraPagadas: 100, salarioMedianoMes: 1100, salarioConvenioMes: 1400, diasRetrasoPago: 45, pctDeducciones: 20,
      canalQuejas: "accesible", quejasRecibidas: 2, quejasResueltas: 2, rotacionAnualPct: 10, represaliasReportadas: 0,
    };
    const d2 = { ...d, laboral: [l, ...d.laboral!.filter((x) => x.tallerId !== id)] };
    const r = evaluarRiesgo(d2, puntuarV2(d2, P)).find((x) => x.tallerId === id)!;
    expect(["alto", "critico"]).toContain(r.nivel);
    expect(r.categoria).toBe("sospecha_fundada");
    expect(r.remediacion.map((m) => m.accion).join(" ")).not.toMatch(/cortar|cerrar|suspender/i);
  });

  it("en 5 semillas: sin falsas alarmas en talleres sanos y la retención de salario siempre en alto o crítico", () => {
    const ev = evaluarRiesgoContraVerdad([1, 2, 3, 4, 5].map((s) => { const c = corrida(s); return { riesgo: c.riesgo, verdad: c.g.verdad }; }));
    expect(ev.falsasAlarmas).toBe(0);
    const sal = ev.porArquetipo.find((a) => a.arquetipo === "salario_retenido")!;
    expect(sal.niveles.alto + sal.niveles.critico).toBe(sal.n);
    expect(ev.deteccionMedio).toBe(ev.problemas);
  });
});
