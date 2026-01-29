"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function Scene() {
  const groupRef = useRef<THREE.Group>(null!);
  
  const redRef = useRef<THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>>(null!);
  const greenRef = useRef<THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>>(null!);
  const blueRef = useRef<THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>>(null!);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, -2, -1),
      new THREE.Vector3(-4, 1, -0.5),
      new THREE.Vector3(4, -1, 0.5),
      new THREE.Vector3(10, 2, 1),
    ]);
  }, []);

useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Slightly faster group rotation for more energy
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;

    if (redRef.current && greenRef.current && blueRef.current) {
      // 2. Swaying Logic - Increased multipliers for speed
      // Red: Faster sway (t * 2.2)
      redRef.current.rotation.x = Math.sin(t * 2.2) * 0.05;
      redRef.current.rotation.y = Math.cos(t * 1.8) * 0.05;

      // Green: Faster "breathing" scale
      const breath = 1 + Math.sin(t * 2.5) * 0.06;
      greenRef.current.scale.set(1, breath, 1);

      // Blue: Faster sway opposite to red
      blueRef.current.rotation.x = Math.cos(t * 2.0) * 0.05;
      blueRef.current.rotation.z = Math.sin(t * 1.6) * 0.05;

      // 3. Faster glow pulse
      const pulseBase = 2;
      // Increased pulse frequency to 4.0
      const pulseVariation = Math.sin(t * 4.0) * 0.6; 
      redRef.current.material.color.setRGB(pulseBase + pulseVariation, 0, 0);
      blueRef.current.material.color.setRGB(0, 0, pulseBase + pulseVariation);
    }
  });

  const tubeArgs: [THREE.Curve<THREE.Vector3>, number, number, number, boolean] = 
    [curve, 128, 0.2, 8, false];

  return (
    <>
      <group ref={groupRef}>
        {/* Red Channel - slight offset remains but position is static */}
        <mesh ref={redRef} position={[-0.08, 0, -0.05]}>
          <tubeGeometry args={tubeArgs} />
          <meshBasicMaterial 
            color={[1.5, 0, 0]} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
        </mesh>

        {/* Green Channel - The Anchor */}
        <mesh ref={greenRef} position={[0, 0, 0]}>
          <tubeGeometry args={tubeArgs} />
          <meshBasicMaterial 
            color={[0, 1.5, 0]} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
        </mesh>

        {/* Blue Channel - slight offset remains but position is static */}
        <mesh ref={blueRef} position={[0.08, 0, 0.05]}>
          <tubeGeometry args={tubeArgs} />
          <meshBasicMaterial 
            color={[0, 0, 1.5]} 
            blending={THREE.AdditiveBlending} 
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
          offset={new THREE.Vector2(0.00, 0.00)}
        />
      </EffectComposer>
    </>
  );
}

export default function LightTrail() {
  return (
    <div className="h-full w-full bg-[#050505]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
      >
        <color attach="background" args={["#050505"]} />
        <Scene />
      </Canvas>
    </div>
  );
}