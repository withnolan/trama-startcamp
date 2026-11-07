import { KpiCounter } from "@/components/motion/KpiCounter";
import { TEXTOS_ALERTA } from "@/content/textos";
import type { Alerta } from "@/lib/calculo/tipos";
import { fmtFecha, fmtHoras, fmtNumero, fmtVentana } from "@/lib/formato";

// Rayado de la zona de desajuste (MOTION §4.4: rojo al 20 % con rayado).
const RAYADO = "repeating-linear-gradient(135deg, rgb(180 35 24 / 0.2) 0 6px, rgb(180 35 24 / 0.06) 6px 12px)";

export interface ResumenAlertaProps {
  alerta: Alerta;
  nombreTaller: string;
}

/** Instantánea de la alerta: horas de alta frente a horas necesarias y lo que falta. */
export function ResumenAlerta({ alerta, nombreTaller }: ResumenAlertaProps) {
  const { horasCotizadas: deAlta, horasNecesarias: necesarias } = alerta;
  const tope = Math.max(deAlta, necesarias, 1);
  const pctDeAlta = (deAlta / tope) * 100;
  const pctNecesarias = (necesarias / tope) * 100;
  const faltan = necesarias - deAlta;
  const ratio = alerta.ratio === null ? "∞" : fmtNumero(alerta.ratio, 1);

  return (
    <section
      aria-labelledby={`alerta-${alerta.id}`}
      className="flex flex-col gap-6 rounded-lg border border-borde bg-superficie p-6 shadow-card lg:p-8"
    >
      <header className="flex flex-col gap-1">
        <p className="text-base text-tinta-2">
          {TEXTOS_ALERTA.fecha(fmtFecha(alerta.fecha))} · {fmtVentana(alerta.ventana)}
        </p>
        <h2 id={`alerta-${alerta.id}`} className="text-2xl">
          {TEXTOS_ALERTA.titulo(nombreTaller)}
        </h2>
      </header>

      <div className="flex flex-col gap-5">
        {/* Horas de alta: barra gris + zona de lo que falta hasta las necesarias */}
        <div className="flex flex-col gap-2">
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-kpi font-semibold tracking-tight text-tinta tabular-nums">
              <KpiCounter valor={deAlta} formato="horas" dataM="contador-cotizadas" />
            </span>
            <span className="text-lg text-tinta-2">{TEXTOS_ALERTA.cotizadas}</span>
          </p>
          <div className="grid" style={{ gridTemplateColumns: `${pctDeAlta}% minmax(0, 1fr)` }}>
            <div aria-hidden className="h-10 rounded-l-sm bg-gris-grafico" />
            {faltan > 0 && (
              <div data-m="grafico-desajuste" className="flex min-w-0 flex-col items-end gap-2">
                <div
                  aria-hidden
                  className="h-10 w-full rounded-r-sm border border-dashed border-rojo-grafico/60"
                  style={{ backgroundImage: RAYADO }}
                />
                <p className="whitespace-nowrap rounded-sm bg-rojo-fondo px-2 py-0.5 text-xl font-semibold text-rojo-texto tabular-nums">
                  {TEXTOS_ALERTA.faltan(fmtHoras(faltan), ratio)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Horas necesarias según los pedidos */}
        <div className="flex flex-col gap-2">
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-kpi font-semibold tracking-tight text-tinta tabular-nums">
              <KpiCounter valor={necesarias} formato="horas" dataM="contador-necesarias" />
            </span>
            <span className="text-lg text-tinta-2">{TEXTOS_ALERTA.necesarias}</span>
          </p>
          <div aria-hidden className="h-10 rounded-sm bg-marca" style={{ width: `${pctNecesarias}%` }} />
        </div>
      </div>
    </section>
  );
}
