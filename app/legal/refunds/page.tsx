import type { Metadata } from "next";
import { DraftNotice, Fill } from "@/components/LegalDraft";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Refunds and returns (draft)",
  robots: { index: false, follow: false },
};

export default function RefundsPage() {
  return (
    <PageShell eyebrow="Legal" title="Refunds and returns">
      <DraftNotice />

      <h2>Changing your mind</h2>
      <p>
        You can return a MagicBridge within <Fill>number</Fill> days of delivery for a refund, as
        long as it is complete and undamaged.{" "}
        <Fill>State whether the box must be unopened, and whether a restocking fee applies</Fill>.
      </p>

      <h2>If it arrives faulty</h2>
      <p>
        If a unit is faulty on arrival, write to <Fill>contact email</Fill> and we will repair or
        replace it, or refund you in full. We cover return postage in that case.
      </p>

      <h2>Who pays return postage</h2>
      <p>
        <Fill>State who pays postage for a change-of-mind return</Fill>.
      </p>

      <h2>How to start a return</h2>
      <p>
        Write to <Fill>contact email</Fill> with your order details and what went wrong. Refunds are
        issued to the original payment method within <Fill>number</Fill> days of the unit arriving
        back.
      </p>

      <p className="mt-10 text-sm text-ink-faint">
        Last updated <Fill>date</Fill>.
      </p>
    </PageShell>
  );
}
