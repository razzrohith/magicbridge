"use client";

import { useEffect } from "react";

/**
 * Writes the pointer position to CSS custom properties (--mx/--my) via one
 * global listener + rAF. No React state per move (that would tank INP).
 * The visual is a pure-CSS radial gradient in globals.css (.cursor-glow).
 * Disabled on touch / no fine pointer and under prefers-reduced-motion.
 */
export function CursorGlow() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const root = document.documentElement;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = 0;

    const write = () => {
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
      raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(write);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor-glow" aria-hidden />;
}
