"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { canRun3D, isFinePointer } from "@/lib/motion";
import { requestRender, scroll } from "@/lib/scrollStore";
import { useDeviceDrag } from "./useDeviceDrag";

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
    // Mount as soon as hydration runs. The hero headline paints from CSS (not
    // JS), so the 3D chunk is not on the LCP path and gating it behind
    // load + requestIdleCallback only left the hero visibly half-empty for ~1s.
    decide();

    // Re-evaluate if the user flips reduced-motion or swaps to a coarse pointer.
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    rm.addEventListener("change", decide);
    fine.addEventListener("change", decide);
    return () => {
      rm.removeEventListener("change", decide);
      fine.removeEventListener("change", decide);
    };
  }, []);

  // Pointer parallax -> store (one listener, no React state; rule 2). Only wake
  // the render loop when the pointer actually moved enough to matter.
  useEffect(() => {
    if (!enabled || !isFinePointer()) return;
    let lastX = 0;
    let lastY = 0;
    const onMove = (e: PointerEvent) => {
      // Freeze parallax while the visitor is turning the device by hand,
      // otherwise the same pointer movement drives two things at once and the
      // device appears to fight the drag.
      if (scroll.dragging) return;
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

  // Grab-and-spin: hit-tests the device's published screen bounds so the
  // visitor can take hold of it and turn it. Desktop-only by construction,
  // since `enabled` already requires a fine pointer and no reduced-motion.
  useDeviceDrag(enabled);

  // Dev-only handle on the store, so the interaction can be asserted from a
  // headless browser instead of eyeballed. `process.env.NODE_ENV` is inlined at
  // build time, so this whole block is dropped from the production bundle.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as { __mb?: typeof scroll }).__mb = scroll;
  }, []);

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
