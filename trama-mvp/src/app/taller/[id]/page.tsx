import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Badge } from "@/components/Badge";
import { BarraLimite } from "@/components/BarraLimite";
import { ChainDiagram } from "@/components/ChainDiagram";
import { HoursChart } from "@/components/HoursChart";
import { KpiCard } from "@/components/KpiCard";
import { DemoDirector } from "@/components/motion/DemoDirector";
import { NotaAlerta } from "@/components/NotaAlerta";
import { PlanTimeline } from "@/components/PlanTimeline";
import { PorQueAlerta } from "@/components/PorQueAlerta";
import { ResumenAlerta } from "@/components/ResumenAlerta";
import { ResumenPeriodo } from "@/components/ResumenPeriodo";
import { Semaforo } from "@/components/Semaforo";
import { SimuladorSemaforo } from "@/components/SimuladorSemaforo";
import { SubnavTaller } from "@/components/SubnavTaller";
import {
  NIVEL_CADENA,
  PAIS_NOMBRE,
  SECCIONES_TALLER,
  TEXTOS_IMPACTO,
  TEXTOS_PLAN,
  TEXTOS_PRIVACIDAD,
  TEXTOS_PROTECCION,
  TEXTOS_PROTOCOLO,
  TEXTOS_TALLER,
} from "@/content/textos";
import { detalleTaller, idsTalleres } from "@/data/vista";
import type { DetalleTaller } from "@/lib/calculo/tipos";
import { fmtFecha, fmtMes, fmtNumero, fmtRatio, fmtVentana } from "@/lib/formato";

const TARJETA = "rounded-lg border border-borde bg-superficie p-6 shadow-card";
const ENLACE =
  "text-marca underline underline-offset-4 hover:text-marca-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca";
const VIAS: Record<string, string> = TEXTOS_PROTECCION.acompanamiento.vias;

// Todos los ids se prerenderizan con generateStaticParams: la ruta puede leer params sin <Suspense>.
export const instant = false;

export function generateStaticParams() {
  return idsTalleres().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/taller/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: detalleTaller(id)?.taller.nombre ?? "Taller" };
}

// DESIGN §3 «/taller/[id]»: por qué salta la alerta y qué se hace sin perjudicar a los trabajadores.
export default async function TallerPage({ params }: PageProps<"/taller/[id]">) {
  const { id } = await params;
  const d = detalleTaller(id);
  if (!d) notFound();
  const { taller, plan } = d;

  return (
    <div className="flex flex-col gap-10">
      <Cabecera d={d} />
      <SubnavTaller />

      <Seccion id="horas" titulo={SECCIONES_TALLER.horas}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-8">
            {d.alerta && !d.ocultarCifras && <ResumenAlerta alerta={d.alerta} nombreTaller={taller.nombre} />}
            <HoursChart ventanas={d.ventanas} ocultarCifras={d.ocultarCifras} />
          </div>
          <div className="lg:col-span-4">
            <ResumenPeriodo resumen={d.resumen} ocultarCifras={d.ocultarCifras} />
          </div>
        </div>
        {!d.ocultarCifras && (
          <div id="simulador" data-m="seccion-simulador">
            <SimuladorSemaforo />
          </div>
        )}
      </Seccion>

      <Seccion id="cadena" titulo={SECCIONES_TALLER.cadena}>
        <ChainDiagram nodos={d.nodos} />
      </Seccion>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <Seccion id="plan" titulo={plan ? TEXTOS_PLAN.titulo(plan.revisor) : SECCIONES_TALLER.plan} className="lg:col-span-7">
          {plan ? (
            <PlanTimeline hitos={plan.hitos} revisor={plan.revisor} />
          ) : (
            <p className="text-tinta-2">{TEXTOS_PLAN.sinPlan[d.estado]}</p>
          )}
        </Seccion>

        <Seccion id="proteccion" titulo={SECCIONES_TALLER.proteccion} className="lg:col-span-5">
          <p className="text-tinta-2">{TEXTOS_PROTECCION.intro}</p>
          {plan && (
            <ul className="flex flex-col gap-4">
              <li data-m="tarjeta-clausula" className={TARJETA}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-tinta">{TEXTOS_PROTECCION.clausula.titulo}</h3>
                  <Badge variante="verde">{TEXTOS_PROTECCION.clausula.estado}</Badge>
                </div>
                <p className="mt-2 text-tinta-2">
                  {TEXTOS_PROTECCION.clausula.vigencia(fmtFecha(plan.clausula.vigenteDesde), fmtFecha(plan.clausula.vigenteHasta))}
                </p>
                <p className="mt-1 text-sm text-tinta-2">{TEXTOS_PROTECCION.clausula.incumplimientos(plan.clausula.incumplimientos)}</p>
              </li>
              <li data-m="tarjeta-limite" className={TARJETA}>
                <h3 className="text-lg font-semibold text-tinta">{TEXTOS_PROTECCION.limite.titulo}</h3>
                <div className="mt-3">
                  <BarraLimite usadoPct={plan.reduccionUsadaPct} limitePct={plan.limiteReduccionPct} />
                </div>
              </li>
              <li data-m="tarjeta-acompanamiento" className={TARJETA}>
                <h3 className="text-lg font-semibold text-tinta">{TEXTOS_PROTECCION.acompanamiento.titulo}</h3>
                <p className="mt-2 text-tinta tabular-nums">
                  {TEXTOS_PROTECCION.acompanamiento.personas(fmtNumero(plan.acompanamiento.iniciadas))}
                </p>
                <p className="mt-1 text-tinta tabular-nums">
                  {TEXTOS_PROTECCION.acompanamiento.altas(fmtNumero(plan.acompanamiento.altasDirectas))}
                </p>
                <p className="mt-2 text-sm text-tinta-2">
                  {TEXTOS_PROTECCION.acompanamiento.entidad(plan.acompanamiento.entidad)}
                  {plan.acompanamiento.vias.length > 0 && ` · ${plan.acompanamiento.vias.map((v) => VIAS[v] ?? v).join(" · ")}`}
                </p>
              </li>
            </ul>
          )}
        </Seccion>
      </div>

      <Seccion id="impacto" titulo={SECCIONES_TALLER.impacto}>
        {d.ocultarCifras ? (
          <p className="text-tinta-2">{TEXTOS_PRIVACIDAD.tallerPequeno}</p>
        ) : d.impacto.length > 0 ? (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.impacto.map((kpi, i) => (
                <li
                  key={kpi.id}
                  data-m={i === 0 ? "kpi-principal-taller" : undefined}
                  className={kpi.variante === "principal" ? "sm:col-span-2 lg:col-span-3" : undefined}
                >
                  <KpiCard kpi={kpi} compacta retraso={i * 80} />
                </li>
              ))}
            </ul>
            <p className="text-sm text-tinta-2">{TEXTOS_IMPACTO.nota}</p>
          </>
        ) : (
          <p className="text-tinta-2">{TEXTOS_IMPACTO.sinPlan}</p>
        )}
      </Seccion>

      {plan?.protocoloLegal.activado && (
        <aside aria-labelledby="titulo-protocolo" className="rounded-lg border border-borde bg-superficie-2 p-6">
          <h2 id="titulo-protocolo" className="font-sans text-xl font-semibold text-tinta">
            {TEXTOS_PROTOCOLO.titulo}
          </h2>
          <p className="mt-2 max-w-[68ch] text-tinta-2">
            {plan.protocoloLegal.fecha && `${fmtFecha(plan.protocoloLegal.fecha)} · `}
            {TEXTOS_PROTOCOLO.texto}{" "}
            <Link href={TEXTOS_PROTOCOLO.href} className={ENLACE}>
              {TEXTOS_PROTOCOLO.enlace}
            </Link>
          </p>
        </aside>
      )}

      <DemoDirector />
    </div>
  );
}

