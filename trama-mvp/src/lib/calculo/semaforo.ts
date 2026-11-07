/**
 * Semáforo de Trama (specs/DATA_MODEL.md §2). Funciones puras y deterministas.
 * Los umbrales salen de `datos.parametros`; durante el cálculo no se redondea nada salvo el ratio (§2.5).
 */
import type {
  CertificadoHoras,
  EstadoSemaforo,
  Evaluacion,
  Firmante,
  ISODate,
  Mes,
  Pais,
  Pedido,
  Seed,
  Taller,
  TipoPieza,
} from "./tipos";

/** Gravedad para ordenar y elegir el peor estado: rojo > ambar > sin_datos > verde. */
export const GRAVEDAD: Record<EstadoSemaforo, number> = { verde: 0, sin_datos: 1, ambar: 2, rojo: 3 };

// ---------- Fechas ----------
const dia = (d: ISODate) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)) / 864e5;

export function sumarMeses(m: Mes, n: number): Mes {
  const i = +m.slice(0, 4) * 12 + +m.slice(5, 7) - 1 + n;
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;
}

/** V(M) = {M−n+1, …, M} (§2.4). */
export const ventanaMeses = (m: Mes, n: number): Mes[] => Array.from({ length: n }, (_, k) => sumarMeses(m, k - n + 1));

/** Meses de `desde` a `hasta`, ambos incluidos (vacío si desde > hasta). */
export function mesesEntre(desde: Mes, hasta: Mes): Mes[] {
  const r: Mes[] = [];
  for (let m = desde; m <= hasta; m = sumarMeses(m, 1)) r.push(m);
  return r;
}

// ---------- Carga (§2.1, §2.2) ----------
/** h(p) = unidades × minutos estándar / 60 */
export const horasPedido = (p: Pedido, t: TipoPieza): number => (p.unidades * t.minutosEstandar) / 60;

/** h(p, m) por días naturales, fechas inclusivas. */
export function repartoMensual(p: Pedido, t: TipoPieza): Record<Mes, number> {
  const h = horasPedido(p, t);
  const ini = dia(p.inicio);
  const fin = dia(p.fin);
  const reparto: Record<Mes, number> = {};
  for (const m of mesesEntre(p.inicio.slice(0, 7), p.fin.slice(0, 7))) {
    const a = Math.max(ini, dia(`${m}-01`));
    const b = Math.min(fin, dia(`${sumarMeses(m, 1)}-01`) - 1);
    reparto[m] = (h * (b - a + 1)) / (fin - ini + 1); // multiplicar antes de dividir: cifras exactas cuando se puede
  }
  return reparto;
}

export function taller(datos: Seed, id: string): Taller {
  const t = datos.talleres.find((x) => x.id === id);
  if (!t) throw new Error(`Taller desconocido: ${id}`);
  return t;
}

/** h(p, m) de un pedido (0 si el mes no cae en su ventana). */
export function horasPedidoMes(datos: Seed, p: Pedido, mes: Mes): number {
  const t = datos.tiposPieza.find((x) => x.id === p.tipoPiezaId);
  if (!t) throw new Error(`Tipo de pieza desconocido: ${p.tipoPiezaId}`);
  return repartoMensual(p, t)[mes] ?? 0;
}

/** C(T, m) = pedidos recibidos por T − subencargos que T pasa a sus subcontratas (solo pedidos de la marca). */
export function cargaMes(datos: Seed, tallerId: string, mes: Mes): number {
  let c = 0;
  for (const p of datos.pedidos) {
    if (p.marcaId !== datos.marca.id) continue;
    if (p.tallerId === tallerId) c += horasPedidoMes(datos, p, mes);
    if (p.origen === "subencargo" && datos.pedidos.find((o) => o.id === p.pedidoOrigenId)?.tallerId === tallerId)
      c -= horasPedidoMes(datos, p, mes);
  }
  return c;
}

// ---------- Horas cotizadas (§2.3) ----------
export const firmanteValido = (f: Firmante, pais: Pais): boolean =>
  pais === "ES" ? f.tipo === "gestor_laboral" : f.tipo === "consulente_del_lavoro" && f.viaAsseCo;

/** Certificado válido de T y m; si hay rectificaciones, el de emisión más reciente (empate: id mayor). */
export function certificadoValido(datos: Seed, tallerId: string, mes: Mes): CertificadoHoras | null {
  const pais = taller(datos, tallerId).pais;
  return datos.certificadosHoras.reduce<CertificadoHoras | null>(
    (mejor, c) =>
      c.tallerId === tallerId &&
      c.mes === mes &&
      firmanteValido(c.firmante, pais) &&
      (!mejor || c.fechaEmision > mejor.fechaEmision || (c.fechaEmision === mejor.fechaEmision && c.id > mejor.id))
        ? c
        : mejor,
    null,
  );
}

