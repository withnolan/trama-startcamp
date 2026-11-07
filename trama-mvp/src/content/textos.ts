// Textos de la interfaz (specs/DESIGN.md §6 y specs/LEGAL.md §2). Dueño: agente Legal.
// Los componentes importan de aquí; el agente Legal puede cambiar los valores y añadir exports, no renombrar ni quitar.
import type { EstadoSemaforo } from "@/lib/calculo/tipos";

export const ETIQUETA_ESTADO: Record<EstadoSemaforo, string> = {
  verde: "En margen",
  ambar: "Vigilar",
  rojo: "Revisar",
  sin_datos: "Sin certificado",
};

export const DESCRIPCION_ESTADO: Record<EstadoSemaforo, string> = {
  verde: "La carga cabe en las horas cotizadas.",
  ambar: "Supera las horas cotizadas dentro del margen para picos.",
  rojo: "Supera el margen: se abre una revisión.",
  sin_datos: "Falta un certificado: no se puede calcular el semáforo.",
};

export const NOTA_ALERTA = {
  titulo: "Es una alerta, no una prueba.",
  texto:
    "El trabajo encargado no cabe en las horas que cotiza la plantilla. Se abre una revisión con el proveedor; no implica incumplimiento ni justifica retirar pedidos.",
};

export const AVISO_DEMO = {
  banda: "Prototipo de demostración · datos ficticios: empresas, talleres, personas y cifras son inventados.",
  compacto: "Prototipo de demostración · datos ficticios",
};

export const KPI_ETIQUETAS = {
  principal: "Siguen empleados y dados de alta 6 meses después de la alerta",
  horasRegularizadas: "Horas regularizadas",
  acompanados: "Trabajadores acompañados en su regularización",
  pedidosMantenidos: "Pedidos mantenidos durante el plan",
  fallos: "Despidos o recortes por encima del límite",
};

export const SECCIONES_TALLER = {
  horas: "Horas necesarias y cotizadas",
  cadena: "Cadena de suministro",
  plan: "Plan de corrección",
  proteccion: "Protección de trabajadores",
  impacto: "Impacto en este taller",
};
