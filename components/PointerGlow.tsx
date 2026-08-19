"use client";

import { useEffect, useRef } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * The only pointer effect on the site: a faint cyan wash that follows the
 * pointer far behind it, lighting the dark stage. It never replaces or hides
 * the system cursor.
 *
 * Deliberately NOT a custom cursor. The system pointer is the most precise and
 * most familiar control a visitor owns, and swapping it for a drawn one costs
 * real accuracy to buy decoration. On a page whose job is to make a $549 device
 * feel trustworthy, that is a bad trade. The craft lives in the hover and focus
 * states instead (see globals.css).
 *
 * One passive listener writing to a transform via rAF, no React state per move.
 */
export function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let seen = false;

    const frame = () => {
      // Heavy damping: the glow drifts, it does not track. Framerate-independent
      // enough at any refresh rate for a purely ambient effect.
      cx += (x - cx) * 0.08;
      cy += (y - cy) * 0.08;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) > 0.5 || Math.abs(y - cy) > 0.5 ? requestAnimationFrame(frame) : 0;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        // Jump to the first known position instead of sweeping in from 0,0.
        seen = true;
        cx = x;
        cy = y;
        el.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="pointer-glow" aria-hidden />;
}
