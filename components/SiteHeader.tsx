import { Logo } from "@/components/Logo";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-8 py-6 sm:px-14">
      <div className="flex items-center gap-3">
        <Logo size={34} />
        <span className="font-display text-lg font-bold tracking-tight">MagicBridge</span>
      </div>
      <a
        href="#price"
        data-magnetic
        className="rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-dim transition-colors hover:border-cyan/40 hover:text-ink focus-visible:border-cyan/40 focus-visible:text-ink"
      >
        $549 · once
      </a>
    </header>
  );
}
