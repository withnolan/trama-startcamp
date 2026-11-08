/**
 * Score v2 de Trama (SUPERPROMPT_DATOS.md §5.2, A4). Funciones puras y deterministas.
 *
 * Mismo algoritmo y MISMOS umbrales que el motor v1 (`semaforo.ts`, se reutiliza `clasificar()`), con cuatro cambios:
 *  1. Minutos efectivos = max(minutos de la versión del escandallo vigente cada día, suelo público de su categoría).
 *     Sin suelo publicado → minutos del escandallo, confianza como mucho «media» («minutos sin contrastar»).
 *  2. Horas: informe de plantilla (España) o LUL (Italia). En Italia NO se exige Asse.Co: Asse.Co y DURC solo bajan
 *     la confianza, no invalidan el dato.
 *  3. Varias marcas: con la cuota de facturación de la marca, ratio total estimado = ratio ÷ cuota. Si sale rojo, se
 *     abre una revisión; el estado NO cambia (nunca rojo por la cuota).
 *  4. Confianza (alta/media/baja) por reglas a la vista, en un eje aparte del ratio, con sus motivos en texto llano.
 *
 * NO lee la verdad oculta del generador: solo el dataset ingerido y los parámetros públicos.
 */
import { clasificar, estadoPanel, GRAVEDAD, horasCertificado, miembrosCadena, personas, sumarMeses, ventanaMeses } from "../calculo/semaforo.ts";
import type { CertificadoHoras, EstadoSemaforo, Mes, Pedido, Seed, Taller } from "../calculo/tipos.ts";
import type { Confianza, CuotaFacturacion, DatasetIngerido, ParametrosPublicos, ResultadoScore, VersionEscandallo } from "./contratos.ts";

/** Copia de `MIN_MARCAS_SUMA` de `simular.ts` (que importa `@/data` y no se puede cargar desde los scripts). Un test comprueba que coinciden. */
export const MIN_MARCAS_SUMA_V2 = 3;

export const CIERRE_EXPLICACION = "Es un indicio que abre una revisión, no una prueba. Decide una persona.";

export interface OpcionesScoreV2 {
  /** Mes de evaluación (por defecto, `seed.meta.mesEvaluacionActual`). */
  mes?: Mes;
  /** Categoría de suelo por tipo de pieza cuando el dataset no la trae (p. ej. { "TP-CHAQ": "americana_forrada" }). */
  categoriaPorPieza?: Record<string, string>;
}

/** Una evaluación (cadena o taller suelto) con lo necesario para reclasificar con otro umbral sin recalcular. */
export interface EvaluacionV2 {
  tipo: "cadena" | "taller";
  tallerId: string;
  carga: number;
  horas: number;
  micro: boolean;
  sinDatos: boolean;
  estado: EstadoSemaforo;
  ratio: number | null | undefined;
}

/** `ResultadoScore` del contrato + detalle para la evaluación (campos aditivos, propios de A4). */
export interface ResultadoScoreV2 extends ResultadoScore {
  revisionAbierta: boolean;
  estadoV1: EstadoSemaforo;
  micro: boolean;
  evaluaciones: EvaluacionV2[];
  horasNecesarias: number;
  horasDeAlta: number | undefined;
  /** Horas de más que añade el suelo de minutos frente al escandallo en la ventana (0 si no actúa). */
  horasPorSuelo: number;
}

// ---------- Fechas ----------
const dia = (d: string) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)) / 864e5;
const finDeMes = (m: Mes) => dia(`${sumarMeses(m, 1)}-01`) - 1;
const fmtH = (h: number) => Math.round(h).toLocaleString("es-ES");
const fmtR = (r: number) => r.toFixed(2).replace(".", ",");

// ---------- Minutos efectivos ----------
interface TramoMinutos {
  desde: number; // día (inclusive)
  minutosEscandallo: number;
  categoria: string;
}

