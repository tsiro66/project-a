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
      ignoreMobileResize: true // Αποφεύγει το "τρέμουλο" σε mobile browsers όταν κρύβεται η address bar
    });

    // 2. Lag Smoothing: Αντί για 0, δώσε μια μικρή ανοχή
    // Αυτό εμποδίζει το "πήδημα" (jank) αλλά μειώνει το CPU load
    gsap.ticker.lagSmoothing(500, 33);

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
        duration: 1.5, // Ελαφρώς πιο αργό για πιο "premium" αίσθηση
        smoothWheel: true,
        syncTouch: true, // Σημαντικό για να μην έχουμε "μάχη" μεταξύ touch και GSAP
      }}
    >
      {children}
    </ReactLenis>
  );
}