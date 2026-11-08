"use client";
import { RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Semaforo } from "@/components/Semaforo";
import { TEXTOS_SIMULADOR } from "@/content/textos";
import { seed } from "@/data";
import { SIMULACION_CASO_PUBLICO, SIMULACION_DEMO, simular, type EntradaSimulacion } from "@/lib/calculo/simular";
import { fmtHoras, fmtNumero, fmtPct, fmtRatio } from "@/lib/formato";
import { dur, ease, s } from "@/lib/motion/tokens";

const ESCENARIOS = [
  { clave: "demo", etiqueta: "Taller de la demo", entrada: SIMULACION_DEMO },
  { clave: "caso", etiqueta: "Caso reconstruido con datos públicos", entrada: SIMULACION_CASO_PUBLICO },
] as const;
type Escenario = (typeof ESCENARIOS)[number]["clave"];

const acotar = (v: number, min: number, max: number) => (Number.isFinite(v) ? Math.round(Math.min(max, Math.max(min, v))) : min);

/** Demo en directo del cálculo: mismas reglas que el panel (lib/calculo/simular). */
export function SimuladorSemaforo({ inicial = SIMULACION_DEMO }: { inicial?: EntradaSimulacion }) {
  const [entrada, setEntrada] = useState(inicial);
  const [escenario, setEscenario] = useState<Escenario | null>(
    () => ESCENARIOS.find((e) => e.entrada === inicial)?.clave ?? null,
  );
  const [tocado, setTocado] = useState(false); // la primera pintura no se anima: el resultado sale del servidor visible
  const reducir = useReducedMotion();
  const id = useId();
  const r = simular(entrada);
  const cuota = entrada.cuotaFacturacionPct ?? 100;
  const T = TEXTOS_SIMULADOR;

  const cargar = (e: EntradaSimulacion) => {
    setTocado(true);
    setEntrada(e);
  };
  const poner = (campo: keyof EntradaSimulacion, min: number, max: number) => (v: number) => {
    setTocado(true);
    setEntrada((e) => ({ ...e, [campo]: acotar(v, min, max) }));
  };

  return (
    <section aria-labelledby={`${id}-titulo`} className="flex flex-col gap-6 rounded-lg border border-borde bg-superficie p-6 shadow-card lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 id={`${id}-titulo`} className="font-serif text-2xl">
            {T.titulo}
          </h3>
          <p className="max-w-[70ch] text-lg text-tinta-2">{T.ayuda}</p>
        </div>
        <button
          type="button"
          onClick={() => cargar(ESCENARIOS.find((e) => e.clave === escenario)?.entrada ?? inicial)}
          className="inline-flex items-center gap-2 rounded-md border border-borde-fuerte bg-superficie px-4 py-2 text-lg font-medium text-tinta transition-transform hover:bg-superficie-2 active:scale-[0.98]"
        >
          <RotateCcw size={18} aria-hidden />
          Restablecer
        </button>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div role="group" aria-label="Escenario" className="flex flex-wrap gap-2">
              {ESCENARIOS.map((e) => (
                <button
                  key={e.clave}
                  type="button"
                  aria-pressed={escenario === e.clave}
                  onClick={() => {
                    setEscenario(e.clave);
                    cargar(e.entrada);
                  }}
                  className={`rounded-md border px-4 py-2 text-base font-medium transition-transform active:scale-[0.98] ${
                    escenario === e.clave
                      ? "border-marca bg-marca text-white hover:bg-marca-hover"
                      : "border-borde-fuerte bg-superficie text-tinta hover:bg-superficie-2"
                  }`}
                >
                  {e.etiqueta}
                </button>
              ))}
            </div>
            {escenario === "caso" && <p className="max-w-[70ch] text-sm text-tinta-2">{T.casoPublico}</p>}
          </div>

          <Control
            id={`${id}-unidades`}
            etiqueta={T.controles.chaquetas}
            valor={entrada.unidades}
            min={0}
            max={3000}
            paso={50}
            conNumero
            onCambio={poner("unidades", 0, 3000)}
          />
          <Control
            id={`${id}-minutos`}
            etiqueta="Minutos por chaqueta"
            valor={entrada.minutosPorPieza}
            min={60}
            max={360}
            paso={10}
            conNumero
            onCambio={poner("minutosPorPieza", 60, 360)}
          />
          <Control
            id={`${id}-personas`}
            etiqueta={T.controles.personas}
            valor={entrada.personasDeAlta}
            min={1}
            max={30}
            paso={1}
            onCambio={poner("personasDeAlta", 1, 30)}
          />
          <Control
            id={`${id}-cuota`}
            etiqueta={T.controles.cuota}
            valor={cuota}
            mostrar={fmtPct(cuota)}
            min={10}
            max={100}
            paso={5}
            onCambio={poner("cuotaFacturacionPct", 10, 100)}
          />

          <p className="text-base text-tinta-2 tabular-nums">
            {fmtNumero(entrada.horasMesPorPersona)} h al mes por persona de alta · ventana de {seed.parametros.mesesVentana} meses
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div aria-live="polite" className="flex flex-col gap-4 rounded-md border border-borde bg-superficie-2 p-6">
            {/* Al cambiar de estado, el resultado entra con un fundido corto (solo opacity/transform). */}
            <motion.div
              key={r.estado}
              initial={tocado && !reducir ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: s(dur.base), ease: [...ease.out] }}
              className="flex flex-col items-start gap-3"
            >
              <Semaforo estado={r.estado} tamano="md" />
              <p className="flex flex-wrap gap-x-2 text-2xl font-semibold tracking-tight text-tinta tabular-nums">
                <span>{fmtHoras(r.horasNecesarias)} necesarias</span>
                <span aria-hidden className="text-tinta-2">·</span>
                <span>{fmtHoras(r.horasDeAlta)} de alta</span>
                <span aria-hidden className="text-tinta-2">·</span>
                <span>{fmtRatio(r.ratio, 1)}</span>
              </p>
            </motion.div>
            {cuota < 100 && (
              <div className="flex flex-col gap-2 border-t border-borde pt-4">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-lg text-tinta tabular-nums">
                  <span>
                    Toda la carga del taller (estimada con la cuota de facturación):{" "}
                    <strong className="font-semibold">{fmtRatio(r.ratioTotalEstimado, 1)}</strong>
                  </span>
                  <Semaforo estado={r.estadoTotalEstimado} tamano="sm" />
                </p>
                <p className="text-sm text-tinta-2">{T.formula}</p>
              </div>
            )}
            {r.micro && (
              <p className="text-base text-tinta-2">
                Taller de {seed.parametros.maxPersonasMicro} personas o menos: el rojo empieza en{" "}
                {fmtRatio(seed.parametros.umbralRojoMicro, 2)}.
              </p>
            )}
          </div>
          <p className="text-sm text-tinta-2">{T.nota}</p>
        </div>
      </div>
    </section>
  );
}

