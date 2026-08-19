import { Logo } from "@/components/Logo";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line px-8 py-10 sm:px-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Logo size={26} />
          <span className="font-display text-sm font-bold tracking-tight">MagicBridge</span>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
          The invisible remote control for a computer you own.
        </p>
      </div>
    </footer>
  );
}
