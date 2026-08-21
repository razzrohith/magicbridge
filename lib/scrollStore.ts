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

  /* ---- Grab-and-spin -------------------------------------------------
     The visitor can take hold of the device and turn it. These are an
     ADDITIVE offset on top of the scroll-driven pose, not a replacement:
     the scroll choreography keeps running underneath, so letting go in the
     middle of the page never strands the device somewhere the next beat
     cannot recover from. */

  /** accumulated user rotation, radians. Yaw is unbounded (it can spin). */
  userYaw: number;
  /** accumulated user tilt, radians, clamped so the device never flips over. */
  userPitch: number;
  /** leftover spin after release, rad/sec, decayed in useFrame (framerate-independent). */
  spinVel: number;
  /** true while a pointer is holding the device. */
  dragging: boolean;

  /* Where the device currently is ON SCREEN, in CSS pixels, written by the
     scene every frame. The canvas is pointer-events:none (the DOM sits on top
     of it), so hit-testing the device cannot use raycasting; instead the scene
     publishes its own projected bounds and the DOM listener tests against them.
     Radius 0 means "not on screen", which fails every hit test. */
  deviceX: number;
  deviceY: number;
  deviceR: number;
};

export const scroll: ScrollState = {
  progress: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
  reveal: 0,
  heroOut: 0,
  userYaw: 0,
  userPitch: 0,
  spinVel: 0,
  dragging: false,
  deviceX: 0,
  deviceY: 0,
  deviceR: 0,
};

/** Tilt limit. Past this the device shows its underside, which reads as a bug. */
export const MAX_PITCH = 0.5;

let invalidate: (() => void) | null = null;

/** The R3F canvas registers its invalidate() here so external writers can wake it. */
export function setInvalidate(fn: (() => void) | null) {
  invalidate = fn;
}

/** Ask the on-demand render loop for one more frame. Safe to call every event. */
export function requestRender() {
  invalidate?.();
}
