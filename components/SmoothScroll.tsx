"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { scroll } from "@/lib/scrollStore";

/**
 * One scroll owner (CLAUDE.md rule 4): Lenis owns smooth scroll, GSAP
 * ScrollTrigger reads it. Writes document progress + velocity to the module
 * store (no per-frame React state, rule 2) and wakes the on-demand 3D loop.
 * Under prefers-reduced-motion we skip Lenis entirely and let native scroll
 * drive ScrollTrigger, so motion-sensitive users get plain scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = prefersReducedMotion();

    // NOTE: deliberately does NOT call requestRender(). The scene consumes only
    // heroOut/reveal, and Scene.tsx invalidates exactly when those change. Waking
    // the composer on every scroll event rendered the full chain page-wide and
    // defeated frameloop="demand".
    const writeProgress = (scrollTop: number, velocity: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.progress = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;
      scroll.velocity = velocity;
    };

    if (reduced) {
      const onScroll = () => writeProgress(window.scrollY, 0);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      // darkroom.engineering recommend leaving touch native; our pinned
      // scenes degrade to native scroll on touch.
      syncTouch: false,
    });

    lenis.on("scroll", (e: { scroll: number; velocity: number }) => {
      ScrollTrigger.update();
      writeProgress(e.scroll, e.velocity);
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recompute trigger positions once fonts settle (research digest gotcha).
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
