/** CSV del pipeline: separador «;», UTF-8, cabecera fija, decimales con punto, sin comillas (los valores no llevan «;»). */

export function aCsv(cabecera: readonly string[], filas: Record<string, string | number | boolean | null>[]): string {
  const lineas = [cabecera.join(";")];
  for (const f of filas) {
    lineas.push(
      cabecera
        .map((c) => {
          const v = f[c];
          const s = v === null || v === undefined ? "" : String(v);
          if (s.includes(";") || s.includes("\n")) throw new Error(`Valor con separador en la columna ${c}: ${s}`);
          return s;
        })
        .join(";"),
    );
  }
  return lineas.join("\n") + "\n";
}

export interface CsvLeido {
  cabecera: string[];
  filas: { numero: number; valores: Record<string, string> }[]; // numero: 1 = primera fila de datos
  errores: { numero: number; detalle: string }[];
}

export function leerCsv(texto: string): CsvLeido {
  const limpio = texto.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const lineas = limpio.split("\n");
  const cabecera = (lineas[0] ?? "").split(";").map((c) => c.trim());
  const filas: CsvLeido["filas"] = [];
  const errores: CsvLeido["errores"] = [];
  for (let i = 1; i < lineas.length; i++) {
    if (lineas[i].trim() === "") continue;
    const celdas = lineas[i].split(";");
    if (celdas.length !== cabecera.length) {
      errores.push({ numero: i, detalle: `tiene ${celdas.length} columnas y la cabecera ${cabecera.length}` });
      continue;
    }
    const valores: Record<string, string> = {};
    cabecera.forEach((c, k) => (valores[c] = celdas[k].trim()));
    filas.push({ numero: i, valores });
  }
  return { cabecera, filas, errores };
}
