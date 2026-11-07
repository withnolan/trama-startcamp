import { CircleCheck, MapPin, Users } from "lucide-react";
import { Semaforo } from "@/components/Semaforo";
import { NIVEL_CADENA, PAIS_NOMBRE, TEXTOS_CADENA } from "@/content/textos";
import type { NodoCadena } from "@/lib/calculo/tipos";
import { fmtFecha, fmtNumero } from "@/lib/formato";

export interface ChainDiagramProps {
  nodos: NodoCadena[];
}

/** Marca → proveedor → subcontratas: horizontal desde 1024 px, vertical por debajo. */
export function ChainDiagram({ nodos }: ChainDiagramProps) {
  const columnas = ([0, 1, 2, 3] as const).map((n) => nodos.filter((x) => x.nivel === n)).filter((c) => c.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <ol aria-label={TEXTOS_CADENA.aria} className="flex flex-col items-stretch lg:flex-row lg:items-center lg:gap-16">
        {columnas.map((columna, i) => {
          const trasAlerta = columna.some((n) => n.momento === "tras_alerta");
          return (
            <li key={columna[0].id} className="relative flex flex-1 flex-col items-center">
              {i > 0 && <Conector dataM={trasAlerta ? "conector-subcontrata" : undefined} />}
              <div className="flex w-full flex-1 flex-col gap-4">
                {columna.map((nodo) =>
                  nodo.momento === "tras_alerta" ? (
                    // El fantasma ocupa el mismo hueco; fuera de la demo no se muestra (globals.css).
                    <div key={nodo.id} className="relative flex flex-1 flex-col">
                      <div
                        data-m="nodo-fantasma"
                        aria-hidden
                        className="absolute inset-0 rounded-lg border-2 border-dashed border-borde-fuerte bg-papel p-5 opacity-60"
                      >
                        <p className="text-sm font-medium uppercase tracking-[0.08em] text-tinta-2">
                          {nodo.nivel === 0 ? TEXTOS_CADENA.tipo.subcontrata : NIVEL_CADENA[nodo.nivel]}
                        </p>
                        <p className="mt-2 font-serif text-xl font-semibold text-tinta-2">{TEXTOS_CADENA.fantasma}</p>
                      </div>
                      <Nodo nodo={nodo} dataM="nodo-subcontrata" />
                    </div>
                  ) : (
                    <Nodo key={nodo.id} nodo={nodo} />
                  ),
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="text-base text-tinta-2">{TEXTOS_CADENA.nota}</p>
    </div>
  );
}

function Nodo({ nodo, dataM }: { nodo: NodoCadena; dataM?: string }) {
  if (nodo.pendiente) {
    return (
      <div className="flex flex-1 flex-col justify-center gap-2 rounded-lg border-2 border-dashed border-borde-fuerte bg-papel p-5">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-tinta-2">{TEXTOS_CADENA.tipo.subcontrata}</p>
        <p className="text-lg font-medium text-tinta">{TEXTOS_CADENA.pendiente}</p>
      </div>
    );
  }

  const esMarca = nodo.tipo === "marca";
  const tipo = esMarca || nodo.nivel === 0 ? TEXTOS_CADENA.tipo.marca : NIVEL_CADENA[nodo.nivel];
  const lugar = [nodo.ciudad, nodo.pais && PAIS_NOMBRE[nodo.pais]].filter(Boolean).join(", ");

  return (
    <article
      data-m={dataM}
      className={`relative flex flex-1 flex-col gap-3 rounded-lg border p-5 shadow-card ${
        esMarca ? "border-marca/30 bg-marca-suave" : "border-borde bg-superficie"
      }`}
    >
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-tinta-2">{tipo}</p>
        <h3 className="font-serif text-xl font-semibold text-tinta">{nodo.nombre}</h3>
      </header>
      {nodo.estado && !esMarca && (
        <div>
          <Semaforo estado={nodo.estado} tamano="sm" />
        </div>
      )}
      <ul className="flex flex-col gap-1.5 text-base text-tinta-2">
        {lugar && (
          <li className="flex items-center gap-2">
            <MapPin size={16} aria-hidden className="shrink-0" />
            {lugar}
          </li>
        )}
        {nodo.plantilla !== undefined && (
          <li className="flex items-center gap-2 tabular-nums">
            <Users size={16} aria-hidden className="shrink-0" />
            {nodo.plantilla === null ? TEXTOS_CADENA.plantillaOculta : TEXTOS_CADENA.plantilla(fmtNumero(nodo.plantilla))}
          </li>
        )}
        {nodo.momento && (
          <li className="tabular-nums">
            {TEXTOS_CADENA.momento[nodo.momento]}
            {nodo.declaradaEl && ` · ${fmtFecha(nodo.declaradaEl)}`}
          </li>
        )}
      </ul>
      {nodo.momento === "tras_alerta" && (
        <p data-m="etiqueta-extension" className="mt-auto flex items-center gap-2 border-t border-borde pt-3 text-base font-medium text-verde-texto">
          <CircleCheck size={18} strokeWidth={2.25} aria-hidden className="shrink-0" />
          {TEXTOS_CADENA.extension}
        </p>
      )}
    </article>
  );
}

/** Flecha SVG entre columnas (`<path>` para que la demo anime `pathLength`). */
function Conector({ dataM }: { dataM?: string }) {
  return (
    // Desde 1024 px va en el hueco de 4rem entre columnas, centrada en vertical: todas las tarjetas miden lo mismo de ancho.
    <div
      aria-hidden
      className="flex shrink-0 items-center justify-center text-tinta-2 max-lg:h-12 lg:absolute lg:right-full lg:top-1/2 lg:h-4 lg:w-16 lg:-translate-y-1/2"
    >
      <svg viewBox="0 0 64 16" className="hidden h-4 w-16 lg:block" fill="none">
        <path data-m={dataM} d="M4 8 H58 M51 2 L58 8 L51 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 16 48" className="h-12 w-4 lg:hidden" fill="none">
        <path data-m={dataM} d="M8 4 V42 M2 35 L8 42 L14 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
