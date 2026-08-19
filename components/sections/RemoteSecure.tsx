import { SectionHeading } from "@/components/SectionHeading";

/**
 * Beat 7: the two things buyers ask about once they believe the stealth story,
 * "can I reach it when I am not home?" and "who else can reach it?".
 *
 * Every claim here is sealed-product safe: the encryption, the in-memory logs
 * and the lockdown are described by what they do, never by the technology or
 * paths that implement them.
 */

const hops = [
  { k: "You", v: "Any browser, anywhere" },
  { k: "Private link", v: "Encrypted, direct to your box" },
  { k: "The box", v: "On your network, at home" },
  { k: "The target", v: "Sees a monitor and a keyboard" },
];

const layers = [
  {
    n: "01",
    title: "A password on the page.",
    body: "The control page will not open without it, and the admin side keeps its own separate password.",
  },
  {
    n: "02",
    title: "A second factor.",
    body: "Add a 6-digit code from your authenticator app, with recovery codes you save once. Signing out ends remembered logins everywhere.",
  },
  {
    n: "03",
    title: "Lock it to your private network.",
    body: "Turn on private-network-only access and the box stops answering anything else, even on your own WiFi.",
  },
  {
    n: "04",
    title: "Kick anyone off.",
    body: "Every live session shows its address, browser and how long it has been connected, with one button to disconnect it.",
  },
  {
    n: "05",
    title: "Encrypted where it rests.",
    body: "Its settings and secrets are held encrypted on the device, unlocked only as it starts.",
  },
  {
    n: "06",
    title: "Logs that never land.",
    body: "Sign-ins and connection history live in memory and are gone on restart. Your WiFi name is never written to storage.",
  },
];

export function RemoteSecure() {
  return (
    <section
      aria-labelledby="remote-secure-title"
      className="relative z-10 border-y border-line bg-stage-2/30"
    >
      <div className="mx-auto max-w-6xl px-8 py-28 sm:px-14 sm:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="07" label="Remote & protected" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/70">
            Included, nothing extra to buy
          </span>
        </div>

        <h2
          id="remote-secure-title"
          data-kinetic
          className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
        >
          Reach it from anywhere.
          <span className="text-ink-dim"> Nobody else can.</span>
        </h2>

        {/* Reach: the private path from you to the box, full width so the
            hop chain reads left to right like the signal it describes. */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan/80">
              Built-in remote access
            </p>
            <p data-reveal className="mt-5 text-lg leading-relaxed text-ink-dim">
              Tailscale is built in. Turn it on once and your box joins a private network only your
              devices can see, so you can take over from a hotel, an office, or a phone on mobile
              data exactly as you would from the next room.
            </p>
          </div>
          <div data-reveal className="lg:pt-8">
            <ol className="grid list-none gap-px overflow-hidden rounded-2xl border border-line bg-line p-0 sm:grid-cols-2">
              {hops.map((h) => (
                <li key={h.k} className="u-card bg-stage p-6">
                  <span className="font-display text-base font-bold tracking-tight text-cyan">
                    {h.k}
                  </span>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{h.v}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-faint">
              No ports opened on your router, and no cloud service in the middle holding your
              screen. The picture and your keystrokes travel straight between your devices.
            </p>
          </div>
        </div>

        {/* Protection: the stack, laid out as a grid so it reads as a wall */}
        <div className="mt-20 border-t border-line pt-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan/80">
            Six layers between it and everyone else
          </p>
          <ol
            data-reveal="stagger"
            className="mt-10 grid list-none gap-x-12 gap-y-10 p-0 md:grid-cols-2 lg:grid-cols-3"
          >
            {layers.map((l) => (
              <li key={l.n} className="border-l border-line pl-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/70">
                  {l.n}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold tracking-tight">{l.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{l.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
