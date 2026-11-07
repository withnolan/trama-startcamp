import Link from "next/link";
import type { ReactNode } from "react";
import { AvisoDatosFicticios } from "@/components/AvisoDatosFicticios";
import { Footer } from "@/components/Footer";

const NAVEGACION = [
  { href: "/panel", etiqueta: "Panel" },
  { href: "/como-calculamos", etiqueta: "Cómo calculamos" },
  { href: "/legal", etiqueta: "Legal" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AvisoDatosFicticios />
      <header className="border-b border-black/10 px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/panel" className="text-lg font-semibold">
            Trama
          </Link>
          <nav aria-label="Principal">
            <ul className="flex gap-4 text-sm">
              {NAVEGACION.map((enlace) => (
                <li key={enlace.href}>
                  <Link href={enlace.href} className="hover:underline">
                    {enlace.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
