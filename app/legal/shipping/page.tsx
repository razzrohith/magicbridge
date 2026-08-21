import type { Metadata } from "next";
import { DraftNotice, Fill } from "@/components/LegalDraft";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Shipping and delivery (draft)",
  robots: { index: false, follow: false },
};

export default function ShippingPage() {
  return (
    <PageShell eyebrow="Legal" title="Shipping and delivery">
      <DraftNotice />

      <h2>Where we ship</h2>
      <p>
        <Fill>List the countries or regions you ship to</Fill>.
      </p>

      <h2>What it costs</h2>
      <p>
        <Fill>Shipping cost, or state that it is included in the purchase price</Fill>.
      </p>

      <h2>How long it takes</h2>
      <p>
        Units are built in small batches, so the wait depends on where you are in the queue. Once a
        unit ships, delivery takes about <Fill>number</Fill> working days to <Fill>region</Fill>.
        You get a tracking number when it leaves.
      </p>

      <h2>Import duties and taxes</h2>
      <p>
        <Fill>
          State clearly who pays import duty and local taxes. This is the most common cause of an
          unhappy international customer.
        </Fill>
      </p>

      <h2>If it does not arrive</h2>
      <p>
        Write to <Fill>contact email</Fill> and we will trace it with the carrier and replace it if
        it is lost.
      </p>

      <p className="mt-10 text-sm text-ink-faint">
        Last updated <Fill>date</Fill>.
      </p>
    </PageShell>
  );
}
