"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { easing } from "maath";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { Vector2 } from "three";
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
    const y = lerp(lerp(0.35, 1.1, ho), 1.85, rv);
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

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const ho = scroll.heroOut;
    const rv = scroll.reveal;
    const t = state.clock.elapsedTime;

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

    const targetPos: [number, number, number] = [
      tx + scroll.pointerX * 0.18,
      ty - scroll.pointerY * 0.14,
      tz,
    ];
    const targetRot: [number, number, number] = [
      rx - scroll.pointerY * 0.1,
      ry + scroll.pointerX * 0.22,
      0,
    ];

    easing.damp3(g.position, targetPos, 0.4, delta);
    easing.dampE(g.rotation, targetRot, 0.45, delta);

    // Keep the loop alive while the device is on-stage or still settling.
    const settled =
      Math.abs(g.position.x - targetPos[0]) < 0.001 &&
      Math.abs(g.position.y - targetPos[1]) < 0.001;
    if (ho < 0.92 || rv > 0.02 || !settled) invalidate();
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
      <ambientLight intensity={0.14} />
      <directionalLight position={[-4, 5, 4]} intensity={1.1} />
      <pointLight position={[3, -1.2, 2.6]} intensity={14} distance={12} color="#12c6e6" />
      {/* Baked once (frames={1}); static Lightformer studio rig, no CDN (rule 9). */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#05060a"]} />
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[-3, 3, 3]}
          scale={[7, 7, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.7}
          position={[4, 1, -3]}
          scale={[6, 6, 1]}
          color="#8beefc"
        />
        <Lightformer
          form="circle"
          intensity={0.9}
          position={[0, -3, 2]}
          scale={5}
          color="#2b3a55"
        />
        <Lightformer form="ring" intensity={1.2} position={[2, 2, 1]} scale={2} color="#12c6e6" />
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
