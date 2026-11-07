# DATA_MODEL — Trama (MVP)

Modelo de datos, algoritmo del semáforo, minutos estándar, métricas de impacto y casos de prueba. `seed.json` cumple todo lo que se describe aquí, y su bloque `esperado` trae los resultados que deben reproducir los tests de la librería TypeScript.

**Convenciones**
- Fechas `ISODate` = `'YYYY-MM-DD'`. Meses `Mes` = `'YYYY-MM'`. Las ventanas de producción incluyen el día de inicio y el de fin.
- Horas en horas decimales. Durante el cálculo no se redondea nada. Para mostrar, horas a 2 decimales. El ratio se redondea a **4 decimales** (`Math.round(x * 1e4) / 1e4`) **antes** de compararlo con los umbrales.
- Países del MVP: `ES` e `IT`.
- Privacidad: Trama solo guarda datos agregados por taller. No guarda nunca datos de trabajadores individuales, ni precios, ni datos de otras marcas.

---

## 1. Interfaces TypeScript

```ts
// ---------- Básicos ----------
export type ISODate = string;              // 'YYYY-MM-DD'
export type Mes = string;                  // 'YYYY-MM'
export type Pais = 'ES' | 'IT';
export type EstadoSemaforo = 'verde' | 'ambar' | 'rojo' | 'sin_datos';

// ---------- Marca ----------
export interface Marca {
  id: string;
  nombre: string;
  sector: 'marroquineria' | 'confeccion' | 'marroquineria_y_confeccion';
  pais: Pais;
  limiteReduccionPedidosPctPorDefecto: number; // 0-100; se copia a cada PlanCorreccion
}

// ---------- Taller y cadena ----------
export interface DeclaracionSubcontrata {
  momento: 'previa' | 'tras_alerta';  // ¿estaba declarada antes o se declaró a raíz de una alerta?
  fecha: ISODate;
  alertaId: string | null;            // obligatorio si momento = 'tras_alerta'
}

export interface Taller {
  id: string;
  nombre: string;
  pais: Pais;
  ciudad: string;
  provincia: string;
  nivel: 1 | 2 | 3;                   // 1 = proveedor directo de la marca; 2 = subcontrata de un nivel 1; 3 = subcontrata de un nivel 2
  padreId: string | null;             // null si nivel 1
  subcontrataIds: string[];           // hijos directos. Invariante: = talleres cuyo padreId === id
  declaracionSubcontrata: DeclaracionSubcontrata | null; // null si nivel 1
  especialidad: string;
}

// ---------- Tipo de pieza ----------
export interface TipoPieza {
  id: string;
  nombre: string;
  categoria: 'marroquineria' | 'confeccion';
  minutosEstandar: number;            // minutos de mano de obra directa por unidad, a ritmo estándar (100 %)
  fuente: 'estimacion_demo' | 'ficha_costes';
}

// ---------- Pedido ----------
export interface Pedido {
  id: string;
  marcaId: string;
  tallerId: string;                   // quien produce: el proveedor (origen 'marca') o la subcontrata (origen 'subencargo')
  tipoPiezaId: string;
  unidades: number;                   // entero > 0
  inicio: ISODate;                    // ventana de producción (inclusiva)
  fin: ISODate;                       // >= inicio
  referencia: string;
  origen: 'marca' | 'subencargo';     // 'subencargo' = parte de un pedido de la marca que el proveedor pasa a una subcontrata declarada
  pedidoOrigenId: string | null;      // solo para 'subencargo'
  fechaDeclaracion?: ISODate;         // solo para 'subencargo'
}
// Invariantes de un subencargo s con pedido de origen o:
//   s.tipoPiezaId === o.tipoPiezaId;  taller(s).padreId === o.tallerId;  Σ unidades de los subencargos de o <= o.unidades

// ---------- Certificado de horas ----------
export interface Firmante {
  tipo: 'gestor_laboral' | 'consulente_del_lavoro'; // ES → gestor_laboral; IT → consulente_del_lavoro
  despacho: string;
  numeroColegiado: string;
  viaAsseCo: boolean;                 // IT: tiene que ser true (asseverazione Asse.Co)
}

export interface CertificadoHoras {
  id: string;
  tallerId: string;
  mes: Mes;
  horasTotalesCotizadas: number;      // TOTAL de la plantilla asalariada en el mes: jornada contratada (incluye vacaciones,
                                      // bajas y permisos retribuidos) + horas extra declaradas. Nunca se desglosa por trabajador.
  numTrabajadores: number;            // asalariados de alta en el mes
  numTitulares?: number;              // titulares o socios trabajadores de alta (autónomo RETA / artigiano INPS)
  horasTitulares?: number;            // horas declaradas por los titulares; computan con un tope de 160 h/mes por titular
  firmante: Firmante;
  fechaEmision: ISODate;
  retroactivo?: boolean;              // emitido más tarde (p. ej. por una subcontrata declarada tras la alerta)
  // Solo talleres bajo un plan de corrección (datos agregados, firmados por el mismo firmante):
  trabajadoresLineaBaseDeAlta?: number; // cuántos trabajadores de la línea base del plan siguen de alta este mes
  despidosEnMes?: number;
}

// ---------- Alerta (instantánea inmutable) ----------
export interface Alerta {
  id: string;
  marcaId: string;
  tallerId: string;                   // raíz de la cadena (nivel 1)
  mesEvaluado: Mes;
  ventana: Mes[];
  fecha: ISODate;
  estado: 'rojo';
  horasNecesarias: number;
  horasCotizadas: number;
  ratio: number | null;
  nota?: string;
}

// ---------- Plan de corrección ----------
export type EstadoHito = 'pendiente' | 'en_curso' | 'cumplido' | 'incumplido';
// "vencido" no se guarda: se deriva (estado !== 'cumplido' && hoy > fechaLimite)

export interface Hito {
  id: string;
  descripcion: string;
  responsable: 'marca' | 'proveedor' | 'subcontrata' | 'revisor' | 'ong_sindicato';
  fechaLimite: ISODate;
  fechaCumplimiento: ISODate | null;
  estado: EstadoHito;
}

export interface RevisorIndependiente {
  tipo: 'sindicato' | 'ong' | 'consulente_asseveratore';
  nombre: string;
  pais: Pais;
  independiente: true;
  declaracionAusenciaConflicto: boolean;
}

export interface ClausulaAntiDespido {
  vigenteDesde: ISODate;              // fecha de la alerta
  vigenteHasta: ISODate;
  alcance: 'toda_la_cadena';
  texto: string;
  incumplimientos: number;
}

export interface PlanCorreccion {
  id: string;
  marcaId: string;
  alertaId: string;
  tallerRaizId: string;
  talleresIncluidos: string[];        // raíz + subcontratas (la lista crece con cada extensión)
  extensiones: { tallerId: string; fecha: ISODate; motivo: string }[];
  estado: 'en_curso' | 'cerrado_cumplido' | 'cerrado_incumplido';
  fechaInicio: ISODate;
  fechaFinPrevista: ISODate;          // fecha de la alerta + 6 meses
  revisor: RevisorIndependiente;
  hitos: Hito[];
  clausulaAntiDespido: ClausulaAntiDespido;
  limiteReduccionPedidosPct: number;  // 0-100: la marca no puede bajar más de este % (en horas estándar/mes)
  periodoReferenciaPedidos: Mes[];    // = ventana de la alerta
  proteccionTrabajadores: {
    lineaBase: { tallerId: string; deAltaEnAlerta: number; sinAltaIdentificados: number }[]; // recuento agregado
    altasDirectas: number;            // personas sin alta pero con permiso válido, dadas de alta sin necesidad de trámite
    regularizaciones: {
      tallerId: string;
      via: 'arraigo_sociolaboral' | 'art18_via_social'; // ES | IT
      iniciadas: number; resueltasFavorables: number; denegadas: number;
    }[];
    entidadAcompanante: string;
  };
  protocoloLegal: { activado: boolean; fecha: ISODate | null; nota: string };
}

// ---------- Métricas de impacto (agregadas por marca) ----------
export interface MetricasImpacto {
  marcaId: string;
  fechaCorte: ISODate;
  ultimoMesCertificado: Mes;
  principal: {
    nombre: string;
    trabajadoresLineaBase: number;
    siguenEmpleadosYDeAlta: number;
    porcentaje: number;               // 0-100, 2 decimales
    mesesDesdeAlerta: number;
    definitiva: boolean;              // false hasta que se cumplen los 6 meses
    fechaDefinitiva: ISODate;
  };
  horasRegularizadas: number;
  trabajadoresAcompanados: { iniciados: number; resueltosFavorables: number; altasDirectas: number };
  pedidosMantenidos: {
    horasMensualesReferencia: number;
    horasMensualesDurantePlan: number;
    porcentajeMantenido: number;
    reduccionPct: number;
    limiteReduccionPct: number;
    cumpleLimite: boolean;
  };
  fallos: { despidosTrasAlerta: number; planesConCaidaPedidosSobreLimite: number };
  planesActivos: number;
}

// ---------- Resultado del cálculo (no se guarda: se calcula) ----------
export interface Evaluacion {
  tipo: 'taller' | 'cadena';
  tallerId: string;
  mes: Mes;                           // último mes de la ventana
  ventana: Mes[];
  estado: EstadoSemaforo;
  horasNecesarias?: number;
  horasCotizadas?: number;
  ratio?: number | null;              // null = ∞ (0 h cotizadas con carga > 0)
  micro?: boolean;
  mesesSinCertificado?: Mes[];
  certificadosSubcontrataQueFaltan?: { tallerId: string; mes: Mes }[]; // solo en tipo 'cadena'
}
```

