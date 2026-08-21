/** Shared motion constants so every entrance uses one easing system (restraint = premium). */

/** expo-out: entrances 0.6–1.0s (CLAUDE.md design system). */
export const EASE_OUT = "expo.out";
export const EASE_INOUT = "power3.inOut";

/** cubic-bezier form of expo-out for CSS transitions. */
export const CSS_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DUR = {
  fast: 0.5,
  base: 0.8,
  slow: 1.0,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Screens where the scene runs a cheaper tier. Matches the CSS breakpoint used
 * for the mobile layout so the two never disagree about what "small" means.
 */
export function isSmallStage(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

/** Conservative check for whether the immersive 3D layer should mount at all. */
export function canRun3D(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  // Phones and tablets DO get the live device. They used to be excluded on the
  // theory that a full-screen WebGL canvas behind scrolling content is a mobile
  // perf risk, which left small screens looking like a different, emptier
  // product. The risk is handled where it belongs instead: isSmallStage() below
  // drives a lighter tier (no postprocessing, no shadows, smaller pixel ratio,
  // fewer particles), and the capability floor underneath still turns 3D off on
  // genuinely weak hardware.
  try {
    const canvas = document.createElement("canvas");
    // three r185 is WebGL2-only, so a WebGL1-only device must fall back.
    const gl = canvas.getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return false;
  }
  // Very low-memory devices: keep the static site.
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem > 0 && mem < 3) return false;
  // Low core count is a decent proxy for weak GPUs on desktop too.
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores < 4) return false;
  return true;
}
