"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightTrail from "../components/LightTrail";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CARDS = [
  { id: 1, title: "Impact", color: "bg-lime-400" },
  { id: 2, title: "Vision", color: "bg-zinc-50" },
  { id: 3, title: "Scale", color: "bg-zinc-800", text: "text-white" },
  { id: 4, title: "Design", color: "bg-lime-400" },
  { id: 5, title: "Growth", color: "bg-white" },
];

export default function Cards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Create a MatchMedia instance
      const mm = gsap.matchMedia();

      // Only run horizontal scroll on Desktop (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          sectionRef.current,
          { x: 0 },
          {
            x: "-330vw",
            ease: "none",
            scrollTrigger: {
              trigger: triggerRef.current,
              start: "top top",
              end: "+=3000",
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
            },
          },
        );
      });

      return () => mm.revert(); // Clean up all animations
    },
    { scope: triggerRef },
  );

  return (
    <div className="relative overflow-hidden">
      <div ref={triggerRef}>
        <div className="fixed inset-0 pointer-events-none z-0 bg-zinc-950">
          <LightTrail />
        </div>

        <div
          ref={sectionRef}
          className={`
            flex relative items-center z-10
            /* Mobile: Vertical stack */
            flex-col h-auto w-full gap-10 py-20 px-6
            /* Desktop: Horizontal row */
            lg:flex-row lg:h-screen lg:w-[500vw] lg:gap-[5vw] lg:px-[5vw] lg:py-0
          `}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`
                relative shrink-0 flex flex-col justify-between p-10 
                /* Mobile sizing */
                h-[60vh] w-full
                /* Desktop sizing */
                lg:h-[70vh] lg:w-[80vw] 
                ${card.color} ${card.text || "text-zinc-950"}
              `}
            >
              <span className="text-2xl font-mono font-bold">0{card.id}</span>

              <h3 className="text-[15vw] lg:text-[12vw] font-black uppercase tracking-tighter leading-none italic">
                {card.title}
              </h3>

              <div className="flex justify-between items-end">
                <p className="max-w-[200px] lg:max-w-xs font-medium uppercase text-xs lg:text-sm leading-tight">
                  High-performance solutions tailored for modern digital
                  ecosystems.
                </p>
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-2 border-current flex items-center justify-center text-2xl lg:text-3xl">
                  ↗
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
