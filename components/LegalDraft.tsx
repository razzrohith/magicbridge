/**
 * Wrapper for the policy pages.
 *
 * These are SCAFFOLDS, not finished policies. Every fact only Raj can supply is
 * left as a visible [[bracketed]] placeholder rather than invented, because a
 * made-up refund window or warranty period is a promise to a paying customer.
 * The pages are noindex and are deliberately not linked from the footer until
 * they have been reviewed and the placeholders filled in.
 */
export function DraftNotice() {
  return (
    <div className="mb-10 rounded-2xl border border-cyan/30 bg-cyan/[0.05] p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan/90">Draft</p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
        This page is a working draft. Anything in double brackets still needs to be confirmed and
        replaced before MagicBridge takes payment. It is not indexed by search engines and is not
        linked from the site yet.
      </p>
    </div>
  );
}

/** A fact that must be supplied before launch. Deliberately conspicuous. */
export function Fill({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded bg-cyan/15 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan">
      [[{children}]]
    </mark>
  );
}
