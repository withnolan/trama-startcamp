import type { Metadata } from "next";
import { SimuladorSemaforo } from "@/components/SimuladorSemaforo";
import { COMO_CALCULAMOS } from "@/content/como-calculamos";
import { PaginaTextoVista } from "../_texto/PaginaTextoVista";

export const metadata: Metadata = { title: COMO_CALCULAMOS.titulo };

export default function ComoCalculamosPage() {
  return (
    <PaginaTextoVista
      pagina={COMO_CALCULAMOS}
      despues={{
        // El simulador va tras el caso reconstruido con datos públicos (que sigue al ejemplo de la demo).
        "caso-publico": (
          <div id="simulador" data-m="seccion-simulador">
            <SimuladorSemaforo />
          </div>
        ),
      }}
    />
  );
}
