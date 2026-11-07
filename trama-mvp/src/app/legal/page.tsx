import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal y avisos",
};

export default function LegalPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Legal y avisos</h1>
      <p>Pendiente: textos de LEGAL.md.</p>
    </section>
  );
}
