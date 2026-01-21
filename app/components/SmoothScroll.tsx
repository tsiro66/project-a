"use client";

import { ReactLenis, LenisRef } from 'lenis/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function SmoothScroll({ children, stop }: { children: React.ReactNode, stop: boolean }) {
  const lenisRef = useRef<LenisRef>(null);
  const isStoppedRef = useRef(stop);

  useEffect(() => {
    isStoppedRef.current = stop;
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
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    function update(time: number) {
      // If we are stopped, we bypass RAF completely
      if (!isStoppedRef.current) {
        lenisRef.current?.lenis?.raf(time * 1000);
      }
    }

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
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