import { ListChecks, Search, Square, UserRound } from "lucide-react";

export interface PorQueAlertaProps {
  /** frases con las cifras reales (DetalleTaller.porQue) */
  porQue: string[];
  /** qué revisaría una persona (DetalleTaller.comprobaciones) */
  comprobaciones: string[];
}

/** Junto a NotaAlerta: por qué salta y qué comprobaría una persona. Nada si ambas listas están vacías. */
export function PorQueAlerta({ porQue, comprobaciones }: PorQueAlertaProps) {
  if (porQue.length === 0 && comprobaciones.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {porQue.length > 0 && (
          <section aria-labelledby="por-que-salta" className="rounded-lg border border-borde bg-superficie p-5 shadow-card">
            <h2 id="por-que-salta" className="flex items-center gap-2 font-sans text-xl font-semibold">
              <Search size={20} aria-hidden className="shrink-0 text-tinta-2" />
              Por qué salta
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-lg text-tinta tabular-nums">
              {porQue.map((frase, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-tinta-2" />
                  {frase}
                </li>
              ))}
            </ul>
          </section>
        )}
        {comprobaciones.length > 0 && (
          <section aria-labelledby="que-comprobar" className="rounded-lg border border-borde bg-superficie p-5 shadow-card">
            <h2 id="que-comprobar" className="flex items-center gap-2 font-sans text-xl font-semibold">
              <ListChecks size={20} aria-hidden className="shrink-0 text-tinta-2" />
              Qué comprobaría una persona
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-lg text-tinta">
              {comprobaciones.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <Square size={18} strokeWidth={2} aria-hidden className="mt-1 shrink-0 text-borde-fuerte" />
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <p className="flex items-center gap-2 text-base text-tinta-2">
        <UserRound size={18} aria-hidden className="shrink-0" />
        Trama propone dónde mirar; decide una persona del equipo de cumplimiento.
      </p>
    </div>
  );
}
