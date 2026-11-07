// Render común de /como-calculamos y /legal (forma PaginaTexto). Carpeta privada: no es una ruta.
import { Fragment, type ReactNode } from "react";
import type { PaginaTexto } from "@/content/tipos";

const ENLACE =
  "text-marca underline underline-offset-4 hover:text-marca-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca";

/** `despues`: bloques que se pintan tras la sección con ese id (p. ej. el simulador en /como-calculamos). */
export function PaginaTextoVista({ pagina, despues = {} }: { pagina: PaginaTexto; despues?: Record<string, ReactNode> }) {
  const indice = [
    ...pagina.secciones.map((s) => ({ id: s.id, titulo: s.titulo })),
    ...(pagina.fuentes?.length ? [{ id: "fuentes", titulo: "Fuentes" }] : []),
  ];

  return (
    <article className="mx-auto flex w-full max-w-[720px] flex-col gap-8 text-base text-tinta">
      <header className="flex flex-col gap-4">
        <h1 className="font-serif text-3xl font-semibold">{pagina.titulo}</h1>
        <p className="text-lg text-tinta-2">{pagina.entradilla}</p>
      </header>

      {indice.length > 0 && (
        <nav aria-labelledby="indice-titulo" className="rounded-lg border border-borde bg-superficie p-6">
          <h2 id="indice-titulo" className="text-sm font-semibold uppercase tracking-wide text-tinta-2">
            En esta página
          </h2>
          <ol className="mt-3 flex list-decimal flex-col gap-1 pl-5">
            {indice.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={ENLACE}>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {pagina.secciones.map((s) => (
        <Fragment key={s.id}>
          <section id={s.id} aria-labelledby={`${s.id}-titulo`} className="flex flex-col gap-4">
            <h2 id={`${s.id}-titulo`} className="font-serif text-2xl font-semibold">
              {s.titulo}
            </h2>
            {s.parrafos.map((p, i) => (
              <p key={i} className="leading-7">
                {p}
              </p>
            ))}
            {s.lista && (
              <ul className="flex list-disc flex-col gap-2 pl-6 leading-7">
                {s.lista.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {s.tabla && (
              <div className="overflow-x-auto rounded-lg border border-borde bg-superficie">
                <table className="w-full border-collapse text-left tabular-nums">
                  <caption className="sr-only">{s.titulo}</caption>
                  <thead className="bg-superficie-2">
                    <tr>
                      {s.tabla.cabecera.map((c, i) => (
                        <th key={i} scope="col" className="px-4 py-3 text-sm font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.tabla.filas.map((fila, f) => (
                      <tr key={f} className="border-t border-borde">
                        {fila.map((celda, i) =>
                          i === 0 ? (
                            <th key={i} scope="row" className="px-4 py-3 font-medium">
                              {celda}
                            </th>
                          ) : (
                            <td key={i} className="px-4 py-3">
                              {celda}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {s.tabla.pie && <p className="border-t border-borde px-4 py-3 text-sm text-tinta-2">{s.tabla.pie}</p>}
              </div>
            )}
            {s.nota && <p className="border-l-4 border-borde-fuerte pl-4 text-sm text-tinta-2">{s.nota}</p>}
          </section>
          {despues[s.id]}
        </Fragment>
      ))}

      {pagina.fuentes?.length ? (
        <section id="fuentes" aria-labelledby="fuentes-titulo" className="flex flex-col gap-4">
          <h2 id="fuentes-titulo" className="font-serif text-2xl font-semibold">
            Fuentes
          </h2>
          <ul className="flex list-disc flex-col gap-2 pl-6">
            {pagina.fuentes.map((f, i) => (
              <li key={i}>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className={ENLACE}>
                  {f.texto}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pagina.aviso && <p className="border-t border-borde pt-4 text-sm text-tinta-2">{pagina.aviso}</p>}
    </article>
  );
}
