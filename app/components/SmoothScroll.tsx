"use client";

import { ReactLenis, LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // 1. Βελτιστοποίηση ScrollTrigger για λιγότερα recalculations
    ScrollTrigger.config({ 
      limitCallbacks: true,
      ignoreMobileResize: true
    });


    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);
  
  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false}
      options={{
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: true, // Σημαντικό για να μην έχουμε "μάχη" μεταξύ touch και GSAP
      }}
    >
      {children}
    </ReactLenis>
  );
}