import { SectionHeading } from "@/components/SectionHeading";

const columns = [
  "Private (no cloud)",
  "Smooth 1080p",
  "Wi-Fi setup from phone",
  "Mouse jiggler",
  "Unplugs when idle",
  "Stealth (can’t be detected)",
];

// "yes" | "limited" | "no" | "star"
const rows: { name: string; highlight?: boolean; cells: string[] }[] = [
  {
    name: "MagicBridge",
    highlight: true,
    cells: ["yes", "yes", "yes", "yes", "yes", "star"],
  },
  { name: "PiKVM", cells: ["yes", "yes", "no", "yes", "no", "no"] },
  { name: "TinyPilot", cells: ["yes", "limited", "no", "limited", "no", "no"] },
  { name: "JetKVM", cells: ["yes", "yes", "no", "yes", "no", "no"] },
  { name: "StarTech IP-KVM", cells: ["yes", "no", "no", "no", "no", "no"] },
];

const MARK_LABEL: Record<string, string> = {
  star: "Yes, fully stealth",
  yes: "Yes",
  limited: "Limited or add-on",
  no: "No",
};

function Mark({ kind }: { kind: string }) {
  const glyph =
    kind === "star" ? (
      <span aria-hidden className="text-cyan drop-shadow-[0_0_10px_var(--color-cyan)]">
        ★
      </span>
    ) : kind === "yes" ? (
      <span aria-hidden className="text-ink">
        ✓
      </span>
    ) : kind === "limited" ? (
      <span aria-hidden className="text-ink-faint">
        ~
      </span>
    ) : (
      <span aria-hidden className="text-ink-faint">
        ✕
      </span>
    );
  return (
    <>
      {glyph}
      <span className="sr-only">{MARK_LABEL[kind] ?? kind}</span>
    </>
  );
}

export function Comparison() {
  return (
    <section className="relative z-10 border-y border-line bg-stage-2/40">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-14 sm:py-36">
        <SectionHeading index="09" label="Comparison" />

        <h2
          data-kinetic
          className="mt-8 max-w-3xl font-display text-[clamp(1.6rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
        >
          Plenty of good boxes.
          <span className="text-ink-dim"> Only one the other computer can’t tell is there.</span>
        </h2>

        {/* Phones get a stacked card per product instead of the wide table.
            A six-column grid cannot survive 390px, and the alternative the
            table was using, a horizontal scroll container, hides half the
            comparison off-screen behind a gesture nobody is told about. Same
            data, same source array, read top to bottom. */}
        <div data-reveal="stagger" className="mt-10 grid gap-4 md:hidden">
          {rows.map((r) => (
            <div
              key={r.name}
              className={`rounded-2xl border p-5 ${
                r.highlight ? "border-cyan/30 bg-cyan/[0.04]" : "border-line bg-stage"
              }`}
            >
              <p
                className={`font-display text-lg font-bold tracking-tight ${
                  r.highlight ? "text-cyan" : "text-ink"
                }`}
              >
                {r.name}
              </p>
              <dl className="mt-4 grid gap-2.5">
                {r.cells.map((cell, i) => (
                  <div key={columns[i]} className="flex items-baseline justify-between gap-4">
                    <dt className="text-[13px] leading-snug text-ink-dim">{columns[i]}</dt>
                    <dd className="flex shrink-0 items-center gap-2 text-base">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                        {MARK_LABEL[cell]}
                      </span>
                      <Mark kind={cell} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div
          data-reveal
          className="mt-14 hidden overflow-x-auto rounded-2xl border border-line md:block"
        >
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th
                  scope="col"
                  className="bg-stage p-4 font-mono text-[11px] font-normal uppercase tracking-widest text-ink-faint"
                >
                  <span className="sr-only">Product</span>
                </th>
                {columns.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="bg-stage p-4 text-center align-bottom font-mono text-[11px] font-normal uppercase leading-snug tracking-widest text-ink-dim"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.name}
                  className={`border-b border-line/60 last:border-0 ${
                    r.highlight ? "bg-cyan/[0.04]" : "bg-stage"
                  }`}
                >
                  <th
                    scope="row"
                    className={`p-4 text-left font-display text-base font-bold tracking-tight ${
                      r.highlight ? "text-cyan" : "text-ink"
                    }`}
                  >
                    {r.name}
                  </th>
                  {r.cells.map((cell, i) => (
                    <td key={columns[i]} className="p-4 text-center text-lg">
                      <Mark kind={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-faint">
          Compared against publicly listed features as of August 2026. Products change, so check the
          maker’s own page before you decide.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint sm:gap-x-6 sm:text-[11px] sm:tracking-widest">
          <span>
            <span className="text-ink">✓</span> yes
          </span>
          <span>~ limited or add-on</span>
          <span>✕ no</span>
          <span>
            <span className="text-cyan">★</span> stealth
          </span>
        </div>
      </div>
    </section>
  );
}
