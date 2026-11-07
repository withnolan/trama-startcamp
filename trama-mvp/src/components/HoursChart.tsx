"use client";
import { BarChart3, Table2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Bar, CartesianGrid, ComposedChart, LabelList, Line, Tooltip, XAxis, YAxis, type LabelProps } from "recharts";
import { Semaforo } from "@/components/Semaforo";
import { TEXTOS_GRAFICO } from "@/content/textos";
import type { VentanaHoras } from "@/lib/calculo/tipos";
import { fmtHoras, fmtRatio } from "@/lib/formato";

const T = TEXTOS_GRAFICO;
// Tokens de globals.css (@theme static): Recharts los recibe como var() en atributos SVG.
const C = {
  deAlta: "var(--color-gris-grafico)",
  necesarias: "var(--color-marca)",
  ambar: "var(--color-ambar-grafico)",
  rojo: "var(--color-rojo-grafico)",
  ambarTexto: "var(--color-ambar-texto)",
  rojoTexto: "var(--color-rojo-texto)",
  rejilla: "var(--color-borde)",
  eje: "var(--color-borde-fuerte)",
  tinta: "var(--color-tinta)",
  tinta2: "var(--color-tinta-2)",
};

// Halo del color de la tarjeta: las cifras se leen aunque una línea de límite pase por detrás.
const HALO = { stroke: "var(--color-superficie)", strokeWidth: 5, strokeLinejoin: "round", paintOrder: "stroke" } as const;

// Recharts mide el contenedor en el navegador: en el servidor se reserva el hueco (sin aviso de ancho 0).
const sinSuscripcion = () => () => {};
const useEnCliente = () => useSyncExternalStore(sinSuscripcion, () => true, () => false);

export interface HoursChartProps {
  ventanas: VentanaHoras[];
  /** taller de menos de 4 personas: solo el semáforo de cada ventana */
  ocultarCifras?: boolean;
  altura?: number;
}

