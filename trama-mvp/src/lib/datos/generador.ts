/**
 * Generador SINTÉTICO de los archivos que «llegan» a Trama y de su verdad oculta. Función pura y determinista.
 * Los datos de talleres, pedidos y plantillas son inventados; solo se calibran con parámetros públicos reales
 * (tamaño de empresa del INE y jornada de convenio del BOE).
 */
import { sumarMeses } from "../calculo/semaforo.ts";
import type { ISODate, Mes } from "../calculo/tipos.ts";
import {
  ARQUETIPOS_PROBLEMA,
  CABECERAS,
  type Arquetipo,
  type ArchivosCrudos,
  type Escenario,
  type FilaInformeES,
  type FilaPedido,
  type FilaTaller,
  type ParametrosPublicos,
  type TramoAsalariados,
  type Verdad,
  type VerdadTaller,
} from "./contratos.ts";
import { aCsv } from "./csv.ts";
import { horasMesConvenio } from "./parametros.ts";
import { crearRng, type Rng } from "./prng.ts";

export const VERSION_GENERADOR = "n1.0";

/** Catálogo de piezas de marroquinería con minutos de escandallo SINTÉTICOS (estimación de demo, sin suelo publicado). */
export const CATALOGO_PIEZAS = [
  { id: "TP-BOLSO-ESTR", nombre: "Bolso estructurado", minutos: 360 },
  { id: "TP-BOLSO-TOTE", nombre: "Bolso tote", minutos: 180 },
  { id: "TP-CARTERA", nombre: "Cartera", minutos: 90 },
  { id: "TP-CINTURON", nombre: "Cinturón", minutos: 45 },
  { id: "TP-TARJETERO", nombre: "Tarjetero", minutos: 40 },
] as const;

/** Ciudades reales de distritos de la piel y el calzado en España (las ciudades sí pueden ser reales). */
const CIUDADES_ES = [
  { ciudad: "Ubrique", provincia: "Cádiz" },
  { ciudad: "Elche", provincia: "Alicante" },
  { ciudad: "Elda", provincia: "Alicante" },
  { ciudad: "Petrer", provincia: "Alicante" },
  { ciudad: "Igualada", provincia: "Barcelona" },
  { ciudad: "Arnedo", provincia: "La Rioja" },
  { ciudad: "Almansa", provincia: "Albacete" },
  { ciudad: "Valverde del Camino", provincia: "Huelva" },
] as const;

const OFICIOS = ["Marroquinería", "Artículos de Piel", "Taller de Piel", "Manufacturas", "Peletería"] as const;
// Aves y plantas; se evitan las que ya usa la demo (Lince, Bagolaro, Alcotán, Almendro, Ontano, Lentisco).
const NOMBRES = [
  "Abubilla", "Cárabo", "Torcaz", "Mirlo", "Vencejo", "Majuelo", "Torvisco", "Aladierno", "Madroño", "Cornicabra",
  "Acebuche", "Retama", "Jara", "Brezo", "Sabina", "Aliso", "Fresno", "Serbal", "Arrayán", "Escaramujo",
  "Avellano", "Quejigo", "Rebollo", "Coscoja", "Taray", "Alcaudón", "Oropéndola", "Herrerillo", "Carbonero", "Petirrojo",
] as const;

const TRAMOS: Record<TramoAsalariados, [number, number]> = {
  "1-2": [1, 2], "3-5": [3, 5], "6-9": [6, 9], "10-19": [10, 19], "20-49": [20, 49],
};

export interface SalidaGenerador {
  archivos: ArchivosCrudos;
  verdad: Verdad;
}

const ultimoDia = (m: Mes): number => {
  const sig = sumarMeses(m, 1);
  return new Date(Date.UTC(+sig.slice(0, 4), +sig.slice(5, 7) - 1, 0)).getUTCDate();
};
const fecha = (m: Mes, d: number): ISODate => `${m}-${String(d).padStart(2, "0")}`;
const r2 = (x: number) => Math.round(x * 100) / 100;

