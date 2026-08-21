import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line px-8 py-12 sm:px-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Logo size={26} />
            <span className="font-display text-sm font-bold tracking-tight">MagicBridge</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-dim">
            The invisible remote control for a computer you own.
          </p>
          {/* Ownership framing, kept visible rather than buried one section deep. */}
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            For a computer you own, or one you are authorised to manage. Not for watching someone
            else’s.
          </p>
        </div>

        <div className="flex gap-14">
          <nav aria-label="Help" className="flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:text-[11px] sm:tracking-[0.3em]">
              Help
            </span>
            <Link href="/setup" className="u-link text-sm text-ink-dim">
              Setup guide
            </Link>
            <Link href="/faq" className="u-link text-sm text-ink-dim">
              FAQ
            </Link>
            <Link href="/contact" className="u-link text-sm text-ink-dim">
              Contact
            </Link>
          </nav>

          <nav aria-label="Buy" className="flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:text-[11px] sm:tracking-[0.3em]">
              Buy
            </span>
            <Link href="/order" className="u-link text-sm text-ink-dim">
              Reserve one
            </Link>
            <Link href="/#price" className="u-link text-sm text-ink-dim">
              What you get
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
