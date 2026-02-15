"use client";

import * as THREE from "three";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";

function Scene({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const redRef = useRef<THREE.Mesh>(null!);
  const greenRef = useRef<THREE.Mesh>(null!);
  const blueRef = useRef<THREE.Mesh>(null!);

  // 1. MEMOIZE GEOMETRY: Create once, reuse 3 times. 
  // This drastically reduces the work R3F does during mounting.
  const sharedGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, -2, -1),
      new THREE.Vector3(-4, 1, -0.5),
      new THREE.Vector3(4, -1, 0.5),
      new THREE.Vector3(10, 2, 1),
    ]);
    // Reduced segments for mobile [128 -> 64]
    return new THREE.TubeGeometry(curve, isMobile ? 64 : 128, 0.2, 8, false);
  }, [isMobile]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    
    // Use delta for frame-rate independence (crucial for older mobile chips)
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;

    if (redRef.current && greenRef.current && blueRef.current) {
      redRef.current.rotation.x = Math.sin(t * 2.2) * 0.05;
      redRef.current.rotation.y = Math.cos(t * 1.8) * 0.05;

      const breath = 1 + Math.sin(t * 2.5) * 0.06;
      greenRef.current.scale.set(1, breath, 1);

      blueRef.current.rotation.x = Math.cos(t * 2.0) * 0.05;
      blueRef.current.rotation.z = Math.sin(t * 1.6) * 0.05;

      const pulse = 2 + Math.sin(t * 4.0) * 0.6;
      (redRef.current.material as THREE.MeshBasicMaterial).color.setRGB(pulse, 0, 0);
      (blueRef.current.material as THREE.MeshBasicMaterial).color.setRGB(0, 0, pulse);
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh ref={redRef} geometry={sharedGeometry} position={[-0.08, 0, -0.05]}>
          <meshBasicMaterial color={[1.5, 0, 0]} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh ref={greenRef} geometry={sharedGeometry} position={[0, 0, 0]}>
          <meshBasicMaterial color={[0, 1.5, 0]} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh ref={blueRef} geometry={sharedGeometry} position={[0.08, 0, 0.05]}>
          <meshBasicMaterial color={[0, 0, 1.5]} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* 2. CONDITIONAL POST-PROCESSING: 
          Bloom is the #1 killer of mobile performance. We disable it or 
          simplify it for mobile to keep the site responsive. */}
      {!isMobile && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={1.3} luminanceThreshold={0.1} radius={0.6} />
          <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
        </EffectComposer>
      )}
    </>
  );
}

export default function LightTrail() {
  // 3. ADAPTIVE RESOLUTION:
  // We check window width to lower the load on mobile GPUs immediately.
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        dpr={isMobile ? 1 : [1, 1.5]} // Cap DPR at 1 for mobile (avoids rendering 3x pixels)
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}