/** Nombre ficticio único que no contiene ningún término de la lista de exclusión (minúsculas, sin acentos). */
export function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function nombreFicticio(rng: Rng, usados: Set<string>, exclusion: string[]): string {
  for (let intento = 0; intento < 500; intento++) {
    const n = `${rng.elegir(OFICIOS)} ${rng.elegir(NOMBRES)} S.L. (ficticio)`;
    const k = normalizar(n);
    if (usados.has(k)) continue;
    if (exclusion.some((t) => t && k.includes(t))) continue;
    usados.add(k);
    return n;
  }
  throw new Error("No se pudo generar un nombre ficticio único: amplía OFICIOS o NOMBRES.");
}

/** Ratio objetivo (carga de pedidos ÷ capacidad declarada) de cada mes según el arquetipo. */
function ratiosMensuales(rng: Rng, arq: Arquetipo, n: number): number[] {
  switch (arq) {
    case "pico_legitimo": {
      const base = rng.uniforme(0.4, 0.6);
      const r = Array.from({ length: n }, () => base * rng.uniforme(0.9, 1.1));
      r[n - 1 - rng.entero(0, 2)] = rng.uniforme(1.3, 1.6); // un mes de pico dentro de la ventana evaluada
      return r;
    }
    case "subcontrata_oculta": {
      const base = rng.uniforme(1.0, 2.0); // el exceso lo cose un taller que no figura en ningún sitio
      return Array.from({ length: n }, () => base * rng.uniforme(0.92, 1.08));
    }
    default: {
      // sano e informe_tardio_o_ausente: carga dentro de la capacidad, con ruido
      const base = rng.uniforme(0.45, 0.85);
      return Array.from({ length: n }, () => base * rng.uniforme(0.9, 1.1));
    }
  }
}

