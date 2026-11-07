"use client";
import { useEffect, useState } from "react";
import { SUBNAV_TALLER } from "@/content/textos";

const ANCLAS = (["horas", "cadena", "plan", "proteccion", "impacto"] as const).map((id) => ({
  id,
  etiqueta: SUBNAV_TALLER[id],
}));

/** Subnav pegajosa bajo la cabecera. Debe ir en el flujo de la página (no dentro de un contenedor corto) para que se pegue. */
export function SubnavTaller() {
  const [activa, setActiva] = useState<string | null>(null);

  // Marca la sección que ocupa la franja superior de la pantalla (también durante el auto-scroll de la demo).
  useEffect(() => {
    const visibles = new Set<string>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visibles.add(e.target.id);
          else visibles.delete(e.target.id);
        }
        setActiva(ANCLAS.find((a) => visibles.has(a.id))?.id ?? null);
      },
      { rootMargin: "-170px 0px -50% 0px" },
    );
    for (const a of ANCLAS) {
      const el = document.getElementById(a.id);
      if (el) observador.observe(el);
    }
    return () => observador.disconnect();
  }, []);

  return (
    <nav
      aria-label={SUBNAV_TALLER.aria}
      className="sticky top-[calc(var(--alto-nav)+var(--alto-aviso))] z-30 h-(--alto-subnav) border-b border-borde bg-papel"
    >
      <ul className="flex h-full items-stretch gap-1 overflow-x-auto text-base font-medium sm:gap-2 sm:text-lg">
        {ANCLAS.map((a) => {
          const actual = activa === a.id;
          return (
            <li key={a.id} className="flex">
              <a
                href={`#${a.id}`}
                aria-current={actual ? "location" : undefined}
                className={`flex items-center whitespace-nowrap border-b-2 px-3 hover:text-tinta ${
                  actual ? "border-marca text-tinta" : "border-transparent text-tinta-2"
                }`}
              >
                {a.etiqueta}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
