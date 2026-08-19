import { SectionHeading } from "@/components/SectionHeading";

const steps = [
  {
    n: "1",
    title: "Plug in two cables.",
    body: "One carries the other computer’s screen into the box. One makes the box act as its keyboard and mouse.",
  },
  {
    n: "2",
    title: "It puts on a disguise.",
    body: "It looks like an ordinary wireless mouse and keyboard, plus a plain monitor. The computer sees nothing odd.",
  },
  {
    n: "3",
    title: "Open one web page.",
    body: "On your own laptop, same WiFi, nothing to install. Move your mouse and its cursor moves. Type and it types.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative z-10 mx-auto max-w-6xl px-8 py-28 sm:px-14 sm:py-36">
      <SectionHeading index="03" label="How it works" />

      <h2
        data-kinetic
        className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
      >
        Three steps. Then you’re in.
      </h2>

      <div
        data-reveal="stagger"
        className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3"
      >
        {steps.map((s) => (
          <div key={s.n} className="u-card flex flex-col bg-stage p-9">
            <span className="font-mono text-sm text-cyan/80">{s.n.padStart(2, "0")}</span>
            <p className="mt-6 font-display text-2xl font-bold tracking-tight">{s.title}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">{s.body}</p>
          </div>
        ))}
      </div>

      <p
        data-reveal
        className="mt-12 font-mono text-[13px] uppercase tracking-[0.2em] text-ink-faint"
      >
        No software on the other computer. Nothing for it to detect.
      </p>
    </section>
  );
}
