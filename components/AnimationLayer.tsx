"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { EASE_OUT, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Declarative scroll-entrance layer. Sections stay server components and just
 * mark elements with data-attributes; this single client component wires all
 * the GSAP triggers (rule 3: useGSAP for auto-cleanup). No per-element client
 * boundary, no per-frame React state.
 *
 *   data-reveal            fade + rise on scroll-in ("stagger" staggers children)
 *   data-kinetic           headline, SplitText line-mask reveal
 *   data-count             number count-up
 *
 * Selectors are querySelectorAll (document-wide) on purpose: the marked
 * elements live in sibling sections, not inside this component, so useGSAP's
 * scope must NOT constrain them.
 * Reduced motion: everything stays in its natural, fully-visible state.
 */
export function AnimationLayer() {
  useGSAP(() => {
    // If the boot failsafe already stripped `.motion`, the page is showing its
    // static state; re-hiding it here would undo that rescue.
    if (prefersReducedMotion() || !document.documentElement.classList.contains("motion")) return;
    const splits: SplitText[] = [];
    const $ = <T extends HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

    try {
      runSetup(splits, $);
      // Signal the boot-script failsafe that the app took over (don't strip .motion).
      document.documentElement.classList.add("revealed");
    } catch (err) {
      // If GSAP/SplitText throws, never strand content: drop the hide gate so
      // every [data-reveal]/[data-kinetic] element falls back to fully visible.
      document.documentElement.classList.remove("motion");
      console.error("AnimationLayer setup failed; reverted to static", err);
    }

    return () => {
      for (const s of splits) s.revert();
    };
  }, []);

  return null;
}

function runSetup(splits: SplitText[], $: <T extends HTMLElement>(sel: string) => T[]) {
  // --- Kinetic headlines: masked line reveal (below-the-fold only; the hero
  // headline paints via CSS so it stays the real-DOM LCP element). ---
  for (const el of $("[data-kinetic]")) {
    if (!el.textContent) continue;
    // Preserve word boundaries at <br> when building the accessible name.
    el.setAttribute(
      "aria-label",
      el.innerHTML
        .replace(/<br\s*\/?>(?=\S)/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    );
    const split = new SplitText(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      // Reveal only once the masked start-state exists, so there's no flash of
      // the un-split headline before the line mask engages.
      onSplit: (self) => {
        gsap.set(el, { autoAlpha: 1 });
        return gsap.from(self.lines, {
          yPercent: 115,
          duration: 0.9,
          ease: EASE_OUT,
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      },
    });
    splits.push(split);
  }

  // --- Generic reveals: fade + rise ---
  for (const el of $("[data-reveal]")) {
    const isStagger = el.getAttribute("data-reveal") === "stagger";
    // Reveal the container chrome (borders/dividers) immediately; animate the
    // children. For a plain reveal the element itself is the animated target.
    const targets = isStagger ? (Array.from(el.children) as HTMLElement[]) : [el];
    if (isStagger) gsap.set(el, { autoAlpha: 1 });
    gsap.set(targets, { autoAlpha: 0, y: 30 });
    gsap.to(targets, {
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      ease: EASE_OUT,
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 84%", once: true },
    });
  }

  // --- Number count-ups ---
  for (const el of $("[data-count]")) {
    const raw = el.getAttribute("data-count") ?? "0";
    const target = Number.parseFloat(raw);
    if (Number.isNaN(target)) continue;
    const decimals = raw.includes(".") ? 1 : 0;
    const obj = { v: 0 };
    // Reserve the final width first: growing "0" back to 4 digits would shift the
    // row. The parent sets tabular-nums, so 1ch is exactly one digit.
    el.style.display = "inline-block";
    el.style.minWidth = `${raw.replace(".", "").length}ch`;
    el.textContent = "0";
    gsap.to(obj, {
      v: target,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = obj.v.toFixed(decimals);
      },
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  }

  // Top scroll-progress line.
  const bar = document.getElementById("scrollbar");
  if (bar) {
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  }

  ScrollTrigger.refresh();
}
