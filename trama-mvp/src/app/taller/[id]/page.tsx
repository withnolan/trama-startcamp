import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Detalle de taller",
};

const SECCIONES_PENDIENTES = [
  "Horas necesarias vs. horas cotizadas",
  "Cadena y subcontratas",
  "Plan de corrección",
  "Protección de trabajadores",
];

// Con Cache Components, leer `params` sin generateStaticParams es dato de
// ejecución: va dentro de <Suspense>. Cuando exista seed.json se añadirá
// generateStaticParams con los identificadores de los talleres.
export default function TallerPage({ params }: PageProps<"/taller/[id]">) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Detalle de taller</h1>
      <Suspense fallback={<p>Cargando taller…</p>}>
        <IdentificadorTaller params={params} />
      </Suspense>
      <ul className="list-disc pl-6">
        {SECCIONES_PENDIENTES.map((seccion) => (
          <li key={seccion}>{seccion} (pendiente)</li>
        ))}
      </ul>
    </section>
  );
}

async function IdentificadorTaller({
  params,
}: Pick<PageProps<"/taller/[id]">, "params">) {
  const { id } = await params;
  return (
    <p>
      Taller: <code className="font-mono">{id}</code>
    </p>
  );
}