/** Tramos de minutos de una pieza ordenados por fecha; con versiones en la misma fecha gana la de número mayor. */
function tramosPieza(d: DatasetIngerido, piezaId: string, op: OpcionesScoreV2): TramoMinutos[] {
  const vs = (d.escandalloVersiones ?? []).filter((v) => v.tipoPiezaId === piezaId);
  if (vs.length) {
    const orden = [...vs].sort((a, b) => a.vigenteDesde.localeCompare(b.vigenteDesde) || a.version - b.version);
    const porFecha = new Map<string, VersionEscandallo>();
    for (const v of orden) porFecha.set(v.vigenteDesde, v); // la última de cada fecha = versión mayor
    return [...porFecha.values()].map((v) => ({
      desde: dia(v.vigenteDesde),
      minutosEscandallo: v.minutos,
      categoria: op.categoriaPorPieza?.[piezaId] ?? v.categoria,
    }));
  }
  const t = d.seed.tiposPieza.find((x) => x.id === piezaId);
  if (!t) throw new Error(`Tipo de pieza desconocido: ${piezaId}`);
  return [{ desde: -Infinity, minutosEscandallo: t.minutosEstandar, categoria: op.categoriaPorPieza?.[piezaId] ?? t.categoria }];
}

/** Suelo público de una categoría: número, o null si no hay suelo publicado («sin contrastar»). */
export function sueloCategoria(p: ParametrosPublicos, categoria: string): number | null {
  const s = p.sueloMinutos[categoria];
  return s && typeof s.valor === "number" ? s.valor : null;
}

interface HorasPedidoMes {
  horas: number; // con minutos efectivos
  horasEscandallo: number; // solo con el escandallo
  sueloActua: boolean;
  sinContrastar: boolean;
}

/** h(p, m) con minutos efectivos: reparto por días naturales (como semaforo.ts) y versión del escandallo vigente cada día. */
function horasPedidoMesV2(tramos: TramoMinutos[], P: ParametrosPublicos, p: Pedido, m: Mes): HorasPedidoMes {
  const ini = dia(p.inicio);
  const fin = dia(p.fin);
  const a = Math.max(ini, dia(`${m}-01`));
  const b = Math.min(fin, finDeMes(m));
  const r: HorasPedidoMes = { horas: 0, horasEscandallo: 0, sueloActua: false, sinContrastar: false };
  if (b < a) return r;
  const total = fin - ini + 1;
  tramos.forEach((t, i) => {
    // el primer tramo cubre también los días anteriores a su fecha (pedido iniciado antes de la primera versión)
    const desde = i === 0 ? a : Math.max(a, t.desde);
    const hasta = i + 1 < tramos.length ? Math.min(b, tramos[i + 1].desde - 1) : b;
    if (hasta < desde) return;
    const dias = hasta - desde + 1;
    const suelo = sueloCategoria(P, t.categoria);
    const minutos = suelo === null ? t.minutosEscandallo : Math.max(t.minutosEscandallo, suelo);
    if (suelo === null) r.sinContrastar = true;
    else if (suelo > t.minutosEscandallo) r.sueloActua = true;
    r.horas += (p.unidades * minutos * dias) / (60 * total);
    r.horasEscandallo += (p.unidades * t.minutosEscandallo * dias) / (60 * total);
  });
  return r;
}

// ---------- Horas de alta ----------
/** Firmante coherente con el país. En Italia basta el consulente del lavoro (LUL): Asse.Co no se exige. */
const firmanteCoherente = (c: CertificadoHoras, t: Taller) =>
  t.pais === "ES" ? c.firmante.tipo === "gestor_laboral" : c.firmante.tipo === "consulente_del_lavoro";

/** Informe válido de T y m: el de emisión más reciente (empate: id mayor), y cuántos había (rectificaciones). */
export function informeV2(seed: Seed, t: Taller, m: Mes): { c: CertificadoHoras | null; emisiones: number } {
  const cs = seed.certificadosHoras.filter((c) => c.tallerId === t.id && c.mes === m && firmanteCoherente(c, t));
  const c = cs.reduce<CertificadoHoras | null>(
    (mejor, x) => (!mejor || x.fechaEmision > mejor.fechaEmision || (x.fechaEmision === mejor.fechaEmision && x.id > mejor.id) ? x : mejor),
    null,
  );
  return { c, emisiones: cs.length };
}

// ---------- Cuota de facturación ----------
const PRIORIDAD_FUENTE: Record<CuotaFacturacion["fuente"], number> = { "303": 3, declarada: 2, "347": 1 };

