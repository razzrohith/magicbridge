import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageShell } from "@/components/PageShell";
import { FORMS_ENABLED } from "@/lib/forms";

export const metadata: Metadata = {
  title: "Reserve a MagicBridge",
  description:
    "MagicBridge is a one-time purchase with no subscription. Join the list and I will contact you when the next batch is ready.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <PageShell
      eyebrow="Reserve"
      title="Reserve a MagicBridge"
      intro="These are built in small batches. Leave your details and I will contact you when the next one is ready, with the price and delivery confirmed before you pay anything."
    >
      <h2>What you are reserving</h2>
      <ul>
        <li>
          <strong>One MagicBridge box, paid once.</strong> No subscription, ever.
        </li>
        <li>
          <strong>Free updates and support.</strong> New features and fixes as they land, and I help
          you set it up.
        </li>
        <li>
          <strong>No payment now.</strong> Joining the list does not charge you and does not commit
          you to buying.
        </li>
      </ul>

      <p>
        MagicBridge is sold for a computer you own, or one you are authorised to manage. It is not
        sold for watching someone else’s.
      </p>

      {FORMS_ENABLED ? (
        <ContactForm
          kind="waitlist"
          submitLabel="Join the list"
          messageLabel="Anything I should know? (optional)"
          messagePlaceholder="What you want to use it for, which computer, where you are based."
        />
      ) : (
        <div className="note">
          <p>
            The reservation form is not connected yet. It goes live as soon as the form endpoint is
            configured, and no details are being collected in the meantime.
          </p>
        </div>
      )}
    </PageShell>
  );
}
