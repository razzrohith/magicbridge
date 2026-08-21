"use client";

import { useEffect } from "react";
import { MAX_PITCH, requestRender, scroll } from "@/lib/scrollStore";

/**
 * Grab-and-spin for the 3D device.
 *
 * The canvas is a pointer-events:none backdrop with the whole page sitting on
 * top of it, so a pointer never reaches three's raycaster and drei's
 * OrbitControls has nothing to bind to. Instead the scene publishes the
 * device's projected screen circle every frame (scroll.deviceX/Y/R) and this
 * listener hit-tests against it. That also means the grab target follows the
 * device automatically through every scroll beat, with no second source of
 * truth to keep in sync.
 *
 * Writes go straight to the module store, never React state: this fires on
 * every pointermove and a setState there would re-render the tree at pointer
 * rate (rule 2).
 */

/** Radians of yaw per pixel dragged. About one full turn per 1000px. */
const YAW_PER_PX = 0.0062;
const PITCH_PER_PX = 0.004;
/** Below this much travel it was a click, not a spin, so leave the hint up. */
const DRAG_SLOP = 3;
/** Cap the release flick so a violent swipe cannot launch it into a blur. */
const MAX_FLICK = 9;
/**
 * Touch only. A finger on the device is ambiguous until it moves: it could be
 * the start of a spin or the start of a scroll, and guessing wrong either
 * freezes the page or spins the box every time someone swipes past it. So a
 * touch claims the gesture only once it has travelled this far AND is this
 * much more horizontal than vertical. Nothing is preventDefault-ed on touch,
 * so a scroll that was never claimed keeps scrolling normally.
 */
const TOUCH_CLAIM_PX = 10;
const TOUCH_CLAIM_RATIO = 1.5;
/** Vertical travel that settles it the other way: this is a scroll, hands off. */
const TOUCH_RELEASE_PX = 12;
/**
 * Floor on the per-move interval when converting travel into a rate. It has to
 * sit below the frame interval of the fastest display we expect (240Hz is
 * ~4.2ms) or the measured rate would be scaled down on high-refresh monitors
 * and the same physical flick would spin the device less.
 */
const MIN_DT_MS = 2;
/** Weight of the newest sample in the velocity average. Smooths out one jittery
 *  frame without adding noticeable lag to the release. */
const VEL_SMOOTHING = 0.4;
/** If the pointer sat still this long before release, it was a place, not a
 *  throw. Without this, pausing mid-drag and letting go still flings it. */
const STALE_VEL_MS = 90;

/** Never steal a press that belongs to something the visitor can actually use. */
const INTERACTIVE =
  "a,button,input,textarea,select,label,summary,[role='button'],[contenteditable]";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * True if (x, y) lands on actual glyphs of the element under the pointer.
 *
 * The grab circle overlaps the hero headline, and starting a drag calls
 * preventDefault, which kills text selection. Selecting the headline should
 * still win over spinning the device, so a press that lands on real text is
 * left alone. Rects come from the text nodes themselves, so the empty space
 * beside a short line still counts as device.
 */
function overText(x: number, y: number): boolean {
  const el = document.elementFromPoint(x, y);
  if (!el) return false;
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of Array.from(range.getClientRects())) {
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
    }
  }
  return false;
}