Funciones de la librería (puras y deterministas):

```ts
horasPedido(p: Pedido, t: TipoPieza): number
repartoMensual(p: Pedido, t: TipoPieza): Record<Mes, number>
evaluarTaller(datos: Seed, tallerId: string, mes: Mes): Evaluacion
evaluarCadena(datos: Seed, raizId: string, mes: Mes): Evaluacion
estadoPanel(datos: Seed, raizId: string, mes: Mes): EstadoSemaforo
calcularMetricas(datos: Seed, fechaCorte: ISODate): MetricasImpacto
```

---

## 2. Algoritmo del semáforo

### 2.1 Carga mínima de un pedido y reparto entre meses

```
h(p)    = unidades(p) × minutosEstandar(tipo(p)) / 60
D(p)    = fin(p) − inicio(p) + 1                      (días naturales de la ventana)
d(p, m) = días de [inicio(p), fin(p)] que caen en el mes m
h(p, m) = h(p) × d(p, m) / D(p)
```

El reparto es proporcional a los días naturales. Lo que cae fuera de la ventana evaluada no cuenta.
*Ejemplo (PED-014 del seed):* 915 tarjeteros × 40 min = 610 h, del 15‑jun al 14‑ago (61 días) → jun 16 d = **160 h**, jul 31 d = **310 h**, ago 14 d = **140 h**.