export function HoursChart({ ventanas, ocultarCifras = false, altura = 340 }: HoursChartProps) {
  const [verTabla, setVerTabla] = useState(false);
  const enCliente = useEnCliente();
  const ultima = ventanas.length - 1;

  if (ocultarCifras) {
    return (
      <figure data-m="grafico-horas" className="flex flex-col gap-5 rounded-lg border border-borde bg-superficie p-6 shadow-card">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ventanas.map((v) => (
            <li key={v.mes} className="flex flex-col items-start gap-2 rounded-md border border-borde px-3 py-3">
              <span className="text-lg tabular-nums text-tinta">{v.etiqueta}</span>
              <Semaforo estado={v.estado} tamano="sm" />
            </li>
          ))}
        </ul>
        <figcaption className="text-base text-tinta-2">{T.cifrasOcultas}</figcaption>
      </figure>
    );
  }

  // Valor encima de las barras solo en la última ventana; las dos etiquetas se apartan hacia fuera.
  const valorUltima = (lado: "izquierda" | "derecha") =>
    function ValorBarra({ x, y, width, value, index }: LabelProps) {
      if (index !== ultima || value == null) return null;
      const izq = lado === "izquierda";
      return (
        <text
          x={Number(x) + (izq ? Number(width) : 0)}
          y={Number(y) - 8}
          textAnchor={izq ? "end" : "start"}
          fill={C.tinta}
          fontSize={14}
          fontWeight={600}
          {...HALO}
        >
          {fmtHoras(Number(value))}
        </text>
      );
    };

  const rotuloLinea = (texto: string, color: string) =>
    function RotuloLinea({ x, y, value, index }: LabelProps) {
      if (index !== ultima || value == null) return null;
      return (
        <text x={Number(x) + 64} y={Number(y)} dy={5} fill={color} fontSize={14} fontWeight={600} {...HALO}>
          {texto}
        </text>
      );
    };

  return (
    <figure data-m="grafico-horas" className="flex flex-col gap-4 rounded-lg border border-borde bg-superficie p-6 shadow-card">
      <div className="flex items-start justify-between gap-6">
        <ul className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 text-base text-tinta">
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-3.5 rounded-[3px] bg-gris-grafico" />
            {T.series.cotizadas}
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-3.5 rounded-[3px] bg-marca" />
            {T.series.necesarias}
          </li>
          <li className="flex items-center gap-2">
            <TrazoLeyenda color={C.ambar} />
            {T.series.limiteAmbar}
          </li>
          <li className="flex items-center gap-2">
            <TrazoLeyenda color={C.rojo} />
            {T.series.limiteRojo}
          </li>
        </ul>
        <button
          type="button"
          onClick={() => setVerTabla((v) => !v)}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-borde-fuerte bg-superficie px-3 py-1.5 text-base font-medium text-tinta transition-transform hover:bg-superficie-2 active:scale-[0.98]"
        >
          {verTabla ? <BarChart3 size={18} aria-hidden /> : <Table2 size={18} aria-hidden />}
          {verTabla ? T.verGrafico : T.verTabla}
        </button>
      </div>

      {verTabla ? (
        <div className="relative overflow-x-auto">
          <table className="w-full border-collapse text-left text-base">
            <caption className="sr-only">{T.tablaCaption}</caption>
            <thead className="border-b border-borde text-sm font-semibold text-tinta-2">
              <tr>
                <th scope="col" className="py-2 pr-3 font-semibold">{T.columnas.ventana}</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">{T.columnas.necesarias}</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">{T.columnas.cotizadas}</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">{T.series.limiteAmbar}</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">{T.series.limiteRojo}</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">{T.columnas.ratio}</th>
                <th scope="col" className="py-2 pl-3 font-semibold">{T.columnas.estado}</th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap tabular-nums">
              {ventanas.map((v) => (
                <tr key={v.mes} className="border-b border-borde last:border-b-0">
                  <th scope="row" className="py-3 pr-3 font-medium text-tinta">{v.etiqueta}</th>
                  <td className="px-3 py-3 text-right">{fmtHoras(v.necesarias)}</td>
                  <td className="px-3 py-3 text-right">{v.cotizadas == null ? T.sinCertificado : fmtHoras(v.cotizadas)}</td>
                  <td className="px-3 py-3 text-right">{v.limiteAmbar == null ? "—" : fmtHoras(v.limiteAmbar)}</td>
                  <td className="px-3 py-3 text-right">{v.limiteRojo == null ? "—" : fmtHoras(v.limiteRojo)}</td>
                  <td className="px-3 py-3 text-right font-semibold">{fmtRatio(v.ratio, 2)}</td>
                  <td className="py-3 pl-3">
                    <Semaforo estado={v.estado} tamano="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ height: altura }}>
          {enCliente && (
            <ComposedChart
              responsive
              data={ventanas}
              style={{ width: "100%", height: altura }}
              margin={{ top: 28, right: 104, bottom: 4, left: 4 }}
              barGap={6}
              barCategoryGap="30%"
            >
              <CartesianGrid vertical={false} stroke={C.rejilla} />
              <XAxis
                dataKey="etiqueta"
                interval={0}
                height={56}
                tickLine={false}
                axisLine={{ stroke: C.eje }}
                tick={({ x, y, payload }: { x?: number | string; y?: number | string; payload?: { index: number } }) => {
                  const v = payload ? ventanas[payload.index] : undefined;
                  if (!v) return <g />;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text y={20} textAnchor="middle" fill={C.tinta} fontSize={15}>
                        {v.etiqueta}
                      </text>
                      <foreignObject x={-9} y={28} width={18} height={18}>
                        <Semaforo estado={v.estado} soloIcono />
                      </foreignObject>
                    </g>
                  );
                }}
              />
              <YAxis
                domain={[0, "auto"]}
                width={84}
                axisLine={false}
                tickLine={false}
                tick={{ fill: C.tinta2, fontSize: 14 }}
                tickFormatter={(h: number) => fmtHoras(h)}
              />
              <Tooltip content={ContenidoTooltip} cursor={{ fill: "var(--color-superficie-2)" }} isAnimationActive={false} />
              <Bar dataKey="cotizadas" name={T.series.cotizadas} fill={C.deAlta} maxBarSize={28} radius={[3, 3, 0, 0]} isAnimationActive={false}>
                <LabelList dataKey="cotizadas" content={valorUltima("izquierda")} />
              </Bar>
              <Bar dataKey="necesarias" name={T.series.necesarias} fill={C.necesarias} maxBarSize={28} radius={[3, 3, 0, 0]} isAnimationActive={false}>
                <LabelList dataKey="necesarias" content={valorUltima("derecha")} />
              </Bar>
              <Line
                dataKey="limiteAmbar"
                name={T.series.limiteAmbar}
                type="linear"
                stroke={C.ambar}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              >
                <LabelList dataKey="limiteAmbar" content={rotuloLinea(T.series.limiteAmbar, C.ambarTexto)} />
              </Line>
              <Line
                dataKey="limiteRojo"
                name={T.series.limiteRojo}
                type="linear"
                stroke={C.rojo}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              >
                <LabelList dataKey="limiteRojo" content={rotuloLinea(T.series.limiteRojo, C.rojoTexto)} />
              </Line>
            </ComposedChart>
          )}
        </div>
      )}

      <figcaption className="text-sm text-tinta-2">
        <span className="sr-only">{T.titulo}. </span>
        {T.pie}
      </figcaption>
    </figure>
  );
}

function TrazoLeyenda({ color }: { color: string }) {
  return (
    <svg aria-hidden width="26" height="4" viewBox="0 0 26 4" className="shrink-0">
      <line x1="0" y1="2" x2="26" y2="2" stroke={color} strokeWidth="2" strokeDasharray="6 4" />
    </svg>
  );
}

function ContenidoTooltip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload?: unknown }> }) {
  const v = active ? (payload?.[0]?.payload as VentanaHoras | undefined) : undefined;
  if (!v) return null;
  return (
    <div className="rounded-md border border-borde bg-superficie px-3 py-3 text-base text-tinta shadow-pop">
      <p className="mb-2 font-semibold">{v.etiqueta}</p>
      <dl className="grid grid-cols-[auto_auto] items-center gap-x-6 gap-y-1 tabular-nums">
        <dt className="text-tinta-2">{T.tooltip.necesarias}</dt>
        <dd className="text-right font-medium">{fmtHoras(v.necesarias)}</dd>
        <dt className="text-tinta-2">{T.tooltip.cotizadas}</dt>
        <dd className="text-right font-medium">{v.cotizadas == null ? T.sinCertificado : fmtHoras(v.cotizadas)}</dd>
        <dt className="text-tinta-2">{T.tooltip.ratio}</dt>
        <dd className="text-right font-medium">{fmtRatio(v.ratio, 2)}</dd>
        <dt className="text-tinta-2">{T.tooltip.estado}</dt>
        <dd className="text-right">
          <Semaforo estado={v.estado} tamano="sm" />
        </dd>
      </dl>
    </div>
  );
}
