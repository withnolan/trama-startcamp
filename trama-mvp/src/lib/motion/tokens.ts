// Tokens de movimiento (specs/MOTION.md §3). Dueño: agente de Animación.
export const dur = { fast: 120, base: 200, medium: 320, slow: 600, count: 900, draw: 1200, pulse: 1200 } as const; // ms
export const ease = {
  out: [0.22, 1, 0.36, 1], // entradas
  inOut: [0.65, 0, 0.35, 1], // dibujo de líneas
  linear: [0, 0, 1, 1], // progreso
} as const;
export const spring = {
  gentle: { type: "spring", stiffness: 260, damping: 30, mass: 1 }, // sin rebote
  firm: { type: "spring", stiffness: 400, damping: 40, mass: 1 },
} as const;
export const dist = { xs: 4, sm: 8, md: 16 } as const; // px
export const stagger = 0.04; // s entre hijos
export const s = (ms: number) => ms / 1000; // Motion usa segundos
