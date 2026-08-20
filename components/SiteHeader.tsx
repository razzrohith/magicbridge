import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between gap-6 px-8 py-6 sm:px-14">
      <Link href="/" className="flex items-center gap-3" aria-label="MagicBridge home">
        <Logo size={34} />
        <span className="font-display text-lg font-bold tracking-tight">MagicBridge</span>
      </Link>

      <nav aria-label="Main" className="flex items-center gap-6 sm:gap-8">
        <Link
          href="/setup"
          className="u-link hidden font-mono text-[11px] uppercase tracking-widest text-ink-dim sm:inline"
        >
          Setup
        </Link>
        <Link
          href="/faq"
          className="u-link hidden font-mono text-[11px] uppercase tracking-widest text-ink-dim sm:inline"
        >
          FAQ
        </Link>
        <Link
          href="/#price"
          className="u-ghost rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-dim"
        >
          $549 · once
        </Link>
      </nav>
    </header>
  );
}