function Cabecera({ d }: { d: DetalleTaller }) {
  const { taller, evaluacion: ev } = d;
  return (
    <header className="flex flex-col gap-4">
      <nav aria-label={TEXTOS_TALLER.migasAria} className="text-sm text-tinta-2">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/panel" className={ENLACE}>
              {TEXTOS_TALLER.migas}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-tinta">
            {taller.nombre}
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl font-semibold text-tinta">{taller.nombre}</h1>
            <Badge variante="neutro">{NIVEL_CADENA[taller.nivel]}</Badge>
          </div>
          <p className="text-tinta-2">
            {taller.ciudad} ({taller.provincia}), {PAIS_NOMBRE[taller.pais]} · {taller.especialidad}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Semaforo estado={d.estado} tamano="lg" dataM="semaforo-cabecera" />
          {!d.ocultarCifras && ev.ratio !== undefined && (
            <dl>
              <dt className="text-sm text-tinta-2">{ev.tipo === "cadena" ? TEXTOS_TALLER.ratioCadena : "Carga / horas de alta"}</dt>
              <dd className="text-xl font-semibold text-tinta tabular-nums">
                {TEXTOS_TALLER.ratio(fmtRatio(ev.ratio))} · {fmtVentana(ev.ventana)}
              </dd>
            </dl>
          )}
        </div>
      </div>

      {(d.estado === "rojo" || d.estado === "ambar") && (
        <>
          <NotaAlerta estado={d.estado} />
          <PorQueAlerta porQue={d.porQue} comprobaciones={d.comprobaciones} />
        </>
      )}
      {d.estado === "sin_datos" && d.resumen.mesesSinCertificado.length > 0 && (
        <p className="text-tinta-2">{TEXTOS_TALLER.sinCertificado(d.resumen.mesesSinCertificado.map(fmtMes).join(", "))}</p>
      )}
      {d.ocultarCifras && <p className="text-tinta-2">{TEXTOS_PRIVACIDAD.tallerPequeno}</p>}
    </header>
  );
}

function Seccion({ id, titulo, className = "", children }: { id: string; titulo: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} data-m={`seccion-${id}`} aria-labelledby={`titulo-${id}`} className={`flex flex-col gap-4 ${className}`}>
      <h2 id={`titulo-${id}`} className="font-serif text-2xl font-semibold text-tinta">
        {titulo}
      </h2>
      {children}
    </section>
  );
}