/** La cuota más reciente de la marca en el taller (empate de periodo: 303 > declarada > 347). */
export function cuotaVigente(d: DatasetIngerido, tallerId: string): CuotaFacturacion | null {
  const cs = (d.cuotas ?? []).filter((c) => c.tallerId === tallerId && c.marcaId === d.seed.marca.id && c.cuotaPct > 0);
  return cs.reduce<CuotaFacturacion | null>(
    (mejor, c) =>
      !mejor || c.periodo > mejor.periodo || (c.periodo === mejor.periodo && PRIORIDAD_FUENTE[c.fuente] > PRIORIDAD_FUENTE[mejor.fuente]) ? c : mejor,
    null,
  );
}

// ---------- Score ----------
interface Motivo {
  grave: boolean;
  texto: string;
}

/** Reglas de confianza: baja si hay algún motivo grave o 3 leves o más; media si hay alguno leve; alta si ninguno. */
export function confianzaDe(motivos: { grave: boolean }[]): Confianza {
  const graves = motivos.filter((m) => m.grave).length;
  const leves = motivos.length - graves;
  return graves > 0 || leves >= 3 ? "baja" : leves > 0 ? "media" : "alta";
}

export function puntuarV2(d: DatasetIngerido, P: ParametrosPublicos, op: OpcionesScoreV2 = {}): ResultadoScoreV2[] {
  const seed = d.seed;
  const PS = seed.parametros;
  const mes = op.mes ?? seed.meta.mesEvaluacionActual;
  const ventana = ventanaMeses(mes, PS.mesesVentana);
  const talleres = new Map(seed.talleres.map((t) => [t.id, t]));
  const tramos = new Map<string, TramoMinutos[]>();
  const tramosDe = (id: string) => {
    if (!tramos.has(id)) tramos.set(id, tramosPieza(d, id, op));
    return tramos.get(id)!;
  };
  const pedidosMarca = seed.pedidos.filter((p) => p.marcaId === seed.marca.id);
  const pedidoPorId = new Map(pedidosMarca.map((p) => [p.id, p]));

  /** C(T, m) con minutos efectivos: pedidos recibidos − subencargos que T pasa a sus subcontratas. */
  const cargaMesV2 = (tallerId: string, m: Mes) => {
    const r = { carga: 0, escandallo: 0, conSuelo: [] as string[], sinContrastar: false };
    for (const p of pedidosMarca) {
      const recibido = p.tallerId === tallerId;
      const pasado = p.origen === "subencargo" && pedidoPorId.get(p.pedidoOrigenId ?? "")?.tallerId === tallerId;
      if (!recibido && !pasado) continue;
      const h = horasPedidoMesV2(tramosDe(p.tipoPiezaId), P, p, m);
      const signo = (recibido ? 1 : 0) - (pasado ? 1 : 0);
      r.carga += signo * h.horas;
      r.escandallo += signo * h.horasEscandallo;
      if (recibido && h.sueloActua) r.conSuelo.push(p.id);
      if (recibido && h.sinContrastar && h.horas > 0) r.sinContrastar = true;
    }
    return r;
  };

  return seed.talleres
    .filter((t) => t.nivel === 1)
    .map((raiz) => {
      const miembros = miembrosCadena(seed, raiz.id);
      const motivos: Motivo[] = [];
      const anadir = (grave: boolean, texto: string) => {
        if (!motivos.some((m) => m.texto === texto)) motivos.push({ grave, texto });
      };

      // Datos por miembro y mes (se calculan una vez y sirven para la cadena y para cada taller suelto)
      const datos = miembros.map((id) => {
        const t = talleres.get(id)!;
        let carga = 0;
        let escandallo = 0;
        let horas = 0;
        const conSuelo = new Set<string>();
        let sinContrastar = false;
        const faltan: Mes[] = [];
        const personasMes: number[] = [];
        for (const m of ventana) {
          const c = cargaMesV2(id, m);
          carga += c.carga;
          escandallo += c.escandallo;
          for (const id of c.conSuelo) conSuelo.add(id);
          sinContrastar ||= c.sinContrastar;
          const { c: inf, emisiones } = informeV2(seed, t, m);
          if (!inf) {
            faltan.push(m);
            personasMes.push(0);
            continue;
          }
          horas += horasCertificado(inf, PS.topeHorasTitularMes);
          personasMes.push(personas(inf));
          if (emisiones > 1) anadir(false, `Informe de ${m} de ${id} rectificado (${emisiones} emisiones): se usa la más reciente.`);
          if (inf.fechaEmision >= `${sumarMeses(m, 2)}-01`) anadir(false, `Informe de ${m} de ${id} entregado tarde (${inf.fechaEmision}).`);
          if (inf.retroactivo) anadir(false, `Informe de ${m} de ${id} emitido con carácter retroactivo.`);
          if (t.pais === "IT") {
            const ind = (d.indicadoresIT ?? []).find((x) => x.tallerId === id && x.mes === m);
            const asseco = ind ? ind.assecoVigente : inf.firmante.viaAsseCo;
            if (!asseco) anadir(false, `${id} sin Asse.Co vigente: las horas del LUL cuentan, pero sin esa revisión externa.`);
            if (ind && (!ind.durcRegolare || dia(ind.durcScadenza) < finDeMes(m)))
              anadir(true, `DURC de ${id} no regular o caducado en ${m}: las horas cuentan, pero el dato es menos fiable.`);
          }
        }
        return { id, t, carga, escandallo, horas, conSuelo, sinContrastar, faltan, personasMes };
      });

      const evaluacion = (tipo: EvaluacionV2["tipo"], ids: string[]): EvaluacionV2 => {
        const xs = datos.filter((x) => ids.includes(x.id));
        const carga = Math.max(0, xs.reduce((s, x) => s + x.carga, 0));
        const horas = xs.reduce((s, x) => s + x.horas, 0);
        const raizX = xs.find((x) => x.id === ids[0])!;
        const sinDatos = raizX.faltan.length > 0; // falta de la raíz → sin datos; de una subcontrata → 0 h
        const micro = !sinDatos && ventana.every((_, i) => xs.reduce((s, x) => s + x.personasMes[i], 0) <= PS.maxPersonasMicro);
        if (sinDatos) return { tipo, tallerId: ids[0], carga, horas, micro, sinDatos, estado: "sin_datos", ratio: undefined };
        return { tipo, tallerId: ids[0], carga, horas, micro, sinDatos, ...clasificar(carga, horas, micro, PS) };
      };
      const cadena = evaluacion("cadena", miembros);
      const sueltos = miembros.length > 1 ? miembros.map((id) => evaluacion("taller", [id])) : [];
      const evaluaciones = [cadena, ...sueltos];
      const estado = evaluaciones.map((e) => e.estado).reduce((peor, e) => (GRAVEDAD[e] > GRAVEDAD[peor] ? e : peor));

      // ---- Motivos de confianza (no tocan el ratio) ----
      const raizDatos = datos[0];
      if (raizDatos.faltan.length) anadir(true, `Falta el informe de plantilla de ${raiz.id} de ${raizDatos.faltan.join(", ")}.`);
      for (const x of datos.slice(1))
        if (x.faltan.length) anadir(true, `Falta el informe de la subcontrata ${x.id} de ${x.faltan.join(", ")}: esos meses cuentan 0 h.`);
      const pedidosConSuelo = datos.reduce((s, x) => s + x.conSuelo.size, 0);
      const horasPorSuelo = datos.reduce((s, x) => s + x.carga - x.escandallo, 0);
      if (pedidosConSuelo) anadir(false, "Minutos del escandallo por debajo del suelo público: se calcula con el suelo.");
      if (datos.some((x) => x.sinContrastar)) anadir(false, "Minutos sin contrastar: no hay suelo público para esta categoría de pieza.");
      if (cadena.micro) anadir(false, `Taller pequeño (${PS.maxPersonasMicro} personas o menos): más margen y la marca solo ve el estado.`);
      for (const i of d.incidencias)
        if (i.gravedad === "aviso" && i.entidad === `taller:${raiz.id}` && !["FALTA_INFORME", "INFORME_TARDIO"].includes(i.codigo))
          anadir(false, `${i.codigo}: ${i.detalle}`);

      // ---- Fuente de las horas ----
      const ultimo = informeV2(seed, raiz, mes).c;
      const horasFuente: ResultadoScore["horasFuente"] =
        estado === "sin_datos" || cadena.sinDatos
          ? "ninguna"
          : (ultimo && d.fuenteHoras?.[ultimo.id]) || (raiz.pais === "IT" ? "lul_it" : "informe_es");

      // ---- Varias marcas: estimación por cuota (abre revisión, nunca rojo) ----
      const cuota = cuotaVigente(d, raiz.id);
      let ratioTotalEstimado: number | null | undefined;
      let revisionAbierta = false;
      if (cuota && !cadena.sinDatos) {
        const total = clasificar((cadena.carga * 100) / cuota.cuotaPct, cadena.horas, cadena.micro, PS);
        ratioTotalEstimado = total.ratio;
        revisionAbierta = total.estado === "rojo";
      }

      // ---- Explicación en lenguaje llano ----
      const fuenteTxt = horasFuente === "lul_it" ? "el registro de jornada (LUL)" : "el informe de plantilla";
      const explicacion: string[] = [];
      if (cadena.sinDatos) {
        explicacion.push(
          `Falta el informe de plantilla de ${raizDatos.faltan.join(", ")}: no se calcula el semáforo de la cadena (nunca rojo por falta de datos).`,
        );
      } else {
        const sub = miembros.length > 1 ? ` (contando tus subcontratas declaradas: ${miembros.slice(1).join(", ")})` : "";
        explicacion.push(
          `Entre ${ventana[0]} y ${ventana.at(-1)}, tus pedidos necesitan unas ${fmtH(cadena.carga)} h${sub}; ${fuenteTxt} recoge ${fmtH(cadena.horas)} h de alta.`,
        );
        const uRojo = cadena.micro ? PS.umbralRojoMicro : PS.umbralRojo;
        explicacion.push(
          cadena.ratio == null
            ? "Hay pedidos y ninguna hora de alta: la carga no cabe."
            : `Carga ÷ horas = ${fmtR(cadena.ratio)}× (verde hasta ${fmtR(PS.umbralVerde)}, rojo por encima de ${fmtR(uRojo)}).`,
        );
      }
      if (pedidosConSuelo)
        explicacion.push(
          `En ${pedidosConSuelo} pedido(s) de la ventana el escandallo estaba por debajo del suelo público de minutos: se calcula con el suelo (+${fmtH(horasPorSuelo)} h).`,
        );
      for (const e of sueltos)
        if (GRAVEDAD[e.estado] > GRAVEDAD[cadena.estado] && e.estado !== "sin_datos")
          explicacion.push(
            `${e.tallerId === raiz.id ? "El taller" : "La subcontrata"} ${e.tallerId}, visto por separado, sale en ${e.estado === "rojo" ? "rojo" : "ámbar"}: el panel muestra el peor estado de la cadena.`,
          );
      if (revisionAbierta)
        explicacion.push(
          "Según la facturación del taller, tus pedidos son solo una parte de su trabajo y la estimación de su carga total no cabe en sus horas de alta: se abre una revisión. El semáforo no cambia por esto.",
        );
      explicacion.push(CIERRE_EXPLICACION);

      return {
        tallerId: raiz.id,
        mes,
        ratio: cadena.sinDatos ? undefined : cadena.ratio,
        estado,
        confianza: confianzaDe(motivos),
        motivosConfianza: motivos.map((m) => (m.grave ? `[grave] ${m.texto}` : m.texto)),
        minutosUsados: pedidosConSuelo ? "suelo" : "escandallo",
        horasFuente,
        explicacion,
        ...(cuota ? { ratioTotalEstimado } : {}),
        revisionAbierta,
        estadoV1: estadoPanel(seed, raiz.id, mes),
        micro: cadena.micro,
        evaluaciones,
        horasNecesarias: cadena.carga,
        horasDeAlta: cadena.sinDatos ? undefined : cadena.horas,
        horasPorSuelo,
      } satisfies ResultadoScoreV2;
    });
}

/** Estado del panel reclasificando las evaluaciones con otro umbral rojo (el de micro conserva su margen). Sin datos sigue sin datos. */
export function estadoConUmbral(r: ResultadoScoreV2, P: Seed["parametros"], umbralRojo: number): EstadoSemaforo {
  const Pu = { ...P, umbralRojo, umbralRojoMicro: umbralRojo + (P.umbralRojoMicro - P.umbralRojo) };
  return r.evaluaciones
    .map((e) => (e.sinDatos ? "sin_datos" : clasificar(e.carga, e.horas, e.micro, Pu).estado))
    .reduce<EstadoSemaforo>((peor, e) => (GRAVEDAD[e] > GRAVEDAD[peor] ? e : peor), "verde");
}
