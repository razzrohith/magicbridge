"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { easing } from "maath";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Group, PerspectiveCamera } from "three";
import { Vector2, Vector3 } from "three";
import { scroll, setInvalidate } from "@/lib/scrollStore";
import { DataStream } from "./DataStream";
import { Device } from "./Device";
import { Dust } from "./Dust";
import { GridFloor } from "./GridFloor";

/** Registers the canvas invalidate() so external scroll/pointer writers can wake the demand loop. */
function InvalidateBridge() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    setInvalidate(invalidate);
    invalidate();
    return () => setInvalidate(null);
  }, [invalidate]);
  return null;
}

/**
 * On GPU context loss (driver reset, long-backgrounded tab, GPU switch),
 * preventDefault lets the browser auto-restore; onRestore re-bakes the baked
 * IBL environment (via key remount) and requests a frame.
 */
function ContextGuard({ onRestore }: { onRestore: () => void }) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (e: Event) => e.preventDefault();
    const onRestored = () => {
      onRestore();
      invalidate();
    };
    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl, invalidate, onRestore]);
  return null;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** How fast a flick bleeds off, per second. Higher stops sooner. */
const SPIN_FRICTION = 2.6;
/** Grab radius in scene units. The device's true bounding sphere is ~1.22, but
 *  that circle swallows a lot of empty corner space and would reach into the
 *  headline; this hugs the body so the target feels like the object. */
const DEVICE_RADIUS = 1.0;
/** Where the device actually sits inside the Rig group. Device.tsx offsets its
 *  own group by -0.5 and the model's origin is at its base, so its visual
 *  centre is a little under the group origin. */
const DEVICE_OFFSET = new Vector3(0, -0.2, 0);

// Module-scope scratch: allocating vectors inside useFrame would churn the GC
// at 60-144Hz.
const WORLD = new Vector3();
const NDC = new Vector3();
const TARGET_POS: [number, number, number] = [0, 0, 0];

/**
 * Camera choreography. The camera itself moves between beats (hero: off to the
 * side and high; reveal: pushed in and level with the device), which reads as a
 * real shot change rather than the object sliding around. Damped, so scrubbing
 * fast never snaps. Cursor adds a few degrees of parallax, clamped.
 */
function CameraRig() {
  const camera = useThree((s) => s.camera);
  useFrame((_, delta) => {
    const ho = scroll.heroOut;
    const rv = scroll.reveal;

    // hero -> receding, then the reveal pulls the camera in close
    const baseZ = lerp(6.5, 7.4, ho);
    const z = lerp(baseZ, 5.9, rv);
    const y = lerp(lerp(1.15, 2.0, ho), 2.1, rv);
    const x = lerp(lerp(-0.5, -0.1, ho), 0, rv);

    easing.damp3(
      camera.position,
      [x + scroll.pointerX * 0.22, y - scroll.pointerY * 0.16, z],
      0.5,
      delta,
    );
    camera.lookAt(0, lerp(0.05, 0.7, rv), 0);
  });
  return null;
}

/**
 * Drives the device from the module scroll store (no React state per frame).
 * Hero: device sits right-of-headline with a gentle idle float + cursor
 * parallax. Scrolling past the hero (heroOut 0->1) lifts it out of frame. The
 * Reveal section (reveal 0->1) brings it back to centre for the dissolve.
 * On-demand: we keep requesting frames only while something is actually moving.
 */
