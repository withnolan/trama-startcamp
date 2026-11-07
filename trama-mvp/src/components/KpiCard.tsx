import { CircleCheck, OctagonAlert } from "lucide-react";
import type { ReactNode } from "react";
import { KpiCounter } from "@/components/motion/KpiCounter";
import type { KpiVista } from "@/lib/calculo/tipos";

export interface KpiCardProps {
  kpi: KpiVista;
  /** tarjetas pequeñas del detalle (#impacto): cifra de 36 px */
  compacta?: boolean;
  /** sustituye a la cifra animada (p. ej. un KpiCounter con dataM) */
  valor?: ReactNode;
  /** retraso del contador en ms (MOTION §4.1: 80 ms entre KPIs) */
  retraso?: number;
}

export function KpiCard({ kpi, compacta = false, valor, retraso = 0 }: KpiCardProps) {
  const decimales = kpi.formato === "porcentaje" && !Number.isInteger(kpi.valor) ? 1 : 0;
  const cifra = valor ?? <KpiCounter valor={kpi.valor} formato={kpi.formato} decimales={decimales} id={kpi.id} retraso={retraso} />;

  if (kpi.variante === "principal") {
    const progreso = Math.min(100, Math.max(0, kpi.progreso ?? kpi.valor));
    const Titulo = compacta ? "h3" : "h2";
    return (
      <article className="grid gap-6 rounded-lg border border-borde bg-superficie p-6 shadow-card lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-10 lg:p-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-tinta-2">Indicador principal</p>
          {/* En el panel cuelga del h1 (h2); compacta va dentro de la sección #impacto, que ya tiene su h2 */}
          <Titulo className="font-serif text-2xl font-semibold text-tinta">{kpi.etiqueta}</Titulo>
        </div>
        <div className="flex flex-col gap-3">
          <p className="flex flex-wrap items-baseline gap-x-3 font-semibold leading-none tracking-tight tabular-nums text-tinta">
            <span className={compacta ? "text-kpi" : "text-[3.5rem] leading-none"}>{cifra}</span>
            {kpi.unidad && <span className="text-xl font-medium text-tinta-2">{kpi.unidad}</span>}
          </p>
          <div aria-hidden className="h-2 overflow-hidden rounded-full bg-superficie-2">
            <div className="h-full rounded-full bg-marca" style={{ width: `${progreso}%` }} />
          </div>
          {kpi.contexto && <p className="text-lg text-tinta-2">{kpi.contexto}</p>}
        </div>
      </article>
    );
  }

  const fallo = kpi.variante === "fallo";
  const sinFallos = fallo && kpi.valor === 0;
  const IconoFallo = sinFallos ? CircleCheck : OctagonAlert;
  const colorCifra = !fallo ? "text-tinta" : sinFallos ? "text-verde-texto" : "text-rojo-texto";

  return (
    // La cifra se pinta arriba (order-first) para que quede alineada entre tarjetas; en el DOM va tras su etiqueta.
    <article className={`flex h-full flex-col gap-2 rounded-lg border border-borde bg-superficie shadow-card ${compacta ? "p-5" : "p-6"}`}>
      <h3 className={`font-sans font-medium text-tinta ${compacta ? "text-base" : "text-lg"}`}>{kpi.etiqueta}</h3>
      <p
        className={`order-first flex flex-wrap items-center gap-x-2 font-semibold tracking-tight tabular-nums ${colorCifra} ${compacta ? "text-3xl" : "text-kpi"}`}
      >
        {fallo && <IconoFallo size={compacta ? 28 : 34} strokeWidth={2.25} aria-hidden className="shrink-0" />}
        <span>{cifra}</span>
        {kpi.unidad && <span className="text-lg font-medium text-tinta-2">{kpi.unidad}</span>}
      </p>
      {kpi.contexto && <p className="text-base text-tinta-2">{kpi.contexto}</p>}
    </article>
  );
}
