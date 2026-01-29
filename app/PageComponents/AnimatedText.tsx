"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function AnimatedText() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const textContent =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum atque, officia dolores itaque neque labore vero possimus facere autem facilis quia officiis, eaque laborum quidem, sint soluta voluptas aut velit.";

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      // Manual type casting for the custom conditions
      const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

      if (isDesktop && textRef.current) {
        // Desktop: High-detail split animation
        const split = new SplitText(textRef.current, { 
          type: "lines, words",
        });

        gsap.from(split.words, {
          yPercent: 100,
          autoAlpha: 0,
          stagger: 0.02,
          scrollTrigger: {
            trigger: container.current,
            start: "top 75%",
            end: "bottom 25%",
            scrub: 1,
          }
        });

        return () => split.revert();
      } else {
        // Mobile: Ultra-performant single block fade
        gsap.from(textRef.current, {
          y: 20,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 40%",
            toggleActions: "play none none reverse",
          }
        });
      }
    });
  }, { scope: container });

  return (
    <div
      ref={container}
      className="min-h-screen flex items-center justify-center p-10 md:p-30 uppercase bg-zinc-200 text-black"
    >
      <div 
        ref={textRef}
        className="text-2xl md:text-4xl lg:text-6xl text-center font-mono"
        style={{ willChange: "transform, opacity" }}
      >
        {textContent}
      </div>
    </div>
  );
}