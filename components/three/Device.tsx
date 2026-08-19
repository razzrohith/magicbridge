"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { scroll } from "@/lib/scrollStore";

/**
 * The MagicBridge device: a sealed matte-black monolith with one cyan status
 * LED. Deliberately featureless (no ports/labels) to stay on-brand ("sealed
 * product, never name internals").
 *
 * The `reveal` store value (0..1, driven in the Reveal section) runs the
 * signature transition: a scan plane sweeps down the shell, and behind it the
 * opaque disguise dissolves to expose a glowing inner core. Implemented as a
 * custom GLSL shell (onBeforeCompile on MeshPhysicalMaterial so we keep real
 * PBR + IBL) rather than a crossfade, so the edge is a lit, moving boundary.
 * All animation is ref-driven inside useFrame (rule 2).
 */

/** Injects an object-space Y scan dissolve + cyan edge glow into a physical material. */
function useDissolveMaterial(color: string, opts: Partial<THREE.MeshPhysicalMaterialParameters>) {
  // NOTE: callers must pass module-scope constants for `opts`. An inline object
  // literal changes identity every render and would rebuild the material (and
  // its shader program) each time.
  const mat = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color), ...opts });
    const uniforms = {
      uCut: { value: 10.0 }, // OBJECT-space Y above which the shell is dissolved
      uEdge: { value: 0.05 },
      uAccent: { value: new THREE.Color("#12c6e6") },
    };
    mat.userData.uniforms = uniforms;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uCut = uniforms.uCut;
      shader.uniforms.uEdge = uniforms.uEdge;
      shader.uniforms.uAccent = uniforms.uAccent;
      // Object space, NOT world space: the scroll rig translates the device, so a
      // world-space plane would slide off the mesh as it moves.
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
varying float vLocalY;`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
vLocalY = position.y;`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
varying float vLocalY;
uniform float uCut;
uniform float uEdge;
uniform vec3 uAccent;`,
        )
        .replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>
float d = vLocalY - uCut;
if (d > 0.0) discard;
float edge = smoothstep(uEdge, 0.0, -d);
gl_FragColor.rgb += uAccent * edge * 1.2;`,
        );
    };
    return mat;
  }, [color, opts]);

  // Free the GPU program/material when this device unmounts or the key changes.
  useEffect(() => () => mat.dispose(), [mat]);

  return mat;
}

const SHELL_OPTS = {
  // DoubleSide: once the dissolve discards the top, a FrontSide shell would cull
  // its own inner walls and the box would read as see-through, not open.
  side: THREE.DoubleSide,
  metalness: 0.38,
  roughness: 0.46,
  clearcoat: 0.75,
  clearcoatRoughness: 0.26,
  envMapIntensity: 1.2,
  reflectivity: 0.35,
} as const;

const LID_OPTS = {
  metalness: 0.5,
  roughness: 0.34,
  clearcoat: 0.8,
  clearcoatRoughness: 0.2,
  envMapIntensity: 1.05,
} as const;

export function Device() {
  const led = useRef<THREE.Mesh>(null);
  const seamMat = useRef<THREE.MeshStandardMaterial>(null);
  const scanRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);

  const shellMat = useDissolveMaterial("#0b0c11", SHELL_OPTS);
  const lidMat = useDissolveMaterial("#070810", LID_OPTS);

  const clk = useRef(0);

  useFrame((_, delta) => {
    clk.current += Math.min(delta, 0.05);
    const t = clk.current;
    const r = scroll.reveal;

    // The cut plane sweeps from above the box down through it as reveal runs.
    // Held above the mesh at r=0 so the shell is fully solid.
    // The cut plane sweeps down and STOPS above the box's middle: the lid goes
    // first, then the top of the shell peels open to expose the core. Capping it
    // keeps a solid open-topped box, where a full sweep would just delete the
    // lit surfaces and the product would read as gone.
    const cut = 0.55 - r * 0.24;
    (shellMat.userData.uniforms.uCut as { value: number }).value = cut;
    // The lid mesh sits at y=+0.42 in the group, so shift the plane into its
    // own object space to keep one continuous sweep across both meshes.
    (lidMat.userData.uniforms.uCut as { value: number }).value = cut - 0.42;

    if (led.current) {
      const mat = led.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.2 + Math.sin(t * 2) * 0.5 + r * 6;
    }
    if (seamMat.current) {
      seamMat.current.emissiveIntensity = r * 3.2;
      seamMat.current.opacity = 0.15 + r * 0.85;
    }
    // Scan band rides the dissolve edge.
    if (scanRef.current) {
      scanRef.current.visible = r > 0.02 && r < 0.99;
      scanRef.current.position.y = cut;
    }
    // Inner core: fades in behind the dissolving shell, always spinning slowly.
    if (coreRef.current) {
      coreRef.current.visible = r > 0.03;
      coreRef.current.rotation.y = t * 0.35;
      coreRef.current.position.y = 0.0 + r * 0.2;
    }
    if (coreMat.current) coreMat.current.opacity = Math.min(1, r * 1.6) * 0.55;
  });

  return (
    <group>
      {/* Inner core: the "truth" under the disguise. Wireframe lattice + hot centre. */}
      <group ref={coreRef} visible={false}>
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshBasicMaterial
            ref={coreMat}
            color="#12c6e6"
            wireframe
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshBasicMaterial color="#8beefc" transparent opacity={0.75} toneMapped={false} />
        </mesh>
        <pointLight color="#12c6e6" intensity={3.2} distance={3} />
      </group>

      {/* Main body */}
      <RoundedBox args={[3, 0.82, 2]} radius={0.11} smoothness={6} material={shellMat} castShadow />

      {/* Layered top lid inset for a machined look */}
      <RoundedBox
        args={[2.72, 0.14, 1.74]}
        radius={0.06}
        smoothness={5}
        position={[0, 0.42, 0]}
        material={lidMat}
      />

      {/* Cyan seam line around the body split: the hidden tech, revealed */}
      <mesh position={[0, 0.06, 1.001]}>
        <planeGeometry args={[2.6, 0.02]} />
        <meshStandardMaterial
          ref={seamMat}
          color="#12c6e6"
          emissive="#12c6e6"
          emissiveIntensity={0.2}
          transparent
          opacity={0.15}
          toneMapped={false}
        />
      </mesh>

      {/* Status LED (front-right), always alive */}
      <mesh ref={led} position={[1.02, 0.12, 1.005]}>
        <circleGeometry args={[0.045, 24]} />
        <meshStandardMaterial
          color="#12c6e6"
          emissive="#12c6e6"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      {/* Scan band that rides the dissolve edge */}
      <group ref={scanRef} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.78, 1.8]} />
          <meshBasicMaterial
            color="#12c6e6"
            transparent
            opacity={0.07}
            side={THREE.DoubleSide}
            toneMapped={false}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}
