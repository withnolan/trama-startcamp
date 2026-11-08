/** Aleatoriedad reproducible: misma semilla → misma secuencia (mulberry32). Sin Math.random ni Date. */
export interface Rng {
  /** Uniforme en [0, 1). */
  next(): number;
  uniforme(a: number, b: number): number;
  entero(a: number, b: number): number; // ambos incluidos
  elegir<T>(xs: readonly T[]): T;
  elegirPonderado<T extends string>(pesos: Record<T, number>): T;
  barajar<T>(xs: readonly T[]): T[];
  normal(media: number, sd: number): number;
  lognormal(mediana: number, sigma: number): number;
}

export function crearRng(semilla: number): Rng {
  let a = semilla >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    next,
    uniforme: (x, y) => x + (y - x) * next(),
    entero: (x, y) => x + Math.floor(next() * (y - x + 1)),
    elegir: (xs) => xs[Math.floor(next() * xs.length)],
    elegirPonderado: (pesos) => {
      const claves = Object.keys(pesos) as (keyof typeof pesos)[];
      const total = claves.reduce((s, k) => s + pesos[k], 0);
      let r = next() * total;
      for (const k of claves) {
        r -= pesos[k];
        if (r < 0) return k;
      }
      return claves[claves.length - 1];
    },
    barajar: (xs) => {
      const r = [...xs];
      for (let i = r.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [r[i], r[j]] = [r[j], r[i]];
      }
      return r;
    },
    normal: (media, sd) => {
      const u = 1 - next();
      const v = next();
      return media + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    lognormal: (mediana, sigma) => mediana * Math.exp(rng.normal(0, sigma)),
  };
  return rng;
}