export function generar(
  escenario: Escenario,
  semilla: number,
  parametros: ParametrosPublicos,
  exclusion: string[] = [],
): SalidaGenerador {
  const rng = crearRng(semilla);
  const excl = exclusion.map(normalizar).filter(Boolean);
  const meses = escenario.meses;
  const ventana = meses.slice(-3);
  const jornadaMes = horasMesConvenio(parametros, "marroquineria");
  const pesosTramo = parametros.empresasPorTramo.cnae15.valor;

  const arquetipos = rng.barajar(
    (Object.entries(escenario.composicion) as [Arquetipo, number][]).flatMap(([a, k]) => Array<Arquetipo>(k).fill(a)),
  );

  const talleres: FilaTaller[] = [];
  const pedidos: FilaPedido[] = [];
  const informes: FilaInformeES[] = [];
  const verdad: VerdadTaller[] = [];
  const usados = new Set<string>();
  let nPedido = 0;

  arquetipos.forEach((arq, i) => {
    const id = `TS-${String(i + 1).padStart(2, "0")}`;
    const lugar = rng.elegir(CIUDADES_ES);
    const [a, b] = TRAMOS[rng.elegirPonderado(pesosTramo)];
    const asalariados = rng.entero(a, b);
    const titulares = asalariados <= 5 && rng.next() < 0.5 ? 1 : 0;
    const piezas = rng.barajar(CATALOGO_PIEZAS).slice(0, rng.entero(1, 3));

    talleres.push({
      taller_id: id, nombre: nombreFicticio(rng, usados, excl), pais: "ES", ciudad: lugar.ciudad,
      provincia: lugar.provincia, nivel: 1, padre_id: "", especialidad: piezas.map((p) => p.nombre).join(" · "),
      convenio: "marroquineria",
    });

    // Informes mensuales de plantilla (SIMULADOS): plantilla media ponderada por jornada (parcialidad 85-100 %).
    const parcialidad = rng.uniforme(0.85, 1.0);
    const horasTitulares = titulares ? Math.round(rng.uniforme(150, 175)) : 0;
    const ausentes = new Set<Mes>();
    if (arq === "informe_tardio_o_ausente") {
      ausentes.add(meses[meses.length - 1]);
      if (rng.next() < 0.5) ausentes.add(meses[meses.length - 2]);
    }
    const despacho = `Gestoría ${rng.elegir(NOMBRES)} (ficticia)`; // la misma gestoría todos los meses
    const capacidad: Record<Mes, number> = {};
    for (const m of meses) {
      const plantilla = r2(asalariados * parcialidad * rng.uniforme(0.97, 1.0));
      capacidad[m] = plantilla * jornadaMes + Math.min(horasTitulares, 160 * titulares);
      if (ausentes.has(m)) continue;
      informes.push({
        taller_id: id, ccc_ficticio: `DEMO-ES-${String(1000 + i)}`, mes: m, plantilla_media_ponderada: plantilla,
        num_trabajadores: asalariados, num_titulares: titulares, horas_titulares: horasTitulares,
        firmante_tipo: "gestor_laboral", despacho,
        fecha_emision: fecha(sumarMeses(m, 1), rng.entero(3, 12)),
      });
    }

    // Pedidos de la marca: carga mensual = ratio objetivo × capacidad declarada, repartida entre las piezas del taller.
    const ratios = ratiosMensuales(rng, arq, meses.length);
    meses.forEach((m, k) => {
      const horasObjetivo = ratios[k] * capacidad[m];
      const pesos = piezas.map(() => rng.uniforme(0.5, 1.5));
      const suma = pesos.reduce((s, p) => s + p, 0);
      piezas.forEach((p, j) => {
        const unidades = Math.max(1, Math.round(((horasObjetivo * pesos[j]) / suma) * 60 / p.minutos));
        nPedido++;
        pedidos.push({
          pedido_id: `PS-${String(nPedido).padStart(4, "0")}`, marca_id: escenario.marcaId, taller_id: id,
          referencia: `${p.nombre} · ${m}`, tipo_pieza_id: p.id, unidades,
          inicio: fecha(m, rng.entero(1, 3)), fin: fecha(m, ultimoDia(m) - rng.entero(0, 2)), origen: "marca",
          pedido_origen_id: "",
        });
      });
    });

    const enVentana = meses.map((m, k) => [m, ratios[k]] as const).filter(([m]) => ventana.includes(m));
    verdad.push({
      tallerId: id,
      arquetipo: arq,
      problemaReal: ARQUETIPOS_PROBLEMA.includes(arq),
      personasReales: asalariados + titulares,
      personasDeclaradas: asalariados + titulares,
      ratioRealMedio: r2(enVentana.reduce((s, [, r]) => s + r, 0) / enVentana.length),
      nota:
        arq === "subcontrata_oculta"
          ? "El exceso de carga lo produce un taller no declarado que no aparece en ningún archivo."
          : arq === "pico_legitimo"
            ? "Un mes de pico dentro de la ventana; los demás meses, holgados."
            : arq === "informe_tardio_o_ausente"
              ? `Carga sana, pero falta el informe de ${[...ausentes].sort().join(" y ")}.`
              : "Carga dentro de su capacidad.",
    });
  });

  const escandallo = CATALOGO_PIEZAS.map((p) => ({
    tipo_pieza_id: p.id, version: 1, minutos: p.minutos, vigente_desde: `${meses[0]}-01`,
    autor: "Compras (ficticio)", categoria: "marroquineria",
  }));

  return {
    archivos: {
      talleres: aCsv(CABECERAS.talleres, talleres as unknown as Record<string, string | number>[]),
      escandallo: aCsv(CABECERAS.escandallo, escandallo),
      pedidos_erp: aCsv(CABECERAS.pedidos_erp, pedidos as unknown as Record<string, string | number>[]),
      informe_plantilla_es: aCsv(CABECERAS.informe_plantilla_es, informes as unknown as Record<string, string | number>[]),
    },
    verdad: { escenario: escenario.nombre, semilla, talleres: verdad },
  };
}
