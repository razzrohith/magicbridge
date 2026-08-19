import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Update to the real domain when hosting lands (Phase 8). Drives OG/canonical URLs.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://magicbridge.razzrohith.com";

const DESCRIPTION =
  "A small box you plug into your other computer to see and control it, live, from any browser in your house, and that computer can’t tell anything is there. $549, one-time. For hardware you own.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MagicBridge · The invisible remote control for a computer you own",
    template: "%s · MagicBridge",
  },
  description: DESCRIPTION,
  applicationName: "MagicBridge",
  keywords: [
    "MagicBridge",
    "remote control box",
    "KVM over IP",
    "invisible KVM",
    "stealth KVM",
    "browser remote control",
    "control second computer",
    "BIOS level remote",
    "for hardware you own",
  ],
  authors: [{ name: "MagicBridge" }],
  creator: "MagicBridge",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "MagicBridge",
    title: "MagicBridge · The invisible remote control for a computer you own",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MagicBridge · The invisible remote control for a computer you own",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

// Pre-paint: enable entrance motion only when JS is on and motion is allowed.
// Absent class => all [data-reveal]/[data-kinetic] stay visible (no-JS / reduced-motion safe).
// Failsafe: if the app never confirms it took over (hydration/GSAP failure), strip
// `.motion` after 4s so below-the-fold content can never be stranded invisible.
const MOTION_BOOT = `try{
var e=document.documentElement;
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  e.classList.add('motion');
  setTimeout(function(){if(!e.classList.contains('revealed'))e.classList.remove('motion')},4000);
  // Same cheap predicates as canRun3D(), minus the WebGL2 probe. Deciding the
  // reveal-stage height here keeps the 260vh track out of a post-hydration
  // layout shift; Scene removes the class if WebGL2 turns out to be missing.
  var n=navigator;
  if(innerWidth>=900
     && matchMedia('(hover: hover) and (pointer: fine)').matches
     && !(n.deviceMemory>0&&n.deviceMemory<3)
     && !(n.hardwareConcurrency>0&&n.hardwareConcurrency<4)){
    e.classList.add('stage3d');
  }
}
}catch(_){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // The boot script mutates <html>.class before hydration; tell React not to warn.
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: tiny trusted boot script, must run pre-paint */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
        {children}
      </body>
    </html>
  );
}
