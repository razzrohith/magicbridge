/**
 * Beat 1 : the device in the void.
 * LCP is this real-DOM headline (rule 7). The 3D device renders full-bleed
 * behind the page from a single fixed canvas; nothing here shifts as it fades
 * in (rule 7 CLS). Text sits in a readable column on the left, the lit device
 * floats to the right in 3D.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center px-8 py-24 sm:px-14"
    >
      {/* data-hero-group: above-the-fold entrance is CSS-driven (globals.css) so
          the headline paints immediately as the real-DOM LCP element (rule 7). */}
      <div data-hero-group className="mx-auto w-full max-w-6xl">
        <p className="mb-7 font-mono text-[11px] uppercase tracking-[0.34em] text-cyan/85">
          <span className="mr-2.5 inline-block h-2 w-2 rounded-full bg-cyan align-middle shadow-[0_0_12px_var(--color-cyan)] motion-safe:animate-pulse" />
          For hardware you own
        </p>

        <h1 className="max-w-4xl font-display text-[clamp(2.75rem,8vw,5.75rem)] font-bold leading-[1.02] tracking-tight">
          Full control of your machine.
          <br />
          <span className="text-ink-dim">From anywhere. </span>
          <span className="text-cyan">Invisible.</span>
        </h1>

        <p className="mt-9 max-w-xl text-lg leading-relaxed text-ink-dim">
          A small box you plug into your other computer. See its screen and take over, live, from
          any browser in your house, and that computer can’t tell anything is there.
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-5">
          <a
            href="#price"
            className="u-press rounded-full bg-cyan px-7 py-3 font-mono text-xs font-medium uppercase tracking-widest text-stage"
          >
            $549 · once
          </a>
          <a
            href="#how"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-faint transition-colors hover:text-ink focus-visible:text-ink"
          >
            See how it works
            <span className="inline-block transition-transform group-hover:translate-y-0.5">↓</span>
          </a>
        </div>
      </div>

      {/* Honesty caption for the 3D render (tone/safety rule). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto flex max-w-6xl items-end justify-between px-8 sm:px-14">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint">
          Product rendering
        </span>
        <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint sm:flex">
          Scroll
          <span className="inline-block h-8 w-px bg-gradient-to-b from-ink-faint/50 to-transparent" />
        </span>
      </div>
    </section>
  );
}
