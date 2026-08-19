/**
 * Framework-agnostic scroll/pointer store, written OUTSIDE React state so we
 * never re-render per frame (CLAUDE.md rule 2). GSAP/Lenis write here; the R3F
 * scene reads it inside useFrame and we call requestRender() to drive the
 * on-demand render loop (frameloop="demand", rule per research digest).
 */
export type ScrollState = {
  /** whole-document scroll progress 0..1 */
  progress: number;
  /** smoothed scroll velocity (px/frame-ish), signed */
  velocity: number;
  /** pointer, normalized to -1..1 with origin at viewport center */
  pointerX: number;
  pointerY: number;
  /** 0..1 progress inside the pinned Reveal section */
  reveal: number;
  /** hero visibility 1..0 as it scrolls away (drives 3D opacity/exit) */
  heroOut: number;
};

export const scroll: ScrollState = {
  progress: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
  reveal: 0,
  heroOut: 0,
};

let invalidate: (() => void) | null = null;

/** The R3F canvas registers its invalidate() here so external writers can wake it. */
export function setInvalidate(fn: (() => void) | null) {
  invalidate = fn;
}

/** Ask the on-demand render loop for one more frame. Safe to call every event. */
export function requestRender() {
  invalidate?.();
}
