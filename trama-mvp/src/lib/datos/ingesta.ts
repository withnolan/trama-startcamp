/**
 * Ingesta N2: los 6 CSV del contrato → validación → Seed compatible con el motor actual (semaforo.ts, sin cambios)
 * + procedencia por dato + incidencias + campos N2 (escandalloVersiones, cuotas, indicadoresIT, fuenteHoras).
 *
 * - NUNCA lee la verdad oculta del generador: solo recibe los archivos crudos.
 * - Ninguna fila se descarta en silencio: cada fila descartada lleva exactamente UNA incidencia bloqueante.
 *   Única excepción, por separación entre marcas: las filas de otras marcas se ignoran sin incidencia y el informe
 *   solo cuenta cuántas son (sin decir de qué marca).
 * - Privacidad: solo totales por taller y mes; ningún campo por persona.
 * - Formato de `Incidencia.entidad`: «archivo:fila · taller:ID» (fila) o «taller:ID» (taller) o «archivo» (archivo).
 */
import { mesesEntre, sumarMeses } from "../calculo/semaforo.ts";
import type { CertificadoHoras, Marca, Mes, Pedido, Seed, Taller, TipoPieza } from "../calculo/tipos.ts";
import {
  ARCHIVO,
  CABECERAS,
  type ArchivosCrudos,
  type CodigoIncidencia,
  type Convenio,
  type CuotaFacturacion,
  type DatasetIngerido,
  type Gravedad,
  type Incidencia,
  type IndicadorIT,
  type MetaIngesta,
  type NombreArchivo,
  type ParametrosPublicos,
  type Procedencia,
  type ValorPublico,
  type VersionEscandallo,
} from "./contratos.ts";
import { leerCsv } from "./csv.ts";
import { horasMesConvenio, PARAMETROS_SEMAFORO } from "./parametros.ts";
import { booleano, decimal, entero, esFecha, esMes, finDeMes, periodoValido, primerDia, primerDiaTras, r2 } from "./parsers.ts";

/** Rango de horas al mes por trabajador que se considera plausible en un LUL agregado (Italia). */
export const RANGO_HORAS_TRABAJADOR_IT = { min: 60, max: 200 } as const;
/** Jornada media ponderada mínima (plantilla ÷ trabajadores) antes de avisar en España. */
export const JORNADA_MINIMA_ES = 0.5;
/** Rebaja de minutos entre dos versiones del escandallo a partir de la cual se avisa. */
export const REBAJA_MINUTOS_AVISO = 0.2;

export interface OpcionesIngesta {
  escenario: string;
  marcaId: string;
  marcaNombre: string;
  parametros: ParametrosPublicos;
  hashCrudo: string;
  semilla?: number | null;
  versionGenerador?: string;
  /** Mes de evaluación. Por defecto, el último mes con informe de horas (o con pedidos si no hay informes). */
  mesEvaluacion?: Mes;
}

export interface ResultadoIngesta {
  ok: boolean; // false si falta un archivo imprescindible o alguno llega con la cabecera mal (bloqueado entero)
  dataset: DatasetIngerido;
}

interface Fila {
  numero: number;
  valores: Record<string, string>;
  archivo: string;
}

interface CertCand {
  c: CertificadoHoras;
  fila: Fila;
}

const pct = (x: number) => Math.round(x * 100);

