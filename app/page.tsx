import { AnimationLayer } from "@/components/AnimationLayer";
import { PointerGlow } from "@/components/PointerGlow";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Close } from "@/components/sections/Close";
import { Comparison } from "@/components/sections/Comparison";
import { ControlRoom } from "@/components/sections/ControlRoom";
import { DeepDive } from "@/components/sections/DeepDive";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Problem } from "@/components/sections/Problem";
import { RemoteSecure } from "@/components/sections/RemoteSecure";
import { Reveal } from "@/components/sections/Reveal";
import { Trust } from "@/components/sections/Trust";
import { Scene } from "@/components/three/Scene";

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "MagicBridge",
  description:
    "A small box you plug into a second computer to see and control it, live, from any browser in your house, and that computer can’t tell anything is there. For hardware you own.",
  brand: { "@type": "Brand", name: "MagicBridge" },
  category: "KVM-over-IP hardware",
  offers: {
    "@type": "Offer",
    price: "549",
    priceCurrency: "USD",
    availability: "https://schema.org/PreOrder",
  },
};

const jsonLd = JSON.stringify(productSchema);

export default function Home() {
  return (
    <div className="relative min-h-dvh">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, trusted JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <SmoothScroll />
      <AnimationLayer />
      <PointerGlow />

      {/* Scroll progress line (scaled by ScrollTrigger; inert under reduced motion).
          Initial scale set via `transform` : NOT Tailwind's `scale-x-0` (native
          `scale` property), which would multiplicatively cancel GSAP's transform. */}
      <div
        id="scrollbar"
        aria-hidden
        style={{ transform: "scaleX(0)" }}
        className="fixed inset-x-0 top-0 z-[95] h-0.5 origin-left bg-cyan/70 shadow-[0_0_8px_var(--color-cyan)]"
      />

      {/* soft radial vignette so the stage reads as a lit void, not flat black */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(120% 90% at 70% 6%, rgba(18,198,230,0.05), transparent 55%)",
        }}
      />

      {/* Immersive 3D device backdrop (client-only, capability-gated). */}
      <Scene />

      <SiteHeader />

      <main className="relative">
        <Hero />
        <Problem />
        <Reveal />
        <HowItWorks />
        <Features />
        <ControlRoom />
        <DeepDive />
        <RemoteSecure />
        <Trust />
        <Comparison />
        <Close />
      </main>

      <SiteFooter />
    </div>
  );
}
