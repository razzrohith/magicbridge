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
      className="relative z-10 flex min-h-[100svh] flex-col justify-start px-6 pt-8 pb-0 sm:justify-center sm:px-14 sm:py-24"
    >
      {/* data-hero-group: above-the-fold entrance is CSS-driven (globals.css) so
          the headline paints immediately as the real-DOM LCP element (rule 7). */}
      <div data-hero-group className="mx-auto w-full max-w-6xl">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan/85 sm:mb-7 sm:text-[11px] sm:tracking-[0.34em]">
          <span className="mr-2.5 inline-block h-2 w-2 rounded-full bg-cyan align-middle shadow-[0_0_12px_var(--color-cyan)] motion-safe:animate-pulse" />
          For hardware you own
        </p>

        <h1 className="max-w-4xl font-display text-[clamp(2rem,7.4vw,5.75rem)] font-bold leading-[1.04] tracking-tight sm:leading-[1.02]">
          Full control of your machine.
          <br />
          <span className="text-ink-dim">From anywhere. </span>
          <span className="text-cyan">Invisible.</span>
        </h1>

        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-dim sm:mt-9 sm:text-lg">
          A small box you plug into your other computer. See its screen and take over, live, from
          any browser in your house, and that computer can’t tell anything is there.
        </p>

        <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-ink-faint sm:mt-5 sm:text-[15px]">
          For a second computer you own, or one you are authorised to manage. Not for watching
          someone else’s.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-11 sm:gap-5">
          <a
            href="/order"
            className="u-press rounded-full bg-cyan px-7 py-3 font-mono text-xs font-medium uppercase tracking-widest text-stage"
          >
            Reserve yours
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

      {/* Reserved stage for the live device on phones. The canvas is fixed and
          full-bleed, so it does not take part in this column's layout: without
          a box holding the space open the copy would run to the bottom of the
          viewport and the device would render straight over it. Desktop needs
          none of this because the device sits beside the headline, not under
          it. Gated on .stage3d so it never opens a hole where the still is. */}
      <div className="hero-stage-gap" aria-hidden />

      {/* Product shot for everyone who does NOT get the live 3D:
          reduced-motion, no WebGL2, or hardware below the floor. CSS-gated on
          .stage3d so it costs no JS and never double-renders with the canvas. */}
      <div className="hero-fallback mx-auto mt-10 w-full max-w-2xl sm:mt-14">
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
      <div className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto flex max-w-6xl items-end justify-between px-6 sm:bottom-8 sm:px-14">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:text-[11px] sm:tracking-[0.3em]">
          Product rendering
        </span>
        <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:text-[11px] sm:tracking-[0.3em] sm:flex">
          Scroll
          <span className="inline-block h-8 w-px bg-gradient-to-b from-ink-faint/50 to-transparent" />
        </span>
      </div>
    </section>
  );
}
