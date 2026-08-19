"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";

const COUNT = 200;

/** Sparse drifting dust for depth in the void. Cheap; animates only on keep-alive frames. */
export function Dust() {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      a[i * 3] = (Math.random() - 0.5) * 20;
      a[i * 3 + 1] = (Math.random() - 0.5) * 13;
      a[i * 3 + 2] = (Math.random() - 0.5) * 9 - 2;
    }
    return a;
  }, []);

  const clk = useRef(0);

  useFrame((_, delta) => {
    // Local clock: elapsedTime advances through demand-loop idle gaps, which made
    // the cloud snap round on the first frame after a wake.
    clk.current += Math.min(delta, 0.05);
    if (ref.current) ref.current.rotation.y = clk.current * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#12c6e6"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
