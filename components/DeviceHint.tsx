"use client";

import type { KeyboardEvent } from "react";
import { MAX_PITCH, requestRender, scroll } from "@/lib/scrollStore";

/**
 * Tells people the device can be turned, and is itself the way to turn it
 * without a mouse.
 *
 * A drag target with no affordance is a feature nobody finds, and a drag target
 * with no keyboard path is one a keyboard user cannot reach at all (rule 8).
 * This solves both with one control: it reads as a label, it focuses, and the
 * arrow keys drive the same store the pointer drag writes to. It retires itself
 * once the device has actually been turned, which is handled in CSS off a class
 * so discovering it costs no React state.
 */

/** One arrow press. Big enough to see, small enough to aim with. */
const STEP_YAW = 0.22;
const STEP_PITCH = 0.12;
/** Enter/Space gives it a push, so the control does something on click too. */
const NUDGE_SPIN = 3.2;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Deliberately does NOT retire the hint. Only a pointer drag does that (in
 * useDeviceDrag), because this control IS the keyboard interface: hiding it the
 * moment someone presses an arrow key would pull the control out from under
 * their own focus after a single press.
 */
function nudged() {
  requestRender();
}

export function DeviceHint() {
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    let handled = true;
    switch (e.key) {
      case "ArrowLeft":
        scroll.userYaw -= STEP_YAW;
        break;
      case "ArrowRight":
        scroll.userYaw += STEP_YAW;
        break;
      case "ArrowUp":
        scroll.userPitch = clamp(scroll.userPitch - STEP_PITCH, -MAX_PITCH, MAX_PITCH);
        break;
      case "ArrowDown":
        scroll.userPitch = clamp(scroll.userPitch + STEP_PITCH, -MAX_PITCH, MAX_PITCH);
        break;
      default:
        handled = false;
    }
    if (!handled) return;
    // Without this the arrows scroll the page out from under the control the
    // moment someone tries to use it.
    e.preventDefault();
    scroll.spinVel = 0;
    nudged();
  };

  return (
    <button
      type="button"
      onKeyDown={onKeyDown}
      onClick={() => {
        scroll.spinVel = NUDGE_SPIN;
        nudged();
      }}
      // The visible label has to be the START of the accessible name (WCAG 2.5.3
      // Label in Name), or voice-control users saying "drag to rotate" cannot
      // reach a control whose name begins with something else.
      aria-label="Drag to rotate the device, or use the arrow keys"
      className="device-hint u-ghost pointer-events-auto items-center gap-2 rounded-full border border-line/80 bg-stage/60 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint backdrop-blur-sm"
    >
      <span aria-hidden className="text-cyan/80">
        ⟲
      </span>
      Drag to rotate
    </button>
  );
}
