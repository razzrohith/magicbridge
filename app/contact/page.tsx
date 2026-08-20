import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageShell } from "@/components/PageShell";
import { FORMS_ENABLED } from "@/lib/forms";

export const metadata: Metadata = {
  title: "Contact and support",
  description:
    "Questions before buying, or help with a MagicBridge you already own. Messages come straight to me.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Support"
      title="Talk to a person"
      intro="MagicBridge is built and supported by one person, so your message comes straight to me rather than a queue."
    >
      <h2>Before you write</h2>
      <p>
        If you are setting one up for the first time, the{" "}
        <a className="u-link" href="/setup">
          setup guide
        </a>{" "}
        walks through it in about ten minutes, and the{" "}
        <a className="u-link" href="/faq">
          FAQ
        </a>{" "}
        answers the questions that come up most. If neither helps, write and I will.
      </p>

      {FORMS_ENABLED ? (
        <ContactForm
          kind="support"
          submitLabel="Send message"
          messageLabel="How can I help?"
          messagePlaceholder="What you are seeing, and what you have already tried."
        />
      ) : (
        <div className="note">
          <p>
            The contact form is not connected yet. It goes live as soon as the form endpoint is
            configured, and no messages are being collected in the meantime.
          </p>
        </div>
      )}
    </PageShell>
  );
}
