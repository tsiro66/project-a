"use client";

import { ReactLenis, LenisRef } from 'lenis/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // 2. Tell Lenis to jump to the top immediately on mount
    // The { immediate: true } argument prevents a smooth scroll animation on load
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });

    // 'time' is a number representing elapsed seconds
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // Connect Lenis to the GSAP Ticker
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
      options={{ lerp: 0.1, duration: 1.5 }}
    >
      {children}
    </ReactLenis>
  );
}