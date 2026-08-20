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
      <div className="mx-auto max-w-6xl px-8 py-28 sm:px-14 sm:py-36">
        <SectionHeading index="09" label="Comparison" />

        <h2
          data-kinetic
          className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
        >
          Plenty of good boxes.
          <span className="text-ink-dim"> Only one the other computer can’t tell is there.</span>
        </h2>

        <div data-reveal className="mt-14 overflow-x-auto rounded-2xl border border-line">
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

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
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
