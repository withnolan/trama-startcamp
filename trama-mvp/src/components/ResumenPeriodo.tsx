import { CircleHelp, ShieldCheck } from "lucide-react";
import { TEXTOS_TALLER } from "@/content/textos";
import type { DetalleTaller } from "@/lib/calculo/tipos";
import { fmtFecha, fmtHoras, fmtMes, fmtNumero } from "@/lib/formato";

const R = TEXTOS_TALLER.resumen;
const horas = (h: number | null) => (h == null ? "—" : fmtHoras(h));
const diferencia = (d: number | null) => (d == null ? "—" : d > 0 ? `+${fmtHoras(d)}` : d < 0 ? `−${fmtHoras(-d)}` : fmtHoras(0));

export interface ResumenPeriodoProps {
  resumen: DetalleTaller["resumen"];
  ocultarCifras: boolean;
}

export function ResumenPeriodo({ resumen, ocultarCifras }: ResumenPeriodoProps) {
  return (
    <section aria-labelledby="resumen-periodo" className="flex h-full flex-col gap-5 rounded-lg border border-borde bg-superficie p-6 shadow-card">
      <header className="flex flex-col gap-1">
        <h3 id="resumen-periodo">{R.titulo}</h3>
        <p className="text-base text-tinta-2 tabular-nums">{resumen.periodo}</p>
      </header>

      {ocultarCifras ? (
        <p className="flex items-start gap-2 rounded-md bg-superficie-2 px-4 py-3 text-lg text-tinta">
          <ShieldCheck size={22} aria-hidden className="mt-0.5 shrink-0 text-tinta-2" />
          {TEXTOS_TALLER.cifrasOcultas}
        </p>
      ) : (
        <dl className="flex flex-col gap-4 tabular-nums">
          <div>
            <dt className="text-base text-tinta-2">{R.necesarias}</dt>
            <dd className="text-3xl font-semibold tracking-tight text-tinta">{horas(resumen.necesarias)}</dd>
            <dd className="text-sm text-tinta-2">{R.necesariasAyuda}</dd>
          </div>
          <div>
            <dt className="text-base text-tinta-2">{R.cotizadas}</dt>
            <dd className="text-3xl font-semibold tracking-tight text-tinta">{horas(resumen.cotizadas)}</dd>
            <dd className="text-sm text-tinta-2">{R.cotizadasAyuda}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-borde pt-4">
            <div>
              <dt className="text-base text-tinta-2">{R.diferencia}</dt>
              <dd className="text-xl font-semibold text-tinta">{diferencia(resumen.diferencia)}</dd>
            </div>
            <div>
              <dt className="text-base text-tinta-2">{R.plantilla}</dt>
              <dd className="text-xl font-semibold text-tinta">
                {resumen.plantilla == null ? "—" : TEXTOS_TALLER.plantilla(fmtNumero(resumen.plantilla))}
              </dd>
            </div>
          </div>
        </dl>
      )}

      <dl className="mt-auto flex flex-col gap-3 border-t border-borde pt-4 text-base">
        <div>
          <dt className="text-tinta-2">{R.firmante}</dt>
          <dd className="text-tinta">{resumen.firmante}</dd>
        </div>
        <div>
          <dt className="text-tinta-2">{R.fecha}</dt>
          <dd className="text-tinta tabular-nums">{resumen.fechaCertificado ? fmtFecha(resumen.fechaCertificado) : "—"}</dd>
        </div>
      </dl>

      {resumen.mesesSinCertificado.length > 0 && (
        <p role="note" className="flex items-start gap-2 rounded-md border border-dashed border-borde-fuerte bg-superficie-2 px-4 py-3 text-base text-tinta">
          <CircleHelp size={20} aria-hidden className="mt-0.5 shrink-0 text-tinta-2" />
          {TEXTOS_TALLER.sinCertificado(resumen.mesesSinCertificado.map(fmtMes).join(", "))}
        </p>
      )}
    </section>
  );
}
