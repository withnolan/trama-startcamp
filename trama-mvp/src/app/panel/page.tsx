import type { Metadata } from "next";
import { KpiCard } from "@/components/KpiCard";
import { TallerTable } from "@/components/TallerTable";
import { TEXTOS_PANEL } from "@/content/textos";
import { contarEstados, kpisMarca, PERIODO_ACTUAL, resumenPanel } from "@/data/vista";

export const metadata: Metadata = { title: TEXTOS_PANEL.titulo };

// DESIGN §3 «/panel»: en 5 s, qué talleres revisar y si la protección funciona.
export default function PanelPage() {
  const talleres = resumenPanel(); // ya ordenados: el rojo sale primero
  const [principal, ...resto] = kpisMarca();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold text-tinta">{TEXTOS_PANEL.titulo}</h1>
        <p className="text-tinta-2">{TEXTOS_PANEL.periodo(PERIODO_ACTUAL)}</p>
      </header>

      <section aria-label={TEXTOS_PANEL.kpisTitulo}>
        <ul className="grid grid-cols-12 gap-4">
          {principal && (
            <li className="col-span-12">
              <KpiCard kpi={principal} />
            </li>
          )}
          {resto.map((kpi, i) => (
            <li key={kpi.id} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <KpiCard kpi={kpi} retraso={(i + 1) * 80} />
            </li>
          ))}
        </ul>
      </section>

      <section id="talleres" aria-labelledby="titulo-talleres" className="flex flex-col gap-4">
        <h2 id="titulo-talleres" className="font-serif text-2xl font-semibold text-tinta">
          {TEXTOS_PANEL.talleresTitulo}
        </h2>
        <TallerTable talleres={talleres} recuento={contarEstados()} />
        <p className="text-tinta-2">{TEXTOS_PANEL.nota}</p>
      </section>
    </div>
  );
}