### 2.2 Carga atribuida a un taller

```
C(T, m) = Σ h(p, m)  para los pedidos p con tallerId = T                        (pedidos de la marca y subencargos recibidos)
        − Σ h(s, m)  para los subencargos s cuyo pedido de origen tiene tallerId = T (lo que T pasa a sus subcontratas)

C(T, V) = max(0, Σ_{m ∈ V} C(T, m))
```

### 2.3 Horas cotizadas

```
H(T, m) = horasTotalesCotizadas + min(horasTitulares, 160 × numTitulares)    (del certificado válido de T y m)
```

- **Certificado válido**: el tipo de firmante corresponde al país (ES → `gestor_laboral`; IT → `consulente_del_lavoro` con `viaAsseCo = true`). Un certificado inválido cuenta como si no existiera.
- **Rectificaciones**: si hay varios certificados válidos del mismo taller y mes, vale el de `fechaEmision` más reciente (si empatan, el `id` mayor).
- **Titulares** (autónomo en RETA / artigiano en INPS): cotizan por base y no por horas, así que se cuentan las horas declaradas con un tope de 160 h/mes por titular. El firmante certifica que están dados de alta.

### 2.4 Ventana móvil

```
V(M) = { M−2, M−1, M }
```

El mes M se evalúa cuando llega su certificado, hacia el día 5 del mes siguiente. Entran todos los pedidos que caen en la ventana, también la parte que todavía está planificada.

### 2.5 Ratio y umbrales

```
R = round4( C(T, V) / Σ_{m ∈ V} H(T, m) )
```

Las reglas se aplican **en este orden**:

| # | Condición | Estado | Ratio |
|---|---|---|---|
| 1 | Falta el certificado válido de algún mes de V | `sin_datos` | — (se listan los `mesesSinCertificado`) |
| 2 | C = 0 | `verde` | 0 |
| 3 | Σ H = 0 (y C > 0) | `rojo` | `null` (∞) |
| 4 | R ≤ **0,85** | `verde` | R |
| 5 | 0,85 < R ≤ **U_rojo** | `ambar` | R |
| 6 | R > **U_rojo** | `rojo` | R |

