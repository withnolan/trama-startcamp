import { defineConfig } from "@playwright/test";

// Contra el servidor de producción (`next start`, requiere `next build` antes; los scripts npm ya lo hacen).
// Puerto propio para no chocar con `npm run dev` / `npm run demo` en :3000.
const PUERTO = 3100;

export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  reporter: "list",
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    browserName: "chromium",
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: `npx next start -p ${PUERTO}`,
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    { name: "recorrido", testMatch: "recorrido.spec.ts" },
    // Capturas del plan B en estado final: con movimiento reducido no hay animaciones (MOTION §6).
    { name: "capturas", testMatch: "capturas.spec.ts", use: { reducedMotion: "reduce" } },
  ],
});
