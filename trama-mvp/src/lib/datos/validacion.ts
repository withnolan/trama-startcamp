/**
 * Validaciones transversales del dataset ingerido.
 * Privacidad (RGPD art. 5.1.c, specs/LEGAL.md §1.1): el dataset solo lleva totales por taller y mes.
 */

/** Claves que delatarían un dato por persona (se comparan en minúsculas y sin «_», «-» ni espacios). */
export const CLAVES_PERSONALES = [
  "dni", "nie", "naf", "ipf", "nif", "nss", "numeroseguridadsocial", "nombretrabajador", "nombrepersona", "apellidos",
  "apellido", "horasporpersona", "horastrabajador", "nacionalidad", "situacionmigratoria", "fechanacimiento",
  "permisoresidencia", "email", "telefono", "codicefiscale",
] as const;

const normalizarClave = (k: string) => k.toLowerCase().replace(/[_\s-]/g, "");

/** Recorre todas las claves (objetos y arrays anidados) y devuelve la ruta de las que parecen personales. */
export function clavesPersonales(x: unknown, ruta = "$"): string[] {
  const prohibidas = new Set<string>(CLAVES_PERSONALES);
  const halladas: string[] = [];
  const visitar = (v: unknown, r: string) => {
    if (Array.isArray(v)) v.forEach((e, i) => visitar(e, `${r}[${i}]`));
    else if (v && typeof v === "object")
      for (const [k, hijo] of Object.entries(v)) {
        if (prohibidas.has(normalizarClave(k))) halladas.push(`${r}.${k}`);
        visitar(hijo, `${r}.${k}`);
      }
  };
  visitar(x, ruta);
  return halladas;
}
