import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4/opsz.css";
import { Providers } from "@/app/providers";
import { AppShell } from "@/components/AppShell";
import "@/lib/motion/demo.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Trama · Control mensual de capacidad de talleres",
    template: "%s · Trama",
  },
  description:
    "Compara cada mes el trabajo encargado a cada taller con las horas de alta de su plantilla. Prototipo de demostración con datos ficticios.",
  applicationName: "Trama",
};

// Antes del primer pintado: con ?demo=1 la coreografía (DemoDirector + demo.css) toma el control.
const SCRIPT_DEMO = `if(/[?&]demo=1(&|$)/.test(location.search))document.documentElement.dataset.demo="1"`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning className="h-full">
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_DEMO }} />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
