import { SectionHeading } from "@/components/SectionHeading";

const problems = [
  {
    lead: "It’s out of reach.",
    body: "The machine is in another room, or has no screen or keyboard plugged in at all.",
  },
  {
    lead: "You don’t want to install anything.",
    body: "Remote-control apps put software on it. That’s extra weight, and something it can detect.",
  },
  {
    lead: "You don’t want it to know.",
    body: "Store-bought boxes announce themselves. The machine sees a strange new device forever.",
  },
];

export function Problem() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-8 py-28 sm:px-14 sm:py-36">
      <SectionHeading index="01" label="The problem" />

      <h2
        data-kinetic
        className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
      >
        Reaching a second computer is
        <span className="text-ink-dim"> harder than it should be.</span>
      </h2>

      <div
        data-reveal="stagger"
        className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
      >
        {problems.map((p) => (
          <div key={p.lead} className="u-card bg-stage p-8">
            <p className="font-display text-xl font-bold tracking-tight text-ink">{p.lead}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{p.body}</p>
          </div>
        ))}
      </div>

      <p data-reveal className="mt-14 max-w-2xl text-lg leading-relaxed text-ink-dim">
        MagicBridge fixes all three. Private, yours for one price, and completely{" "}
        <span className="text-cyan">invisible</span> to that computer.
      </p>
    </section>
  );
}
