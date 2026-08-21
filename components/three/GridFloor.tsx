"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scroll } from "@/lib/scrollStore";

/**
 * An infinite tech grid under the device. Pure shader (no geometry cost): a
 * large plane with an anti-aliased line field that fades out with distance, so
 * the void reads as a lit stage rather than flat black. Scrolls slowly toward
 * the camera and brightens during the reveal.
 */
export function GridFloor({ small = false }: { small?: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.35 },
      uColor: { value: new THREE.Color("#2f6f86") },
    }),
    [],
  );

  const clk = useRef(0);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    // Local accumulated clock, wrapped: elapsedTime keeps running across demand-loop
    // idle gaps (visible jump on wake) and grows unbounded inside fract().
    clk.current = (clk.current + Math.min(delta, 0.05)) % 1000;
    uniforms.uTime.value = clk.current;
    // A portrait camera sits nearly level with the floor, so the grid rakes
    // up most of the frame and sits directly behind the headline. Half strength
    // keeps it as a hint of a stage instead of a texture over the copy.
    const dim = small ? 0.28 : 1;
    uniforms.uIntensity.value = (0.07 + scroll.reveal * 0.1 + (1 - scroll.heroOut) * 0.05) * dim;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 0]}>
      <planeGeometry args={[44, 44]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        vertexShader={`
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime; uniform float uIntensity; uniform vec3 uColor;

          // Anti-aliased grid lines via screen-space derivatives.
          float gridLine(vec2 uv, float scale){
            vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
            return 1.0 - min(min(g.x, g.y), 1.0);
          }

          void main(){
            vec2 uv = vUv;
            uv.y += uTime * 0.012;              // slow drift toward the viewer
            float fine  = gridLine(uv, 90.0) * 0.18;
            float major = gridLine(uv, 18.0) * 0.7;
            float lines = clamp(fine + major, 0.0, 1.0);

            // radial falloff so the grid dissolves into the void
            float fade = 1.0 - smoothstep(0.055, 0.47, distance(vUv, vec2(0.5)));
            float a = lines * fade * uIntensity;
            if (a < 0.002) discard;
            gl_FragColor = vec4(uColor, a);
          }
        `}
      />
    </mesh>
  );
}
