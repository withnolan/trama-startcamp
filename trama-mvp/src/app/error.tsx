"use client";
import { TEXTOS_PANEL } from "@/content/textos";

// DESIGN §3 «/panel», estado de error. Atrapa fallos de render para que la demo no enseñe una pantalla rota.
export default function ErrorDemo({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="font-serif text-3xl font-semibold text-tinta">{TEXTOS_PANEL.error}</h1>
      <button
        type="button"
        onClick={retry}
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-marca px-6 py-3 font-semibold text-white transition-colors hover:bg-marca-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca"
      >
        Reintentar
      </button>
    </div>
  );
}
