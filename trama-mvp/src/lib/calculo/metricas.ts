/** Métricas de impacto (specs/DATA_MODEL.md §4): por plan y sumadas por marca. */
import { certificadoValido, horasCotizadasMes, horasPedidoMes, mesesEntre, sumarMeses } from "./semaforo";
import type { ISODate, Mes, MetricasImpacto, PlanCorreccion, Seed } from "./tipos";

/** Meses de seguimiento hasta que la métrica principal es definitiva. */
export const MESES_SEGUIMIENTO = 6;
const NOMBRE_PRINCIPAL = "Trabajadores de la cadena que siguen empleados y de alta 6 meses después de la alerta";

const r2 = (x: number) => Math.round(x * 100) / 100;
const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

function metricasPlan(d: Seed, plan: PlanCorreccion, ultimoMes: Mes | null, fechaCorte: ISODate) {
  const alerta = d.alertas.find((a) => a.id === plan.alertaId);
  if (!alerta) throw new Error(`Alerta desconocida: ${plan.alertaId}`);
  // Meses del plan: posteriores al mes evaluado en la alerta, hasta el último certificado disponible.
  const mesesPlan = ultimoMes ? mesesEntre(sumarMeses(alerta.mesEvaluado, 1), ultimoMes) : [];
  const ref = plan.periodoReferenciaPedidos;
  const ids = plan.talleresIncluidos;
  const pt = plan.proteccionTrabajadores;

  // Principal: S / B con el certificado del mes 6 (o el último, provisional).
  const n = Math.min(MESES_SEGUIMIENTO, mesesPlan.length);
  const lineaBase = suma(pt.lineaBase.map((l) => l.deAltaEnAlerta + l.sinAltaIdentificados));
  const siguen = n
    ? suma(pt.lineaBase.map((l) => certificadoValido(d, l.tallerId, mesesPlan[n - 1])?.trabajadoresLineaBaseDeAlta ?? 0))
    : suma(pt.lineaBase.map((l) => l.deAltaEnAlerta));

  // Horas regularizadas: Σ_T Σ_m∈plan (H(T, m) − media de H(T) en la referencia). Neta: puede salir negativa.
  const horasRegularizadas = suma(
    ids.map((id) => {
      const base = suma(ref.map((m) => horasCotizadasMes(d, id, m))) / (ref.length || 1);
      return suma(mesesPlan.map((m) => horasCotizadasMes(d, id, m) - base));
    }),
  );

  // Pedidos mantenidos: horas estándar/mes de pedidos de origen 'marca' a la cadena.
  const pedidos = d.pedidos.filter((p) => p.marcaId === d.marca.id && p.origen === "marca" && ids.includes(p.tallerId));
  const mensual = (meses: Mes[]) =>
    meses.length ? suma(pedidos.flatMap((p) => meses.map((m) => horasPedidoMes(d, p, m)))) / meses.length : 0;
  const refMensual = mensual(ref);
  const planMensual = mesesPlan.length ? mensual(mesesPlan) : refMensual;
  const reduccion = r2(100 - (refMensual ? (planMensual / refMensual) * 100 : 100));

  return {
    lineaBase,
    siguen,
    n,
    definitiva: n >= MESES_SEGUIMIENTO && fechaCorte >= plan.fechaFinPrevista,
    fechaDefinitiva: plan.fechaFinPrevista,
    horasRegularizadas,
    iniciados: suma(pt.regularizaciones.map((r) => r.iniciadas)),
    resueltos: suma(pt.regularizaciones.map((r) => r.resueltasFavorables)),
    altasDirectas: pt.altasDirectas,
    refMensual,
    planMensual,
    limite: plan.limiteReduccionPedidosPct,
    cumple: reduccion <= plan.limiteReduccionPedidosPct,
    despidos: suma(ids.flatMap((id) => mesesPlan.map((m) => certificadoValido(d, id, m)?.despidosEnMes ?? 0))),
  };
}

/** Métricas de la marca con los certificados emitidos hasta `fechaCorte`. Para un solo plan: pasar datos con ese plan. */
export function calcularMetricas(datos: Seed, fechaCorte: ISODate): MetricasImpacto {
  const d: Seed = { ...datos, certificadosHoras: datos.certificadosHoras.filter((c) => c.fechaEmision <= fechaCorte) };
  const ultimoMes = d.certificadosHoras.map((c) => c.mes).sort().at(-1) ?? null;
  const planes = d.planesCorreccion.filter((p) => p.marcaId === d.marca.id);
  const ms = planes.map((p) => metricasPlan(d, p, ultimoMes, fechaCorte));

  const lineaBase = suma(ms.map((m) => m.lineaBase));
  const siguen = suma(ms.map((m) => m.siguen));
  const ref = suma(ms.map((m) => m.refMensual));
  const durante = suma(ms.map((m) => m.planMensual));
  const pct = ref ? (durante / ref) * 100 : 100;
  const limite = ms.length ? Math.min(...ms.map((m) => m.limite)) : d.marca.limiteReduccionPedidosPctPorDefecto;
  const reduccionPct = r2(100 - pct);

  return {
    marcaId: d.marca.id,
    fechaCorte,
    ultimoMesCertificado: ultimoMes ?? "",
    principal: {
      nombre: NOMBRE_PRINCIPAL,
      trabajadoresLineaBase: lineaBase,
      siguenEmpleadosYDeAlta: siguen,
      porcentaje: lineaBase ? r2((siguen / lineaBase) * 100) : 0,
      mesesDesdeAlerta: ms.length ? Math.min(...ms.map((m) => m.n)) : 0,
      definitiva: ms.length > 0 && ms.every((m) => m.definitiva),
      fechaDefinitiva: ms.map((m) => m.fechaDefinitiva).sort().at(-1) ?? "",
    },
    horasRegularizadas: r2(suma(ms.map((m) => m.horasRegularizadas))),
    trabajadoresAcompanados: {
      iniciados: suma(ms.map((m) => m.iniciados)),
      resueltosFavorables: suma(ms.map((m) => m.resueltos)),
      altasDirectas: suma(ms.map((m) => m.altasDirectas)),
    },
    pedidosMantenidos: {
      horasMensualesReferencia: r2(ref),
      horasMensualesDurantePlan: r2(durante),
      porcentajeMantenido: r2(pct),
      reduccionPct,
      limiteReduccionPct: limite,
      cumpleLimite: reduccionPct <= limite,
    },
    fallos: {
      despidosTrasAlerta: suma(ms.map((m) => m.despidos)),
      planesConCaidaPedidosSobreLimite: ms.filter((m) => !m.cumple).length,
    },
    planesActivos: planes.filter((p) => p.estado === "en_curso").length,
  };
}