`U_rojo = 1,10` en general y `1,25` si el taller es **micro**. Micro significa que trabajadores + titulares ≤ 3 en los tres meses de la ventana.

**De dónde salen los umbrales.** Son supuestos que se pueden configurar en `parametros` y que habrá que calibrar con datos de pilotos:

| Parámetro | Valor | Qué representa |
|---|---|---|
| a | 12 % | Horas cotizadas que no se trabajan: vacaciones y festivos retribuidos (≈ 8 %) + bajas y permisos (≈ 4 %) |
| p | 3 % | Tiempo no productivo del personal de producción: preparación, limpieza, control final, mantenimiento |
| e_max | 125 % | Rendimiento máximo que puede sostener una plantilla muy experta por encima del minuto estándar |

- **Verde ≤ 0,85 = (1 − a − p) × 100 %.** La carga mínima de esta marca cabe en el tiempo productivo normal a ritmo estándar. No hace falta suponer nada a favor del taller.
- **Ámbar (0,85-1,10]: picos legítimos.** La carga no cabe a ritmo estándar, pero puede explicarse sin fraude: operarias por encima del estándar, menos ausencias que la media, campaña con horas extra y descanso compensatorio dentro de la ventana, producción adelantada o retrasada respecto a la fecha planificada, o error de los minutos estándar. Las horas extra legítimas **no necesitan margen propio** porque se cotizan y ya están dentro del certificado. Además, el tope legal (ES: 80 h/año, art. 35.2 ET; IT: 250 h/año salvo convenio, D.Lgs. 66/2003) limita cuánto pueden subir. La ventana de 3 meses absorbe un pico concentrado: un mes al 130 % y dos al 85 % dan una media de 1,00, que es ámbar y no rojo.
- **Rojo > 1,10 = (1 − a) × e_max = 0,88 × 1,25.** Aunque no hubiera ningún tiempo no productivo y toda la plantilla rindiera al 125 % durante tres meses seguidos trabajando solo para esta marca, la carga seguiría sin caber en las horas cotizadas.
- **Micro: U_rojo = 1,00 × e_max = 1,25.** Con 1-3 personas, la media del 12 % de ausencias no es fiable (basta con que una persona no coja vacaciones en el trimestre para que cambie), así que se quita ese descuento y solo se mantiene el rendimiento máximo. Además se suman las horas de los titulares, que en los talleres pequeños suelen trabajar en producción.

**Qué hace cada color**: verde → nada. Ámbar → se pide una explicación al proveedor, sin plan. Rojo → alerta: revisión, declaración obligatoria de subcontratas y plan de corrección. Nunca hay rescisión automática. Sin datos → recordatorio al taller y al firmante (obligación contractual aparte del semáforo).

### 2.6 Cadena y estado en el panel

- **Miembros de la cadena** = la raíz (nivel 1) + todas sus subcontratas declaradas (recursivo).
- `C_cad(V) = max(0, Σ_{T ∈ cadena} Σ_{m ∈ V} C(T, m))`. Los subencargos se cancelan entre emisor y receptor, así que el resultado es la carga de los pedidos de la marca a la cadena.
- `H_cad(V) = Σ_{T ∈ cadena} Σ_{m ∈ V} H(T, m)`. Si falta un certificado de la **raíz** → `sin_datos`. Si falta el de una **subcontrata**, ese mes cuenta **0 h** y se anota en `certificadosSubcontrataQueFaltan`. Así, declarar una subcontrata sin aportar horas certificadas no puede “limpiar” un rojo.
- Micro de la cadena: la suma de personas de todos los miembros ≤ 3 en los tres meses.
- Se aplican las mismas reglas de 2.5.
- **`estadoPanel(raíz)`** = el peor estado entre {cadena, cada miembro evaluado por separado}, con el orden `rojo > ambar > sin_datos > verde`. El panel lista los talleres de nivel 1 con `estadoPanel` y, anidadas, sus subcontratas con su estado individual.
- **Alertas**: se crea una `Alerta` cuando `estadoPanel` pasa a rojo y no hay un plan abierto para esa cadena. La alerta es una instantánea y **no se recalcula**. Mientras el plan siga abierto, los rojos nuevos no crean alertas nuevas: van al seguimiento del plan. Al declarar después una subcontrata, el cálculo actual (una función pura de los datos de hoy) la incluye en todas las ventanas.

