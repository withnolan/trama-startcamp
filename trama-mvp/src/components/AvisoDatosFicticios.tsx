import { Info } from "lucide-react";
import { AVISO_DEMO } from "@/content/textos";

export function AvisoDatosFicticios({ variante = "banda" }: { variante?: "banda" | "compacto" }) {
  if (variante === "compacto") {
    return (
      <p
        role="note"
        className="inline-flex items-center gap-2 rounded-md border border-borde bg-superficie-2 px-3 py-1.5 text-sm text-tinta-2"
      >
        <Info size={16} aria-hidden className="shrink-0" />
        {AVISO_DEMO.compacto}
      </p>
    );
  }
  return (
    <p
      role="note"
      className="flex h-(--alto-aviso) items-center justify-center gap-2 overflow-hidden border-b border-borde bg-superficie-2 px-4 text-sm text-tinta-2"
    >
      <Info size={15} aria-hidden className="shrink-0" />
      <span className="truncate md:hidden">{AVISO_DEMO.compacto}</span>
      <span className="hidden truncate md:inline">{AVISO_DEMO.banda}</span>
    </p>
  );
}
