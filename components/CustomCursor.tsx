"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Immersive cursor layer (rule 8): custom ring+dot follower, magnetic pull on
 * [data-magnetic], a grow state over interactive elements, a radar-ping on
 * click, and the ambient cyan flashlight glow (writes --mx/--my for CSS).
 *
 * All gated behind fine-pointer + no-reduced-motion, and mounted only after the
 * follower exists, so touch/keyboard/reduced-motion users keep the native
 * cursor and every hover affordance still has a :focus-visible fallback.
 * useGSAP (rule 3) so the quickTo setters auto-revert; one pointermove listener.
 */
export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const ringEl = ring.current;
    const dotEl = dot.current;
    const glowEl = glow.current;
    if (!ringEl || !dotEl || !glowEl) return;

    document.documentElement.classList.add("cursor-hidden");
    gsap.set([ringEl, dotEl], { xPercent: -50, yPercent: -50, opacity: 1 });

    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.5, ease: "power3" });
    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power3" });
    const glowX = gsap.quickTo(glowEl, "x", { duration: 0.6, ease: "power3" });
    const glowY = gsap.quickTo(glowEl, "y", { duration: 0.6, ease: "power3" });

    // Active magnet state: element + cached rect + reusable setters.
    let magnetEl: HTMLElement | null = null;
    let magnetRect: DOMRect | null = null;
    let magX: ((v: number) => void) | null = null;
    let magY: ((v: number) => void) | null = null;

    const onMove = (e: PointerEvent) => {
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
      glowX(e.clientX);
      glowY(e.clientY);

      if (magnetEl && magnetRect && magX && magY) {
        magX((e.clientX - (magnetRect.left + magnetRect.width / 2)) * 0.3);
        magY((e.clientY - (magnetRect.top + magnetRect.height / 2)) * 0.3);
      }
    };

    const grow = () => gsap.to(ringEl, { scale: 2.3, duration: 0.3, ease: "power3" });
    const shrink = () => gsap.to(ringEl, { scale: 1, duration: 0.3, ease: "power3" });

    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-magnetic], [role='button']",
      );
      if (!t) return;
      grow();
      const magnet = t.closest<HTMLElement>("[data-magnetic]");
      if (magnet && magnet !== magnetEl) {
        magnetEl = magnet;
        magnetRect = magnet.getBoundingClientRect(); // one read per hover, not per move
        magX = gsap.quickTo(magnet, "x", { duration: 0.4, ease: "power3" });
        magY = gsap.quickTo(magnet, "y", { duration: 0.4, ease: "power3" });
      }
    };
    const onOut = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-magnetic], [role='button']",
      );
      if (!t) return;
      shrink();
      if (magnetEl && !magnetEl.contains(e.relatedTarget as Node)) {
        gsap.to(magnetEl, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        magnetEl = null;
        magnetRect = null;
        magX = null;
        magY = null;
      }
    };

    const onDown = (e: PointerEvent) => {
      const ping = document.createElement("div");
      ping.className = "cursor-ping";
      ping.style.left = `${e.clientX}px`;
      ping.style.top = `${e.clientY}px`;
      document.body.appendChild(ping);
      gsap.fromTo(
        ping,
        { scale: 0, opacity: 0.6 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => ping.remove(),
        },
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      document.documentElement.classList.remove("cursor-hidden");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <>
      {/* ambient cyan flashlight; also the reduced-motion-safe glow */}
      <div ref={glow} className="cursor-glow" aria-hidden />
      {/* custom follower */}
      <div ref={ring} className="cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
