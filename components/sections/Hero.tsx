import { DeviceHint } from "@/components/DeviceHint";

/**
 * Beat 1 : the device in the void.
 * LCP is this real-DOM headline (rule 7). The 3D device renders full-bleed
 * behind the page from a single fixed canvas; nothing here shifts as it fades
 * in (rule 7 CLS). Text sits in a readable column on the left, the lit device
 * floats to the right in 3D.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center px-8 py-24 sm:px-14"
    >
      {/* data-hero-group: above-the-fold entrance is CSS-driven (globals.css) so
          the headline paints immediately as the real-DOM LCP element (rule 7). */}
      <div data-hero-group className="mx-auto w-full max-w-6xl">
        <p className="mb-7 font-mono text-[11px] uppercase tracking-[0.34em] text-cyan/85">
          <span className="mr-2.5 inline-block h-2 w-2 rounded-full bg-cyan align-middle shadow-[0_0_12px_var(--color-cyan)] motion-safe:animate-pulse" />
          For hardware you own
        </p>

        <h1 className="max-w-4xl font-display text-[clamp(2.75rem,8vw,5.75rem)] font-bold leading-[1.02] tracking-tight">
          Full control of your machine.
          <br />
          <span className="text-ink-dim">From anywhere. </span>
          <span className="text-cyan">Invisible.</span>
        </h1>

        <p className="mt-9 max-w-xl text-lg leading-relaxed text-ink-dim">
          A small box you plug into your other computer. See its screen and take over, live, from
          any browser in your house, and that computer can’t tell anything is there.
        </p>

        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-faint">
          For a second computer you own, or one you are authorised to manage. Not for watching
          someone else’s.
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-5">
          <a
            href="/order"
            className="u-press rounded-full bg-cyan px-7 py-3 font-mono text-xs font-medium uppercase tracking-widest text-stage"
          >
            $549 · once
          </a>
          <a
            href="#how"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-faint transition-colors hover:text-ink focus-visible:text-ink"
          >
            See how it works
            <span className="inline-block transition-transform group-hover:translate-y-0.5">↓</span>
          </a>

          {/* Sits on the CTA row rather than in the caption bar at the bottom of
              the section: the hero column already fills the viewport, so
              anything on a new line below this falls under the fold and the
              affordance would never be seen. Hidden unless the live 3D mounted. */}
          <DeviceHint />
        </div>
      </div>

      {/* Product shot for everyone who does NOT get the live 3D: phones,
          reduced-motion, and machines without WebGL2. Before this they saw an
          empty column where the device should be. CSS-gated on .stage3d so it
          costs no JS and never double-renders alongside the canvas. */}
      <div className="hero-fallback mx-auto mt-14 w-full max-w-2xl">
        {/* Two crops of the same shot. A phone showing the 21:9 frame renders
            the device postage-stamp small, so small screens get a tighter 4:3
            crop instead. width/height on each <source> so swapping aspect
            ratios still reserves the right box (rule 7 CLS). */}
        <picture>
          <source
            media="(min-width: 640px)"
            srcSet="/hero-device.webp"
            type="image/webp"
            width={1600}
            height={686}
          />
          <source
            media="(min-width: 640px)"
            srcSet="/hero-device.jpg"
            type="image/jpeg"
            width={1600}
            height={686}
          />
          <source srcSet="/hero-device-mobile.webp" type="image/webp" width={1200} height={900} />
          <img
            src="/hero-device-mobile.jpg"
            width={1200}
            height={900}
            alt="The MagicBridge device: a small sealed box with an engraved lid, a lit status window showing its address, and labelled ports along one side."
            className="h-auto w-full"
            // Eager and high priority, NOT lazy. Measured on the built site:
            // wherever the 3D does not mount, this image is the LCP element
            // (390x844 and 768x1024 both resolve LCP to it), so deprioritising
            // it is deprioritising the largest paint on every phone. It costs
            // one wasted ~12 KB request on desktops that do run the 3D, where
            // the block is display:none, and that is the cheaper side of the
            // trade by a wide margin.
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>

      {/* Honesty caption for the 3D render (tone/safety rule). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto flex max-w-6xl items-end justify-between px-8 sm:px-14">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint">
          Product rendering
        </span>
        <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint sm:flex">
          Scroll
          <span className="inline-block h-8 w-px bg-gradient-to-b from-ink-faint/50 to-transparent" />
        </span>
      </div>
    </section>
  );
}