export function useDeviceDrag(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    let active = false;
    let pointerId = -1;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    /** Smoothed yaw rate, rad/sec, handed to the scene as momentum on release. */
    let vel = 0;
    let hovering = false;
    /** Touch gesture that has not yet declared itself a spin or a scroll. */
    let pending = false;
    let startX = 0;
    let startY = 0;
    /** Last seen pointer position, so hover can be re-checked after a drag. */
    let hoverX = -1;
    let hoverY = -1;
    // One-shot: the hint is retired exactly once per mount, not per pointermove.
    let retired = false;

    const overDevice = (x: number, y: number) =>
      scroll.deviceR > 0 && Math.hypot(x - scroll.deviceX, y - scroll.deviceY) < scroll.deviceR;

    const setHover = (on: boolean) => {
      if (on === hovering) return;
      hovering = on;
      root.classList.toggle("device-grab", on);
    };

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return;
      if (!overDevice(e.clientX, e.clientY)) return;
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) return;
      if (overText(e.clientX, e.clientY)) return;

      // A touch is not a drag yet, only a candidate. onMove decides.
      if (e.pointerType === "touch") {
        pending = true;
        pointerId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = e.timeStamp;
        vel = 0;
        return;
      }

      active = true;
      pointerId = e.pointerId;
      scroll.dragging = true;
      scroll.spinVel = 0;
      vel = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      root.classList.add("device-grabbing");
      // Capture so a drag that leaves the window still ends properly instead of
      // sticking on until the pointer wanders back in.
      try {
        root.setPointerCapture(e.pointerId);
      } catch {
        /* capture is a nicety, the drag works without it */
      }
      // Keeps the drag from turning into a text selection across the hero copy.
      e.preventDefault();
      requestRender();
    };

    const onMove = (e: PointerEvent) => {
      hoverX = e.clientX;
      hoverY = e.clientY;

      // Touch candidate: wait for the gesture to declare itself.
      if (pending && e.pointerId === pointerId) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dy > TOUCH_RELEASE_PX && dy >= dx) {
          // Clearly a scroll. Let go of it completely.
          pending = false;
          pointerId = -1;
          return;
        }
        if (dx > TOUCH_CLAIM_PX && dx > dy * TOUCH_CLAIM_RATIO) {
          pending = false;
          active = true;
          scroll.dragging = true;
          scroll.spinVel = 0;
          lastX = e.clientX;
          lastY = e.clientY;
          lastT = e.timeStamp;
          requestRender();
        } else {
          return;
        }
      }

      if (!active) {
        setHover(overDevice(e.clientX, e.clientY));
        return;
      }
      if (e.pointerId !== pointerId) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Math.max(MIN_DT_MS, e.timeStamp - lastT) / 1000;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;

      const dYaw = dx * YAW_PER_PX;
      scroll.userYaw += dYaw;
      scroll.userPitch = clamp(scroll.userPitch + dy * PITCH_PER_PX, -MAX_PITCH, MAX_PITCH);
      // First real drag retires the "drag to rotate" hint, via a class so the
      // fade is CSS and nothing re-renders at pointer rate.
      if (!retired && Math.abs(dx) + Math.abs(dy) > DRAG_SLOP) {
        retired = true;
        root.classList.add("device-spun");
      }
      vel = vel * (1 - VEL_SMOOTHING) + (dYaw / dt) * VEL_SMOOTHING;
      requestRender();
    };

    const end = (e?: PointerEvent) => {
      if (pending && (!e || e.pointerId === pointerId)) {
        pending = false;
        pointerId = -1;
      }
      if (!active) return;
      if (e && e.pointerId !== pointerId) return;
      active = false;
      scroll.dragging = false;
      // Only throw it if the pointer was actually still moving at the moment of
      // release. Otherwise a drag, a pause, and a release would fling it.
      const idleFor = (e?.timeStamp ?? performance.now()) - lastT;
      scroll.spinVel = idleFor > STALE_VEL_MS ? 0 : clamp(vel, -MAX_FLICK, MAX_FLICK);
      vel = 0;
      root.classList.remove("device-grabbing");
      releaseCapture();
      pointerId = -1;
      // The device has usually moved out from under the pointer by now.
      setHover(hoverX >= 0 && overDevice(hoverX, hoverY));
      requestRender();
    };

    const releaseCapture = () => {
      if (pointerId >= 0 && root.hasPointerCapture?.(pointerId)) {
        root.releasePointerCapture(pointerId);
      }
    };

    // Alt-tabbing away mid-drag should drop the grab, not leave it stuck on.
    const onBlur = () => end();

    // pointerdown must not be passive: it calls preventDefault to suppress the
    // text selection that would otherwise start under the drag.
    window.addEventListener("pointerdown", onDown, { passive: false });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("lostpointercapture", end);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      window.removeEventListener("lostpointercapture", end);
      window.removeEventListener("blur", onBlur);
      // Leave nothing behind if the 3D layer unmounts mid-drag: a capture still
      // held here would keep swallowing the page's pointer events.
      releaseCapture();
      scroll.dragging = false;
      root.classList.remove("device-grab", "device-grabbing");
    };
  }, [enabled]);
}
