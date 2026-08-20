import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Setting up your MagicBridge",
  description:
    "The first-run guide. It takes about ten minutes, and you need your phone for the first part.",
  alternates: { canonical: "/setup" },
};

const needs = [
  [
    "A video output on the other computer",
    "The computer you want to control needs a screen output you can plug into.",
  ],
  ["A spare USB port on the other computer", "This is how the box acts as its keyboard and mouse."],
  [
    "WiFi at home",
    "Both the box and the device you use to control it need to be on the same WiFi.",
  ],
  ["A phone for the first five minutes", "Only for the very first setup."],
  [
    "A free Tailscale account, only for remote access",
    "Optional. The app also has to be installed on whatever device you want to connect from.",
  ],
];

export default function SetupPage() {
  return (
    <PageShell
      eyebrow="Setup guide"
      title="Setting up your MagicBridge"
      intro="It takes about ten minutes. You need your phone for the first part."
    >
      <h2>Before you start</h2>
      <ul>
        {needs.map(([k, v]) => (
          <li key={k}>
            <strong>{k}.</strong> {v}
          </li>
        ))}
      </ul>

      <div className="step">
        <span className="step-n">Step 01</span>
        <h3>Plug it in</h3>
        <p>
          Connect the video cable from the other computer’s screen output into the socket marked{" "}
          <strong>IN</strong> on the box. Connect the control cable from the box into any USB port
          on that computer. Then plug in the power.
        </p>
        <p>Give it about two minutes to wake up the first time.</p>
      </div>

      <div className="step">
        <span className="step-n">Step 02</span>
        <h3>Connect it to your WiFi</h3>
        <p>
          The very first time it starts, MagicBridge creates its own temporary WiFi network so you
          can talk to it.
        </p>
        <ul>
          <li>On your phone, open your WiFi settings.</li>
          <li>
            Look for an open network whose name starts with <strong>Setup-</strong>. If your box has
            a small screen on it, the exact name is shown there.
          </li>
          <li>Join it. There is no password.</li>
          <li>
            A setup page should open by itself. If it does not, open your browser and go to{" "}
            <strong>192.168.73.1</strong>
          </li>
          <li>Choose your home WiFi from the list and enter its password.</li>
        </ul>
      </div>

      <div className="step">
        <span className="step-n">Step 03</span>
        <h3>Write down your address</h3>
        <p>
          When it connects, the setup page shows you <strong>your box’s web address</strong>. Write
          it down or screenshot it. This is how you reach MagicBridge from now on.
        </p>
        <p>
          The temporary Setup network disappears at this point. That is normal, it means it worked.
        </p>
      </div>

      <div className="step">
        <span className="step-n">Step 04</span>
        <h3>Open it and set your password</h3>
        <ul>
          <li>Reconnect your phone or laptop to your normal home WiFi.</li>
          <li>Open the address from step 3 in any browser.</li>
          <li>
            Your browser may warn you that the connection is not private. That is expected for a
            device on your own network. Choose to continue.
          </li>
          <li>
            Sign in with the starting password: <strong>magicbridge</strong>
          </li>
          <li>
            You will immediately be asked to choose your own password. Do it now. Until you do,
            nothing else will open.
          </li>
        </ul>
      </div>

      <div className="step">
        <span className="step-n">Step 05</span>
        <h3>Get the latest version</h3>
        <p>
          Go to <strong>Settings</strong>, then <strong>System</strong>, then{" "}
          <strong>Check for updates</strong>. Install what it offers and let it restart. This takes
          a few minutes and only needs doing once at the start.
        </p>
        <p>That’s it. You are in.</p>
      </div>

      <div className="step">
        <span className="step-n">Step 06 · optional</span>
        <h3>Reach it from anywhere</h3>
        <p>
          If you want to use MagicBridge when you are away from home, open <strong>Settings</strong>
          , then <strong>Remote access</strong>, and follow the steps to turn on Tailscale. It is
          free for personal use.
        </p>
        <ul>
          <li>
            You also need the Tailscale app on whatever phone or laptop you want to connect{" "}
            <strong>from</strong>. Both ends have to be signed in to the same account.
          </li>
          <li>
            If you use another VPN, turn it off while you connect. Most VPNs will block the
            connection.
          </li>
        </ul>
      </div>

      <div className="note">
        <p>
          Stuck on something? The{" "}
          <a className="u-link" href="/faq">
            questions people actually ask
          </a>{" "}
          covers the common ones.
        </p>
      </div>
    </PageShell>
  );
}
