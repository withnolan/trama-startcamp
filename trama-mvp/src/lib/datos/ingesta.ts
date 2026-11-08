/**
 * Ingesta: archivos crudos → validación → Seed compatible con el motor actual + procedencia + incidencias.
 * NUNCA lee la verdad oculta del generador. Las filas con incidencia bloqueante se excluyen y se informa de ellas.
 * Privacidad: solo totales por taller y mes; ningún campo por persona.
 */
import { sumarMeses } from "../calculo/semaforo.ts";
import type { CertificadoHoras, Mes, Pedido, Seed, Taller, TipoPieza } from "../calculo/tipos.ts";
import {
  ARCHIVO,
  CABECERAS,
  type ArchivosCrudos,
  type Convenio,
  type DatasetIngerido,
  type Incidencia,
  type MetaIngesta,
  type NombreArchivo,
  type ParametrosPublicos,
  type Procedencia,
} from "./contratos.ts";
import { leerCsv } from "./csv.ts";
import { horasMesConvenio, PARAMETROS_SEMAFORO } from "./parametros.ts";

const RE_FECHA = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const RE_MES = /^\d{4}-(0[1-9]|1[0-2])$/;
const fechaValida = (s: string) => {
  if (!RE_FECHA.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return d.toISOString().slice(0, 10) === s;
};
const r2 = (x: number) => Math.round(x * 100) / 100;

export interface OpcionesIngesta {
  escenario: string;
  marcaId: string;
  marcaNombre: string;
  parametros: ParametrosPublicos;
  hashCrudo: string;
  semilla?: number | null;
  versionGenerador?: string;
}

export interface ResultadoIngesta {
  ok: boolean; // false si algún archivo imprescindible está bloqueado entero
  dataset: DatasetIngerido;
}

export function ingerir(archivos: ArchivosCrudos, op: OpcionesIngesta): ResultadoIngesta {
  const inc: Incidencia[] = [];
  const procedencia: Record<string, Procedencia> = {};
  let ok = true;
  const metaArchivos: MetaIngesta["archivos"] = [];

  const abrir = (nombre: NombreArchivo, obligatorio: boolean) => {
    const texto = archivos[nombre];
    const archivo = ARCHIVO[nombre];
    if (texto === undefined) {
      if (obligatorio) {
        ok = false;
        inc.push({ codigo: "CABECERA_INVALIDA", gravedad: "bloqueante", entidad: archivo, detalle: "Falta el archivo." });
      }
      return [];
    }
    const csv = leerCsv(texto);
    const esperada = CABECERAS[nombre].join(";");
    if (csv.cabecera.join(";") !== esperada) {
      ok = false;
      inc.push({
        codigo: "CABECERA_INVALIDA", gravedad: "bloqueante", entidad: archivo,
        detalle: `Cabecera «${csv.cabecera.join(";")}»; se esperaba «${esperada}». Archivo descartado entero.`,
      });
      return [];
    }
    for (const e of csv.errores)
      inc.push({ codigo: "TIPO_INVALIDO", gravedad: "bloqueante", entidad: `${archivo}:${e.numero}`, detalle: `Fila descartada: ${e.detalle}.` });
    metaArchivos.push({ nombre: archivo, filas: csv.filas.length });
    return csv.filas.map((f) => ({ ...f, archivo }));
  };

  const bloquear = (entidad: string, codigo: Incidencia["codigo"], detalle: string) =>
    inc.push({ codigo, gravedad: "bloqueante", entidad, detalle: `Fila descartada: ${detalle}` });

  const entero = (s: string) => (/^-?\d+$/.test(s) ? Number(s) : NaN);
  const decimal = (s: string) => (/^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN);

  // ---------- Talleres ----------
  const talleres: Taller[] = [];
  const convenioDe: Record<string, Convenio> = {};
  for (const { numero, valores: v, archivo } of abrir("talleres", true)) {
    const ent = `${archivo}:${numero}`;
    if (talleres.some((t) => t.id === v.taller_id)) { bloquear(ent, "DUPLICADO", `taller ${v.taller_id} repetido.`); continue; }
    if (v.pais !== "ES" && v.pais !== "IT") { bloquear(ent, "TIPO_INVALIDO", `país «${v.pais}».`); continue; }
    const nivel = entero(v.nivel);
    if (![1, 2, 3].includes(nivel)) { bloquear(ent, "TIPO_INVALIDO", `nivel «${v.nivel}».`); continue; }
    if (v.convenio !== "textil" && v.convenio !== "marroquineria") { bloquear(ent, "TIPO_INVALIDO", `convenio «${v.convenio}».`); continue; }
    talleres.push({
      id: v.taller_id, nombre: v.nombre, pais: v.pais, ciudad: v.ciudad, provincia: v.provincia,
      nivel: nivel as 1 | 2 | 3, padreId: v.padre_id || null, subcontrataIds: [], declaracionSubcontrata: null,
      especialidad: v.especialidad,
    });
    convenioDe[v.taller_id] = v.convenio;
    procedencia[`taller:${v.taller_id}`] = { archivo, fila: numero, tipoFuente: "declarado", fechaDato: "" };
  }
  for (const t of talleres) if (t.padreId) talleres.find((p) => p.id === t.padreId)?.subcontrataIds.push(t.id);
  const tallerDe = (id: string) => talleres.find((t) => t.id === id);

  // ---------- Escandallo (versión vigente más reciente) ----------
  const tiposPieza: TipoPieza[] = [];
  const versiones: Record<string, { version: number; minutos: number; categoria: string }> = {};
  for (const { numero, valores: v, archivo } of abrir("escandallo", true)) {
    const ent = `${archivo}:${numero}`;
    const minutos = decimal(v.minutos);
    const version = entero(v.version);
    if (!(minutos > 0) || !(version > 0)) { bloquear(ent, "TIPO_INVALIDO", "minutos o versión no válidos."); continue; }
    if (!fechaValida(v.vigente_desde)) { bloquear(ent, "FECHAS_INVALIDAS", `vigente_desde «${v.vigente_desde}».`); continue; }
    const prev = versiones[v.tipo_pieza_id];
    if (!prev || version > prev.version) versiones[v.tipo_pieza_id] = { version, minutos, categoria: v.categoria };
    procedencia[`pieza:${v.tipo_pieza_id}`] = { archivo, fila: numero, tipoFuente: "declarado", fechaDato: v.vigente_desde, firmante: v.autor };
  }
  for (const [id, x] of Object.entries(versiones)) {
    const categoria = x.categoria === "confeccion" ? "confeccion" : "marroquineria";
    tiposPieza.push({ id, nombre: id, categoria, minutosEstandar: x.minutos, fuente: "ficha_costes" });
    const suelo = op.parametros.sueloMinutos[categoria === "marroquineria" ? "marroquineria" : "americana_forrada"];
    if (suelo && suelo.valor === null)
      inc.push({ codigo: "MINUTOS_SIN_CONTRASTAR", gravedad: "info", entidad: `pieza:${id}`, detalle: "No hay suelo público de minutos para esta categoría." });
    else if (suelo && suelo.valor !== null && x.minutos < suelo.valor)
      inc.push({ codigo: "MINUTOS_BAJO_SUELO", gravedad: "aviso", entidad: `pieza:${id}`, detalle: `${x.minutos} min < suelo de ${suelo.valor} min.` });
  }

  // ---------- Pedidos ----------
  const pedidos: Pedido[] = [];
  for (const { numero, valores: v, archivo } of abrir("pedidos_erp", true)) {
    const ent = `${archivo}:${numero}`;
    if (v.marca_id !== op.marcaId) continue; // cada marca solo ingiere lo suyo
    if (pedidos.some((p) => p.id === v.pedido_id)) { bloquear(ent, "DUPLICADO", `pedido ${v.pedido_id} repetido.`); continue; }
    if (!tallerDe(v.taller_id)) { bloquear(ent, "REFERENCIA_DESCONOCIDA", `taller ${v.taller_id} no está en talleres.csv.`); continue; }
    if (!versiones[v.tipo_pieza_id]) { bloquear(ent, "REFERENCIA_DESCONOCIDA", `pieza ${v.tipo_pieza_id} sin escandallo.`); continue; }
    const unidades = entero(v.unidades);
    if (!(unidades > 0)) { bloquear(ent, "TIPO_INVALIDO", `unidades «${v.unidades}».`); continue; }
    if (!fechaValida(v.inicio) || !fechaValida(v.fin) || v.fin < v.inicio) { bloquear(ent, "FECHAS_INVALIDAS", `${v.inicio} → ${v.fin}.`); continue; }
    if (v.origen !== "marca" && v.origen !== "subencargo") { bloquear(ent, "TIPO_INVALIDO", `origen «${v.origen}».`); continue; }
    pedidos.push({
      id: v.pedido_id, marcaId: v.marca_id, tallerId: v.taller_id, tipoPiezaId: v.tipo_pieza_id, unidades,
      inicio: v.inicio, fin: v.fin, referencia: v.referencia, origen: v.origen, pedidoOrigenId: v.pedido_origen_id || null,
    });
    procedencia[`pedido:${v.pedido_id}`] = { archivo, fila: numero, tipoFuente: "declarado", fechaDato: v.inicio };
  }

  // ---------- Informes de plantilla (España) ----------
  const certificados: CertificadoHoras[] = [];
  for (const { numero, valores: v, archivo } of abrir("informe_plantilla_es", true)) {
    const ent = `${archivo}:${numero}`;
    const t = tallerDe(v.taller_id);
    if (!t) { bloquear(ent, "REFERENCIA_DESCONOCIDA", `taller ${v.taller_id}.`); continue; }
    if (!RE_MES.test(v.mes) || !fechaValida(v.fecha_emision)) { bloquear(ent, "FECHAS_INVALIDAS", `mes ${v.mes} / emisión ${v.fecha_emision}.`); continue; }
    if (v.fecha_emision < `${sumarMeses(v.mes, 1)}-01`) { bloquear(ent, "FECHAS_INVALIDAS", `emitido (${v.fecha_emision}) antes de terminar el mes ${v.mes}.`); continue; }
    if (t.pais !== "ES" || v.firmante_tipo !== "gestor_laboral") {
      bloquear(ent, "FIRMANTE_INCOHERENTE", `taller de ${t.pais} con firmante «${v.firmante_tipo}»: en España firma el gestor laboral.`);
      continue;
    }
    const plantilla = decimal(v.plantilla_media_ponderada);
    const trab = entero(v.num_trabajadores);
    const tit = entero(v.num_titulares);
    const hTit = decimal(v.horas_titulares);
    if (!(plantilla >= 0) || !(trab >= 0) || !(tit >= 0) || !(hTit >= 0)) { bloquear(ent, "TIPO_INVALIDO", "cifras de plantilla no válidas."); continue; }
    if (plantilla > trab + 0.001)
      inc.push({ codigo: "PLANTILLA_INCOHERENTE", gravedad: "aviso", entidad: ent, detalle: `Plantilla media ${plantilla} > ${trab} trabajadores de alta.` });
    if (trab > 0 && plantilla / trab < 0.5)
      inc.push({ codigo: "JORNADA_FUERA_RANGO", gravedad: "aviso", entidad: ent, detalle: `Jornada media ponderada del ${Math.round((plantilla / trab) * 100)} %: mucha parcialidad, revisar.` });
    const limiteTardio = `${sumarMeses(v.mes, 2)}-01`;
    if (v.fecha_emision >= limiteTardio)
      inc.push({ codigo: "INFORME_TARDIO", gravedad: "aviso", entidad: ent, detalle: `Informe de ${v.mes} emitido el ${v.fecha_emision}.` });
    if (certificados.some((c) => c.tallerId === t.id && c.mes === v.mes))
      inc.push({ codigo: "RECTIFICACION", gravedad: "info", entidad: ent, detalle: `Nuevo informe de ${v.mes} para ${t.id}: gana el de emisión más reciente.` });

    const id = `CS-${t.id}-${v.mes}-${numero}`;
    certificados.push({
      id, tallerId: t.id, mes: v.mes,
      // Horas de alta = plantilla media ponderada por jornada × horas al mes del convenio del taller.
      horasTotalesCotizadas: r2(plantilla * horasMesConvenio(op.parametros, convenioDe[t.id])),
      numTrabajadores: trab,
      ...(tit > 0 ? { numTitulares: tit, horasTitulares: hTit } : {}),
      firmante: { tipo: "gestor_laboral", despacho: v.despacho, numeroColegiado: v.ccc_ficticio, viaAsseCo: false },
      fechaEmision: v.fecha_emision,
    });
    procedencia[`informe:${id}`] = { archivo, fila: numero, tipoFuente: "oficial", fechaDato: v.mes, firmante: v.despacho };
  }

  // ---------- Completitud y tamaño ----------
  const meses = [...new Set(pedidos.flatMap((p) => [p.inicio.slice(0, 7), p.fin.slice(0, 7)]))].sort();
  const mesesInforme = [...new Set(certificados.map((c) => c.mes))].sort();
  const mesActual: Mes = mesesInforme.at(-1) ?? meses.at(-1) ?? "";
  for (const t of talleres) {
    const faltan = meses.filter((m) => m <= mesActual && !certificados.some((c) => c.tallerId === t.id && c.mes === m));
    if (faltan.length)
      inc.push({ codigo: "FALTA_INFORME", gravedad: "aviso", entidad: `taller:${t.id}`, detalle: `Sin informe de ${faltan.join(", ")}.` });
    const ult = certificados.filter((c) => c.tallerId === t.id).sort((a, b) => a.mes.localeCompare(b.mes)).at(-1);
    if (ult && ult.numTrabajadores + (ult.numTitulares ?? 0) <= PARAMETROS_SEMAFORO.maxPersonasMicro)
      inc.push({ codigo: "TALLER_MICRO", gravedad: "info", entidad: `taller:${t.id}`, detalle: "3 personas o menos: la marca solo ve el estado." });
  }

  const seed: Seed = {
    meta: {
      descripcion: `Dataset SINTÉTICO del escenario «${op.escenario}»: talleres, pedidos y plantillas inventados.`,
      version: "pipeline-datos",
      fechaCorte: mesActual ? `${sumarMeses(mesActual, 1)}-28` : "",
      mesEvaluacionActual: mesActual,
      mesesConCertificado: mesesInforme,
      minutosEstandar: "escandallo sintético (versión vigente)",
    },
    parametros: PARAMETROS_SEMAFORO,
    marca: { id: op.marcaId, nombre: op.marcaNombre, sector: "marroquineria", pais: "ES", limiteReduccionPedidosPctPorDefecto: 20 },
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
    },
  };
}

