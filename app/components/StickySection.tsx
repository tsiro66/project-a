"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StickySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // --- MOBILE & DESKTOP SHARED ANIMATIONS ---
      const titleSpans = titleRef.current?.querySelectorAll("span");
      if (titleSpans) {
        gsap.from(titleSpans, {
          yPercent: 100,
          stagger: 0.1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        });
      }

      // --- DESKTOP ONLY: PINNING ---
      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: leftColumnRef.current,
          start: "center center",
          endTrigger: containerRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });

        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top center",
              end: "bottom center",
              scrub: true,
            },
          }
        );
      });

      // --- MOBILE ONLY: PROGRESS LINE ---
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
          }
        );
      });

      // --- SHARED: Content Block Reveal ---
      const blocks = gsap.utils.toArray<HTMLElement>(".content-block");
      blocks.forEach((block) => {
        gsap.from(block, {
          opacity: 0,
          x: -20,
          duration: 0.8,
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative w-full bg-lime-400 text-black py-20 overflow-hidden">
      <div className="flex flex-col md:flex-row px-6 md:px-20">
        
        {/* Left Side: Sticky Title */}
        <div className="w-full md:w-1/2 h-fit md:h-screen flex flex-col justify-center md:justify-start pt-10 md:pt-30" ref={leftColumnRef}>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
            {/* Horizontal on mobile, Vertical on desktop */}
            <div 
              ref={lineRef}
              className="w-full h-1 md:w-1.5 md:h-60 bg-black origin-left md:origin-top" 
            />
            
            <h2 
              ref={titleRef} 
              className="text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8] flex flex-col overflow-hidden"
            >
              <span>Our</span>
              <span>Process</span>
            </h2>
          </div>
        </div>

        {/* Right Side: Content steps */}
        <div className="w-full md:w-1/2 flex flex-col gap-24 md:gap-[60vh] py-20 md:py-[50vh]">
          <StepContent number="01" title="Strategy" text="Deep diving into your brand to find the unique angle that makes people stop and stare." />
          <StepContent number="02" title="Design" text="Translating strategy into visual language. We don't just make it pretty; we make it work." />
          <StepContent number="03" title="Launch" text="Deploying the vision and scaling it. This is where your brand meets the real world." />
        </div>
      </div>
    </section>
  );
}

function StepContent({ number, title, text }: { number: string, title: string, text: string }) {
  return (
    <div className="content-block max-w-lg border-l-2 border-black/10 pl-6 md:border-none md:pl-0">
      <span className="font-mono text-sm mb-2 block opacity-50 tracking-widest">— PHASE {number}</span>
      <h3 className="text-5xl md:text-6xl font-black uppercase mb-4 leading-none">{title}</h3>
      <p className="text-lg md:text-xl font-medium leading-relaxed">{text}</p>
    </div>
  );
}