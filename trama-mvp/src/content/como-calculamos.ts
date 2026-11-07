// Página /como-calculamos (specs/DATA_MODEL.md §2-§3, DESIGN §3). Dueño: agente Legal.
// Frases cortas: se proyecta. El ejemplo es la alerta de la demo (TC-01: 8.000 h frente a 3.360 h).
// Concepto: «horas de alta» (personas de alta × jornada pactada), nunca «horas cotizadas».
import type { PaginaTexto } from "./tipos";

export const COMO_CALCULAMOS: PaginaTexto = {
  titulo: "Cómo calculamos",
  entradilla:
    "Cada mes comparamos el trabajo que la marca encarga a un taller con las horas de alta de su plantilla. Si no cabe, el semáforo lo señala. Es una alerta, no una prueba: ayuda a decidir dónde mirar.",
  secciones: [
    {
      id: "carga",
      titulo: "Carga mínima: pedidos × minutos estándar",
      parrafos: [
        "Para cada pedido de la marca: unidades × minutos estándar de ese tipo de pieza.",
        "Los minutos estándar son mano de obra directa por unidad, a ritmo normal (100 %).",
        "En esta demo son una estimación ilustrativa. En producción salen de las fichas de costes (escandallos): los minutos que la marca ya usa para fijar el precio.",
        "Si el proveedor pasa parte de un pedido a una subcontrata declarada, esa carga se le resta a él y se suma a la subcontrata.",
      ],
      nota: "Ejemplo de la demo (ficticio): la ficha de costes de la marca fija 240 min = 4 h de mano de obra por chaqueta forrada.",
    },
    {
      id: "horas",
      titulo: "Horas de alta: un informe mensual por taller",
      parrafos: [
        "Horas de alta = personas dadas de alta × su jornada pactada (convenio o contrato), sumadas por taller.",
        "España: el gestor laboral o graduado social las saca del Informe de Trabajadores en Alta (ITA) de cada código de cuenta de cotización, que incluye el coeficiente de parcialidad, y firma solo el total.",
        "Italia: el consulente del lavoro las extrae del Libro Unico del Lavoro (LUL), que ya registra las horas. La asseverazione Asse.Co es otra cosa: un control anual de regularidad que hace un asseveratore independiente del taller, complementario al informe mensual.",
        "No hablamos de horas cotizadas: en España se cotiza por base, no por horas.",
        "Nunca hay horas por persona: ni nombres, ni nóminas, ni documentos de identidad. Trama recibe solo el total.",
        "Incluye vacaciones, bajas y permisos retribuidos, y las horas extra declaradas.",
        "Titulares o socios que trabajan en el taller: cuentan sus horas declaradas, con un tope de 160 h al mes por persona.",
        "Si firma alguien que no corresponde al país, el informe no cuenta.",
      ],
    },
    {
      id: "ventana",
      titulo: "Ventana móvil de 3 meses",
      parrafos: [
        "Comparamos siempre el trimestre que acaba en el último mes con informe: may–jul, jun–ago, jul–sep…",
        "Cada mes se evalúa cuando llega su informe, hacia el día 5 del mes siguiente.",
        "Un pedido que cruza meses se reparte por días naturales. Ejemplo: 610 h del 15 jun al 14 ago (61 días) → jun 160 h, jul 310 h, ago 140 h.",
        "Tres meses absorben un pico: un mes al 130 % y dos al 85 % dan una media de 1,00. Es ámbar, no rojo.",
      ],
    },
    {
      id: "umbrales",
      titulo: "Umbrales: qué hace cada color",
      parrafos: [
        "Ratio = carga mínima ÷ horas de alta de la ventana, redondeado a 4 decimales.",
        "Verde hasta 0,85 = 1 − a − p. Se descuentan las horas de alta que no se trabajan (a = 12 %: vacaciones, festivos, bajas y permisos) y el tiempo no productivo (p = 3 %: preparación, limpieza, control final). La carga cabe sin suponer nada a favor del taller.",
        "Ámbar hasta 1,10: picos legítimos. Plantilla experta, menos ausencias, campaña con horas extra declaradas, producción adelantada o minutos estándar mal fijados.",
        "Rojo por encima de 1,10 = (1 − a) × e_max = 0,88 × 1,25. Ni con toda la plantilla al 125 % (e_max) durante tres meses, sin tiempo no productivo y trabajando solo para esta marca, cabría la carga.",
        "Talleres de 1 a 3 personas: rojo por encima de 1,25 = e_max. Con tan pocas personas la media de ausencias no es fiable y no se descuenta. Se suman las horas de los titulares.",
        "Sin el informe de algún mes de la ventana no hay semáforo: «sin datos». Que falte un dato no es una prueba.",
      ],
      tabla: {
        cabecera: ["Estado", "Ratio", "Qué pasa"],
        filas: [
          ["Verde · En margen", "≤ 0,85", "Nada. Seguimiento mensual."],
          ["Ámbar · Vigilar", "> 0,85 y ≤ 1,10", "Se pide una explicación al proveedor. Sin plan."],
          [
            "Rojo · Revisar",
            "> 1,10 (1-3 personas: > 1,25)",
            "Alerta: revisión, declaración de subcontratas y plan de corrección. Nunca rescisión automática.",
          ],
          ["Sin datos", "—", "Falta el informe: recordatorio al taller y a su gestor. Nunca verde ni rojo."],
        ],
        pie: "Las horas extra no necesitan margen propio: si se declaran, ya están en el informe. Su tope legal es de 80 h al año en España (art. 35.2 ET) y de 250 h en Italia salvo convenio (art. 5 D.Lgs. 66/2003).",
      },
      nota: "Un verde no es un sello: significa que las horas cuadran con los pedidos de esta marca, y nada más. Por contrato, no puede usarse en publicidad ni como sello público.",
    },
    {
      id: "ejemplo",
      titulo: "El caso de la demo",
      parrafos: ["Un proveedor directo con 7 personas de alta. Ventana may–jul 2026."],
      tabla: {
        cabecera: ["Concepto", "Cálculo", "Resultado"],
        filas: [
          ["Carga mínima", "2.000 chaquetas × 4 h", "8.000 h"],
          ["Horas de alta", "7 personas × 160 h × 3 meses", "3.360 h"],
          ["Ratio", "8.000 h ÷ 3.360 h", "2,38×"],
          ["Estado", "2,38 > 1,10", "Rojo · Revisar"],
        ],
        pie: "Faltan ≈4.640 h. Ni al 125 % y sin ausencias cabrían: 3.360 h × 1,25 = 4.200 h.",
      },
      nota: "La alerta del 7 ago 2026 es una instantánea: no se recalcula. Después, el proveedor declaró su subcontrata y el plan se extendió a ella.",
    },
    {
      id: "caso-publico",
      titulo: "Un caso reconstruido con datos públicos",
      parrafos: [
        "El proveedor directo no tenía taller propio: capacidad de 0 h.",
        "Su subproveedor tenía 7 personas × ≈1.750 h al año ≈ 12.250 h al año.",
        "Entregaba entre 6.000 y 7.000 chaquetas al año: entre 1,75 y 2 h disponibles por chaqueta.",
        "La auditoría no comprobó la capacidad. Estaba en los números. Nadie hizo la cuenta.",
        "Con el umbral rojo de 1,10, sale rojo si cada chaqueta necesita más de ≈135 min (2,25 h) de mano de obra directa con 6.000 al año, o más de ≈115 min (1,9 h) con 7.000.",
        "No hay un dato publicado para una chaqueta de cachemir. Usamos 180 min, lo que declara un taller premium (estimación con fuente pública): 18.000 h necesarias frente a 12.250 h de alta, 1,47× → rojo.",
      ],
      nota: "Anonimizado: sin nombres de empresas ni personas. Las fuentes de prensa están en la documentación del equipo, no en la app.",
    },
    {
      id: "cadena",
      titulo: "Toda la cadena",
      parrafos: [
        "Tras un rojo, el proveedor declara todas sus subcontratas. La cláusula y el informe mensual se extienden a ellas.",
        "La carga que el proveedor pasa a una subcontrata se le resta a él y se suma a ella. El total de la cadena es la carga de los pedidos de la marca.",
        "Si una subcontrata no entrega su informe, ese mes cuenta 0 h. Declarar una subcontrata sin horas de alta no limpia un rojo. Si falta el del proveedor, la cadena queda «sin datos».",
        "En el panel, cada proveedor muestra el peor estado entre su cadena completa y cada taller por separado: rojo › ámbar › sin datos › verde.",
      ],
    },
    {
      id: "minimo",
      titulo: "Por qué el resultado es un mínimo",
      parrafos: [
        "La carga se queda corta: solo cuenta los pedidos de esta marca, y el taller suele trabajar para otras.",
        "Los minutos estándar no incluyen reprocesos, piezas rechazadas, muestras ni esperas.",
        "Las horas se pasan: incluyen todas las de alta, también vacaciones, bajas y personal que no produce.",
        "Por eso la utilización real del taller es igual o mayor que el ratio. Si sale rojo con estos datos, con los datos completos también.",
        "La otra cara: un verde no certifica nada. Solo dice que, con los datos de esta marca, no se ve una imposibilidad.",
      ],
      nota: "Si la ficha de costes paga 240 minutos de mano de obra por chaqueta, esos minutos tienen que estar en alguna nómina.",
    },
    {
      id: "varias-marcas",
      titulo: "Talleres que trabajan para varias marcas",
      parrafos: [
        "El semáforo principal usa solo los pedidos de esta marca. Por eso es un mínimo.",
        "Para estimar la carga total usamos la parte de la facturación del taller que representa la marca: lo que le paga la marca ÷ la facturación del taller en el mismo trimestre (por ejemplo, la declarada en su autoliquidación trimestral del IVA o en sus cuentas anuales).",
        "Carga total ≈ carga de la marca ÷ esa cuota. Es una cota inferior si la marca paga por hora al menos lo mismo que las demás.",
        "La marca no ve la facturación del taller: Trama hace la cuenta y le devuelve solo el resultado, como estado.",
        "Si 3 o más marcas del taller usan Trama, Trama suma sus cargas como tercero. Cada marca solo recibe «revisión abierta», el mismo aviso sea cual sea la causa, nunca datos de otras. Con menos de 3, la suma solo la ven el taller y el revisor independiente.",
      ],
      nota: "Ejemplo: si eres el 20 % de su facturación y tus pedidos ya llenan media plantilla, la carga total estimada es 2,5× (0,5 ÷ 0,2).",
    },
    {
      id: "limites",
      titulo: "Límites del método",
      parrafos: ["El semáforo ayuda a decidir dónde mirar. No sustituye a la inspección, a las auditorías ni a las visitas."],
      lista: [
        "Mide capacidad, no condiciones de trabajo: salarios, seguridad o trato no se ven en un ratio.",
        "Depende de los minutos estándar: si están mal fijados, el semáforo también.",
        "Un taller grande puede dar verde aunque pase trabajo a una subcontrata no declarada: sus horas de alta lo tapan.",
        "El informe vale lo que su firmante: se apoya en la responsabilidad profesional del gestor laboral, del graduado social o del consulente del lavoro.",
        "La carga total estimada depende de la facturación declarada y de que el precio por hora sea comparable entre marcas.",
        "Un taller con menos de 3 meses de informes queda «sin datos» hasta tener historial.",
        "Una alerta es una instantánea: no se recalcula. Los datos nuevos van al seguimiento del plan.",
        "Los umbrales (a, p y e_max) son supuestos de diseño: se calibrarán con datos de pilotos.",
      ],
    },
  ],
};