/** Informe de calidad legible (Markdown). */
export function informeCalidad(d: DatasetIngerido, ok: boolean): string {
  const porCodigo = new Map<string, { gravedad: string; n: number }>();
  for (const i of d.incidencias) {
    const k = porCodigo.get(i.codigo) ?? { gravedad: i.gravedad, n: 0 };
    k.n++;
    porCodigo.set(i.codigo, k);
  }
  const bloq = d.incidencias.filter((i) => i.gravedad === "bloqueante");
  const avisos = d.incidencias.filter((i) => i.gravedad === "aviso");
  const L: string[] = [
    `# Informe de calidad · escenario «${d.metaIngesta.escenario}» (datos SINTÉTICOS)`,
    "",
    `- Estado de la ingesta: **${ok ? "OK" : "BLOQUEADA"}** · hash de los archivos crudos: \`${d.metaIngesta.hashCrudo.slice(0, 16)}…\``,
    `- Archivos: ${d.metaIngesta.archivos.map((a) => `${a.nombre} (${a.filas} filas)`).join(" · ")}`,
    `- Ingeridos: ${d.seed.talleres.length} talleres · ${d.seed.pedidos.length} pedidos · ${d.seed.certificadosHoras.length} informes de plantilla · ${d.seed.tiposPieza.length} piezas`,
    `- Incidencias: ${bloq.length} bloqueantes (filas descartadas) · ${avisos.length} avisos · ${d.incidencias.length - bloq.length - avisos.length} informativas`,
    "",
    "## Incidencias por código",
    "",
    "| Código | Gravedad | Nº |",
    "|---|---|---|",
    ...[...porCodigo.entries()].sort((a, b) => b[1].n - a[1].n).map(([c, x]) => `| ${c} | ${x.gravedad} | ${x.n} |`),
    "",
    "## Detalle (bloqueantes y avisos)",
    "",
    ...[...bloq, ...avisos].map((i) => `- **${i.codigo}** · ${i.entidad} · ${i.detalle}`),
    "",
    "> Privacidad: el dataset solo contiene totales por taller y mes; ningún dato por persona.",
  ];
  return L.join("\n") + "\n";
}