export function ingerir(archivos: ArchivosCrudos, op: OpcionesIngesta): ResultadoIngesta {
  const inc: Incidencia[] = [];
  const procedencia: Record<string, Procedencia> = {};
  const metaArchivos: MetaIngesta["archivos"] = [];
  let ok = true;

  const add = (codigo: CodigoIncidencia, gravedad: Gravedad, entidad: string, detalle: string) =>
    inc.push({ codigo, gravedad, entidad, detalle });
  const ent = (f: Fila, tallerId?: string) => `${f.archivo}:${f.numero}${tallerId ? ` · taller:${tallerId}` : ""}`;
  const bloquear = (f: Fila, tallerId: string | undefined, codigo: CodigoIncidencia, detalle: string) =>
    add(codigo, "bloqueante", ent(f, tallerId || undefined), `Fila descartada: ${detalle}`);

  const abrir = (nombre: NombreArchivo, obligatorio: boolean): Fila[] => {
    const texto = archivos[nombre];
    const archivo = ARCHIVO[nombre];
    if (texto === undefined) {
      if (obligatorio) {
        ok = false;
        add("CABECERA_INVALIDA", "bloqueante", archivo, "Falta el archivo.");
      }
      return [];
    }
    const csv = leerCsv(texto);
    const esperada = CABECERAS[nombre].join(";");
    if (csv.cabecera.join(";") !== esperada) {
      ok = false;
      add("CABECERA_INVALIDA", "bloqueante", archivo, `Cabecera «${csv.cabecera.join(";")}»; se esperaba «${esperada}». Archivo descartado entero.`);
      return [];
    }
    for (const e of csv.errores)
      add("TIPO_INVALIDO", "bloqueante", `${archivo}:${e.numero}`, `Fila descartada: ${e.detalle}.`);
    metaArchivos.push({ nombre: archivo, filas: csv.filas.length + csv.errores.length });
    return csv.filas.map((f) => ({ ...f, archivo }));
  };

  // ======================= Talleres =======================
  interface TallerCand { t: Taller; convenio: Convenio; fila: Fila }
  let candTalleres: TallerCand[] = [];
  for (const f of abrir("talleres", true)) {
    const v = f.valores;
    const id = v.taller_id;
    if (!id) { bloquear(f, undefined, "TIPO_INVALIDO", "columna taller_id vacía."); continue; }
    if (candTalleres.some((c) => c.t.id === id)) { bloquear(f, id, "DUPLICADO", `taller ${id} repetido.`); continue; }
    if (v.pais !== "ES" && v.pais !== "IT") { bloquear(f, id, "TIPO_INVALIDO", `columna pais «${v.pais}» (ES o IT).`); continue; }
    const nivel = entero(v.nivel);
    if (nivel !== 1 && nivel !== 2 && nivel !== 3) { bloquear(f, id, "TIPO_INVALIDO", `columna nivel «${v.nivel}» (1, 2 o 3).`); continue; }
    if (v.convenio !== "textil" && v.convenio !== "marroquineria") { bloquear(f, id, "TIPO_INVALIDO", `columna convenio «${v.convenio}».`); continue; }
    if (nivel === 1 && v.padre_id) { bloquear(f, id, "TIPO_INVALIDO", `columna padre_id: un taller de nivel 1 no tiene padre (llega «${v.padre_id}»).`); continue; }
    if (nivel > 1 && !v.padre_id) { bloquear(f, id, "REFERENCIA_DESCONOCIDA", `columna padre_id vacía en un taller de nivel ${nivel}.`); continue; }
    candTalleres.push({
      t: {
        id, nombre: v.nombre, pais: v.pais, ciudad: v.ciudad, provincia: v.provincia, nivel,
        padreId: v.padre_id || null, subcontrataIds: [], declaracionSubcontrata: null, especialidad: v.especialidad,
      },
      convenio: v.convenio,
      fila: f,
    });
  }
  // Coherencia de la cadena: el padre existe y es del nivel inmediatamente inferior. Se itera porque descartar un
  // padre deja huérfanos a sus hijos.
  for (let cambio = true; cambio; ) {
    cambio = false;
    for (const c of candTalleres) {
      if (!c.t.padreId) continue;
      const p = candTalleres.find((x) => x.t.id === c.t.padreId);
      if (!p) bloquear(c.fila, c.t.id, "REFERENCIA_DESCONOCIDA", `el padre ${c.t.padreId} no está entre los talleres ingeridos.`);
      else if (p.t.nivel !== c.t.nivel - 1)
        bloquear(c.fila, c.t.id, "TIPO_INVALIDO", `nivel ${c.t.nivel} con padre ${p.t.id} de nivel ${p.t.nivel}: el padre debe ser de nivel ${c.t.nivel - 1}.`);
      else continue;
      candTalleres = candTalleres.filter((x) => x !== c);
      cambio = true;
      break;
    }
  }
  const talleres = candTalleres.map((c) => c.t);
  const convenioDe: Record<string, Convenio> = Object.fromEntries(candTalleres.map((c) => [c.t.id, c.convenio]));
  const tallerDe = (id: string) => talleres.find((t) => t.id === id);
  for (const t of talleres) if (t.padreId) tallerDe(t.padreId)?.subcontrataIds.push(t.id);

  // ======================= Escandallo (todas las versiones) =======================
  const versiones: (VersionEscandallo & { fila: Fila })[] = [];
  for (const f of abrir("escandallo", true)) {
    const v = f.valores;
    const id = v.tipo_pieza_id;
    if (!id) { bloquear(f, undefined, "TIPO_INVALIDO", "columna tipo_pieza_id vacía."); continue; }
    const version = entero(v.version);
    if (!(version > 0)) { bloquear(f, undefined, "TIPO_INVALIDO", `columna version «${v.version}» (entero > 0).`); continue; }
    const minutos = decimal(v.minutos);
    if (!(minutos > 0)) { bloquear(f, undefined, "TIPO_INVALIDO", `columna minutos «${v.minutos}» (decimal > 0).`); continue; }
    if (!esFecha(v.vigente_desde)) { bloquear(f, undefined, "FECHAS_INVALIDAS", `columna vigente_desde «${v.vigente_desde}».`); continue; }
    if (!v.categoria) { bloquear(f, undefined, "TIPO_INVALIDO", "columna categoria vacía."); continue; }
    if (versiones.some((x) => x.tipoPiezaId === id && x.version === version)) { bloquear(f, undefined, "DUPLICADO", `versión ${version} de ${id} repetida.`); continue; }
    versiones.push({ tipoPiezaId: id, version, minutos, vigenteDesde: v.vigente_desde, autor: v.autor, categoria: v.categoria, fila: f });
    procedencia[`escandallo:${id}:v${version}`] = { archivo: f.archivo, fila: f.numero, tipoFuente: "declarado", fechaDato: v.vigente_desde, firmante: v.autor };
  }
  const piezasConEscandallo = new Set(versiones.map((v) => v.tipoPiezaId));
  // Suelo público de minutos por categoría, versión a versión.
  const sinContrastar = new Set<string>();
  for (const x of versiones) {
    const suelos = op.parametros.sueloMinutos;
    const suelo: ValorPublico<number | null> | undefined = Object.prototype.hasOwnProperty.call(suelos, x.categoria) ? suelos[x.categoria] : undefined;
    const e = `${ent(x.fila)} · pieza:${x.tipoPiezaId}`;
    if (!suelo || suelo.valor === null) {
      const k = `${x.tipoPiezaId}|${x.categoria}`;
      if (!sinContrastar.has(k)) {
        sinContrastar.add(k);
        add("MINUTOS_SIN_CONTRASTAR", "info", e, `No hay suelo público de minutos para la categoría «${x.categoria}»: minutos de ${x.tipoPiezaId} sin contrastar.`);
      }
    } else if (x.minutos < suelo.valor)
      add("MINUTOS_BAJO_SUELO", "aviso", e, `${x.tipoPiezaId} v${x.version}: ${x.minutos} min < suelo de ${suelo.valor} min («${x.categoria}»). Autor «${x.autor}», vigente desde ${x.vigenteDesde}.`);
  }
  // Rebajas fuertes entre versiones consecutivas (sin código propio en el contrato: se usa MINUTOS_SIN_CONTRASTAR, aviso).
  for (const id of piezasConEscandallo) {
    const vs = versiones.filter((x) => x.tipoPiezaId === id).sort((a, b) => a.version - b.version);
    for (let k = 1; k < vs.length; k++) {
      const [a, b] = [vs[k - 1], vs[k]];
      const rebaja = (a.minutos - b.minutos) / a.minutos;
      if (rebaja > REBAJA_MINUTOS_AVISO)
        add("MINUTOS_SIN_CONTRASTAR", "aviso", `${ent(b.fila)} · pieza:${id}`,
          `Rebaja de minutos del ${pct(rebaja)} % en ${id}: v${a.version} ${a.minutos} min → v${b.version} ${b.minutos} min, autor «${b.autor}», vigente desde ${b.vigenteDesde}. Sin contraste externo: revisar.`);
    }
  }

  // ======================= Pedidos (solo los de la marca) =======================
  const candPedidos: { p: Pedido; fila: Fila }[] = [];
  for (const f of abrir("pedidos_erp", true)) {
    const v = f.valores;
    const tid = v.taller_id;
    if (!v.marca_id) { bloquear(f, tid, "TIPO_INVALIDO", "columna marca_id vacía."); continue; }
    if (v.marca_id !== op.marcaId) continue; // separación entre marcas: se cuenta en el informe, sin incidencia
    if (!v.pedido_id) { bloquear(f, tid, "TIPO_INVALIDO", "columna pedido_id vacía."); continue; }
    if (candPedidos.some((c) => c.p.id === v.pedido_id)) { bloquear(f, tid, "DUPLICADO", `pedido ${v.pedido_id} repetido.`); continue; }
    if (!tallerDe(tid)) { bloquear(f, tid, "REFERENCIA_DESCONOCIDA", `taller ${tid} no está en talleres.csv.`); continue; }
    if (!piezasConEscandallo.has(v.tipo_pieza_id)) { bloquear(f, tid, "REFERENCIA_DESCONOCIDA", `pieza ${v.tipo_pieza_id} sin escandallo.`); continue; }
    const unidades = entero(v.unidades);
    if (!(unidades > 0)) { bloquear(f, tid, "TIPO_INVALIDO", `columna unidades «${v.unidades}» (entero > 0).`); continue; }
    if (!esFecha(v.inicio) || !esFecha(v.fin) || v.fin < v.inicio) { bloquear(f, tid, "FECHAS_INVALIDAS", `columnas inicio/fin ${v.inicio} → ${v.fin}.`); continue; }
    if (v.origen !== "marca" && v.origen !== "subencargo") { bloquear(f, tid, "TIPO_INVALIDO", `columna origen «${v.origen}».`); continue; }
    if (v.origen === "subencargo" && !v.pedido_origen_id) { bloquear(f, tid, "REFERENCIA_DESCONOCIDA", "subencargo sin pedido_origen_id."); continue; }
    candPedidos.push({
      p: {
        id: v.pedido_id, marcaId: v.marca_id, tallerId: tid, tipoPiezaId: v.tipo_pieza_id, unidades,
        inicio: v.inicio, fin: v.fin, referencia: v.referencia, origen: v.origen,
        pedidoOrigenId: v.origen === "subencargo" ? v.pedido_origen_id : null,
      },
      fila: f,
    });
  }
  // Subencargos: el pedido origen existe (puede ser otro subencargo), misma pieza, el taller es subcontrata declarada
  // del taller origen y Σ unidades ≤ unidades del origen. Se resuelven por capas.
  const aceptados = new Map<string, Pedido>(candPedidos.filter((c) => c.p.origen === "marca").map((c) => [c.p.id, c.p]));
  const usado = new Map<string, number>();
  let pendientes = candPedidos.filter((c) => c.p.origen === "subencargo");
  for (let progreso = true; progreso && pendientes.length; ) {
    progreso = false;
    const resto: typeof pendientes = [];
    for (const c of pendientes) {
      const o = aceptados.get(c.p.pedidoOrigenId ?? "");
      if (!o) { resto.push(c); continue; }
      progreso = true;
      const s = c.p;
      if (o.tipoPiezaId !== s.tipoPiezaId) { bloquear(c.fila, s.tallerId, "REFERENCIA_DESCONOCIDA", `subencargo ${s.id} de pieza ${s.tipoPiezaId}; su pedido origen ${o.id} es de ${o.tipoPiezaId}.`); continue; }
      if (tallerDe(s.tallerId)?.padreId !== o.tallerId) { bloquear(c.fila, s.tallerId, "REFERENCIA_DESCONOCIDA", `${s.tallerId} no es subcontrata declarada de ${o.tallerId} (taller del pedido origen ${o.id}).`); continue; }
      const suma = (usado.get(o.id) ?? 0) + s.unidades;
      if (suma > o.unidades) { bloquear(c.fila, s.tallerId, "SUBENCARGO_EXCEDE", `subencargo ${s.id}: con él, los subencargos de ${o.id} suman ${suma} uds > ${o.unidades} uds del pedido origen.`); continue; }
      usado.set(o.id, suma);
      aceptados.set(s.id, s);
    }
    pendientes = resto;
  }
  for (const c of pendientes)
    bloquear(c.fila, c.p.tallerId, "REFERENCIA_DESCONOCIDA", `pedido origen ${c.p.pedidoOrigenId} no está entre los pedidos ingeridos de la marca.`);
  const pedidos = candPedidos.filter((c) => aceptados.has(c.p.id)).map((c) => c.p);
  for (const c of candPedidos.filter((x) => aceptados.has(x.p.id)))
    procedencia[`pedido:${c.p.id}`] = { archivo: c.fila.archivo, fila: c.fila.numero, tipoFuente: "declarado", fechaDato: c.p.inicio };

  // ======================= Informes de horas =======================
  const certs: CertCand[] = [];
  const fuenteHoras: Record<string, "informe_es" | "lul_it"> = {};
  const indicadoresIT: IndicadorIT[] = [];
  const firmas = new Set<string>(); // fila completa → duplicado exacto
  const yaVisto = (f: Fila) => {
    const k = `${f.archivo}|${Object.values(f.valores).join(";")}`;
    if (firmas.has(k)) return true;
    firmas.add(k);
    return false;
  };
  const sufijo = (f: Fila) => String(f.numero).padStart(5, "0"); // el motor desempata por id: orden de fila

  const hayES = archivos.informe_plantilla_es !== undefined;
  const hayIT = archivos.lul_agregado_it !== undefined;
  if (!hayES && !hayIT) {
    ok = false;
    add("CABECERA_INVALIDA", "bloqueante", `${ARCHIVO.informe_plantilla_es} / ${ARCHIVO.lul_agregado_it}`, "Falta el archivo de horas: hace falta el informe de plantilla (ES) o el LUL agregado (IT).");
  }

  // ---- España: informe de plantilla media ----
  for (const f of abrir("informe_plantilla_es", false)) {
    const v = f.valores;
    const t = tallerDe(v.taller_id);
    if (!t) { bloquear(f, v.taller_id, "REFERENCIA_DESCONOCIDA", `taller ${v.taller_id} no está entre los talleres ingeridos.`); continue; }
    if (!esMes(v.mes) || !esFecha(v.fecha_emision)) { bloquear(f, t.id, "FECHAS_INVALIDAS", `columnas mes «${v.mes}» / fecha_emision «${v.fecha_emision}».`); continue; }
    if (v.fecha_emision < primerDiaTras(v.mes, 1)) { bloquear(f, t.id, "FECHAS_INVALIDAS", `emitido (${v.fecha_emision}) antes de terminar el mes ${v.mes}.`); continue; }
    if (t.pais !== "ES") { bloquear(f, t.id, "FIRMANTE_INCOHERENTE", `taller de ${t.pais} con informe de plantilla de España: en Italia la fuente es el LUL.`); continue; }
    if (v.firmante_tipo !== "gestor_laboral") { bloquear(f, t.id, "FIRMANTE_INCOHERENTE", `taller de ES con firmante «${v.firmante_tipo}»: en España firma el gestor laboral.`); continue; }
    const plantilla = decimal(v.plantilla_media_ponderada);
    const trab = entero(v.num_trabajadores);
    const tit = entero(v.num_titulares);
    const hTit = decimal(v.horas_titulares);
    const malas = [
      ...(!(plantilla >= 0) ? ["plantilla_media_ponderada"] : []), ...(!(trab >= 0) ? ["num_trabajadores"] : []),
      ...(!(tit >= 0) ? ["num_titulares"] : []), ...(!(hTit >= 0) ? ["horas_titulares"] : []),
    ];
    if (malas.length) { bloquear(f, t.id, "TIPO_INVALIDO", `columnas ${malas.join(", ")} no válidas.`); continue; }
    if (yaVisto(f)) { bloquear(f, t.id, "DUPLICADO", `informe de ${v.mes} repetido (fila idéntica).`); continue; }
    if (plantilla > trab + 0.001)
      add("PLANTILLA_INCOHERENTE", "aviso", ent(f, t.id), `Plantilla media ${plantilla} > ${trab} trabajadores de alta (${v.mes}).`);
    if (trab > 0 && plantilla / trab < JORNADA_MINIMA_ES)
      add("JORNADA_FUERA_RANGO", "aviso", ent(f, t.id), `Jornada media ponderada del ${pct(plantilla / trab)} % en ${v.mes} (< ${pct(JORNADA_MINIMA_ES)} %): mucha parcialidad, revisar.`);
    const id = `CS-${t.id}-${v.mes}-${sufijo(f)}`;
    certs.push({
      fila: f,
      c: {
        id, tallerId: t.id, mes: v.mes,
        // Horas de alta = plantilla media ponderada por jornada × horas al mes del convenio del taller.
        horasTotalesCotizadas: r2(plantilla * horasMesConvenio(op.parametros, convenioDe[t.id])),
        numTrabajadores: trab,
        ...(tit > 0 ? { numTitulares: tit, horasTitulares: hTit } : {}),
        firmante: { tipo: "gestor_laboral", despacho: v.despacho, numeroColegiado: v.ccc_ficticio, viaAsseCo: false },
        fechaEmision: v.fecha_emision,
      },
    });
    fuenteHoras[id] = "informe_es";
    procedencia[`informe:${id}`] = { archivo: f.archivo, fila: f.numero, tipoFuente: "oficial", fechaDato: v.mes, firmante: v.despacho };
  }

  // ---- Italia: LUL agregado ----
  for (const f of abrir("lul_agregado_it", false)) {
    const v = f.valores;
    const t = tallerDe(v.taller_id);
    if (!t) { bloquear(f, v.taller_id, "REFERENCIA_DESCONOCIDA", `taller ${v.taller_id} no está entre los talleres ingeridos.`); continue; }
    if (!esMes(v.mes) || !esFecha(v.fecha_emision) || !esFecha(v.durc_scadenza))
      { bloquear(f, t.id, "FECHAS_INVALIDAS", `columnas mes «${v.mes}» / fecha_emision «${v.fecha_emision}» / durc_scadenza «${v.durc_scadenza}».`); continue; }
    if (v.fecha_emision < primerDiaTras(v.mes, 1)) { bloquear(f, t.id, "FECHAS_INVALIDAS", `LUL emitido (${v.fecha_emision}) antes de terminar el mes ${v.mes}.`); continue; }
    if (t.pais !== "IT") { bloquear(f, t.id, "FIRMANTE_INCOHERENTE", `taller de ${t.pais} con LUL italiano: en España la fuente es el informe de plantilla del gestor laboral.`); continue; }
    if (!v.consulente) { bloquear(f, t.id, "FIRMANTE_INCOHERENTE", "columna consulente vacía: el LUL agregado lo firma el consulente del lavoro."); continue; }
    const ore = decimal(v.ore_registrate_totali);
    const num = entero(v.num_lavoratori);
    const regolare = booleano(v.durc_regolare);
    const asseco = booleano(v.asseco_vigente);
    const malas = [
      ...(!(ore >= 0) ? ["ore_registrate_totali"] : []), ...(!(num >= 0) ? ["num_lavoratori"] : []),
      ...(regolare === null ? ["durc_regolare"] : []), ...(asseco === null ? ["asseco_vigente"] : []),
    ];
    if (malas.length || regolare === null || asseco === null) { bloquear(f, t.id, "TIPO_INVALIDO", `columnas ${malas.join(", ")} no válidas.`); continue; }
    if (yaVisto(f)) { bloquear(f, t.id, "DUPLICADO", `LUL de ${v.mes} repetido (fila idéntica).`); continue; }
    if (!regolare || v.durc_scadenza < finDeMes(v.mes))
      add("DURC_CADUCADO", "aviso", ent(f, t.id), !regolare
        ? `DURC no regular en ${v.mes}: baja la confianza, no invalida las horas.`
        : `DURC caducado el ${v.durc_scadenza}, antes de terminar ${v.mes}: baja la confianza, no invalida las horas.`);
    if (num === 0 && ore > 0)
      add("PLANTILLA_INCOHERENTE", "aviso", ent(f, t.id), `${ore} h registradas con 0 trabajadores en ${v.mes}.`);
    if (num > 0 && (ore / num < RANGO_HORAS_TRABAJADOR_IT.min || ore / num > RANGO_HORAS_TRABAJADOR_IT.max))
      add("JORNADA_FUERA_RANGO", "aviso", ent(f, t.id), `${r2(ore / num)} h por trabajador en ${v.mes}, fuera de ${RANGO_HORAS_TRABAJADOR_IT.min}-${RANGO_HORAS_TRABAJADOR_IT.max} h/mes.`);
    if (!asseco)
      add("FIRMANTE_INCOHERENTE", "info", ent(f, t.id), `LUL de ${v.mes} sin Asse.Co vigente: el motor v1 (semaforo.ts) no cuenta este informe (exige viaAsseCo); el score v2 no lo exige y lo usa como indicador de calidad.`);
    const id = `LUL-${t.id}-${v.mes}-${sufijo(f)}`;
    certs.push({
      fila: f,
      c: {
        id, tallerId: t.id, mes: v.mes, horasTotalesCotizadas: ore, numTrabajadores: num,
        firmante: { tipo: "consulente_del_lavoro", despacho: v.consulente, numeroColegiado: "", viaAsseCo: asseco },
        fechaEmision: v.fecha_emision,
      },
    });
    fuenteHoras[id] = "lul_it";
    indicadoresIT.push({ tallerId: t.id, mes: v.mes, durcRegolare: regolare, durcScadenza: v.durc_scadenza, assecoVigente: asseco });
    procedencia[`informe:${id}`] = { archivo: f.archivo, fila: f.numero, tipoFuente: "oficial", fechaDato: v.mes, firmante: v.consulente };
  }

  // ---- Rectificaciones y tardíos (por taller y mes) ----
  const grupos = new Map<string, CertCand[]>();
  for (const x of certs) grupos.set(`${x.c.tallerId}|${x.c.mes}`, [...(grupos.get(`${x.c.tallerId}|${x.c.mes}`) ?? []), x]);
  for (const g of grupos.values()) {
    const { tallerId, mes } = g[0].c;
    const primero = g.reduce((a, b) => (b.c.fechaEmision < a.c.fechaEmision ? b : a));
    if (primero.c.fechaEmision >= primerDiaTras(mes, 2))
      add("INFORME_TARDIO", "aviso", ent(primero.fila, tallerId), `Informe de ${mes} emitido el ${primero.c.fechaEmision} (plazo: antes del ${primerDiaTras(mes, 2)}).`);
    if (g.length > 1) {
      const gana = g.reduce((a, b) => (b.c.fechaEmision > a.c.fechaEmision || (b.c.fechaEmision === a.c.fechaEmision && b.c.id > a.c.id) ? b : a));
      add("RECTIFICACION", "info", ent(gana.fila, tallerId), `${g.length} informes de ${mes} para ${tallerId}: gana el de emisión más reciente (${gana.c.fechaEmision}), como el motor.`);
    }
  }

  // ======================= Cuota de facturación (solo la de la marca) =======================
  const cuotas: CuotaFacturacion[] = [];
  for (const f of abrir("cuota_facturacion", false)) {
    const v = f.valores;
    const tid = v.taller_id;
    if (!v.marca_id) { bloquear(f, tid, "TIPO_INVALIDO", "columna marca_id vacía."); continue; }
    if (v.marca_id !== op.marcaId) continue; // cada marca ve solo lo suyo
    if (!tallerDe(tid)) { bloquear(f, tid, "REFERENCIA_DESCONOCIDA", `taller ${tid} no está entre los talleres ingeridos.`); continue; }
    if (v.fuente !== "303" && v.fuente !== "347" && v.fuente !== "declarada") { bloquear(f, tid, "TIPO_INVALIDO", `columna fuente «${v.fuente}» (303, 347 o declarada).`); continue; }
    if (!periodoValido(v.fuente, v.periodo)) { bloquear(f, tid, "FECHAS_INVALIDAS", `columna periodo «${v.periodo}» no encaja con la fuente ${v.fuente}.`); continue; }
    const cuotaPct = decimal(v.cuota_pct);
    if (!(cuotaPct >= 1 && cuotaPct <= 100)) { bloquear(f, tid, "TIPO_INVALIDO", `columna cuota_pct «${v.cuota_pct}» (1-100).`); continue; }
    if (cuotas.some((c) => c.tallerId === tid && c.periodo === v.periodo && c.fuente === v.fuente)) { bloquear(f, tid, "DUPLICADO", `cuota de ${tid} en ${v.periodo} (${v.fuente}) repetida.`); continue; }
    cuotas.push({ tallerId: tid, marcaId: v.marca_id, periodo: v.periodo, cuotaPct, fuente: v.fuente });
    procedencia[`cuota:${tid}:${v.fuente}:${v.periodo}`] = {
      archivo: f.archivo, fila: f.numero, tipoFuente: v.fuente === "declarada" ? "declarado" : "oficial", fechaDato: v.periodo,
    };
  }

  // ======================= Meses, escandallo vigente y completitud =======================
  const certificados = certs.map((x) => x.c);
  const mesesPedidos = pedidos.flatMap((p) => mesesEntre(p.inicio.slice(0, 7), p.fin.slice(0, 7)));
  const mesesInforme = [...new Set(certificados.map((c) => c.mes))].sort();
  const mesActual: Mes = op.mesEvaluacion ?? mesesInforme.at(-1) ?? [...mesesPedidos].sort().at(-1) ?? "";
  const primerMes: Mes = [...mesesPedidos, ...mesesInforme].sort()[0] ?? mesActual;
  const meses = primerMes && mesActual ? mesesEntre(primerMes, mesActual) : [];

  // Versión vigente en el mes de evaluación: la última que entra en vigor no más tarde de su último día.
  const tiposPieza: TipoPieza[] = [];
  const finEval = mesActual ? finDeMes(mesActual) : "9999-12-31";
  for (const id of piezasConEscandallo) {
    const vs = versiones
      .filter((x) => x.tipoPiezaId === id)
      .sort((a, b) => a.vigenteDesde.localeCompare(b.vigenteDesde) || a.version - b.version);
    let vig = vs.filter((x) => x.vigenteDesde <= finEval).at(-1);
    if (!vig) {
      vig = vs[0];
      add("FECHAS_INVALIDAS", "aviso", `${ent(vig.fila)} · pieza:${id}`, `Ninguna versión de ${id} está vigente en ${mesActual}; se usa la v${vig.version} (desde ${vig.vigenteDesde}).`);
    }
    tiposPieza.push({
      id, nombre: id, categoria: vig.categoria === "marroquineria" ? "marroquineria" : "confeccion",
      minutosEstandar: vig.minutos, fuente: "ficha_costes",
    });
    procedencia[`pieza:${id}`] = { archivo: vig.fila.archivo, fila: vig.fila.numero, tipoFuente: "declarado", fechaDato: vig.vigenteDesde, firmante: vig.autor };
  }

  // Talleres: procedencia y declaración de subcontrata (previa: figura en talleres.csv desde el primer mes).
  for (const c of candTalleres) {
    if (c.t.nivel > 1) c.t.declaracionSubcontrata = { momento: "previa", fecha: primerMes ? primerDia(primerMes) : "", alertaId: null };
    procedencia[`taller:${c.t.id}`] = { archivo: c.fila.archivo, fila: c.fila.numero, tipoFuente: "declarado", fechaDato: primerMes };
  }

  for (const t of talleres) {
    const faltan = meses.filter((m) => !certificados.some((c) => c.tallerId === t.id && c.mes === m));
    if (faltan.length)
      add("FALTA_INFORME", "aviso", `taller:${t.id}`, `Sin informe de horas de ${faltan.join(", ")}.`);
    const ult = certificados.filter((c) => c.tallerId === t.id && c.mes <= mesActual).sort((a, b) => a.mes.localeCompare(b.mes)).at(-1);
    if (ult && ult.numTrabajadores + (ult.numTitulares ?? 0) <= PARAMETROS_SEMAFORO.maxPersonasMicro)
      add("TALLER_MICRO", "info", `taller:${t.id}`, `${PARAMETROS_SEMAFORO.maxPersonasMicro} personas o menos: la marca solo ve el estado.`);
  }

  const cats = new Set(tiposPieza.map((t) => t.categoria));
  const sector: Marca["sector"] = cats.size === 2 ? "marroquineria_y_confeccion" : cats.has("confeccion") ? "confeccion" : "marroquineria";
  const seed: Seed = {
    meta: {
      descripcion: `Dataset SINTÉTICO del escenario «${op.escenario}»: talleres, pedidos y plantillas inventados.`,
      version: "pipeline-datos",
      fechaCorte: mesActual ? `${sumarMeses(mesActual, 1)}-28` : "",
      mesEvaluacionActual: mesActual,
      mesesConCertificado: mesesInforme,
      minutosEstandar: `escandallo sintético (versión vigente en ${mesActual || "—"})`,
    },
    parametros: PARAMETROS_SEMAFORO,
    marca: { id: op.marcaId, nombre: op.marcaNombre, sector, pais: "ES", limiteReduccionPedidosPctPorDefecto: 20 },
    tiposPieza,
    talleres,
    pedidos,
    certificadosHoras: certificados,
    alertas: [],
    planesCorreccion: [],
    metricasImpacto: {
      marcaId: op.marcaId, fechaCorte: "", ultimoMesCertificado: mesActual,
      principal: { nombre: "", trabajadoresLineaBase: 0, siguenEmpleadosYDeAlta: 0, porcentaje: 0, mesesDesdeAlerta: 0, definitiva: false, fechaDefinitiva: "" },
      horasRegularizadas: 0,
      trabajadoresAcompanados: { iniciados: 0, resueltosFavorables: 0, altasDirectas: 0 },
      pedidosMantenidos: { horasMensualesReferencia: 0, horasMensualesDurantePlan: 0, porcentajeMantenido: 0, reduccionPct: 0, limiteReduccionPct: 20, cumpleLimite: true },
      fallos: { despidosTrasAlerta: 0, planesConCaidaPedidosSobreLimite: 0 },
      planesActivos: 0,
    },
    esperado: null,
  };

  return {
    ok,
    dataset: {
      seed,
      procedencia,
      incidencias: inc,
      metaIngesta: {
        escenario: op.escenario,
        semilla: op.semilla ?? null,
        versionGenerador: op.versionGenerador ?? "",
        hashCrudo: op.hashCrudo,
        archivos: metaArchivos,
      },
      escandalloVersiones: versiones
        .map((x): VersionEscandallo => ({
          tipoPiezaId: x.tipoPiezaId, version: x.version, minutos: x.minutos, vigenteDesde: x.vigenteDesde, autor: x.autor, categoria: x.categoria,
        }))
        .sort((a, b) => a.tipoPiezaId.localeCompare(b.tipoPiezaId) || a.version - b.version),
      cuotas,
      indicadoresIT,
      fuenteHoras,
    },
  };
}

