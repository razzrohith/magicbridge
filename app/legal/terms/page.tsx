import type { Metadata } from "next";
import { DraftNotice, Fill } from "@/components/LegalDraft";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Terms of sale (draft)",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <PageShell eyebrow="Legal" title="Terms of sale">
      <DraftNotice />

      <h2>Who you are buying from</h2>
      <p>
        <Fill>legal name or trading name</Fill>, registered in <Fill>country</Fill>
        <Fill>company number, if you have one</Fill>.
      </p>

      <h2>The product and the price</h2>
      <p>
        MagicBridge is a physical device sold for $549, paid once. There is no subscription and no
        recurring charge. Prices are in <Fill>currency</Fill> and{" "}
        <Fill>state whether tax, VAT or duties are included</Fill>.
      </p>

      <h2>Acceptable use</h2>
      <p>
        By buying MagicBridge you confirm that you own the computer you will connect it to, or that
        you are authorised by its owner to control and manage it.
      </p>
      <p>
        MagicBridge is not sold for monitoring people without their knowledge, for use on hardware
        you do not control, or for evading security controls that someone else is responsible for.
        We may decline or cancel an order we believe is intended for those purposes.
      </p>

      <h2>Orders and delivery</h2>
      <p>
        Units are built in small batches. A reservation is not a purchase: nothing is charged until
        an order is confirmed. Delivery terms are set out in the{" "}
        <a className="u-link" href="/legal/shipping">
          shipping page
        </a>
        .
      </p>

      <h2>Cancelling and returns</h2>
      <p>
        See the{" "}
        <a className="u-link" href="/legal/refunds">
          refunds and returns page
        </a>
        .{" "}
        <Fill>
          Add any statutory cancellation right that applies where you sell, for example the UK/EU 14
          day right to cancel
        </Fill>
        .
      </p>

      <h2>Liability</h2>
      <p>
        <Fill>
          Liability wording, drafted or reviewed by someone qualified in your jurisdiction. Do not
          ship this page without it.
        </Fill>
      </p>

      <h2>Which law applies</h2>
      <p>
        These terms are governed by the law of <Fill>jurisdiction</Fill>.
      </p>

      <p className="mt-10 text-sm text-ink-faint">
        Last updated <Fill>date</Fill>.
      </p>
    </PageShell>
  );
}
