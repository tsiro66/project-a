"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StepContent({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  const container = useRef<HTMLDivElement>(null);

  // Helper to wrap content for the "reveal" effect
  const splitWords = (phrase: string) => {
    return phrase.split(" ").map((word, i) => (
      <span key={i} className="inline-block overflow-hidden align-top">
        <span className="word inline-block translate-y-[115%] pt-1 pb-1">
          {word}&nbsp;
        </span>
      </span>
    ));
  };

  useGSAP(() => {
    // 1. Check if user is on a touch device / small screen
    const isMobile = window.innerWidth < 768;
    const words = container.current?.querySelectorAll(".word");

    if (words && words.length > 0) {
      gsap.to(words, {
        y: 0,
        // On mobile, we stagger much faster or not at all to reduce paint calls
        stagger: isMobile ? 0.005 : 0.015, 
        duration: isMobile ? 0.8 : 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 92%", // Start later so the user sees the start of the movement
          toggleActions: "play none none none", // Don't reverse on mobile to save CPU
          once: isMobile, // Kill the trigger after playing once on mobile
        },
      });
    }

    // Number animation: Simplified for performance
    gsap.fromTo(".step-number", 
      { opacity: 0, y: 15 }, // Removed Scale to avoid layout recalculations
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 95%",
          toggleActions: "play none none none",
          once: isMobile,
        }
      }
    );
  }, { 
    scope: container, 
    dependencies: [title, text], 
    revertOnUpdate: true 
  });

  return (
    <div ref={container} className="content-block flex flex-col items-start max-w-xl relative py-12">
      <div className="absolute -top-10 -left-12 pointer-events-none">
        <span className="step-number block text-[12rem] md:text-[16rem] font-black text-zinc-950/10 select-none leading-none">
          {number}
        </span>
      </div>

      <h3 className="relative z-10 text-2xl md:text-4xl font-black uppercase mb-8 leading-[1.1] tracking-tighter text-justify font-syne w-full">
        {splitWords(title)}
      </h3>

      <div className="relative z-10 w-full">
        <p className="text-lg md:text-xl leading-[0.8] tracking-tight text-justify opacity-90">
          {splitWords(text)}
        </p>
      </div>
    </div>
  );
}