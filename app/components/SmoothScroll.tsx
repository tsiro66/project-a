"use client";

import { ReactLenis, LenisRef } from "lenis/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Prevent GSAP from trying to catch up after lag spikes
    gsap.ticker.lagSmoothing(0);

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33); // Reset to default on unmount
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false}
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 1.5, // Makes it feel more responsive on small swipes
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
