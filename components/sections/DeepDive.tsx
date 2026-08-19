import { SectionHeading } from "@/components/SectionHeading";

const stats = [
  { prefix: "", count: "1080", suffix: "p", unit: "Full-HD picture", note: "" },
  { prefix: "", count: "50", suffix: "", unit: "fps", note: "frames every second, smooth" },
  { prefix: "~", count: "9", suffix: "", unit: "ms", note: "delay on home WiFi, feels live" },
  {
    prefix: "~",
    count: "27",
    suffix: "",
    unit: "ms",
    note: "control delay measured over a real remote link",
  },
];

const values = [
  { k: "Feels instant", v: "Live video, not a slideshow." },
  { k: "Private", v: "Stays on your own network." },
  { k: "Simple", v: "Two cables and a web page." },
  { k: "Self-setup", v: "From your phone, no cable." },
];

/**
 * Beat 6 : one deep-dive on speed. Numbers count up on scroll-in; the signal
 * path animates left to right.
 */
export function DeepDive() {
  return (
    <section className="relative z-10 border-y border-line bg-stage-2/60">
      <div className="mx-auto max-w-6xl px-8 py-28 sm:px-14 sm:py-40">
        <SectionHeading index="06" label="Specs & speed" />

        <h2
          data-kinetic
          className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
        >
          Live video. <span className="text-cyan">Not a slideshow.</span>
        </h2>

        <div
          data-reveal="stagger"
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.unit} className="bg-stage p-9">
              <p className="font-display text-4xl font-bold tracking-tight text-ink tabular-nums sm:text-5xl">
                {s.prefix}
                <span data-count={s.count}>{s.count}</span>
                {s.suffix}
                <span className="ml-2 align-baseline text-xl font-medium text-ink-dim">
                  {s.unit}
                </span>
              </p>
              {s.note && <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">{s.note}</p>}
            </div>
          ))}
        </div>

        {/* Signal path */}
        <div
          data-reveal
          className="mt-12 flex flex-col gap-3 rounded-2xl border border-line bg-stage/70 p-8 font-mono text-[13px] uppercase tracking-[0.15em] text-ink-dim sm:flex-row sm:items-center sm:gap-5"
        >
          <span>The other computer’s screen</span>
          <span aria-hidden className="text-cyan">
            →
          </span>
          <span className="sr-only">to</span>
          <span className="text-ink">The MagicBridge box</span>
          <span aria-hidden className="text-cyan">
            →
          </span>
          <span className="sr-only">to</span>
          <span>Your browser</span>
        </div>

        <div data-reveal="stagger" className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.k}>
              <p className="font-display text-lg font-bold tracking-tight">{v.k}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{v.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
