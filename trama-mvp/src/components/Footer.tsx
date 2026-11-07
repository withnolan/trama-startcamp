import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/10 px-6 py-4 text-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2">
        <span>Trama · MVP de demostración</span>
        <Link href="/legal" className="underline">
          Legal y avisos
        </Link>
      </div>
    </footer>
  );
}
