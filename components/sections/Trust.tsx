import { SectionHeading } from "@/components/SectionHeading";

const points = [
  {
    title: "Password-protected.",
    body: "The web page needs your password. Nobody opens it and takes over without it.",
  },
  {
    title: "Stays on your network.",
    body: "The screen and controls never leave your home. There’s no cloud server for anyone else to reach. Away from home, it comes with you securely over Tailscale.",
  },
  {
    title: "It’s for YOUR machine.",
    body: "Built to run a second computer you own, privately. Not to watch someone else’s.",
  },
];

/**
 * Beat 7 : plain, effect-free trust section. This is a conversion issue, not
 * only ethics: the "for hardware you own" framing keeps the product legible.
 */
export function Trust() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-8 py-28 sm:px-14 sm:py-36">
      <SectionHeading index="08" label="Trust" />

      <h2
        data-kinetic
        className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
      >
        Locked down, and for a computer you own.
      </h2>

      <div data-reveal="stagger" className="mt-16 grid gap-12 md:grid-cols-3">
        {points.map((p) => (
          <div key={p.title}>
            <p className="font-display text-xl font-bold tracking-tight">{p.title}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
