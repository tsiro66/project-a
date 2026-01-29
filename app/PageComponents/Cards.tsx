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
      const pin = gsap.fromTo(
        sectionRef.current,
        { x: 0 },
        {
          x: "-330vw", // Moves 4 cards' width (since 1st is visible)
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "2000 top", // Duration of the horizontal scroll
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        },
      );
      return () => pin.kill();
    },
    { scope: triggerRef },
  );

  return (
    <div className="overflow-hidden">
      {/* Container that stays pinned */}
      <div ref={triggerRef}>
          <div className="absolute inset-0 pointer-events-none">
          {/* <div className="absolute inset-0 z-10 bg-zinc-950/20 pointer-events-none" /> */}
            <LightTrail />
          </div>
        <div
          ref={sectionRef}
          className="flex h-screen w-[500vw] relative items-center px-[5vw] gap-[5vw] z-20"
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`relative h-[70vh] w-[80vw] shrink-0 flex flex-col justify-between p-10 ${card.color} ${card.text || "text-zinc-950"}`}
            >
              <span className="text-2xl font-mono font-bold">0{card.id}</span>

              <h3 className="text-[15vw] font-black uppercase tracking-tighter leading-none italic">
                {card.title}
              </h3>

              <div className="flex justify-between items-end">
                <p className="max-w-xs font-medium uppercase text-sm leading-tight">
                  High-performance solutions tailored for modern digital
                  ecosystems.
                </p>
                <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center text-3xl">
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