### 2.7 Casos límite

| Caso | Regla |
|---|---|
| Falta un certificado (o es inválido) | `sin_datos`, **nunca rojo**: la falta de un dato no es una prueba. Se muestra “falta certificado de jun‑2026”. |
| Taller nuevo con menos de 3 meses de certificados | `sin_datos` (historial insuficiente). |
| Taller de 1-3 personas | Umbral rojo 1,25 y horas de titulares con tope de 160 h/mes (2.3 y 2.5). |
| Pedido que cruza meses | Reparto por días naturales (2.1). En cada ventana solo cuentan los días que caen dentro. |
| Pedido que empieza antes o termina después de los meses certificados | Los días fuera de la ventana evaluada no cuentan en ella. |
| Subencargo con fechas distintas a las del pedido de origen | La carga mensual del emisor puede salir negativa algún mes; se acota a 0 a nivel de ventana. |
| Certificado con 0 h y pedidos > 0 | `rojo`, ratio ∞ (es una declaración firmada de que no hay plantilla). |
| Sin pedidos de la marca en la ventana | `verde`, ratio 0. |
| Cierre de agosto o vacaciones colectivas | El reparto por días naturales los ignora y la ventana de 3 meses los absorbe. |
| Certificado rectificado | Vale el de emisión más reciente (2.3). |

### 2.8 Por qué el resultado es un mínimo

1. **Numerador por defecto.** Solo cuenta los pedidos de **esta** marca, y el taller suele trabajar para otras. Los minutos estándar son de mano de obra directa a ritmo del 100 %, sin reprocesos, piezas rechazadas, muestras ni esperas.
2. **Denominador por exceso.** Incluye **todas** las horas cotizadas: vacaciones, bajas y personal que no produce (administración, encargados).
3. Por eso **la utilización real ≥ R**. Si R > 1,10, la real también lo es. Si la ficha de costes de la marca paga 240 min de mano de obra por chaqueta, esos minutos tienen que aparecer en alguna nómina.
4. La otra cara: **un verde no certifica nada**. Solo dice que, con los datos de esta marca, no se ve una imposibilidad. El rojo es una alerta que abre una revisión, no una prueba.

---

## 3. Minutos estándar por tipo de pieza (demo)

> **ESTIMACIÓN ilustrativa para la demo.** No son datos de ninguna empresa. En producción saldrán de las **fichas de costes (escandallos)** de cada modelo, de los minutos de mano de obra que la marca o el fabricante principal ya usan para fijar el precio, versionados por temporada (`fuente: 'ficha_costes'`).

| id | Tipo de pieza | Categoría | Min/ud | h/ud | Incluye (mano de obra directa) |
|---|---|---|---|---|---|
| TP-CHAQ-CACH | Chaqueta de cachemir forrada | confección | 240 | 4,00 | corte, confección, forrado, ojales, planchado final |
| TP-ABRIGO-CACH | Abrigo de cachemir | confección | 360 | 6,00 | ídem, más entretelas y forro completo |
| TP-JERSEY-CACH | Jersey de punto de cachemir | confección | 90 | 1,50 | remallado, confección, acabado (sin el tejido) |
| TP-BOLSO-ESTR | Bolso de mano estructurado de piel | marroquinería | 360 | 6,00 | corte, refuerzos, montaje, cosido, cantos pintados, herrajes |
| TP-BOLSO-TOTE | Bolso tote de piel | marroquinería | 180 | 3,00 | corte, cosido, cantos, asas |
| TP-CINTURON | Cinturón de piel con hebilla | marroquinería | 45 | 0,75 | corte, cantos, cosido, hebilla |
| TP-CARTERA | Cartera / billetero de piel | marroquinería | 90 | 1,50 | corte, rebajado, montaje, cosido, cantos |
| TP-TARJETERO | Tarjetero de piel | marroquinería | 40 | 0,67 | corte, montaje, cantos |

---

## 4. Métricas de impacto

Se calculan por plan y se suman por marca para los KPIs del panel. **Meses del plan** = los meses posteriores al `mesEvaluado` de la alerta, hasta el último certificado disponible. **Periodo de referencia** = la ventana de la alerta.