// ======================= Informe de calidad =======================

const RE_FILA = /^(\S+\.csv):(\d+)/;
const RE_TALLER = /taller:([^\s·]+)/;
const GRAVEDADES: Gravedad[] = ["bloqueante", "aviso", "info"];

/** Taller al que se refiere una incidencia (por su `entidad`), o null. */
export const tallerDeIncidencia = (i: Incidencia): string | null => RE_TALLER.exec(i.entidad)?.[1] ?? null;

/** Filas de un archivo con al menos una incidencia bloqueante (= filas descartadas de ese archivo). */
function filasBloqueadas(d: DatasetIngerido, archivo: string): number {
  const s = new Set<string>();
  for (const i of d.incidencias) {
    const m = RE_FILA.exec(i.entidad);
    if (i.gravedad === "bloqueante" && m && m[1] === archivo) s.add(m[2]);
  }
  return s.size;
}

/**
 * Filas de otras marcas descartadas por separación entre marcas (pedidos + cuota). Se deduce sin guardar nada de la otra
 * marca: filas del archivo − filas ingeridas − filas descartadas con incidencia bloqueante.
 */
export function filasOtrasMarcas(d: DatasetIngerido): number {
  const filas = (a: string) => d.metaIngesta.archivos.find((x) => x.nombre === a)?.filas;
  let n = 0;
  const fp = filas(ARCHIVO.pedidos_erp);
  if (fp !== undefined) n += fp - d.seed.pedidos.length - filasBloqueadas(d, ARCHIVO.pedidos_erp);
  const fc = filas(ARCHIVO.cuota_facturacion);
  if (fc !== undefined) n += fc - (d.cuotas?.length ?? 0) - filasBloqueadas(d, ARCHIVO.cuota_facturacion);
  return n;
}

