"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { scroll } from "@/lib/scrollStore";

/**
 * The real MagicBridge, from the v7.8 case design that is actually printed.
 *
 * SEALED ON PURPOSE. The source model ships a fully modelled board, a fan and a
 * baked lid-open clip; all three are stripped out of
 * public/models/magicbridge.glb at asset-prep time rather than merely hidden
 * here, because a GLB served to a browser is a downloadable file anyone can
 * open in a glTF viewer. Hiding internals at runtime would still ship them. The
 * site never shows, names, or ships what is inside: the product's whole promise
 * is that the box is sealed.
 *
 * The Reveal beat therefore does NOT open the lid. It turns the device to face
 * the camera and brings the status window up, which is the on-message payoff
 * anyway: what the other computer meets is a monitor cable and a keyboard.
 *
 * Loading: the file is meshopt-compressed with quantized attributes and WebP
 * textures. drei wires the meshopt decoder by default; Draco is switched off
 * because the model does not use it and enabling it would point a DRACOLoader
 * at a Google CDN (rule 9, self-host everything).
 */
const MODEL = "/models/magicbridge.glb";

// The model is in millimetres (~106 x 104 x 37). The scene works in units where
// the device reads about 3 wide, so bring it down to roughly that.
const MM_TO_SCENE = 0.016;

// Matched by material, not by node name: the mesh optimiser is free to wrap a
// part in an extra transform node, which would break a name lookup silently.
const OLED_MATERIAL = "OledGlowMat";

export function Device() {
  const { scene } = useGLTF(MODEL, false);
  const oledMat = useRef<MeshStandardMaterial | null>(null);
  const clk = useRef(0);
  const group = useRef<Group>(null);

  // One instance, and the OLED material cloned so animating its glow cannot
  // leak into any other consumer of the cached GLTF.
  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const mat = mesh.material as MeshStandardMaterial;
      if (mat?.name === OLED_MATERIAL) {
        const m = mat.clone();
        mesh.material = m;
        oledMat.current = m;
      }
    });
    return root;
  }, [scene]);

  // The clone above is ours, so it is ours to release.
  useEffect(() => {
    return () => {
      oledMat.current?.dispose();
      oledMat.current = null;
    };
  }, []);

  useFrame((_, delta) => {
    clk.current += Math.min(delta, 0.05);
    const t = clk.current;
    const r = scroll.reveal;

    // Status window breathes, then burns brighter as the reveal lands.
    if (oledMat.current) {
      oledMat.current.emissiveIntensity = 1.6 + Math.sin(t * 2) * 0.35 + r * 5;
    }
    // Turn the port face toward the camera through the reveal. The X tilt is a
    // fixed presentation angle so the camera looks down onto the engraved lid,
    // matching the studio hero shot rather than a flat side-on slab.
    if (group.current) {
      group.current.rotation.x = 0.3;
      group.current.rotation.y = -0.35 + r * -0.5;
    }
  });

  return (
    <group ref={group} scale={MM_TO_SCENE} position={[0, -0.5, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL, false);
