"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scroll } from "@/lib/scrollStore";

const COUNT = 260;
const SPAN = 26; // world length of the flow lane

/**
 * The signal made visible: packets streaming left to right through the device,
 * i.e. the other computer's screen -> the box -> your browser. Runs as one
 * additive Points cloud (no per-particle objects), positions advanced on the
 * GPU-friendly path: a single Float32Array mutated in useFrame, never React
 * state (rule 2). Intensity rises with the DeepDive/reveal beats.
 */
export function DataStream() {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, speeds, offsets, baseY } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const offsets = new Float32Array(COUNT);
    const baseY = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPAN;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.4 - 0.6;
      speeds[i] = 2.4 + Math.random() * 4.6;
      offsets[i] = Math.random() * Math.PI * 2;
      baseY[i] = positions[i * 3 + 1];
    }
    return { positions, speeds, offsets, baseY };
  }, []);

  const clk = useRef(0);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    // Visible during the reveal and while the device is on-stage in the hero.
    const intensity = Math.max(scroll.reveal, 1 - scroll.heroOut);
    pts.visible = intensity > 0.04;
    if (!pts.visible) return;

    if (matRef.current) matRef.current.opacity = 0.5 * intensity;

    const arr = pts.geometry.attributes.position.array as Float32Array;
    const d = Math.min(delta, 0.05); // clamp so a background tab doesn't teleport them
    clk.current += d;
    const t = clk.current;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      arr[ix] += speeds[i] * d;
      if (arr[ix] > SPAN / 2) arr[ix] = -SPAN / 2;
      // Absolute, not accumulated: a per-frame += is framerate-dependent (hard
      // rule 6) and drifts without bound.
      arr[ix + 1] = baseY[i] + Math.sin(t * 1.6 + offsets[i]) * 0.06;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.036}
        color="#8beefc"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
