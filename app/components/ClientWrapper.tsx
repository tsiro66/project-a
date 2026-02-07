"use client";

import { useEffect, useState } from "react";
import Preloader from "./Preloader";
import SmoothScroll from "./SmoothScroll";
import { AnimationProvider } from "../contexts/AnimationContext";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  // 1. Initialize to false to match Server Side Rendering
  const [isLoading, setIsLoading] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

    // We wrap these in a tiny timeout to move them out of the 
    // synchronous execution of the effect.
    const timeoutId = setTimeout(() => {
      if (!hasSeenPreloader) {
        setIsLoading(true);
        // Lock scroll
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = '0';
        document.documentElement.classList.add('js-loading');
      } else {
        // If they have seen it, just enable animations immediately
        setCanAnimate(true);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleComplete = () => {
    // These updates are fine because they are triggered by a user-event/callback,
    // not directly inside a mounting effect.
    setIsLoading(false);
    sessionStorage.setItem("hasSeenPreloader", "true");
    
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.documentElement.classList.remove('js-loading');
    
    setTimeout(() => setCanAnimate(true), 100);
  };

  return (
    <>
      {isLoading && <Preloader onComplete={handleComplete} />}
      <AnimationProvider value={{ canAnimate }}>
        <SmoothScroll stop={isLoading}>
          {children}
        </SmoothScroll>
      </AnimationProvider>
    </>
  );
}