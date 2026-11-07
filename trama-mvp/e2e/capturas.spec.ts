// Plan B: capturas PNG de cada pantalla y vídeo de la demo en ../demo-backup/ (raíz del proyecto).
import path from "node:path";
import { test, type Page } from "@playwright/test";

const DESTINO = path.resolve(__dirname, "../../demo-backup");
const TAMANOS = [
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
];
const casoReconstruido = (page: Page) =>
  page.locator("#simulador").getByRole("button", { name: "Caso reconstruido con datos públicos" }).click();

const PANTALLAS: { nombre: string; ruta: string; ancla?: string; completa?: boolean; antes?: (page: Page) => Promise<void> }[] = [
  { nombre: "01-entrada", ruta: "/" },
  { nombre: "02-panel", ruta: "/panel" },
  { nombre: "03-panel-talleres", ruta: "/panel", ancla: "talleres" },
  { nombre: "04-taller-T1", ruta: "/taller/T1" },
  { nombre: "05-taller-T1-horas", ruta: "/taller/T1", ancla: "horas" },
  { nombre: "06-taller-T1-simulador", ruta: "/taller/T1", ancla: "simulador" },
  { nombre: "07-taller-T1-simulador-caso-reconstruido", ruta: "/taller/T1", ancla: "simulador", antes: casoReconstruido },
  { nombre: "08-taller-T1-cadena", ruta: "/taller/T1", ancla: "cadena" },
  // Plan y Protección comparten fila (7 | 5 columnas) desde 1024 px: una sola captura.
  { nombre: "09-taller-T1-plan-proteccion", ruta: "/taller/T1", ancla: "plan" },
  { nombre: "10-taller-T1-impacto", ruta: "/taller/T1", ancla: "impacto" },
  { nombre: "11-taller-T2", ruta: "/taller/T2" },
  { nombre: "12-taller-T6", ruta: "/taller/T6" },
  { nombre: "13-como-calculamos", ruta: "/como-calculamos", completa: true },
  { nombre: "14-legal", ruta: "/legal", completa: true },
  { nombre: "15-escenas-cuatro-marcas", ruta: "/escenas", ancla: "cuatro-marcas" },
  { nombre: "16-escenas-caso-milan", ruta: "/escenas", ancla: "caso-milan" },
];

for (const tamano of TAMANOS) {
  const carpeta = `${tamano.width}x${tamano.height}`;
  for (const p of PANTALLAS) {
    test(`${carpeta} ${p.nombre}`, async ({ page }) => {
      await page.setViewportSize(tamano);
      await page.goto(p.ruta, { waitUntil: "networkidle" });
      await p.antes?.(page);
      if (p.ancla) await page.locator(`#${p.ancla}`).evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
      await page.waitForTimeout(400); // gráficos cliente (Recharts) ya medidos
      await page.screenshot({ path: path.join(DESTINO, carpeta, `${p.nombre}.png`), fullPage: p.completa, animations: "disabled" });
    });
  }
}

test("vídeo de la demo /taller/T1?demo=1 (1280×720)", async ({ browser, baseURL }) => {
  test.setTimeout(90_000);
  const size = { width: 1280, height: 720 };
  const context = await browser.newContext({
    viewport: size,
    reducedMotion: "no-preference", // la demo se graba con movimiento
    recordVideo: { dir: test.info().outputPath("video"), size },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/taller/T1?demo=1`);
  await page.waitForTimeout(21_000); // coreografía ~18 s + reposo
  await context.close();
  await page.video()?.saveAs(path.join(DESTINO, "demo-T1-1280x720.webm"));
});
