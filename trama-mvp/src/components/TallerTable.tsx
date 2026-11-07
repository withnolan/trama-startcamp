"use client";
import { ChevronRight, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Badge } from "@/components/Badge";
import { ICONO_ESTADO, Semaforo } from "@/components/Semaforo";
import { FILTRO_ESTADO, NIVEL_CADENA, PAIS_NOMBRE, TEXTOS_PANEL, TEXTOS_PRIVACIDAD } from "@/content/textos";
import type { EstadoSemaforo, TallerResumen } from "@/lib/calculo/tipos";
import { fmtMes, fmtRatio } from "@/lib/formato";

type Filtro = EstadoSemaforo | "todos";
const FILTROS: Filtro[] = ["todos", "rojo", "ambar", "verde", "sin_datos"];
const COL = TEXTOS_PANEL.columnas;

export interface TallerTableProps {
  /** nivel 1 con sus subcontratas anidadas, ya ordenados (resumenPanel) */
  talleres: TallerResumen[];
  /** recuento por estado de las filas de nivel 1 (contarEstados) */
  recuento: Record<Filtro, number>;
}

export function TallerTable({ talleres, recuento }: TallerTableProps) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  // MOTION §4.2: solo la primera pintura escalona las filas; filtrar no anima.
  const [animar, setAnimar] = useState(true);
  const elegir = (f: Filtro) => {
    setAnimar(false);
    setFiltro(f);
  };

  if (talleres.length === 0) {
    return (
      <p className="rounded-lg border border-borde bg-superficie px-6 py-10 text-center text-lg text-tinta-2">
        {TEXTOS_PANEL.vacio}
      </p>
    );
  }

  const visibles = filtro === "todos" ? talleres : talleres.filter((t) => t.estado === filtro);
  const filas = visibles.flatMap((t) => [
    { taller: t, padre: null as TallerResumen | null },
    ...t.subcontratas.map((s) => ({ taller: s, padre: t })),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label={TEXTOS_PANEL.filtrosAria} className="flex flex-wrap gap-2">
        {FILTROS.map((f) => {
          const Icono = f === "todos" ? null : ICONO_ESTADO[f];
          const activo = filtro === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={activo}
              onClick={() => elegir(f)}
              className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-lg font-medium tabular-nums transition-transform active:scale-[0.98] ${
                activo
                  ? "border-marca bg-marca text-white hover:bg-marca-hover"
                  : "border-borde-fuerte bg-superficie text-tinta hover:bg-superficie-2"
              }`}
            >
              {Icono && <Icono size={18} strokeWidth={2.25} aria-hidden className="shrink-0" />}
              {TEXTOS_PANEL.filtro(FILTRO_ESTADO[f], recuento[f] ?? 0)}
            </button>
          );
        })}
      </div>

      {filas.length === 0 ? (
        <div
          role="status"
          className="flex flex-col items-center gap-4 rounded-lg border border-borde bg-superficie px-6 py-10 text-center"
        >
          <p className="text-lg text-tinta-2">{TEXTOS_PANEL.filtroVacio[filtro as EstadoSemaforo]}</p>
          <button
            type="button"
            onClick={() => elegir("todos")}
            className="rounded-md border border-borde-fuerte bg-superficie px-4 py-2 text-lg font-medium text-tinta hover:bg-superficie-2"
          >
            {TEXTOS_PANEL.verTodos}
          </button>
        </div>
      ) : (
        <div className="relative overflow-x-auto rounded-lg border border-borde bg-superficie shadow-card">
          <table className="w-full border-collapse text-left text-base">
            <caption className="sr-only">{TEXTOS_PANEL.talleresTitulo}</caption>
            <thead className="border-b border-borde bg-superficie-2 text-sm font-semibold uppercase tracking-[0.06em] text-tinta-2">
              <tr>
                <th scope="col" className="px-3 py-3 font-semibold">{COL.estado}</th>
                <th scope="col" className="px-3 py-3 font-semibold">{COL.taller}</th>
                <th scope="col" className="px-3 py-3 font-semibold">{COL.nivel}</th>
                <th scope="col" className="px-3 py-3 font-semibold">{COL.pais}</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">{COL.carga}</th>
                <th scope="col" className="px-3 py-3 font-semibold">{COL.certificado}</th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  <span className="sr-only">{COL.detalle}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filas.map(({ taller: t, padre }, i) => (
                <tr
                  key={t.id}
                  className={`border-b border-borde last:border-b-0 hover:bg-superficie-2 ${animar && i < 8 ? "animar-entrada" : ""}`}
                  style={animar && i < 8 ? ({ "--orden": i } as CSSProperties) : undefined}
                >
                  <td className="px-3 py-4 align-middle">
                    <Semaforo estado={t.estado} tamano="sm" />
                  </td>
                  <th scope="row" className={`py-4 pr-3 text-left align-middle font-normal ${padre ? "pl-9" : "pl-3"}`}>
                    <span className="flex items-start gap-2">
                      {padre && <CornerDownRight size={18} aria-hidden className="mt-1 shrink-0 text-borde-fuerte" />}
                      <span className="flex flex-col items-start gap-1">
                        <Link
                          href={`/taller/${t.id}`}
                          className={`font-semibold text-marca underline decoration-marca/30 underline-offset-4 hover:decoration-marca ${
                            padre ? "text-base" : "text-lg"
                          }`}
                        >
                          {t.nombre}
                        </Link>
                        {padre && <span className="text-sm text-tinta-2">{TEXTOS_PANEL.subcontrataDe(padre.nombre)}</span>}
                        {t.tienePlan && <Badge variante="marca">{TEXTOS_PANEL.conPlan}</Badge>}
                      </span>
                    </span>
                  </th>
                  <td className="whitespace-nowrap px-3 py-4 align-middle text-tinta-2">{NIVEL_CADENA[t.nivel]}</td>
                  <td className="whitespace-nowrap px-3 py-4 align-middle">
                    <span className="block text-tinta">{PAIS_NOMBRE[t.pais]}</span>
                    <span className="block text-sm text-tinta-2">{t.ciudad}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right align-middle tabular-nums">
                    {t.ocultarCifras ? (
                      <>
                        <span aria-hidden className="text-base text-tinta-2">{TEXTOS_PRIVACIDAD.cifraOculta}</span>
                        <span className="sr-only">{TEXTOS_PRIVACIDAD.cifraOcultaAria}</span>
                      </>
                    ) : t.ratio === undefined ? (
                      <>
                        <span aria-hidden className="text-lg text-tinta-2">—</span>
                        <span className="sr-only">{TEXTOS_PANEL.sinCertificado}</span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-tinta">{fmtRatio(t.ratio, 2)}</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 align-middle tabular-nums text-tinta">
                    {t.ultimoCertificado ? fmtMes(t.ultimoCertificado) : <span className="text-tinta-2">{TEXTOS_PANEL.sinCertificado}</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right align-middle">
                    <Link
                      href={`/taller/${t.id}`}
                      aria-label={TEXTOS_PANEL.verDetalleAria(t.nombre)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-marca hover:bg-marca-suave"
                    >
                      {TEXTOS_PANEL.verDetalle}
                      <ChevronRight size={18} aria-hidden />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
