import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo calculamos",
};

export default function ComoCalculamosPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Cómo calculamos</h1>
      <p>
        Pendiente: explicación de la carga mínima, las horas cotizadas, la
        ventana móvil de 3 meses y el semáforo.
      </p>
    </section>
  );
}
