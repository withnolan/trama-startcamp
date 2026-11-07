/** Simulador en directo (navegador): mismas reglas que el semáforo, con entradas a mano. */
import { seed } from "@/data";
import { clasificar } from "./semaforo";
import type { EstadoSemaforo, Seed } from "./tipos";

export interface EntradaSimulacion {
  unidades: number;             // unidades en la ventana de 3 meses
  minutosPorPieza: number;      // minutos estándar
  personasDeAlta: number;       // trabajadores + titulares
  horasMesPorPersona: number;   // jornada mensual por persona (160 por defecto)
  cuotaFacturacionPct?: number; // 1-100: parte de la facturación del taller que es de esta marca (100 por defecto)
}

export interface ResultadoSimulacion {
  horasNecesarias: number;
  horasDeAlta: number;
  ratio: number | null;
  estado: EstadoSemaforo;
  micro: boolean;
  cargaTotalEstimada: number; // horasNecesarias / (cuota/100)
  ratioTotalEstimado: number | null;
  estadoTotalEstimado: EstadoSemaforo;
}

/** T1 en la alerta: 2.000 chaquetas × 240 min frente a 7 personas × 160 h × 3 meses → 8.000 / 3.360 = 2,381 rojo. */
export const SIMULACION_DEMO: EntradaSimulacion = {
  unidades: 2000,
  minutosPorPieza: 240,
  personasDeAlta: 7,
  horasMesPorPersona: 160,
  cuotaFacturacionPct: 100,
};

/**
 * Reconstrucción anonimizada de un caso público de prensa: subproveedor con 7 personas que entregaba 6.000-7.000 chaquetas/año (≈1.750 h/persona/año).
 * 180 min por chaqueta: lo que declara un taller premium (estimación con fuente pública, investigacion/minutos_chaqueta.md). T1 sigue en 240: es ficticio.
 */
export const SIMULACION_CASO_PUBLICO: EntradaSimulacion = {
  unidades: 1500,
  minutosPorPieza: 180,
  personasDeAlta: 7,
  horasMesPorPersona: 146,
  cuotaFacturacionPct: 100,
};

// Entrada de un formulario: vacío, NaN o negativo cuentan 0.
const num = (x: number) => (Number.isFinite(x) && x > 0 ? x : 0);

export function simular(e: EntradaSimulacion, parametros: Seed["parametros"] = seed.parametros): ResultadoSimulacion {
  const horasNecesarias = (num(e.unidades) * num(e.minutosPorPieza)) / 60;
  const personas = num(e.personasDeAlta);
  const horasDeAlta = personas * num(e.horasMesPorPersona) * parametros.mesesVentana;
  const micro = personas <= parametros.maxPersonasMicro;
  const cuota = Number.isFinite(e.cuotaFacturacionPct) ? Math.min(100, Math.max(1, e.cuotaFacturacionPct!)) : 100;
  // Cota inferior de la carga total del taller si esta marca paga por hora al menos lo mismo que las demás.
  const cargaTotalEstimada = (horasNecesarias * 100) / cuota;
  const propio = clasificar(horasNecesarias, horasDeAlta, micro, parametros);
  const total = clasificar(cargaTotalEstimada, horasDeAlta, micro, parametros);
  return {
    horasNecesarias,
    horasDeAlta,
    ratio: propio.ratio,
    estado: propio.estado,
    micro,
    cargaTotalEstimada,
    ratioTotalEstimado: total.ratio,
    estadoTotalEstimado: total.estado,
  };
}

/** Competencia (investigacion/encaje_legal.md): la suma de las marcas solo abre revisión si al menos 3 usan Trama; con menos, solo la ven el taller y el revisor. Criterio de diseño, no cifra legal. */
export const MIN_MARCAS_SUMA = 3;

/**
 * Taller con varias marcas: cada marca, su semáforo con sus pedidos; Trama, como tercero, suma las cargas.
 * A ninguna marca le llega la suma: solo «revisión abierta» si el conjunto sale rojo.
 */
export function sumarMarcas(horasPorMarca: number[], horasDeAlta: number, micro = false, parametros: Seed["parametros"] = seed.parametros) {
  const porMarca = horasPorMarca.map((h) => clasificar(h, horasDeAlta, micro, parametros));
  const horas = horasPorMarca.reduce((a, h) => a + h, 0);
  const conjunta = horasPorMarca.length >= MIN_MARCAS_SUMA ? { horas, ...clasificar(horas, horasDeAlta, micro, parametros) } : null;
  return { porMarca, conjunta, revisionAbierta: conjunta?.estado === "rojo" };
}
