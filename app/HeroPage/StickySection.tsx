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

  // Helper to split text into characters
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
      // We target the nested .char spans
      const chars = titleRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.to(chars, {
          y: 0,
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%", // Trigger slightly later for better visibility
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

        // 1. Line grows downwards from the top origin
        tl.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top" },
          { scaleY: 4, duration: 1, ease: "none" },
          0,
        )
          // 2. Title moves down at the same time
          .to(titleRef.current, { y: 400, duration: 1, ease: "none" }, 0)

          // 3. NEW: The start of the line begins moving down
          // We start this at "0.5" (the midpoint of the 1-second timeline)
          .to(
            lineRef.current,
            {
              y: 1000,
              duration: 0.5,
              ease: "none",
            },
            0.5,
          );
      });

      // --- 3. MOBILE ONLY ---
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 20%",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
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
              className="w-full h-1 md:w-1 md:h-60 bg-zinc-900 origin-left md:origin-top"
            />

            <h2
              ref={titleRef}
              className="text-6xl pr-4 md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8] flex flex-col"
            >
              {/* Apply overflow-hidden to the line level only */}
              <span className="block overflow-hidden px-4">
                {splitText("Our")}
              </span>
              <span className="block overflow-hidden px-4">
                {splitText("Process")}
              </span>
            </h2>
          </div>
        </div>
        {/* Right Side: Content steps */}
        <div className="w-full md:w-1/2 flex flex-col gap-40 md:gap-[80vh] pt-40 md:pt-96 md:pb-[100vh]">
          {" "}
          <StepContent
            number="01"
            title="Strategy"
            text="Deep diving into your brand to find the unique angle that makes people stop and stare.Deep diving into your brand to find the unique angle that makes people stop and stare.Deep diving into your brand to find the unique angle that makes people stop and stare.Deep diving into your brand to find the unique angle that makes people stop and stare."
          />
          <StepContent
            number="02"
            title="Design"
            text="Translating strategy into visual language. We don't just make it pretty; we make it work.We don't just make it pretty; we make it work.We don't just make it pretty; we make it work.We don't just make it pretty; we make it work.We don't just make it pretty; we make it work."
          />
          <StepContent
            number="03"
            title="Launch"
            text="Deploying the vision and scaling it. This is where your brand meets the real world.This is where your brand meets the real world.This is where your brand meets the real world.This is where your brand meets the real world.This is where your brand meets the real world.This is where your brand meets the real world."
          />
        </div>
      </div>
    </section>
  );
}