| Métrica | Definición y cálculo | Seed |
|---|---|---|
| **Principal: siguen empleados y de alta a 6 meses** | Línea base `B = Σ_T (deAltaEnAlerta + sinAltaIdentificados)` para los talleres del plan. El recuento sin alta lo hace el revisor/ONG de forma agregada, sin nombres. `S = Σ_T trabajadoresLineaBaseDeAlta` del certificado del mes en que se cumplen 6 meses desde la alerta. **Métrica = S / B × 100.** Antes de esa fecha es *provisional* y se calcula con el último certificado. Las personas regularizadas y dadas de alta cuentan como éxito. | (7 + 7) / 18 = **77,78 %**, provisional (mes 3 de 6; definitiva el 2027‑02‑07) |
| **Horas regularizadas** | `HR = Σ_T Σ_{m ∈ meses del plan} (H(T, m) − Hbase_T)`, con `Hbase_T` = media mensual de H(T) en el periodo de referencia. Es una cifra neta: si sale negativa, señala un problema. Las subcontratas aportan su base con certificados retroactivos. | T1: 0 + 160 + 160; T2: 0 + 320 + 480 → **1.120 h** |
| **Trabajadores acompañados en su regularización** | `iniciados = Σ regularizaciones.iniciadas` (arraigo sociolaboral en ES / permiso art. 18 vía social en IT, con acompañamiento de ONG o sindicato). También se muestran `resueltosFavorables` y `altasDirectas` (personas con permiso válido dadas de alta sin trámite). | **4** iniciados, 0 resueltos, 3 altas directas |
| **Pedidos mantenidos durante el plan** | `% = (horas estándar/mes de los pedidos de origen 'marca' a la cadena durante el plan) / (horas estándar/mes en el periodo de referencia) × 100`, con el reparto de 2.1. Se mide en horas estándar y no en unidades para poder comparar tipos de pieza distintos. `reducción = 100 − %`. **Cumple** si reducción ≤ `limiteReduccionPedidosPct`. | 2.400 / 2.666,67 = **90 %** → reducción del 10 % ≤ 20 % → cumple |
| **Fallo: despido tras la alerta** | `Σ despidosEnMes` de los talleres del plan desde la alerta. Cualquier valor > 0 es un incumplimiento de la cláusula, salvo que el revisor valide la baja. | **0** |
| **Fallo: caída de pedidos sobre el límite** | Número de planes con reducción > límite. | **0** |

---

## 5. Casos de prueba

Salvo que se indique otra cosa, los talleres son IT con firmante válido y se evalúa la ventana may‑jul 2026 (mes `2026-07`).