/** Completitud por taller y mes: ✓ informe a tiempo · ✗ falta · R rectificado · T tardío (RT: ambas). */
export function completitud(d: DatasetIngerido): { meses: Mes[]; filas: { tallerId: string; celdas: string[] }[] } {
  const s = d.seed;
  const fin = s.meta.mesEvaluacionActual;
  const ini = [...s.pedidos.map((p) => p.inicio.slice(0, 7)), ...s.certificadosHoras.map((c) => c.mes)].filter((m) => m <= fin).sort()[0];
  const meses = ini && fin ? mesesEntre(ini, fin) : [];
  const filas = s.talleres.map((t) => ({
    tallerId: t.id,
    celdas: meses.map((m) => {
      const cs = s.certificadosHoras.filter((c) => c.tallerId === t.id && c.mes === m);
      if (!cs.length) return "✗";
      const tardio = cs.every((c) => c.fechaEmision >= primerDiaTras(m, 2));
      const marca = `${cs.length > 1 ? "R" : ""}${tardio ? "T" : ""}`;
      return marca || "✓";
    }),
  }));
  return { meses, filas };
}

/** Informe de calidad legible (Markdown). Todo es SINTÉTICO. */
export function informeCalidad(d: DatasetIngerido, ok: boolean): string {
  const s = d.seed;
  const inc = d.incidencias;
  const nG = (g: Gravedad) => inc.filter((i) => i.gravedad === g).length;
  const fuentes = Object.values(d.fuenteHoras ?? {});
  const subencargos = s.pedidos.filter((p) => p.origen === "subencargo").length;
  const otras = filasOtrasMarcas(d);

  // Por código y gravedad
  const porCodigo = new Map<string, Record<Gravedad, number>>();
  for (const i of inc) {
    const k = porCodigo.get(i.codigo) ?? { bloqueante: 0, aviso: 0, info: 0 };
    k[i.gravedad]++;
    porCodigo.set(i.codigo, k);
  }
  const tot = (r: Record<Gravedad, number>) => r.bloqueante + r.aviso + r.info;

  // Completitud
  const comp = completitud(d);
  const celdas = comp.filas.flatMap((f) => f.celdas);
  const conInforme = celdas.filter((c) => c !== "✗").length;

  // Peor 5 % de talleres por nº de incidencias
  const porTaller = new Map<string, Incidencia[]>();
  for (const i of inc) {
    const t = tallerDeIncidencia(i);
    if (t) porTaller.set(t, [...(porTaller.get(t) ?? []), i]);
  }
  const k = Math.max(1, Math.ceil(s.talleres.length * 0.05));
  const peores = [...porTaller.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])).slice(0, k);

  // Filas descartadas por motivo
  const descartes = new Map<string, number>();
  for (const i of inc.filter((x) => x.gravedad === "bloqueante")) {
    const archivo = RE_FILA.exec(i.entidad)?.[1] ?? `${i.entidad} (archivo entero)`;
    const clave = `${archivo}|${i.codigo}`;
    descartes.set(clave, (descartes.get(clave) ?? 0) + 1);
  }

  const bloq = inc.filter((i) => i.gravedad === "bloqueante");
  const avisos = inc.filter((i) => i.gravedad === "aviso");
  const MAX = 60;
  const lista = (xs: Incidencia[]) => [
    ...xs.slice(0, MAX).map((i) => `- **${i.codigo}** · ${i.entidad} · ${i.detalle}`),
    ...(xs.length > MAX ? [`- … y ${xs.length - MAX} más (ver dataset.json).`] : []),
  ];
  const mesCorto = (m: Mes) => `${m.slice(5, 7)}/${m.slice(2, 4)}`;

  const L: string[] = [
    `# Informe de calidad · escenario «${d.metaIngesta.escenario}» · SINTÉTICO`,
    "",
    "> Datos SINTÉTICOS: talleres, pedidos, informes y cuotas inventados por el generador. Ninguna cifra describe un taller real.",
    "",
    "## Resumen",
    "",
    `- Estado de la ingesta: **${ok ? "OK" : "BLOQUEADA"}** · mes de evaluación ${s.meta.mesEvaluacionActual || "—"} · hash de los archivos crudos: \`${d.metaIngesta.hashCrudo.slice(0, 16)}…\``,
    `- Archivos: ${d.metaIngesta.archivos.map((a) => `${a.nombre} (${a.filas} filas)`).join(" · ") || "ninguno"}`,
    `- Talleres: ${s.talleres.length} (${s.talleres.filter((t) => t.pais === "ES").length} ES · ${s.talleres.filter((t) => t.pais === "IT").length} IT · ${s.talleres.filter((t) => t.nivel > 1).length} subcontratas declaradas)`,
    `- Pedidos de la marca: ${s.pedidos.length} (${subencargos} subencargos) · piezas: ${s.tiposPieza.length} · versiones de escandallo: ${d.escandalloVersiones?.length ?? 0}`,
    `- Informes de horas: ${s.certificadosHoras.length} (${fuentes.filter((f) => f === "informe_es").length} informes de plantilla ES · ${fuentes.filter((f) => f === "lul_it").length} LUL IT) · cuotas de facturación de la marca: ${d.cuotas?.length ?? 0}`,
    `- Incidencias: ${nG("bloqueante")} bloqueantes (filas descartadas) · ${nG("aviso")} avisos · ${nG("info")} informativas`,
    `- Completitud de informes: ${conInforme} de ${celdas.length} taller·mes (${celdas.length ? pct(conInforme / celdas.length) : 0} %)`,
    "",
    "## Incidencias por código y gravedad",
    "",
    "| Código | Bloqueante | Aviso | Info | Total |",
    "|---|---|---|---|---|",
    ...[...porCodigo.entries()]
      .sort((a, b) => tot(b[1]) - tot(a[1]) || a[0].localeCompare(b[0]))
      .map(([c, r]) => `| ${c} | ${GRAVEDADES.map((g) => r[g] || "·").join(" | ")} | ${tot(r)} |`),
    ...(porCodigo.size ? [] : ["| (ninguna) | · | · | · | 0 |"]),
    "",
    "## Completitud por taller y mes",
    "",
    "✓ informe a tiempo · ✗ falta · R rectificado (gana la emisión más reciente) · T tardío (emitido después del mes siguiente)",
    "",
    `| Taller | ${comp.meses.map(mesCorto).join(" | ")} |`,
    `|---|${comp.meses.map(() => "---").join("|")}|`,
    ...comp.filas.map((f) => `| ${f.tallerId} | ${f.celdas.join(" | ")} |`),
    "",
    `## El 5 % de talleres con más incidencias (${k})`,
    "",
    ...(peores.length
      ? peores.map(([t, xs]) => {
          const c = new Map<string, number>();
          for (const i of xs) c.set(i.codigo, (c.get(i.codigo) ?? 0) + 1);
          return `- **${t}** · ${xs.length} incidencias · ${[...c.entries()].map(([x, n]) => `${x} ×${n}`).join(", ")}`;
        })
      : ["- Ningún taller tiene incidencias."]),
    "",
    "## Filas descartadas por motivo",
    "",
    ...(descartes.size
      ? ["| Archivo | Código | Filas |", "|---|---|---|", ...[...descartes.entries()].sort().map(([kk, n]) => `| ${kk.split("|")[0]} | ${kk.split("|")[1]} | ${n} |`)]
      : ["Ninguna fila descartada."]),
    "",
    `**${otras} filas de otras marcas descartadas por separación entre marcas** (pedidos y cuotas; no se dice de qué marca son).`,
    "",
    "## Detalle de bloqueantes",
    "",
    ...(bloq.length ? lista(bloq) : ["Ninguna."]),
    "",
    "## Detalle de avisos",
    "",
    ...(avisos.length ? lista(avisos) : ["Ninguno."]),
    "",
    "## Notas",
    "",
    "- Italia: las horas salen del LUL agregado (`ore_registrate_totali`). El motor v1 solo cuenta un informe italiano con Asse.Co vigente (`viaAsseCo`); el score v2 no lo exige y usa Asse.Co y DURC como indicadores de calidad.",
    "- Códigos usados por cercanía (el contrato no tiene uno propio): rebaja de minutos > 20 % entre versiones → `MINUTOS_SIN_CONTRASTAR` (aviso); informe italiano sin Asse.Co → `FIRMANTE_INCOHERENTE` (info); nivel o padre incoherente en talleres → `TIPO_INVALIDO` / `REFERENCIA_DESCONOCIDA`; subencargo a un taller que no es subcontrata del taller origen → `REFERENCIA_DESCONOCIDA`; ninguna versión de escandallo vigente → `FECHAS_INVALIDAS` (aviso); falta el archivo → `CABECERA_INVALIDA`.",
    "- Las incidencias son indicios de calidad del dato, no conclusiones sobre ningún taller. Trama propone; decide una persona.",
    "",
    "> Privacidad: el dataset solo contiene totales por taller y mes; ningún dato por persona (ni nombres, ni DNI/NIE, ni horas por persona, ni situación migratoria). Cada marca ve solo sus pedidos y sus cuotas.",
  ];
  return L.join("\n") + "\n";
}