function Rig() {
  const group = useRef<Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  // Our own unwrapped rotation state (see the damp call below for why).
  // Per-instance, not module scope, so a second Rig would not share it.
  const rot = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const ho = scroll.heroOut;
    const rv = scroll.reveal;
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05);

    // Momentum after the visitor lets go. Decayed against real elapsed time,
    // not per frame, so it coasts the same distance on 60Hz and 144Hz (rule 6).
    if (!scroll.dragging && scroll.spinVel !== 0) {
      scroll.userYaw += scroll.spinVel * d;
      scroll.spinVel *= Math.exp(-d * SPIN_FRICTION);
      if (Math.abs(scroll.spinVel) < 0.004) scroll.spinVel = 0;
    }

    // Idle float fades out as the device leaves the stage, so once it is parked
    // the target is STATIC and damping can converge (settled=true). Without this
    // the sin() terms move the target forever and the demand loop never idles.
    const idle = Math.max(0, 1 - ho / 0.92);

    let tx = 1.2 + ho * 0.5;
    let ty = -0.1 + ho * 5.6 + Math.sin(t * 0.6) * 0.05 * idle;
    let tz = -ho * 1.5;
    let ry = 0.52 + ho * 0.5 + Math.sin(t * 0.3) * 0.04 * idle;
    let rx = -0.12 + Math.sin(t * 0.5) * 0.03 * idle;

    // Reveal pose: centre, level, facing us so the dissolve reads clearly.
    tx = lerp(tx, 0, rv);
    ty = lerp(ty, 0.72, rv);
    tz = lerp(tz, 0.0, rv);
    ry = lerp(ry, 0.32, rv);
    rx = lerp(rx, 0.06, rv);

    // Reused, not reallocated: this runs up to 144 times a second.
    TARGET_POS[0] = tx + scroll.pointerX * 0.18;
    TARGET_POS[1] = ty - scroll.pointerY * 0.14;
    TARGET_POS[2] = tz;

    // The visitor's own rotation rides ON TOP of the scroll pose, so the beats
    // keep playing underneath whatever angle they parked it at.
    const targetRx = rx - scroll.pointerY * 0.1 + scroll.userPitch;
    const targetRy = ry + scroll.pointerX * 0.22 + scroll.userYaw;

    // While a hand is on it, follow the pointer almost rigidly: a 0.45s damp
    // makes a drag feel like it is dragging something through treacle.
    const rotSmooth = scroll.dragging ? 0.08 : 0.45;

    easing.damp3(g.position, TARGET_POS, 0.4, delta);

    // Damped as plain scalars we own, NOT with dampE. userYaw is unbounded (the
    // device can be spun any number of turns) and an Euler wraps into
    // [-pi, pi], so dampE would take the shortest path: the device would
    // silently drop a whole turn, and worse, the settled test below could never
    // be true again because it would compare a wrapped angle to an unwrapped
    // one, pinning the on-demand loop awake for the rest of the session.
    easing.damp(rot.current, "x", targetRx, rotSmooth, delta);
    easing.damp(rot.current, "y", targetRy, rotSmooth, delta);
    g.rotation.set(rot.current.x, rot.current.y, 0);

    // Publish where the device landed on screen so the DOM can hit-test it.
    // The canvas is pointer-events:none, so a pointer never reaches three's
    // raycaster; the scene has to hand its bounds out instead.
    // DEVICE_OFFSET, not the group origin: Device sits half a unit below its
    // parent, so projecting the origin would put the grab circle above the box.
    g.updateWorldMatrix(true, false);
    WORLD.copy(DEVICE_OFFSET).applyMatrix4(g.matrixWorld);
    camera.updateMatrixWorld();
    NDC.copy(WORLD).project(camera);
    const cam = camera as PerspectiveCamera;
    const dist = camera.position.distanceTo(WORLD);
    const halfH = Math.tan(((cam.fov ?? 38) * Math.PI) / 360) * dist;
    // NDC z past 1 means it is behind the camera, where x/y flip and a hit test
    // would fire on the opposite side of the screen.
    if (NDC.z > 1 || halfH <= 0) {
      scroll.deviceR = 0;
    } else {
      scroll.deviceX = (NDC.x * 0.5 + 0.5) * size.width;
      scroll.deviceY = (-NDC.y * 0.5 + 0.5) * size.height;
      scroll.deviceR = (DEVICE_RADIUS / halfH) * (size.height / 2);
    }

    // Keep the loop alive while the device is on-stage or still settling.
    const settled =
      Math.abs(g.position.x - TARGET_POS[0]) < 0.001 &&
      Math.abs(g.position.y - TARGET_POS[1]) < 0.001 &&
      Math.abs(rot.current.y - targetRy) < 0.001 &&
      Math.abs(rot.current.x - targetRx) < 0.001;
    if (ho < 0.92 || rv > 0.02 || scroll.dragging || scroll.spinVel !== 0 || !settled) {
      invalidate();
    }
  });

  return (
    <group ref={group}>
      <Device />
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight position={[-4, 5, 4]} intensity={0.55} castShadow />
      <pointLight position={[3, -1.2, 2.6]} intensity={7} distance={12} color="#12c6e6" />
      {/* Baked once (frames={1}); static Lightformer studio rig, no CDN (rule 9). */}
      <Environment resolution={256} frames={1} environmentIntensity={0.72}>
        <color attach="background" args={["#05060a"]} />
        <Lightformer
          form="rect"
          intensity={0.85}
          position={[-3, 3, 3]}
          scale={[7, 7, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={0.7}
          position={[4, 1, -3]}
          scale={[6, 6, 1]}
          color="#8beefc"
        />
        <Lightformer
          form="circle"
          intensity={0.35}
          position={[0, -3, 2]}
          scale={5}
          color="#2b3a55"
        />
        <Lightformer form="ring" intensity={0.6} position={[2, 2, 1]} scale={2} color="#12c6e6" />
      </Environment>
    </>
  );
}

const CA_OFFSET = new Vector2(0.0006, 0.0009);

export function Experience() {
  const [glEpoch, setGlEpoch] = useState(0);
  const onRestore = useCallback(() => setGlEpoch((e) => e + 1), []);

  return (
    <Canvas
      frameloop="demand"
      // Array form so R3F clamps to the real devicePixelRatio. A scalar would
      // supersample 1x displays. PerformanceMonitor is deliberately absent: it
      // samples wall-clock fps and misreads an on-demand loop as a slow GPU.
      dpr={[1, 1.5]}
      // AA comes from the composer's MSAA render target, not the (unused) canvas.
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.35, 6.5], fov: 38 }}
    >
      <InvalidateBridge />
      <ContextGuard onRestore={onRestore} />
      <fog attach="fog" args={["#050507", 9, 20]} />
      {/* key remount re-bakes the IBL after a GPU context restore */}
      <Lighting key={glEpoch} />
      <CameraRig />
      <GridFloor />
      <Rig />
      <DataStream />
      <Dust />
      <EffectComposer enableNormalPass={false} multisampling={4}>
        <Bloom intensity={0.7} luminanceThreshold={0.65} luminanceSmoothing={0.25} mipmapBlur />
        <Vignette offset={0.3} darkness={0.75} eskil={false} />
        {/* CA last: a convolution effect in the middle would split the chain into
            three EffectPasses instead of merging Bloom+Vignette into one. */}
        <ChromaticAberration offset={CA_OFFSET} radialModulation={false} modulationOffset={0} />
      </EffectComposer>
    </Canvas>
  );
}
