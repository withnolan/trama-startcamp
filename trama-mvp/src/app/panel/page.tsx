import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panel de la marca",
};

export default function PanelPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Panel de la marca</h1>
      <p>
        Pendiente: lista de talleres con semáforo y KPIs de impacto (datos de
        seed.json).
      </p>
      <p>
        <Link href="/taller/ejemplo" className="underline">
          Ver detalle de un taller (placeholder)
        </Link>
      </p>
    </section>
  );
}
