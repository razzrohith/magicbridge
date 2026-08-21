import { SectionHeading } from "@/components/SectionHeading";

/**
 * Beat 5b: the capabilities added since launch. These are the "it runs
 * itself" proofs: scheduling, session control, adaptive quality, 2FA, fleet.
 * Copy is sealed-product safe (no internals named).
 */
const capabilities = [
  {
    tag: "Automation",
    title: "A jiggler that runs itself.",
    body: "Keep the target awake with tiny nudges, and tell it when to start and stop: after a set time, at a clock time, or on a repeating daily window. It uses the device\u2019s own clock, shows the timezone, and survives a restart or a power cut.",
  },
  {
    tag: "Sessions",
    title: "See who is connected, and end it.",
    body: "Every open session shows its address, browser and how long it has been there, with a button to disconnect any of them. Your own session is marked, so you can\u2019t cut yourself off.",
  },
  {
    tag: "Adaptive",
    title: "Picture that gives way to control.",
    body: "On a weak connection it eases the picture back a step so your keyboard and mouse stay sharp, then returns when the line is clean. It never goes sharper than the setting you picked.",
  },
  {
    tag: "Access",
    title: "Lock it behind two factors.",
    body: "Password, plus a 6-digit code when you switch it on, with recovery codes you save once. Signing out ends remembered logins everywhere.",
  },
  {
    tag: "Fleet",
    title: "Run more than one.",
    body: "Name each device so your tabs are easy to tell apart, and keep your own list of units in one launcher page. The name is yours alone: it never reaches the identity the other computer sees.",
  },
  {
    tag: "Updates",
    title: "Updates in plain words.",
    body: "The update panel lists what changed in language you can act on, not developer shorthand.",
  },
];

export function ControlRoom() {
  return (
    <section
      aria-labelledby="control-room-title"
      className="relative z-10 border-y border-line bg-stage-2/30"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-14 sm:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="05" label="The control room" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan/70 sm:text-[11px] sm:tracking-[0.3em]">
            Now shipping
          </span>
        </div>

        <h2
          id="control-room-title"
          data-kinetic
          className="mt-8 max-w-3xl font-display text-[clamp(1.6rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
        >
          One page runs the whole thing.
          <span className="text-ink-dim"> Even when you are not watching.</span>
        </h2>

        <ul
          data-reveal="stagger"
          className="mt-10 grid sm:mt-16 list-none gap-x-12 gap-y-12 p-0 md:grid-cols-2"
        >
          {capabilities.map((c) => (
            <li key={c.title} className="border-l border-line pl-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/70">
                {c.tag}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
