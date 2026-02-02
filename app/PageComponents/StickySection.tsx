"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StepContent from "../components/StepContent";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StickySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Helper to split text - Προσθήκη GPU hint (will-change)
  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block translate-y-full will-change-transform"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // --- 1. CHARACTER REVEAL ---
      const chars = titleRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.to(chars, {
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.out",
          force3D: true, // GPU Acceleration
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse", // Όχι scrub εδώ, είναι βαρύ για γράμματα
          },
        });
      }

      // --- 2. DESKTOP PARALLAX ---
      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: leftColumnRef.current,
          start: "top top",
          endTrigger: containerRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });

        tl.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top" },
          { scaleY: 4, duration: 1, ease: "none", force3D: true },
          0
        )
        .to(titleRef.current, { y: 800, duration: 1, ease: "none", force3D: true }, 0)
        .to(lineRef.current, { y: 1000, duration: 0.5, ease: "none", force3D: true }, 0.5);
      });

      // --- 3. MOBILE ONLY (Optimized) ---
      mm.add("(max-width: 767px)", () => {
        // Αφαιρούμε το scrub αν κολλάει πολύ, ή το κρατάμε μόνο για την απλή γραμμή
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 20%",
              end: "bottom bottom",
              scrub: true, // Η γραμμή είναι ελαφρύ element, το scrub αντέχεται
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-lime-400 text-black py-20 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row px-6 md:px-20">
        <div
          className="w-full md:w-1/2 h-fit flex flex-col justify-start"
          ref={leftColumnRef}
        >
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-10">
            <div
              ref={lineRef}
              className="w-full h-1 md:w-2.5 md:h-60 bg-zinc-900 rounded-xs origin-left md:origin-top"
              style={{ willChange: "transform" }}
            />

            <h2
              ref={titleRef}
              className="text-3xl pr-4 md:text-7xl lg:text-6xl font-syne font-black uppercase tracking-tighter leading-[0.8] flex flex-col"
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="block overflow-hidden px-4">
                {splitText("Υπηρεσιες")}
              </span>
            </h2>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-20 md:gap-[80vh] pt-20 md:pt-96 md:pb-[100vh]">
          <StepContent
            number="01"
            title="Strategy"
            text="Deep diving into your brand to find the unique angle that makes people stop and stare."
          />
          <StepContent
            number="02"
            title="Design"
            text="Translating strategy into visual language. We don't just make it pretty; we make it work."
          />
          <StepContent
            number="03"
            title="Launch"
            text="Deploying the vision and scaling it. This is where your brand meets the real world."
          />
        </div>
      </div>
    </section>
  );
}