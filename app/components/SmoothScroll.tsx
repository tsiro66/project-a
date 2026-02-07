"use client";

import { ReactLenis, LenisRef } from "lenis/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function SmoothScroll({
  children,
  stop,
}: {
  children: React.ReactNode;
  stop: boolean;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;

    if (stop) {
      lenis?.stop();
      lenis?.scrollTo(0, { immediate: true });
    } else {
      // 1. Force a jump to 0 to "eat" any buffered scroll momentum
      lenis?.scrollTo(0, { immediate: true });
      // 2. Start the engine back up
      lenis?.start();
    }
  }, [stop]);

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
        // syncTouch: true,
        touchMultiplier: 1.5, // Makes it feel more responsive on small swipes
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
