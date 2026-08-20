import type { Metadata } from "next";
import { DraftNotice, Fill } from "@/components/LegalDraft";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Warranty (draft)",
  robots: { index: false, follow: false },
};

export default function WarrantyPage() {
  return (
    <PageShell eyebrow="Legal" title="Warranty">
      <DraftNotice />

      <h2>What is covered</h2>
      <p>
        Every MagicBridge is covered for <Fill>number</Fill> months from delivery against faults in
        the hardware or the way it was built. If it fails in normal use in that period, we repair
        it, replace it, or refund you.
      </p>

      <h2>What is not covered</h2>
      <ul>
        <li>Damage from liquid, drops, or a power supply other than the one it shipped with.</li>
        <li>Units that have been opened or modified.</li>
        <li>Normal wear to cables and connectors.</li>
        <li>
          <Fill>Anything else you want to exclude</Fill>
        </li>
      </ul>

      <h2>Software updates</h2>
      <p>
        Updates and support are included for the life of the device, at no extra charge. That is a
        commitment about updates, not a guarantee that any specific future feature will be built.
      </p>

      <h2>How to claim</h2>
      <p>
        Write to <Fill>contact email</Fill> describing the fault. Please include your order details.
      </p>
      <p>
        This warranty is in addition to your statutory rights, which it does not affect.{" "}
        <Fill>Confirm the correct statutory wording for where you sell</Fill>.
      </p>

      <p className="mt-10 text-sm text-ink-faint">
        Last updated <Fill>date</Fill>.
      </p>
    </PageShell>
  );
}
