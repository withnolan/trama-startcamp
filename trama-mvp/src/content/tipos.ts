// Forma de las páginas de texto (/como-calculamos y /legal). Dueño: agente Legal (solo aditivo).
export interface SeccionTexto {
  id: string; // ancla (#protocolo, #competencia…)
  titulo: string;
  parrafos: string[];
  lista?: string[];
  tabla?: { cabecera: string[]; filas: string[][]; pie?: string };
  nota?: string;
}

export interface PaginaTexto {
  titulo: string;
  entradilla: string;
  secciones: SeccionTexto[];
  fuentes?: { texto: string; url: string }[];
  aviso?: string; // p. ej. "No constituye asesoramiento jurídico."
}
