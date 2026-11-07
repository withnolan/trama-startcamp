// Datos de /escenas, calculados con la misma librería que el panel (@/lib/calculo).
// «Taller con 4 marcas»: ficticio. «Caso Milán 2025»: reconstrucción anonimizada con cifras públicas de prensa (sin nombres).
import { seed } from "@/data";
import { clasificar } from "@/lib/calculo/semaforo";
import { SIMULACION_CASO_PUBLICO, simular, sumarMarcas } from "@/lib/calculo/simular";

// ---------- Taller con 4 marcas (ficticio) ----------
/** 10 personas × 160 h × 3 meses = 4.800 h de alta en la ventana. */
const TALLER = { personasDeAlta: 10, horasMesPorPersona: 160 };
/** Lo único que ve Ordessa: sus pedidos (480 chaquetas × 240 min = 1.920 h) frente a las horas de alta del taller. */
const ORDESSA = simular({ unidades: 480, minutosPorPieza: 240, ...TALLER });
const MARCAS = [
  { nombre: seed.marca.nombre, horas: ORDESSA.horasNecesarias },
  { nombre: "Marca B (ficticia)", horas: 1680 },
  { nombre: "Marca C (ficticia)", horas: 1440 },
  { nombre: "Marca D (ficticia)", horas: 1200 },
];
const SUMA = sumarMarcas(
  MARCAS.map((m) => m.horas),
  ORDESSA.horasDeAlta,
  ORDESSA.micro,
);

export const ESCENA_CUATRO_MARCAS = {
  taller: "Laboratorio Ligustro (ficticio)",
  personas: TALLER.personasDeAlta,
  ordessa: ORDESSA,
  marcas: MARCAS.map((m, i) => ({ ...m, ...SUMA.porMarca[i] })),
  conjunta: SUMA.conjunta!,
  revisionAbierta: SUMA.revisionAbierta,
  /** Si las demás marcas no usan Trama: carga de Ordessa ÷ su parte de la facturación del taller (30 %). */
  cuotaPct: 30,
  conCuota: simular({ unidades: 480, minutosPorPieza: 240, ...TALLER, cuotaFacturacionPct: 30 }),
};

// ---------- Caso Milán 2025 (datos públicos, anonimizado) ----------
const P = seed.parametros;
const CHAQUETAS_ANO = 6000; // lo que entregaba el subproveedor, según su cotitular (prensa)
const PERSONAS_B = 7;
const HORAS_PERSONA_ANO = 1750; // jornada completa ≈ 1.750 h al año
const MINUTOS = SIMULACION_CASO_PUBLICO.minutosPorPieza; // 180: estimación con fuente pública
const NECESARIAS = (CHAQUETAS_ANO * MINUTOS) / 60;
const DE_ALTA_B = PERSONAS_B * HORAS_PERSONA_ANO;

export const ESCENA_CASO_MILAN = {
  chaquetasAno: CHAQUETAS_ANO,
  minutos: MINUTOS,
  necesarias: NECESARIAS,
  personasB: PERSONAS_B,
  horasPersonaAno: HORAS_PERSONA_ANO,
  deAltaB: DE_ALTA_B,
  /** Proveedor A sin taller propio: 0 personas de alta → 0 h → ratio ∞ → rojo desde el primer pedido. */
  proveedorA: clasificar(NECESARIAS, 0, false, P),
  subproveedorB: clasificar(NECESARIAS, DE_ALTA_B, PERSONAS_B <= P.maxPersonasMicro, P),
  /** Minutos por chaqueta desde los que B sale rojo con 6.000 al año: umbral rojo × horas de alta ÷ chaquetas. */
  minutosRojo: Math.round((P.umbralRojo * DE_ALTA_B * 60) / CHAQUETAS_ANO),
};
