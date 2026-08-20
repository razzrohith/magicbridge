import type { Metadata } from "next";
import { DraftNotice, Fill } from "@/components/LegalDraft";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy policy (draft)",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <PageShell eyebrow="Legal" title="Privacy policy">
      <DraftNotice />

      <h2>Who is responsible</h2>
      <p>
        MagicBridge is run by <Fill>legal name or trading name</Fill>, based in <Fill>country</Fill>
        . You can reach us at <Fill>contact email</Fill>.
      </p>

      <h2>What the website collects</h2>
      <p>
        If you join the reservation list or write to support, we receive the name, email address and
        message you type. That is used only to reply to you and to tell you when a unit is ready.
      </p>
      <p>
        Those messages are handled by <Fill>form provider, e.g. Formspree</Fill>, who process them
        on our behalf. The site itself sets no analytics and no advertising cookies.
      </p>

      <h2>What the device collects</h2>
      <p>
        Nothing reaches us. MagicBridge runs entirely on your own network, has no account, and does
        not report usage, telemetry or diagnostics to us or anyone else. Sign-in history and
        connection history stay in the device's memory and are gone when it restarts.
      </p>

      <h2>How long we keep things</h2>
      <p>
        Reservation and support messages are kept for <Fill>retention period</Fill>, then deleted.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask what we hold about you, ask for it to be corrected, or ask for it to be deleted,
        by writing to <Fill>contact email</Fill>.{" "}
        <Fill>
          Add the specific rights wording required in your jurisdiction, for example UK/EU GDPR or
          CCPA
        </Fill>
        .
      </p>

      <p className="mt-10 text-sm text-ink-faint">
        Last updated <Fill>date</Fill>.
      </p>
    </PageShell>
  );
}
