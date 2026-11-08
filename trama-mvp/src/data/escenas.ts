// Datos de /escenas, calculados con la misma librería que el panel (@/lib/calculo).
// «Taller con 4 marcas»: ficticio. «Caso Milán 2025»: reconstrucción anonimizada con cifras públicas de prensa (sin nombres).
import { seed } from "@/data";
import { clasificar } from "@/lib/calculo/semaforo";
import { SIMULACION_CASO_PUBLICO, simular, sumarMarcas } from "@/lib/calculo/simular";

// ---------- Documentos de ejemplo (SIMULADO): de aquí salen las cifras del taller con 4 marcas ----------
export const DOCUMENTOS = {
  /** Informe de plantilla media de trabajadores en alta (Seguridad Social): una cifra agregada, sin nombres. */
  plantillaMedia: 10,
  /** Ficha de costes (escandallo) de la chaqueta de Ordessa: minutos por operación (suman 240). */
  escandallo: [
    { operacion: "Corte", minutos: 20 },
    { operacion: "Costura del cuerpo", minutos: 95 },
    { operacion: "Forro y montaje", minutos: 75 },
    { operacion: "Ojales, botones y remates", minutos: 25 },
    { operacion: "Plancha y control final", minutos: 25 },
  ],
  /** Modelo 347 del taller: importe anual con Ordessa y con el resto de clientes (€). */
  importeOrdessa: 288000,
  importeResto: 672000,
};
const MINUTOS_CHAQUETA = DOCUMENTOS.escandallo.reduce((a, o) => a + o.minutos, 0);
const IMPORTE_TOTAL = DOCUMENTOS.importeOrdessa + DOCUMENTOS.importeResto;

// ---------- Taller con 4 marcas (ficticio) ----------
/** 10 personas × 160 h × 3 meses = 4.800 h de alta en la ventana. */
const TALLER = { personasDeAlta: DOCUMENTOS.plantillaMedia, horasMesPorPersona: 160 };
const CUOTA_PCT = Math.round((100 * DOCUMENTOS.importeOrdessa) / IMPORTE_TOTAL);
const CHAQUETAS_ORDESSA = 480; // en el trimestre
/** Lo único que ve Ordessa: sus pedidos (480 chaquetas × 240 min = 1.920 h) frente a las horas de alta del taller. */
const ORDESSA = simular({ unidades: CHAQUETAS_ORDESSA, minutosPorPieza: MINUTOS_CHAQUETA, ...TALLER });
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
  chaquetasOrdessa: CHAQUETAS_ORDESSA,
  minutosChaqueta: MINUTOS_CHAQUETA,
  horasMesPorPersona: TALLER.horasMesPorPersona,
  /** Si las demás marcas no usan Trama: carga de Ordessa ÷ su parte de la facturación del taller (30 %, del modelo 347). */
  cuotaPct: CUOTA_PCT,
  importeTotal: IMPORTE_TOTAL,
  conCuota: simular({ unidades: CHAQUETAS_ORDESSA, minutosPorPieza: MINUTOS_CHAQUETA, ...TALLER, cuotaFacturacionPct: CUOTA_PCT }),
};

// ---------- Caso Milán 2025 (datos públicos, anonimizado) ----------
const P = seed.parametros;
const CHAQUETAS_ANO = 6000; // lo que entregaba el subproveedor, según su cotitular (prensa)
const PERSONAS_B = 7;
const HORAS_PERSONA_ANO = 1750; // jornada completa ≈ 1.750 h al año
const MINUTOS = SIMULACION_CASO_PUBLICO.minutosPorPieza; // 180: referencia de una fábrica premium (no es un suelo)
const SUELO_INDUSTRIAL = 126; // suelo externo: mínimo industrial de una americana forrada (línea industrial con su eficiencia real)
const NECESARIAS = (CHAQUETAS_ANO * MINUTOS) / 60;
const DE_ALTA_B = PERSONAS_B * HORAS_PERSONA_ANO;

export const ESCENA_CASO_MILAN = {
  chaquetasAno: CHAQUETAS_ANO,
  minutos: MINUTOS,
  necesarias: NECESARIAS,
  personasB: PERSONAS_B,
  horasPersonaAno: HORAS_PERSONA_ANO,
  deAltaB: DE_ALTA_B,
  /** Proveedor A sin taller propio: 0 h de producción propia → ratio ∞ → rojo siempre, con cualquier minutaje. */
  proveedorA: clasificar(NECESARIAS, 0, false, P),
  subproveedorB: clasificar(NECESARIAS, DE_ALTA_B, PERSONAS_B <= P.maxPersonasMicro, P),
  /** El mismo subproveedor con el suelo externo (mínimo industrial). */
  suelo: SUELO_INDUSTRIAL,
  conSuelo: clasificar((CHAQUETAS_ANO * SUELO_INDUSTRIAL) / 60, DE_ALTA_B, PERSONAS_B <= P.maxPersonasMicro, P),
  /** Minutos por chaqueta desde los que B sale rojo con 6.000 al año: umbral rojo × horas de alta ÷ chaquetas. */
  minutosRojo: Math.round((P.umbralRojo * DE_ALTA_B * 60) / CHAQUETAS_ANO),
};
