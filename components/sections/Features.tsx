import { SectionHeading } from "@/components/SectionHeading";

const features = [
  {
    title: "Invisible to the target.",
    body: "It dresses up as an ordinary mouse and monitor, so the other computer never flags a control box. The other devices here can’t do this.",
    span: "sm:col-span-2 lg:col-span-2",
  },
  {
    title: "Sets up from your phone.",
    body: "First run, it makes its own MagicBridge-Setup WiFi. Join from your phone, pick your home network, done. No cable, no screen.",
  },
  {
    title: "Wake it, then use it.",
    body: "Power the other computer on from the same page with Wake-on-LAN, or set a wake schedule so it is already up when you need it.",
  },
  {
    title: "Connects only when in use.",
    body: "Between sessions it can unplug its own keyboard and mouse from the target, so nothing is attached while you’re away.",
  },
  {
    title: "Fixes itself.",
    body: "Plug it in and it sets up its own video and disguise. If WiFi or power blips mid-session, it reconnects on its own.",
  },
  {
    title: "Type and paste across.",
    body: "An on-screen keyboard for keys your laptop can’t send, saved clips and key-sequence macros, plus paste a password or block of text straight onto the other machine.",
    span: "sm:col-span-2 lg:col-span-3",
  },
];

export function Features() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-8 py-28 sm:px-14 sm:py-36">
      <SectionHeading index="04" label="What sets it apart" />

      <h2
        data-kinetic
        className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
      >
        Everything a good box does.
        <span className="text-ink-dim"> Plus the one thing none of them can.</span>
      </h2>

      <div
        data-reveal="stagger"
        className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((f) => (
          <div key={f.title} className={`u-card bg-stage p-8 ${f.span ?? ""}`}>
            <p className="font-display text-xl font-bold tracking-tight text-ink">{f.title}</p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-dim">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
