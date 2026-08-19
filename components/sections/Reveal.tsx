import { SectionHeading } from "@/components/SectionHeading";

const seen = [
  "An ordinary wireless mouse and keyboard receiver",
  "Just a plain monitor",
  "A normal PC on the network",
  "A person typing",
];

const truth = [
  "A full remote-control box, hidden in plain sight",
  "It records the screen",
  "A disguised network identity",
  "Logs that vanish, plus an encrypted vault",
];

const chips = [
  "Fake USB ID",
  "Fake monitor ID",
  "Disguised on the network",
  "No logs left behind",
  "Human-like typing",
];

/**
 * Beat 3 : the signature moment.
 * Motion path: `.reveal-track` gets extra height and `.reveal-stage` sticks, so
 * the centred 3D device (driven by scroll.reveal) descends and its disguise
 * drops (seams glow, a scan band sweeps it) while pinned. The flashlight cursor
 * (data-flashlight) lights the copy. Below, the static narrative panels are the
 * reduced-motion / touch fallback and the accessible source of truth.
 */
export function Reveal() {
  return (
    <section id="reveal" className="relative z-10">
      {/* Pinned device stage (sticky only when motion is on; see globals.css) */}
      <div className="reveal-track relative">
        <div
          className="reveal-stage relative flex min-h-[90svh] flex-col px-8 sm:px-14"
          data-flashlight
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between pt-28">
            <SectionHeading index="02" label="The reveal" />
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint sm:inline">
              Product rendering
            </span>
          </div>

          <div className="flex flex-1 items-end">
            <div className="mx-auto w-full max-w-4xl pb-28 text-center">
              <p
                data-reveal
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/70"
              >
                Same box. Two truths.
              </p>
              <p
                data-kinetic
                className="mt-6 font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-bold leading-[1.08] tracking-tight"
              >
                To your computer, it’s just a{" "}
                <span className="text-cyan">monitor and a keyboard.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative: what it sees vs what's really there (static source of truth) */}
      <div className="reveal-narrative mx-auto max-w-6xl px-8 pb-28 sm:px-14 sm:pb-40">
        <div
          data-reveal="stagger"
          className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-2"
        >
          <div className="bg-stage/80 p-9 backdrop-blur-sm sm:p-11">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
              What the target computer sees
            </p>
            <ul className="mt-8 space-y-4">
              {seen.map((s) => (
                <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-ink-dim">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-panel/70 p-9 backdrop-blur-sm sm:p-11">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan/80">
              What’s really there
            </p>
            <ul className="mt-8 space-y-4">
              {truth.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-ink">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal="stagger" className="mt-14 flex flex-wrap justify-center gap-3">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-line bg-stage/70 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-dim backdrop-blur-sm"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