/** Último certificado válido del taller (mes más reciente), o null. */
export function ultimoCertificado(datos: Seed, tallerId: string): CertificadoHoras | null {
  const meses = datos.certificadosHoras.filter((c) => c.tallerId === tallerId).map((c) => c.mes).sort().reverse();
  for (const m of meses) {
    const c = certificadoValido(datos, tallerId, m);
    if (c) return c;
  }
  return null;
}

/** H(T, m) = horas cotizadas + horas de titulares con tope por titular. */
export const horasCertificado = (c: CertificadoHoras, topeTitular: number): number =>
  c.horasTotalesCotizadas + Math.min(c.horasTitulares ?? 0, topeTitular * (c.numTitulares ?? 0));

/** Personas de alta: trabajadores + titulares. */
export const personas = (c: CertificadoHoras): number => c.numTrabajadores + (c.numTitulares ?? 0);

/** H(T, m), con 0 si no hay certificado válido. */
export function horasCotizadasMes(datos: Seed, tallerId: string, mes: Mes): number {
  const c = certificadoValido(datos, tallerId, mes);
  return c ? horasCertificado(c, datos.parametros.topeHorasTitularMes) : 0;
}

// ---------- Evaluación (§2.5, §2.6) ----------
/** La raíz y todas sus subcontratas declaradas (recursivo). */
export function miembrosCadena(datos: Seed, raizId: string): string[] {
  return [raizId, ...taller(datos, raizId).subcontrataIds.flatMap((id) => miembrosCadena(datos, id))];
}

function evaluar(datos: Seed, tipo: Evaluacion["tipo"], raizId: string, miembros: string[], mes: Mes): Evaluacion {
  const P = datos.parametros;
  const ventana = ventanaMeses(mes, P.mesesVentana);
  const mesesSinCertificado: Mes[] = [];
  const certificadosSubcontrataQueFaltan: { tallerId: string; mes: Mes }[] = [];
  const personasMes = ventana.map(() => 0);
  let carga = 0;
  let horas = 0;
  for (const id of miembros)
    ventana.forEach((m, i) => {
      carga += cargaMes(datos, id, m);
      const c = certificadoValido(datos, id, m);
      if (!c) {
        // falta de la raíz → sin datos; falta de una subcontrata → ese mes cuenta 0 h
        if (id === raizId) mesesSinCertificado.push(m);
        else certificadosSubcontrataQueFaltan.push({ tallerId: id, mes: m });
        return;
      }
      horas += horasCertificado(c, P.topeHorasTitularMes);
      personasMes[i] += personas(c);
    });

  const C = Math.max(0, carga);
  const micro = mesesSinCertificado.length === 0 && personasMes.every((n) => n <= P.maxPersonasMicro);
  const base: Evaluacion = { tipo, tallerId: raizId, mes, ventana, estado: "sin_datos", horasNecesarias: C, micro };
  if (tipo === "cadena") base.certificadosSubcontrataQueFaltan = certificadosSubcontrataQueFaltan;

  if (mesesSinCertificado.length) return { ...base, mesesSinCertificado }; // regla 1: nunca rojo por falta de datos
  return { ...base, horasCotizadas: horas, ...clasificar(C, horas, micro, P) };
}

/** Reglas 2-6 de §2.5 (la 1, falta de certificado, va antes). La usan la evaluación y el simulador. */
export function clasificar(
  carga: number,
  horas: number,
  micro: boolean,
  P: Seed["parametros"],
): { estado: EstadoSemaforo; ratio: number | null } {
  if (carga === 0) return { estado: "verde", ratio: 0 };
  if (horas === 0) return { estado: "rojo", ratio: null }; // ∞
  const f = 10 ** P.decimalesRatio;
  const ratio = Math.round((carga / horas) * f) / f; // se redondea ANTES de comparar
  const uRojo = micro ? P.umbralRojoMicro : P.umbralRojo;
  return { ratio, estado: ratio <= P.umbralVerde ? "verde" : ratio <= uRojo ? "ambar" : "rojo" };
}

export const evaluarTaller = (datos: Seed, tallerId: string, mes: Mes): Evaluacion =>
  evaluar(datos, "taller", tallerId, [tallerId], mes);

export const evaluarCadena = (datos: Seed, raizId: string, mes: Mes): Evaluacion =>
  evaluar(datos, "cadena", raizId, miembrosCadena(datos, raizId), mes);

/** Peor estado entre la cadena y cada miembro evaluado por separado. */
export function estadoPanel(datos: Seed, raizId: string, mes: Mes): EstadoSemaforo {
  return [evaluarCadena(datos, raizId, mes), ...miembrosCadena(datos, raizId).map((id) => evaluarTaller(datos, id, mes))]
    .map((e) => e.estado)
    .reduce((peor, e) => (GRAVEDAD[e] > GRAVEDAD[peor] ? e : peor));
}
