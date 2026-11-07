import type { Metadata } from "next";
import { LEGAL } from "@/content/legal";
import { PaginaTextoVista } from "../_texto/PaginaTextoVista";

export const metadata: Metadata = { title: LEGAL.titulo };

export default function LegalPage() {
  return <PaginaTextoVista pagina={LEGAL} />;
}
