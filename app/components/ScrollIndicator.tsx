"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

export default function ScrollIndicator() {
  const container = useRef<HTMLButtonElement>(null);


  useGSAP(() => {
    // Entrance animation (Removed the hardcoded delay)
    gsap.fromTo(
      container.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 1 } // Delay 1s relative to the preloader finish
    );

    // Desktop: Infinite looping dot
    gsap.to(".scroll-dot", {
      y: 16,
      opacity: 0,
      duration: 1.5,
      repeat: -1,
      ease: "power2.inOut",
    });

    // Mobile: Infinite bouncing arrows
    gsap.to(".mobile-arrow", {
      y: 8,
      opacity: 0.3,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2
    });
  }, { scope: container });

  const scrollToContent = () => {
    // GSAP ScrollTo gives you full control
    gsap.to(window, {
      duration: 1.5,      // Increase this number to make it slower
      scrollTo: {
        y: window.innerHeight,
        autoKill: true    // Stops the animation if the user scrolls manually
      },
      ease: "power2.inOut" // A smooth, professional-grade ease
    });
  };

  return (
    <button
      ref={container}
      onClick={scrollToContent}
      className="opacity-0 absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 cursor-pointer group transition-colors duration-300 pointer-events-auto will-change-transform translate-z-0"
      aria-label="Scroll to content"
    >
      <span className="animate-pulse uppercase tracking-[0.5em] text-zinc-500 font-mono group-hover:text-lime-400">
        Scroll
      </span>

      <div className="hidden md:flex w-5.5 h-9 border border-zinc-500 group-hover:border-lime-400 rounded-full justify-center p-1.5 transition-colors duration-300">
        <div className="scroll-dot w-1 h-1 bg-lime-400 rounded-full" />
      </div>

      <div className="flex md:hidden flex-col items-center -space-y-1">
        <svg className="mobile-arrow w-5 h-5 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
        <svg className="mobile-arrow w-5 h-5 text-zinc-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </button>
  );
}