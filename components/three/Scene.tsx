"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { canRun3D, isFinePointer } from "@/lib/motion";
import { requestRender, scroll } from "@/lib/scrollStore";

gsap.registerPlugin(ScrollTrigger);

// Client-only: the R3F Canvas must never render on the server (rule 1).
const Experience = dynamic(() => import("./Experience").then((m) => m.Experience), {
  ssr: false,
});

/**
 * Mounts the immersive 3D layer as a fixed, non-interactive backdrop behind the
 * DOM (LCP stays the headline, rule 7). Gated by capability (WebGL, memory,
 * reduced-motion) so touch / low-end / reduced-motion users get the static site
 * unchanged. Pointer + scroll beats are written to the module store here.
 */
export function Scene() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const decide = () => {
      const ok = canRun3D();
      setEnabled(ok);
      // The boot script optimistically set .stage3d from the cheap predicates;
      // withdraw it if the WebGL2 probe (or a later media change) says otherwise.
      document.documentElement.classList.toggle("stage3d", ok);
    };
    // Defer past the load window so the 3D chunk never competes with LCP.
    const start = () =>
      window.requestIdleCallback
        ? window.requestIdleCallback(decide, { timeout: 2000 })
        : window.setTimeout(decide, 300);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    // Re-evaluate if the user flips reduced-motion or swaps to a coarse pointer.
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    rm.addEventListener("change", decide);
    fine.addEventListener("change", decide);
    return () => {
      rm.removeEventListener("change", decide);
      fine.removeEventListener("change", decide);
      window.removeEventListener("load", start);
    };
  }, []);

  // Pointer parallax -> store (one listener, no React state; rule 2). Only wake
  // the render loop when the pointer actually moved enough to matter.
  useEffect(() => {
    if (!enabled || !isFinePointer()) return;
    let lastX = 0;
    let lastY = 0;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      scroll.pointerX = nx;
      scroll.pointerY = ny;
      if (Math.abs(nx - lastX) > 0.003 || Math.abs(ny - lastY) > 0.003) {
        lastX = nx;
        lastY = ny;
        requestRender();
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  // Scroll beats -> store. Hero recede drives the device into the void.
  useGSAP(
    () => {
      if (!enabled) return;
      // `.stage3d` (the reveal pin) is set pre-paint by the boot script and
      // reconciled in the mount effect above, so triggers measure a stable height.
      // Hero recede: device lifts off-screen as the hero scrolls away.
      ScrollTrigger.create({
        trigger: "#top",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scroll.heroOut = self.progress;
          requestRender();
        },
      });

      // Reveal: over the pinned track, ramp the device in, hold, then out.
      ScrollTrigger.create({
        trigger: ".reveal-track",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const r = p < 0.32 ? p / 0.32 : p > 0.78 ? Math.max(0, 1 - (p - 0.78) / 0.22) : 1;
          scroll.reveal = r;
          requestRender();
        },
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Experience />
    </div>
  );
}
