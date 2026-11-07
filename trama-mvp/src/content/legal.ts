// Página /legal (specs/LEGAL.md, revisada y contrastada con fuentes oficiales el 7-nov-2026). Dueño: agente Legal.
// Las normas se citan como marco: no se aplican a ningún taller ni empresa. Sin casos ni marcas reales.
import type { PaginaTexto } from "./tipos";

export const LEGAL: PaginaTexto = {
  titulo: "Legal y avisos",
  entradilla:
    "Cómo protege Trama a los trabajadores, a los talleres y a las marcas. Todo lo que ves en esta demo es ficticio.",
  secciones: [
    {
      id: "datos-ficticios",
      titulo: "Datos ficticios",
      parrafos: [
        "Esta es una demostración de producto para el Start Camp UC3M.",
        "Todos los datos son inventados: la marca Ordessa (marca ficticia), los talleres, los despachos, las entidades y las cifras. Solo las ciudades son reales. Cualquier parecido con empresas o personas reales es casual.",
        "Los cálculos ilustran el método. No son una auditoría, un informe pericial ni asesoramiento jurídico. Las cláusulas son borradores no vinculantes.",
        "La demo no recoge datos personales: no tiene registro, formularios ni analítica, y sus datos forman parte del propio código. No introduzcas datos reales.",
      ],
    },
    {
      id: "encaje",
      titulo: "Qué detecta Trama (y qué no)",
      parrafos: [
        "Trama detecta un posible desajuste de capacidad: más trabajo encargado que horas de alta en el taller. Es un indicio de trabajo no declarado o de jornadas excesivas.",
        "Las horas extraordinarias excesivas son uno de los 11 indicadores de la OIT. Un indicador aislado no permite concluir nada, y Trama no califica a ningún taller.",
        "Por qué importa: en Italia, el Tribunal de Milán ha aplicado la administración judicial (art. 34 D.Lgs. 159/2011) a empresas de moda que no verificaron la capacidad real de sus contratistas. Es una medida preventiva y temporal, no una multa.",
        "Trama ayuda a decidir dónde mirar y documenta que la empresa vigiló.",
      ],
      lista: [
        "No es un sello ni una certificación: un verde significa que las horas cuadran con los pedidos de esta marca, y nada más.",
        "Por contrato, el semáforo no puede usarse en publicidad ni como sello público.",
        "No prueba nada y no sustituye a la inspección, a la auditoría ni a los tribunales.",
      ],
    },
    {
      id: "alerta",
      titulo: "Una alerta no es una prueba",
      parrafos: [
        "Un rojo es un desajuste entre dos fuentes: la carga estimada de los pedidos y las horas de alta del informe mensual.",
        "Puede tener explicaciones legítimas: una subcontrata declarada tarde, minutos estándar mal fijados, un pico de campaña o un error en los datos.",
        "Por eso un rojo abre una revisión con el proveedor. Nunca es una sanción, nunca rescinde el contrato de forma automática y no justifica retirar pedidos.",
        "La interfaz describe el dato, la fuente y el periodo, y dice cuál es el siguiente paso. No atribuye conductas a nadie: afirmar más de lo que dicen los datos podría lesionar el honor de un taller identificable (España: LO 1/1982; Italia: art. 595 del Codice penale).",
      ],
      lista: [
        "Verde: ninguna acción. Seguimiento mensual.",
        "Ámbar: se pide una explicación al proveedor, sin plan.",
        "Rojo: revisión abierta, declaración obligatoria de subcontratas y plan de corrección con un revisor independiente.",
        "Sin datos: falta el informe mensual. Recordatorio al taller y a su gestor; nunca cuenta como rojo.",
      ],
    },
    {
      id: "competencia",
      titulo: "Competencia: cada marca ve solo lo suyo",
      parrafos: [
        "Varias marcas pueden compartir un taller. Si Trama trasladara entre ellas volúmenes, precios o cargas, podría facilitar un intercambio de información prohibido por el art. 101 TFUE. También puede responder el tercero que hace de intermediario.",
        "Cada marca ve solo su semáforo, calculado con sus propios pedidos frente a las horas de alta totales del taller.",
        "Nunca mostramos volúmenes, precios, cuotas ni nombres de otras marcas, ni cuántas trabajan con un taller.",
        "Si varias marcas usan Trama, el cálculo conjunto lo hace Trama como tercero. Si el taller está saturado en conjunto, ese dato solo lo ven el taller y el revisor independiente; la marca solo recibe «revisión abierta».",
        "La carga total estimada con la facturación del taller se entrega como estado, no como cifra, para que no se pueda deducir lo que le compran otras marcas.",
      ],
      nota: "Referencia: Directrices sobre acuerdos de cooperación horizontal (2023/C 259/01), capítulo 6, intercambio de información. Las estadísticas sectoriales, si las hubiera, serían agregadas e históricas.",
    },
    {
      id: "privacidad",
      titulo: "Privacidad (RGPD)",
      parrafos: [
        "Trama solo trata horas de alta agregadas por taller: taller, mes, personas de alta y horas totales. Nunca nombres, documentos de identidad, nóminas ni horas por persona (minimización, art. 5.1.c).",
        "En talleres de menos de 4 personas, el total permitiría deducir las horas de alguien identificable (art. 4.1 y considerando 26). Ahí la marca solo ve el semáforo, sin cifras, y el impacto se muestra agregado entre talleres. El umbral de 4 es una decisión de diseño, no una cifra legal.",
        "Base jurídica: interés legítimo en verificar la cadena de suministro (art. 6.1.f), con una ponderación documentada y un test de compatibilidad para reutilizar datos de alta y de jornada (art. 6.4). El taller informa a su plantilla (art. 14).",
        "Roles: el taller es responsable de sus datos laborales y su gestor o consulente, su encargado. La marca es responsable del control de su cadena. Trama es encargado de cada marca (art. 28), con los datos separados por marca y sin usarlos para fines propios.",
        "Ningún semáforo produce efectos por sí solo: siempre decide una persona tras la revisión (art. 22).",
        "Trama no trata datos de situación migratoria. No hacen falta para comparar horas, en Italia podrían ser datos relativos a infracciones penales (art. 10 RGPD; art. 10-bis TU Inmigración) y podrían volverse contra las personas que se quiere proteger. Del revisor solo llegan recuentos agregados.",
      ],
    },
    {
      id: "proteccion",
      titulo: "Protección de trabajadores",
      parrafos: [
        "La alerta no la pagan los trabajadores. El plan de corrección activa tres protecciones en toda la cadena y abre vías de regularización.",
      ],
      lista: [
        "Cláusula anti-despido: durante el plan y los 6 meses siguientes, ningún taller de la cadena despide ni da de baja por causas ligadas a la alerta. No impide bajas voluntarias ni despidos disciplinarios justificados; toda baja la revisa antes el revisor.",
        "Límite de reducción de pedidos: durante el plan, la marca no reduce sus pedidos a la cadena más de un porcentaje pactado (por defecto, 20 %) frente al periodo de referencia, en horas estándar al mes. Solo puede superarlo si el proveedor se niega a cooperar o incumple de forma grave.",
        "Acompañamiento: una ONG o un sindicato informa a los trabajadores de sus derechos y les acompaña hacia el alta y, si hace falta, hacia la regularización. Trama no gestiona trámites ni recibe datos personales.",
        "España · arraigo sociolaboral (Reglamento de Extranjería, RD 1155/2024): dos años de permanencia continuada (art. 126.b) y uno o varios contratos que garanticen al menos el salario mínimo interprofesional, con un mínimo de 20 h semanales en total (art. 127.b). Un plan que ofrece contrato real facilita esta vía.",
        "Italia · permiso por protección social (art. 18 TU Inmigración): puede seguir la vía social, a propuesta de los servicios sociales o de asociaciones inscritas, sin necesidad de denuncia.",
        "Italia · permiso del art. 18-ter TU Inmigración (añadido por el DL 145/2024, convertido por la L. 187/2024): un año, renovable y convertible en permiso de trabajo, a propuesta de la autoridad judicial en un procedimiento por el art. 603-bis del Codice penale. Solo si el trabajador decide colaborar.",
      ],
      nota: "Son pactos entre empresas (art. 1255 del Código Civil; art. 1322 del Codice civile), redactados como compromisos del proveedor con penalización, no como veto de la marca. Los trabajadores o sus representantes pueden exigir la cláusula como terceros beneficiarios (art. 1257 CC; art. 1411 Codice civile). El proveedor la traslada a sus subcontratas como condición para subcontratar.",
    },
    {
      id: "protocolo",
      titulo: "Protocolo legal",
      parrafos: [
        "Un rojo no es una acusación. El protocolo legal solo se activa si la revisión aporta indicios que deben valorarse jurídicamente: por ejemplo, personas que trabajan sin alta o condiciones de trabajo y alojamiento que la ley protege de forma especial.",
        "Mientras tanto, las personas siguen protegidas: la cláusula anti-despido y el límite de pedidos siguen activos, y la ONG o el sindicato les informa de sus derechos y de sus vías de regularización antes de cualquier comunicación.",
        "Las comprobaciones sobre el terreno (registro de jornada, visitas sin aviso, entrevistas confidenciales) las hace el revisor independiente. La marca no investiga por su cuenta, no entrevista a trabajadores ni les pide documentos. Solo recibe la información quien tiene que actuar.",
      ],
      lista: [
        "Día 0 · Marca: registra la alerta con responsable y fecha. No corta pedidos.",
        "≤ 10 días · Proveedor: explica el desajuste y declara todas sus subcontratas.",
        "≤ 30 días · Revisor independiente: visita sin aviso y valida un plan de corrección.",
        "Si hay indicios de un posible delito · Asesoría jurídica externa de la marca: valora el caso y, si procede, lo comunica a la autoridad competente. España: Inspección de Trabajo y Seguridad Social o Fiscalía. Italia: Ispettorato del lavoro o Procura della Repubblica.",
        "Siempre · Trama: documenta y deriva. No investiga, no acusa y no denuncia.",
      ],
      nota: "Plazos orientativos de diseño, no plazos legales. Queda registro de quién vio qué y cuándo.",
    },
    {
      id: "marco",
      titulo: "Marco normativo",
      parrafos: [
        "Normas de referencia. Se citan como marco: Trama no las aplica a ningún taller ni empresa, y un semáforo no equivale a ninguna de las conductas que describen.",
      ],
      lista: [
        "Italia · art. 34 D.Lgs. 159/2011: administración judicial de la empresa cuya actividad facilita, también por falta de control, delitos como el del art. 603-bis. Medida preventiva de hasta un año, prorrogable; no es una multa.",
        "Italia · art. 603-bis del Codice penale («Intermediazione illecita e sfruttamento del lavoro»).",
        "Italia · D.Lgs. 231/2001: la empresa puede responder por ese delito si se comete en su interés (art. 25-quinquies), salvo que haya adoptado y aplicado con eficacia un modelo de organización idóneo para prevenirlo (arts. 6 y 7).",
        "España · LISOS (Real Decreto Legislativo 5/2000): no solicitar el alta de un trabajador es infracción grave, una por cada persona afectada (art. 22.2). Actúa la Inspección de Trabajo y Seguridad Social.",
        "España · Código Penal, arts. 311 a 318: delitos contra los derechos de los trabajadores.",
        "UE · Directiva (UE) 2024/1760 sobre diligencia debida (CSDDD), modificada por la Directiva (UE) 2026/470, de 24-2-2026 (Ómnibus I): transposición hasta el 26-7-2028 y aplicación desde el 26-7-2029, para empresas de más de 5.000 trabajadores y más de 1.500 millones de euros de volumen de negocios neto mundial.",
        "Horizonte · Reglamento (UE) 2024/3015, relativo a la prohibición en el mercado de la Unión de los productos realizados con trabajo forzoso: aplicable desde el 14-12-2027. La Comisión publicó sus guías y abrió el Portal Único el 30-6-2026.",
        "Horas extra: tope de 80 al año en España (art. 35.2 del Estatuto de los Trabajadores) y de 250 al año en Italia salvo convenio (art. 5 D.Lgs. 66/2003).",
      ],
      nota: "Trama aporta un indicio de capacidad que la marca puede usar en su diligencia debida y en sus controles internos. No sustituye a la inspección, a la auditoría ni a los tribunales.",
    },
  ],
  fuentes: [
    {
      texto: "D.Lgs. 159/2011, art. 34 · Normattiva",
      url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2011-09-06;159~art34",
    },
    {
      texto: "Codice penale, art. 603-bis · Normattiva",
      url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:regio.decreto:1930-10-19;1398~art603bis",
    },
    {
      texto: "D.Lgs. 231/2001, art. 25-quinquies · Normattiva",
      url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2001-06-08;231~art25quinquies",
    },
    {
      texto: "TU Inmigración (D.Lgs. 286/1998), art. 18 · Normattiva",
      url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-07-25;286~art18",
    },
    {
      texto: "TU Inmigración, art. 18-ter · Normattiva",
      url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-07-25;286~art18ter",
    },
    { texto: "DL 145/2024 · Gazzetta Ufficiale", url: "https://www.gazzettaufficiale.it/eli/id/2024/10/11/24G00171/sg" },
    {
      texto: "DL 145/2024, texto coordinado con la L. 187/2024 · Gazzetta Ufficiale",
      url: "https://www.gazzettaufficiale.it/eli/id/2024/12/10/24A06589/sg",
    },
    {
      texto: "D.Lgs. 66/2003 (jornada), art. 5 · Normattiva",
      url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-04-08;66~art5",
    },
    {
      texto: "Codice civile, art. 1411 · Normattiva",
      url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:regio.decreto:1942-03-16;262~art1411",
    },
    { texto: "RD 1155/2024, Reglamento de Extranjería (consolidado) · BOE", url: "https://www.boe.es/eli/es/rd/2024/11/19/1155/con" },
    { texto: "LISOS, Real Decreto Legislativo 5/2000 · BOE", url: "https://www.boe.es/eli/es/rdlg/2000/08/04/5/con" },
    { texto: "Código Penal, LO 10/1995 · BOE", url: "https://www.boe.es/eli/es/lo/1995/11/23/10/con" },
    { texto: "Estatuto de los Trabajadores, RDL 2/2015 · BOE", url: "https://www.boe.es/eli/es/rdlg/2015/10/23/2/con" },
    { texto: "LO 1/1982, derecho al honor · BOE", url: "https://www.boe.es/eli/es/lo/1982/05/05/1/con" },
    { texto: "Código Civil · BOE", url: "https://www.boe.es/eli/es/rd/1889/07/24/(1)/con" },
    { texto: "Directiva (UE) 2024/1760 (CSDDD) · EUR-Lex", url: "https://eur-lex.europa.eu/eli/dir/2024/1760/oj/spa" },
    { texto: "Directiva (UE) 2026/470 (Ómnibus I) · EUR-Lex", url: "https://eur-lex.europa.eu/eli/dir/2026/470/oj/spa" },
    { texto: "Reglamento (UE) 2024/3015 · EUR-Lex", url: "https://eur-lex.europa.eu/eli/reg/2024/3015/oj/spa" },
    {
      texto: "Portal Único del Reglamento (UE) 2024/3015 · Comisión Europea",
      url: "https://single-market-economy.ec.europa.eu/single-market/goods/forced-labour-regulation_en",
    },
    { texto: "Reglamento (UE) 2016/679 (RGPD) · EUR-Lex", url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj/spa" },
    { texto: "TFUE, art. 101 · EUR-Lex", url: "https://eur-lex.europa.eu/eli/treaty/tfeu_2016/art_101/oj/spa" },
    {
      texto: "Directrices de cooperación horizontal (2023/C 259/01) · EUR-Lex",
      url: "https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:52023XC0721(01)",
    },
    { texto: "Indicadores de la OIT (ILO Indicators of Forced Labour) · OIT", url: "https://www.ilo.org/publications/ilo-indicators-forced-labour" },
  ],
  aviso: "No constituye asesoramiento jurídico.",
};