| ID | Entrada | Salida esperada |
|---|---|---|
| **TC‑01 (demo)** | 7 trabajadores, 1.120 h/mes × 3 = **3.360 h**; 2.000 chaquetas (240 min) del 01‑may al 31‑jul | C = **8.000 h**, R = **2,3810** → **rojo** |
| TC‑02 | ES, 10 trab., 1.600 h/mes (4.800 h); 1.000 totes (180 min) | C = 3.000 h, R = 0,6250 → verde |
| TC‑03 límite verde | 3.360 h; 714 chaquetas | C = 2.856 h, R = 0,8500 → **verde** (≤ es verde) |
| TC‑04 | 3.360 h; 875 chaquetas | C = 3.500 h, R = 1,0417 → ámbar |
| TC‑05 límite rojo | 3.360 h; a) 924 chaquetas; b) 925 chaquetas | a) 3.696 h, R = 1,1000 → **ámbar**; b) 3.700 h, R = 1,1012 → **rojo** |
| TC‑06 falta certificado | Igual que TC‑01, pero sin certificado de jun | **sin_datos**, `mesesSinCertificado = ['2026-06']` (no rojo) |
| TC‑07 cruza meses | ES, 4 trab., 640 h/mes (1.920 h/ventana) de abr a sep; 305 chaquetas (1.220 h) del 15‑jun al 14‑ago (61 d) | Reparto: jun 320, jul 620, ago 280. Ventana abr‑jun: 320 h, R = 0,1667 verde. Jun‑ago: 1.220 h, R = 0,6354 verde. Jul‑sep: 900 h, R = 0,4688 verde |
| TC‑08 micro | ES, 2 trab. (320 h/mes) + 1 titular que declara 180 h (cuentan 160) → 480 h/mes = 1.440 h; a) 2.550 tarjeteros; b) 2.850 tarjeteros | a) 1.700 h, R = 1,1806, micro → **ámbar** (no micro sería rojo); b) 1.900 h, R = 1,3194 → rojo |
| TC‑09 cadena (seed, may‑jul) | T1: PED‑001 (2.000 chaq.) − subencargo PED‑002 (1.300 a T2); T1 3.360 h; T2 4 trab. 640 h/mes = 1.920 h | T1 individual 2.800 h, R = 0,8333 verde. T2 5.200 h, R = 2,7083 rojo. Cadena 8.000 / 5.280, R = 1,5152 rojo. **Panel: rojo** |
| TC‑10 subcontrata sin certificados | Como TC‑09, pero T2 no ha entregado ningún certificado | T2 **sin_datos**. T1 individual 0,8333 verde. Cadena 8.000 / 3.360 = 2,3810 **rojo** (T2 cuenta 0 h). Panel: rojo |
| TC‑11 sin pedidos | 3.360 h; ningún pedido | C = 0 → verde, R = 0 |
| TC‑12 cero horas | Certificados de 0 h y 0 trab.; 100 chaquetas | C = 400 h → **rojo**, R = `null` (∞) |
| TC‑13 firmante no válido | Taller IT; el certificado de jun lo firma un `gestor_laboral` | Certificado inválido → **sin_datos** (`['2026-06']`) |
| TC‑14 rectificación | Como TC‑01, con dos certificados de jun: 1.120 h (emitido 06‑jul) y 1.280 h (emitido 20‑jul) | Se usa el de 1.280 h → 3.520 h, R = 2,2727 → rojo |
| TM‑01 pedidos mantenidos (seed) | Referencia may‑jul: 8.000 h / 3 = 2.666,67 h/mes; plan ago‑oct: PED‑003, 1.800 chaq. = 7.200 h / 3 = 2.400 h/mes; límite 20 % | 90 % mantenido, reducción del 10 % → cumple |
| TM‑02 caída de pedidos | Como TM‑01, pero PED‑003 = 1.500 chaquetas | 2.000 h/mes → 75 %, reducción del 25 % > 20 % → **fallo** |

---

## 6. Resultados esperados con `seed.json`

Marca ficticia **Ordessa**. Certificados de may a oct 2026. Mes actual: `2026-10` (ventana ago‑oct). Valor = ratio → estado.

| Taller | Ciudad | Jul (may‑jul) | Ago (jun‑ago) | Sep (jul‑sep) | **Oct (ago‑oct)** |
|---|---|---|---|---|---|
| T1 Manifattura Lince — **cadena** (T1 + T2) | Abbiategrasso (IT) | 1,5152 R | 1,4641 R | 1,2968 R | **1,1250 R** |
| T1 individual (sin lo subcontratado) | | 0,8333 V | 0,9136 A | 0,9461 A | 0,9783 A |
| T2 Laboratorio Gelso (subcontrata, declarada tras la alerta) | Rozzano (IT) | 2,7083 R | 2,4275 R | 1,8478 R | **1,3235 R** |
| T3 Marroquinería Alcotán | Ubrique (ES) | 0,8299 V | 0,8474 V | 0,8982 A | **0,9807 A** |
| T4 Taller del Almendro | Elche (ES) | 0,8333 V | 0,8192 V | 0,8055 V | **0,6597 V** |
| T5 Pelletteria Ontano | Scandicci (IT) | 0,6042 V | 0,6711 V | 0,6847 V | **0,6458 V** |
| T6 Marroquinería Lentisco (micro: 2 + 1 titular) | Igualada (ES) | 0,7014 V | 0,8129 V | 0,7871 V | **0,6571 V** |

- **Alerta AL‑001** (2026‑08‑07, instantánea antes de la declaración): 8.000 h / 3.360 h = **2,381 → rojo**. Es el caso de la demo.
- Panel en oct: T1 **rojo** (cadena, mejorando: 1,52 → 1,13), T2 **rojo**, T3 **ámbar** (pico de campaña de Navidad), T4, T5 y T6 **verde**.
- Plan PC‑001 en curso: extendido a T2 el 2026‑08‑20, límite de reducción de pedidos del 20 %, cláusula anti‑despido para toda la cadena y protocolo legal activado.
