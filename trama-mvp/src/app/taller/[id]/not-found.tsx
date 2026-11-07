import Link from "next/link";
import { TEXTOS_TALLER } from "@/content/textos";

// DESIGN §3: id inexistente → notFound().
export default function TallerNoEncontrado() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="font-serif text-3xl font-semibold text-tinta">{TEXTOS_TALLER.noEncontrado.titulo}</h1>
      <Link
        href="/panel"
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-marca px-6 py-3 font-semibold text-white transition-colors hover:bg-marca-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca"
      >
        {TEXTOS_TALLER.noEncontrado.accion}
      </Link>
    </div>
  );
}
