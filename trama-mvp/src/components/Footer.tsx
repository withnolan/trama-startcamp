import Link from "next/link";
import { TEXTOS_APP } from "@/content/textos";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-borde">
      <div className="mx-auto flex w-full max-w-[75rem] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-6 text-base text-tinta-2 sm:px-8">
        <p>
          {TEXTOS_APP.pie}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href="/como-calculamos" className="underline decoration-borde-fuerte underline-offset-4 hover:text-tinta hover:decoration-tinta">
              {TEXTOS_APP.nav.comoCalculamos}
            </Link>
          </li>
          <li>
            <Link href="/legal" className="underline decoration-borde-fuerte underline-offset-4 hover:text-tinta hover:decoration-tinta">
              {TEXTOS_APP.nav.legal}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
