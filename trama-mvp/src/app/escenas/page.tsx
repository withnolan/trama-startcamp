import { EyeOff, FileSearch, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/Badge";
import { ChainDiagram } from "@/components/ChainDiagram";
import { Semaforo } from "@/components/Semaforo";
import { TEXTOS_ESCENAS } from "@/content/textos";
import { seed } from "@/data";
import { ESCENA_CASO_MILAN, ESCENA_CUATRO_MARCAS } from "@/data/escenas";
import { MIN_MARCAS_SUMA } from "@/lib/calculo/simular";
import type { NodoCadena } from "@/lib/calculo/tipos";
import { fmtHoras, fmtNumero, fmtPct, fmtRatio } from "@/lib/formato";

export const metadata: Metadata = { title: TEXTOS_ESCENAS.titulo, description: TEXTOS_ESCENAS.entradilla };

const T = TEXTOS_ESCENAS;
const P = seed.parametros;
const TARJETA = "rounded-lg border border-borde bg-superficie p-6 shadow-card";
const ETIQUETA = "text-sm font-medium uppercase tracking-[0.08em] text-tinta-2";
const ENLACE =
  "text-marca underline underline-offset-4 hover:text-marca-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca";
// Sin subnav en esta página: el ancla solo salva la cabecera pegajosa (nav + aviso).
const SECCION = "flex scroll-mt-28 flex-col gap-6";

export default function EscenasPage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Cabecera en una sola fila: al entrar desde la nav, la escena de las 4 marcas se ve entera a 1280×720. */}
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <h1 className="font-serif text-3xl font-semibold text-tinta">{T.titulo}</h1>
        <nav aria-label={T.indiceAria}>
          <ol className="flex flex-wrap gap-2">
            {[
              { href: "#cuatro-marcas", texto: T.cuatroMarcas.titulo },
              { href: "#caso-milan", texto: T.casoMilan.corto },
            ].map((a, i) => (
              <li key={a.href}>
                <a
                  href={a.href}
                  className="block rounded-md border border-borde-fuerte bg-superficie px-4 py-2 font-medium text-tinta hover:bg-superficie-2"
                >
                  {i + 1} · {a.texto}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </header>
      <CuatroMarcas />
      <CasoMilan />
    </div>
  );
}

// ---------- Taller con 4 marcas: verde con cada una, rojo al sumar ----------
const ESCALA = 1.5; // eje de 0 a 1,5×: caben la suma (1,30×) y los dos límites
const pos = (r: number) => `${(Math.min(r, ESCALA) / ESCALA) * 100}%`;

/** Pista de una fila con los límites ámbar y rojo como líneas discontinuas (decorativa: las cifras van en la tabla). */
function Pista({ alta = false, children }: { alta?: boolean; children: ReactNode }) {
  return (
    <div aria-hidden className={`relative rounded-full bg-superficie ${alta ? "h-5" : "h-3"}`}>
      {children}
      <span className="absolute -inset-y-1.5 border-l-2 border-dashed border-ambar-grafico" style={{ left: pos(P.umbralVerde) }} />
      <span className="absolute -inset-y-1.5 border-l-2 border-dashed border-rojo-grafico" style={{ left: pos(P.umbralRojo) }} />
    </div>
  );
}

function CuatroMarcas() {
  const e = ESCENA_CUATRO_MARCAS;
  const C = T.cuatroMarcas;
  const celda = "py-2 align-middle";
  return (
    <section id="cuatro-marcas" aria-labelledby="titulo-cuatro-marcas" className={SECCION}>
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="titulo-cuatro-marcas" className="font-serif text-2xl font-semibold text-tinta">
            {C.titulo}
          </h2>
          <Badge variante="neutro">{C.datos}</Badge>
        </div>
        <p className="text-lg text-tinta">{C.resumen}</p>
        <p className="text-tinta-2 tabular-nums">{C.taller(e.taller, fmtNumero(e.personas), fmtHoras(e.ordessa.horasDeAlta))}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <article aria-labelledby="titulo-ve-ordessa" className={`${TARJETA} flex flex-col gap-4 lg:col-span-4`}>
          <header className="flex flex-col gap-1">
            <p className={ETIQUETA}>{C.marca.etiqueta}</p>
            <h3 id="titulo-ve-ordessa" className="text-xl font-semibold text-tinta">
              {C.marca.titulo}
            </h3>
          </header>
          <div className="flex flex-wrap items-center gap-4">
            <Semaforo estado={e.ordessa.estado} tamano="lg" />
            <p className="text-3xl font-semibold tracking-tight text-tinta tabular-nums">{fmtRatio(e.ordessa.ratio, 2)}</p>
          </div>
          <p className="text-tinta-2 tabular-nums">{C.marca.cifras(fmtHoras(e.ordessa.horasNecesarias), fmtHoras(e.ordessa.horasDeAlta))}</p>
          {e.revisionAbierta && (
            <div className="flex gap-3 rounded-md border-l-4 border-marca bg-marca-suave p-4">
              <FileSearch size={22} aria-hidden className="mt-0.5 shrink-0 text-marca" />
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-tinta">{C.marca.revision}</p>
                <p className="text-tinta">{C.marca.revisionTexto}</p>
              </div>
            </div>
          )}
          <p className="mt-auto flex gap-2 text-sm text-tinta-2">
            <EyeOff size={16} aria-hidden className="mt-0.5 shrink-0" />
            {C.marca.noVe}
          </p>
        </article>

        <article
          aria-labelledby="titulo-tercero"
          className="flex flex-col gap-4 rounded-lg border-2 border-dashed border-borde-fuerte bg-superficie-2 p-6 lg:col-span-8"
        >
          <header className="flex flex-col gap-1">
            <p className={`${ETIQUETA} flex items-center gap-2`}>
              <Lock size={14} aria-hidden className="shrink-0" />
              {C.tercero.etiqueta}
            </p>
            <h3 id="titulo-tercero" className="text-xl font-semibold text-tinta">
              {C.tercero.titulo}
            </h3>
          </header>
          <table className="w-full border-collapse text-left tabular-nums">
            <caption className="sr-only">{C.tercero.caption}</caption>
            <thead className="text-sm text-tinta-2">
              <tr>
                <th scope="col" className="pb-1 pr-4 font-medium">
                  {C.tercero.columnas.marca}
                </th>
                <th scope="col" className="w-full pb-1 font-medium">
                  {C.tercero.columnas.barra}
                </th>
                <th scope="col" className="pb-1 pl-4 text-right font-medium">
                  {C.tercero.columnas.ratio}
                </th>
                <th scope="col" className="pb-1 pl-4 font-medium">
                  {C.tercero.columnas.estado}
                </th>
              </tr>
            </thead>
            <tbody>
              {e.marcas.map((m) => (
                <tr key={m.nombre}>
                  <th scope="row" className={`${celda} whitespace-nowrap pr-4 font-medium text-tinta`}>
                    {m.nombre}
                  </th>
                  <td className={celda}>
                    <Pista>
                      <span className="absolute inset-y-0 left-0 rounded-full bg-verde-grafico" style={{ width: pos(m.ratio ?? 0) }} />
                    </Pista>
                  </td>
                  <td className={`${celda} pl-4 text-right text-lg font-semibold text-tinta`}>{fmtRatio(m.ratio, 2)}</td>
                  <td className={`${celda} pl-4`}>
                    <Semaforo estado={m.estado} tamano="sm" />
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-borde-fuerte">
                <th scope="row" className={`${celda} whitespace-nowrap pr-4 pt-4 font-semibold text-tinta`}>
                  {C.tercero.suma(fmtNumero(e.marcas.length))}
                </th>
                <td className={`${celda} pt-4`}>
                  <Pista alta>
                    {/* La suma: los cuatro tramos, uno tras otro. */}
                    <span className="absolute inset-y-0 left-0 flex overflow-hidden rounded-full" style={{ width: pos(e.conjunta.ratio ?? ESCALA) }}>
                      {e.marcas.map((m) => (
                        <span
                          key={m.nombre}
                          className="h-full border-r-2 border-superficie bg-rojo-grafico last:border-r-0"
                          style={{ width: `${(m.horas / e.conjunta.horas) * 100}%` }}
                        />
                      ))}
                    </span>
                  </Pista>
                </td>
                <td className={`${celda} pl-4 pt-4 text-right text-2xl font-semibold text-rojo-texto`}>{fmtRatio(e.conjunta.ratio, 2)}</td>
                <td className={`${celda} pl-4 pt-4`}>
                  <Semaforo estado={e.conjunta.estado} tamano="sm" />
                </td>
              </tr>
            </tbody>
          </table>
          <p aria-hidden className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-tinta-2 tabular-nums">
            <span className="flex items-center gap-2">
              <span className="h-4 border-l-2 border-dashed border-ambar-grafico" />
              {C.tercero.limiteAmbar(fmtRatio(P.umbralVerde, 2))}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 border-l-2 border-dashed border-rojo-grafico" />
              {C.tercero.limiteRojo(fmtRatio(P.umbralRojo, 2))}
            </span>
          </p>
          <p className="text-tinta tabular-nums">{C.tercero.pie(fmtHoras(e.conjunta.horas), fmtHoras(e.ordessa.horasDeAlta))}</p>
        </article>
      </div>

      <ul aria-label={C.salvaguardasAria} className="grid gap-4 lg:grid-cols-3">
        <li className={`${TARJETA} flex flex-col gap-2`}>
          <h3 className="text-lg font-semibold text-tinta">{C.minimo.titulo(fmtNumero(MIN_MARCAS_SUMA))}</h3>
          <p className="text-tinta-2">{C.minimo.texto(fmtNumero(MIN_MARCAS_SUMA))}</p>
        </li>
        <li className={`${TARJETA} flex flex-col gap-2`}>
          <h3 className="text-lg font-semibold text-tinta">{C.mismoAviso.titulo}</h3>
          <p className="text-tinta-2">{C.mismoAviso.texto}</p>
        </li>
        <li className={`${TARJETA} flex flex-col gap-2`}>
          <h3 className="text-lg font-semibold text-tinta">{C.cuota.titulo}</h3>
          <p className="text-tinta-2 tabular-nums">
            {C.cuota.texto(
              fmtPct(e.cuotaPct),
              fmtNumero(e.conCuota.ratio ?? 0, 2),
              fmtNumero(e.cuotaPct / 100, 2),
              fmtRatio(e.conCuota.ratioTotalEstimado, 2),
            )}{" "}
            <Link href={C.cuota.href} className={ENLACE}>
              {C.cuota.enlace}
            </Link>
          </p>
        </li>
      </ul>
    </section>
  );
}

// ---------- Caso Milán 2025: proveedor sin taller → subproveedor de 7 personas ----------
function CasoMilan() {
  const e = ESCENA_CASO_MILAN;
  const M = T.casoMilan;
  const nodos: NodoCadena[] = [
    { id: "M", nombre: M.nodos.marca, tipo: "marca", nivel: 0, padreId: null },
    { id: "A", nombre: M.nodos.proveedor, tipo: "proveedor", nivel: 1, padreId: "M", estado: e.proveedorA.estado },
    { id: "B", nombre: M.nodos.subproveedor, tipo: "subcontrata", nivel: 2, padreId: "A", plantilla: e.personasB, estado: e.subproveedorB.estado },
  ];
  const necesarias = fmtHoras(e.necesarias);
  const cifra = "text-kpi font-semibold leading-none tracking-tight tabular-nums";
  return (
    <section id="caso-milan" aria-labelledby="titulo-caso-milan" className={SECCION}>
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="titulo-caso-milan" className="font-serif text-2xl font-semibold text-tinta">
            {M.titulo}
          </h2>
          <Badge variante="marca">{M.rotulo}</Badge>
        </div>
        <p className="text-lg text-tinta">{M.resumen}</p>
      </header>

      <ChainDiagram nodos={nodos} />

      {/* Una columna bajo cada eslabón de la cadena (mismo reparto: 3 columnas y 4rem de hueco). */}
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-16">
        <div className={`${TARJETA} flex flex-col gap-2`}>
          <p className={ETIQUETA}>{M.pedidos.titulo}</p>
          <p className="text-xl font-semibold text-tinta tabular-nums">{M.pedidos.unidades(fmtNumero(e.chaquetasAno))}</p>
          <p className="text-lg text-tinta tabular-nums">{M.pedidos.horas(fmtNumero(e.minutos), necesarias)}</p>
          <p className="text-sm text-tinta-2">
            {M.pedidos.unidadesNota} {M.pedidos.minutosNota(fmtNumero(e.minutos))}
          </p>
        </div>
        <div className={`${TARJETA} flex flex-col gap-2`}>
          <p className={ETIQUETA}>{M.proveedor.titulo}</p>
          <p className={`${cifra} text-rojo-texto`}>{fmtRatio(e.proveedorA.ratio, 2)}</p>
          <p className="text-lg text-tinta tabular-nums">{M.proveedor.texto(necesarias)}</p>
          <p className="font-medium text-rojo-texto">{M.proveedor.conclusion}</p>
        </div>
        <div className={`${TARJETA} flex flex-col gap-2`}>
          <p className={ETIQUETA}>{M.subproveedor.titulo(fmtNumero(e.personasB))}</p>
          <p className={`${cifra} text-rojo-texto`}>{fmtRatio(e.subproveedorB.ratio, 2)}</p>
          <p className="text-lg text-tinta tabular-nums">
            {M.subproveedor.texto(necesarias, fmtHoras(e.deAltaB), fmtNumero(e.personasB), fmtHoras(e.horasPersonaAno))}
          </p>
          <p className="font-medium text-rojo-texto">{M.subproveedor.conclusion(fmtRatio(P.umbralRojo, 2))}</p>
          <p className="text-sm text-tinta-2 tabular-nums">{M.umbral(fmtNumero(e.minutosRojo), fmtNumero(e.chaquetasAno))}</p>
        </div>
      </div>

      <p className="border-l-4 border-borde-fuerte pl-4 text-sm text-tinta-2">{M.nota}</p>
    </section>
  );
}
