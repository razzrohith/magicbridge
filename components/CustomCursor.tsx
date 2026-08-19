"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * The cursor is the product argument in miniature.
 *
 * RETICLE: four corner brackets that fly out and LOCK onto whatever is
 * interactive, the way a capture device acquires a target. Free-floating it is
 * a small aiming mark; over a control it snaps to that control's exact box, so
 * the affordance is drawn rather than implied.
 *
 * ECHO: a fainter mark trailing behind, arriving a beat late. That is the whole
 * product in one detail: your hand here, the pointer landing over there. It
 * only shows while you are actually moving, so at rest there is exactly one
 * cursor and it never reads as lag.
 *
 * Gated behind fine-pointer + no-reduced-motion (rule 8), so touch, keyboard
 * and motion-sensitive visitors keep the native cursor untouched. One
 * pointermove listener, all movement via gsap.quickTo, no React state.
 */
export function CustomCursor() {
  const reticle = useRef<HTMLDivElement>(null);
  const echo = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const ret = reticle.current;
    const ech = echo.current;
    const glw = glow.current;
    if (!ret || !ech || !glw) return;

    document.documentElement.classList.add("cursor-hidden");
    gsap.set([ret, ech], { xPercent: -50, yPercent: -50, opacity: 1 });

    // The reticle leads (near-instant), the echo lags: that gap IS the idea.
    const retX = gsap.quickTo(ret, "x", { duration: 0.06, ease: "power3" });
    const retY = gsap.quickTo(ret, "y", { duration: 0.06, ease: "power3" });
    const echX = gsap.quickTo(ech, "x", { duration: 0.42, ease: "power2" });
    const echY = gsap.quickTo(ech, "y", { duration: 0.42, ease: "power2" });
    const glowX = gsap.quickTo(glw, "x", { duration: 0.6, ease: "power3" });
    const glowY = gsap.quickTo(glw, "y", { duration: 0.6, ease: "power3" });
    const echoFade = gsap.quickTo(ech, "opacity", { duration: 0.35, ease: "power2" });

    let lockedEl: HTMLElement | null = null;
    let lastX = 0;
    let lastY = 0;
    // Speed is only sampled on pointermove, so when the pointer stops moving no
    // further sample arrives and the echo would sit there at its last opacity.
    // This decays it to nothing shortly after the last movement.
    let restTimer = 0;
    let magX: ((v: number) => void) | null = null;
    let magY: ((v: number) => void) | null = null;
    let magnetRect: DOMRect | null = null;

    const onMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      // Echo brightens with speed, so it only appears when input is in flight.
      const speed = Math.hypot(x - lastX, y - lastY);
      lastX = x;
      lastY = y;
      echoFade(Math.min(0.5, speed * 0.045));
      window.clearTimeout(restTimer);
      restTimer = window.setTimeout(() => echoFade(0), 90);

      echX(x);
      echY(y);
      glowX(x);
      glowY(y);
      // While locked the reticle stays on the target; the echo keeps showing
      // where your hand actually is.
      if (!lockedEl) {
        retX(x);
        retY(y);
      }
      if (magnetRect && magX && magY) {
        magX((x - (magnetRect.left + magnetRect.width / 2)) * 0.28);
        magY((y - (magnetRect.top + magnetRect.height / 2)) * 0.28);
      }
    };

    /** Snap the reticle onto a control's real box. */
    const lockOn = (el: HTMLElement) => {
      lockedEl = el;
      const r = el.getBoundingClientRect();
      ret.classList.add("is-locked");
      gsap.to(ret, {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        width: r.width + 18,
        height: r.height + 14,
        duration: 0.32,
        ease: "expo.out",
      });
    };

    const release = () => {
      lockedEl = null;
      ret.classList.remove("is-locked");
      gsap.to(ret, { width: 26, height: 26, duration: 0.34, ease: "expo.out" });
    };

    const TARGETS = "a, button, [data-magnetic], [role='button']";

    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>(TARGETS);
      if (!t || t === lockedEl) return;
      lockOn(t);
      const magnet = t.closest<HTMLElement>("[data-magnetic]");
      if (magnet) {
        magnetRect = magnet.getBoundingClientRect(); // one read per hover
        magX = gsap.quickTo(magnet, "x", { duration: 0.4, ease: "power3" });
        magY = gsap.quickTo(magnet, "y", { duration: 0.4, ease: "power3" });
      }
    };

    const onOut = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>(TARGETS);
      if (!t || t !== lockedEl) return;
      if (t.contains(e.relatedTarget as Node)) return;
      release();
      if (magX && magY) {
        gsap.to(t.closest("[data-magnetic]") ?? t, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
      }
      magnetRect = null;
      magX = null;
      magY = null;
    };

    // Click reads as a lock confirming, not a generic ripple.
    const onDown = () => {
      gsap
        .timeline()
        .to(ret, { scale: 0.86, duration: 0.09, ease: "power2.out" })
        .to(ret, { scale: 1, duration: 0.34, ease: "elastic.out(1, 0.45)" });
    };

    // A locked reticle would drift off its target as the page scrolls. Lenis
    // emits a scroll event every frame, so throttle to one rAF and use gsap.set
    // (the size has not changed, only the position) rather than spawning a new
    // tween and reading layout on every event.
    let scrollRaf = 0;
    const onScroll = () => {
      if (!lockedEl || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        if (!lockedEl) return;
        const r = lockedEl.getBoundingClientRect();
        gsap.set(ret, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(restTimer);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      document.documentElement.classList.remove("cursor-hidden");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* ambient cyan flashlight */}
      <div ref={glow} className="cursor-glow" aria-hidden />
      {/* the echo: your input, arriving a beat late */}
      <div ref={echo} className="cursor-echo" aria-hidden />
      {/* the reticle: four brackets that lock onto a target */}
      <div ref={reticle} className="cursor-reticle" aria-hidden>
        <span className="c-tl" />
        <span className="c-tr" />
        <span className="c-bl" />
        <span className="c-br" />
        <span className="c-core" />
      </div>
    </>
  );
}
