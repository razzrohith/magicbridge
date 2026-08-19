import { SectionHeading } from "@/components/SectionHeading";

const ready = [
  {
    title: "Works on any computer.",
    body: "Windows, Mac, or Linux, and even a machine with no operating system yet. To it, the box is just a monitor and mouse.",
  },
  {
    title: "Even when it’s stuck.",
    body: "Drive it through a restart, into the BIOS, or when the screen is frozen, exactly when you can’t reach it any other way.",
  },
  {
    title: "Use it from anywhere.",
    body: "On your home network, or securely over the internet with built-in Tailscale.",
  },
  {
    title: "Reconnects on its own.",
    body: "If WiFi or power blips mid-session, it comes right back without you touching it.",
  },
  {
    title: "Wake it from cold.",
    body: "Power the target on remotely, or on a schedule, so it is ready before you are.",
  },
  {
    title: "Grows with you.",
    body: "Run several units, name each one, and keep your own list of them in one launcher page.",
  },
];

const pricePoints = [
  {
    title: "Free updates.",
    body: "New features and fixes as they land, at no extra charge.",
  },
  {
    title: "Full support.",
    body: "I help you set it up and keep it running. You’re not on your own.",
  },
  {
    title: "No lock-in.",
    body: "Nothing phones home. Run it entirely on your own network, forever.",
  },
];

export function Close() {
  return (
    <section id="price" className="relative z-10 mx-auto max-w-6xl px-8 py-28 sm:px-14 sm:py-40">
      <SectionHeading index="10" label="Ready today" />

      <h2
        data-kinetic
        className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
      >
        It works the moment you plug it in.
      </h2>

      <div
        data-reveal="stagger"
        className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2"
      >
        {ready.map((r) => (
          <div key={r.title} className="u-card bg-stage p-8">
            <p className="font-display text-xl font-bold tracking-tight">{r.title}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{r.body}</p>
          </div>
        ))}
      </div>

      {/* Price card */}
      <div
        data-reveal
        className="mt-24 overflow-hidden rounded-3xl border border-cyan/20 bg-[radial-gradient(120%_140%_at_50%_-20%,rgba(18,198,230,0.08),transparent_60%)]"
      >
        <div className="grid gap-12 p-10 sm:p-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/85">
              One price. No subscriptions, ever.
            </p>
            <p className="mt-6 font-display text-[clamp(3.5rem,9vw,6rem)] font-bold leading-none tracking-tight">
              $549
              <span className="ml-3 align-top text-2xl font-medium text-ink-dim">once</span>
            </p>
            <a
              href="#price"
              className="u-press mt-10 inline-block rounded-full bg-cyan px-8 py-3.5 font-mono text-xs font-medium uppercase tracking-widest text-stage"
            >
              Get MagicBridge
            </a>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-faint">
              You pay once for the only remote box the other computer can’t see. Commercial KVMs
              cost this much or more, then bill you every month.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-1">
            {pricePoints.map((p) => (
              <div key={p.title} className="border-l border-line pl-5">
                <p className="font-display text-lg font-bold tracking-tight">{p.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p
        data-kinetic
        className="mx-auto mt-24 max-w-3xl text-center font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight"
      >
        The invisible remote control for a <span className="text-cyan">computer you own.</span>
      </p>
    </section>
  );
}
