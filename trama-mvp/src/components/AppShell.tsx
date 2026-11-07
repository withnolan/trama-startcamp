import Link from "next/link";
import type { ReactNode } from "react";
import { AvisoDatosFicticios } from "@/components/AvisoDatosFicticios";
import { Footer } from "@/components/Footer";
import { TEXTOS_APP } from "@/content/textos";
import { marca } from "@/data/vista";

const NAVEGACION = [
  { href: "/panel", etiqueta: TEXTOS_APP.nav.panel },
  { href: "/como-calculamos", etiqueta: TEXTOS_APP.nav.comoCalculamos },
  { href: "/legal", etiqueta: TEXTOS_APP.nav.legal },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-marca focus:px-4 focus:py-2 focus:text-base focus:font-medium focus:text-white"
      >
        {TEXTOS_APP.saltar}
      </a>
      {/* Cabecera pegajosa de altura fija (--alto-nav + --alto-aviso): la subnav del taller se pega debajo. */}
      <header className="sticky top-0 z-40 bg-papel">
        <div className="border-b border-borde">
          <div className="mx-auto flex h-(--alto-nav) w-full max-w-[75rem] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8">
            <div className="flex min-w-0 items-baseline gap-3">
              <Link href="/panel" className="rounded-sm font-serif text-2xl font-semibold tracking-tight text-tinta">
                {TEXTOS_APP.nombre}
              </Link>
              <span aria-hidden className="hidden h-5 w-px self-center bg-borde md:block" />
              <span className="hidden truncate text-base text-tinta-2 md:inline">{marca().nombre}</span>
            </div>
            <nav aria-label={TEXTOS_APP.navAria} className="min-w-0 overflow-x-auto">
              <ul className="flex items-center text-sm font-medium sm:gap-1 sm:text-base">
                {NAVEGACION.map((enlace) => (
                  <li key={enlace.href}>
                    <Link
                      href={enlace.href}
                      className="block whitespace-nowrap rounded-md px-2 py-2 text-tinta-2 hover:bg-superficie-2 hover:text-tinta sm:px-3"
                    >
                      {enlace.etiqueta}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <AvisoDatosFicticios variante="banda" />
      </header>
      <main id="contenido" className="mx-auto w-full max-w-[75rem] flex-1 px-4 py-10 sm:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
