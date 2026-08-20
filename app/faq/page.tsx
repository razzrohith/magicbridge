import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Questions people actually ask",
  description:
    "The real questions from testing MagicBridge: setup, remote access, what it works with, and what it costs.",
  alternates: { canonical: "/faq" },
};

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "I typed magicbridge.local and nothing happened. Is it broken?",
    a: (
      <>
        No, and that is deliberate. MagicBridge does not announce itself by name on your network,
        because announcing itself is exactly what would give it away. Use the address the setup page
        gave you in step 3.
      </>
    ),
  },
  {
    q: "I lost the address.",
    a: (
      <>
        If your box has a small screen, it is shown there. Otherwise, unplug the power, plug it back
        in, and the Setup network appears again so you can go through step 2 once more.
      </>
    ),
  },
  {
    q: "Do I need to install anything on the computer I am controlling?",
    a: (
      <>
        No. That is the whole point. It never has software on it and never knows the box is there.
      </>
    ),
  },
  {
    q: "Does it work if the other computer is switched off, or stuck?",
    a: (
      <>
        Yes. You can watch it start up, get into its startup menus, and use it when the screen is
        frozen.
      </>
    ),
  },
  {
    q: "Do I need to plug in a network cable?",
    a: <>No. WiFi is all it needs. A cable is optional.</>,
  },
  {
    q: "Can I use it away from home?",
    a: (
      <>
        Yes, with the free Tailscale option in Settings. You need the Tailscale app on the device
        you are connecting from as well.
      </>
    ),
  },
  {
    q: "I turned on Tailscale but I still cannot connect.",
    a: (
      <>
        Check two things. First, the device you are connecting from also needs to be signed in to
        Tailscale. Second, if you are running another VPN, turn it off. Most VPNs block this kind of
        private connection.
      </>
    ),
  },
  {
    q: "My WiFi router is a travel router or a guest network.",
    a: (
      <>
        The box and the device you are controlling it from must be on the same network. If they are
        on two different networks, they cannot see each other.
      </>
    ),
  },
  {
    q: "What screen quality do I get?",
    a: <>Full HD, running smoothly at 50 frames a second.</>,
  },
  {
    q: "Are there any monthly fees?",
    a: <>No. You pay once. Updates and support are included forever.</>,
  },
  {
    q: "Is this legal?",
    a: (
      <>
        MagicBridge is built for controlling a computer you own or are authorised to manage. That is
        what it is sold for.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="FAQ"
      title="Questions people actually ask"
      intro="Every one of these came up while testing the device."
    >
      <dl>
        {faqs.map((f) => (
          <div key={f.q} className="step">
            <dt className="font-display text-lg font-bold tracking-tight text-ink">{f.q}</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-ink-dim">{f.a}</dd>
          </div>
        ))}
      </dl>

      <div className="note">
        <p>
          Setting it up for the first time? Start with the{" "}
          <a className="u-link" href="/setup">
            setup guide
          </a>
          .
        </p>
      </div>
    </PageShell>
  );
}
