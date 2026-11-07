import { NOTA_ESTADO } from "@/content/textos";
import type { EstadoSemaforo } from "@/lib/calculo/tipos";

const BORDE: Record<EstadoSemaforo, string> = {
  verde: "border-l-verde-grafico",
  ambar: "border-l-ambar-grafico",
  rojo: "border-l-rojo-grafico",
  sin_datos: "border-l-borde-fuerte",
};

export function NotaAlerta({ estado }: { estado: EstadoSemaforo }) {
  const { titulo, texto } = NOTA_ESTADO[estado];
  return (
    <div
      role="note"
      className={`rounded-r-lg border border-l-4 border-borde bg-superficie px-6 py-5 text-lg text-tinta ${BORDE[estado]}`}
    >
      <p className="max-w-[68ch]">
        <strong className="font-semibold">{titulo}</strong> {texto}
      </p>
    </div>
  );
}
