import { describe, expect, it } from "vitest";
import { VENTANA_MESES, clasificarSemaforo } from "./semaforo";

describe("semaforo (esqueleto)", () => {
  it("usa una ventana móvil de 3 meses", () => {
    expect(VENTANA_MESES).toBe(3);
  });

  it("avisa de que la lógica está pendiente", () => {
    expect(() => clasificarSemaforo(0, 0, { margenAmbar: 0 })).toThrow(/TODO/);
  });
});
