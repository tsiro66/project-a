"use client";

import { 
  Group, 
  Mesh, 
  TubeGeometry, 
  MeshBasicMaterial, 
  CatmullRomCurve3, 
  Vector3, 
  AdditiveBlending,
  Vector2
} from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function Scene() {
  const groupRef = useRef<Group>(null!);
  const redRef = useRef<Mesh<TubeGeometry, MeshBasicMaterial>>(null!);
  const greenRef = useRef<Mesh<TubeGeometry, MeshBasicMaterial>>(null!);
  const blueRef = useRef<Mesh<TubeGeometry, MeshBasicMaterial>>(null!);

  // 1. REUSE GEOMETRY: Prevents "Cannot access refs during render" 
  // and saves significant memory/processing time.
  const sharedTubeGeometry = useMemo(() => {
    const curve = new CatmullRomCurve3([
      new Vector3(-10, -2, -1),
      new Vector3(-4, 1, -0.5),
      new Vector3(4, -1, 0.5),
      new Vector3(10, 2, 1),
    ]);
    // Reduced segments (128 -> 64) for mobile CPU performance
    return new TubeGeometry(curve, 64, 0.2, 8, false);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;

    if (redRef.current && greenRef.current && blueRef.current) {
      // Red: Sway
      redRef.current.rotation.x = Math.sin(t * 2.2) * 0.05;
      redRef.current.rotation.y = Math.cos(t * 1.8) * 0.05;

      // Green: Breathe
      const breath = 1 + Math.sin(t * 2.5) * 0.06;
      greenRef.current.scale.set(1, breath, 1);

      // Blue: Sway opposite
      blueRef.current.rotation.x = Math.cos(t * 2.0) * 0.05;
      blueRef.current.rotation.z = Math.sin(t * 1.6) * 0.05;

      // Glow Pulse
      const pulseBase = 2;
      const pulseVariation = Math.sin(t * 4.0) * 0.6;
      redRef.current.material.color.setRGB(pulseBase + pulseVariation, 0, 0);
      blueRef.current.material.color.setRGB(0, 0, pulseBase + pulseVariation);
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh ref={redRef} geometry={sharedTubeGeometry} position={[-0.08, 0, -0.05]}>
          <meshBasicMaterial
            color={[1.5, 0, 0]}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={greenRef} geometry={sharedTubeGeometry} position={[0, 0, 0]}>
          <meshBasicMaterial
            color={[0, 1.5, 0]}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={blueRef} geometry={sharedTubeGeometry} position={[0.08, 0, 0.05]}>
          <meshBasicMaterial
            color={[0, 0, 1.5]}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          mipmapBlur
          intensity={1.3}
          luminanceThreshold={0.1}
          radius={0.6}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.SCREEN}
          offset={new Vector2(0.001, 0.001)}
        />
      </EffectComposer>
    </>
  );
}

export default function LightTrail() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        // 2. CAP DPR: Essential for mobile performance (prevents 3x resolution lag)
        dpr={1} 
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: false,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}