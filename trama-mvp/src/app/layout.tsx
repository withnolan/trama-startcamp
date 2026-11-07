import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

// Fuentes provisionales: se sustituirán por las que defina DESIGN.md.
const fuenteSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fuenteMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Trama",
    template: "%s · Trama",
  },
  description:
    "Herramienta de cumplimiento: compara el trabajo encargado a cada taller con las horas que cotiza. Demo con datos ficticios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fuenteSans.variable} ${fuenteMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
