import { expect, test, type Page } from "@playwright/test";

const RUTAS = ["/", "/panel", "/taller/T1", "/taller/T2", "/taller/T6", "/como-calculamos", "/legal"];
const TAMANOS = [
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
];

// Hooks data-m que la demo tiene que dejar visibles (CONTRATO.md). El anillo del semáforo (decorativo) termina en 0
// y el nodo fantasma desaparece por diseño: no cuentan.
const REQUERIDOS = [
  "semaforo-cabecera",
  "seccion-horas",
  "contador-cotizadas",
  "contador-necesarias",
  "grafico-desajuste",
  "grafico-horas",
  "seccion-simulador",
  "seccion-cadena",
  "nodo-subcontrata",
  "conector-subcontrata",
  "etiqueta-extension",
  "seccion-plan",
  "hito",
  "seccion-proteccion",
  "tarjeta-clausula",
  "tarjeta-limite",
  "tarjeta-acompanamiento",
  "seccion-impacto",
  "kpi-principal-taller",
];
const EXCLUIDOS = ["semaforo-anillo", "nodo-fantasma"];

/** Errores de consola/página y peticiones fuera de localhost (se bloquean: la demo tiene que funcionar sin internet). */
async function vigilar(page: Page) {
  const errores: string[] = [];
  const externas: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errores.push(`console.error: ${m.text()}`);
  });
  page.on("pageerror", (e) => errores.push(`pageerror: ${e.message}`));
  await page.route("**/*", (ruta) => {
    const url = new URL(ruta.request().url());
    if (url.hostname === "localhost") return ruta.continue();
    externas.push(url.href);
    return ruta.abort("internetdisconnected");
  });
  return { errores, externas };
}

/** data-m que no han terminado visibles (opacidad < 1) y hooks requeridos que faltan. */
async function pendientesDeVer(page: Page) {
  const minimo = await page.evaluate(() => {
    const m: Record<string, number> = {};
    for (const el of document.querySelectorAll("[data-m]")) {
      const nombre = el.getAttribute("data-m")!;
      m[nombre] = Math.min(m[nombre] ?? 1, Number(getComputedStyle(el).opacity));
    }
    return m;
  });
  return [
    ...REQUERIDOS.filter((n) => !(n in minimo)).map((n) => `${n}: no existe`),
    ...Object.entries(minimo)
      .filter(([n, o]) => o < 1 && !EXCLUIDOS.includes(n))
      .map(([n, o]) => `${n}: opacidad ${o}`),
  ];
}

for (const tamano of TAMANOS) {
  for (const ruta of RUTAS) {
    test(`${tamano.width}×${tamano.height} ${ruta}: sin errores, sin internet y sin scroll horizontal`, async ({ page }) => {
      const { errores, externas } = await vigilar(page);
      await page.setViewportSize(tamano);
      const respuesta = await page.goto(ruta, { waitUntil: "networkidle" });
      expect(respuesta?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(desborde, "scroll horizontal").toBeLessThanOrEqual(0);
      // Fuentes autoalojadas (@fontsource): cargan sin red.
      const fuentes = await page.evaluate(async () => {
        await document.fonts.ready;
        return [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family);
      });
      expect(fuentes.join()).toContain("Inter");
      expect(fuentes.join()).toContain("Source Serif");
      expect(externas).toEqual([]);
      expect(errores).toEqual([]);
    });
  }
}

test("panel: el rojo sale primero", async ({ page }) => {
  await page.goto("/panel");
  await expect(page.locator("tbody tr").first()).toContainText("Revisar");
});

test("taller inexistente: No encontramos este taller.", async ({ page }) => {
  await page.goto("/taller/NO-EXISTE");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No encontramos este taller.");
  await expect(page.getByRole("link", { name: "Volver al panel" })).toBeVisible();
});

test("simulador en /taller/T1: «Chaquetas» a 700 → verde y el ratio se recalcula", async ({ page }) => {
  await page.goto("/taller/T1");
  const resultado = page.locator('#simulador [aria-live="polite"]');
  await expect(resultado).toContainText("Revisar");
  await expect(resultado).toContainText("2,4×");
  await page.locator("#simulador").getByRole("slider", { name: /chaquetas/i }).fill("700");
  await expect(resultado).toContainText("En margen");
  await expect(resultado).toContainText("0,8×"); // 2.800 h / 3.360 h
});

test("simulador: caso reconstruido → rojo; menos minutos por chaqueta → ámbar y verde", async ({ page }) => {
  await page.goto("/taller/T1");
  const simulador = page.locator("#simulador");
  const resultado = simulador.locator('[aria-live="polite"]');
  await simulador.getByRole("button", { name: "Caso reconstruido con datos públicos" }).click();
  await expect(resultado).toContainText("Revisar");
  const minutos = simulador.getByRole("slider", { name: "Minutos por chaqueta" });
  await minutos.fill("130");
  await expect(resultado).toContainText("Vigilar");
  await minutos.fill("100");
  await expect(resultado).toContainText("En margen");
});

test("simulador: en /como-calculamos va tras el caso público; no aparece en T6 (menos de 4 personas)", async ({ page }) => {
  await page.goto("/como-calculamos");
  await expect(page.locator("#caso-publico + #simulador")).toHaveCount(1);
  await page.goto("/taller/T6");
  await expect(page.locator("#simulador")).toHaveCount(0);
});

test("demo ?demo=1: secuencia completa sin errores, sin internet y todo visible al final", async ({ page }) => {
  test.setTimeout(60_000);
  const { errores, externas } = await vigilar(page);
  await page.goto("/taller/T1?demo=1");
  await page.waitForTimeout(20_000); // la coreografía dura ~18 s (MOTION §5)
  expect(await page.evaluate(() => document.documentElement.dataset.demo)).toBe("fin");
  expect(await pendientesDeVer(page)).toEqual([]);
  expect(externas).toEqual([]);
  expect(errores).toEqual([]);
});

for (const [nombre, saltar] of [
  ["Esc", (page: Page) => page.keyboard.press("Escape")],
  ["clic", (page: Page) => page.locator("h1").click()],
] as const) {
  test(`demo ?demo=1: ${nombre} salta al estado final`, async ({ page }) => {
    await page.goto("/taller/T1?demo=1");
    await page.waitForTimeout(1_500);
    await saltar(page);
    await expect.poll(() => pendientesDeVer(page), { timeout: 3_000 }).toEqual([]);
  });
}
