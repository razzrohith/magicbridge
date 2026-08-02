import { CursorGlow } from "@/components/CursorGlow";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <CursorGlow />

      {/* soft radial vignette so the stage reads as a lit void, not flat black */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 70% 8%, rgba(18,198,230,0.06), transparent 55%)",
        }}
      />

      {/* top bar */}
      <header className="relative z-10 flex items-center gap-3 px-8 py-6 sm:px-14">
        <Logo size={34} />
        <span className="font-display text-lg font-bold tracking-tight">
          MagicBridge
        </span>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-88px)] max-w-5xl flex-col justify-center px-8 sm:px-14">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.34em] text-cyan/80">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan align-middle shadow-[0_0_12px_var(--color-cyan)]" />
          For hardware you own
        </p>

        <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl md:text-[86px]">
          Full control of
          <br />
          your machine.
          <br />
          <span className="text-ink-dim">From anywhere. </span>
          <span className="text-cyan">Invisible.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-dim">
          A small box you plug into your other computer. See its screen and take
          over, live, from any browser in your house, and that computer can’t
          tell anything is there.
        </p>

        <div className="mt-10 flex items-center gap-5">
          <span className="rounded-full border border-cyan/40 bg-cyan/[0.06] px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-cyan">
            $549 · once
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            Site in progress
          </span>
        </div>
      </section>

      {/* bottom hairline */}
      <div className="relative z-10 mx-8 border-t border-line sm:mx-14" />
      <footer className="relative z-10 flex items-center justify-between px-8 py-5 font-mono text-[11px] uppercase tracking-widest text-ink-faint sm:px-14">
        <span>Phase 0 · foundation</span>
        <span>Cyan · Space Grotesk · dark tech-noir</span>
      </footer>
    </main>
  );
}