interface ControlProps {
  id: string;
  etiqueta: string;
  valor: number;
  min: number;
  max: number;
  paso: number;
  onCambio: (v: number) => void;
  /** añade un campo numérico editable junto al deslizador */
  conNumero?: boolean;
  /** valor visible si no hay campo numérico (p. ej. «60 %») */
  mostrar?: string;
}

function Control({ id, etiqueta, valor, min, max, paso, onCambio, conNumero = false, mostrar }: ControlProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label id={`${id}-etiqueta`} htmlFor={conNumero ? `${id}-numero` : `${id}-rango`} className="text-lg font-medium text-tinta">
          {etiqueta}
        </label>
        {conNumero ? (
          <input
            id={`${id}-numero`}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={paso}
            value={valor}
            onChange={(e) => onCambio(e.target.valueAsNumber)}
            className="w-28 rounded-md border border-borde-fuerte bg-superficie px-3 py-1.5 text-right text-xl font-semibold tabular-nums text-tinta"
          />
        ) : (
          <output htmlFor={`${id}-rango`} className="text-xl font-semibold tabular-nums text-tinta">
            {mostrar ?? valor}
          </output>
        )}
      </div>
      <input
        id={`${id}-rango`}
        type="range"
        aria-labelledby={`${id}-etiqueta`}
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => onCambio(e.target.valueAsNumber)}
        className="rango"
      />
    </div>
  );
}
