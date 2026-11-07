import Link from "next/link";
import { AvisoDatosFicticios } from "@/components/AvisoDatosFicticios";
import { TEXTOS_ENTRADA } from "@/content/textos";

// DESIGN §3 «/ — Entrada»: entrar con un clic.
export default function Inicio() {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg border border-borde bg-superficie p-8 text-center shadow-card">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-semibold text-tinta">{TEXTOS_ENTRADA.titulo}</h1>
          <p className="text-lg text-tinta-2">{TEXTOS_ENTRADA.subtitulo}</p>
        </div>
        {/* Navega: es un <a> con aspecto de botón primario. */}
        <Link
          href="/panel"
          autoFocus
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-marca px-6 py-3 font-semibold text-white transition-colors hover:bg-marca-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca active:scale-[0.98]"
        >
          {TEXTOS_ENTRADA.boton}
        </Link>
        <p className="text-sm text-tinta-2">{TEXTOS_ENTRADA.nota}</p>
        <AvisoDatosFicticios variante="compacto" />
      </div>
    </div>
  );
}
