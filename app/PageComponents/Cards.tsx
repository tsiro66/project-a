"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightTrail from "../components/LightTrail";
import { useTranslations } from "next-intl";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Cards() {
  const t = useTranslations("Cards");
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const cardKeys = [
    { key: "first", color: "bg-lime-400", text: "text-zinc-950" },
    { key: "second", color: "bg-zinc-50", text: "text-zinc-950" },
    { key: "third", color: "bg-zinc-800", text: "text-white" },
    { key: "fourth", color: "bg-lime-400", text: "text-zinc-950" },
    { key: "fifth", color: "bg-white", text: "text-zinc-950" },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (!sectionRef.current) return;

        const getScrollAmount = () => {
          return sectionRef.current!.scrollWidth - window.innerWidth;
        };

        const speedFactor = 0.5;

        gsap.to(sectionRef.current, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount() * speedFactor}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
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
          id="process-section"
          ref={sectionRef}
          className={`
            flex relative items-center z-10
            flex-col h-auto w-full gap-6 py-12 px-6
            lg:flex-row lg:h-screen lg:w-max lg:gap-[5vw] lg:px-[5vw] lg:py-0
          `}
        >
          {/* Intro Card */}
          <div className="relative shrink-0 flex flex-col justify-between p-8 
            h-auto min-h-95 lg:h-[75vh] 
            w-full lg:w-[45vw] 
            border border-zinc-800 bg-zinc-900 text-lime-400"
          >
            <span className="text-xl lg:text-2xl font-mono font-bold">—</span>
            
            <h3 className="font-black uppercase tracking-tighter leading-[0.9] italic
              text-[12vw] lg:text-[7vw] my-6 lg:my-0"
            >
              {t("intro.title")}
            </h3>

            <div className="flex justify-between items-end gap-4">
              <p className="max-w-55 lg:max-w-xs font-medium uppercase text-[10px] lg:text-sm leading-tight text-zinc-400">
                {t("intro.description")}
              </p>
              
              <div className="flex shrink-0 w-10 h-10 lg:w-16 lg:h-16 rounded-full border border-current items-center justify-center text-xl lg:text-3xl">
                {/* Points DOWN on mobile, rotates -90deg (RIGHT) on desktop */}
                <span className="rotate-0 lg:-rotate-90 transition-transform duration-300">
                  ↓
                </span>
              </div>
            </div>
          </div>

          {/* Process Cards */}
          {cardKeys.map((card, index) => (
            <div
              key={card.key}
              className={`
                relative shrink-0 flex flex-col justify-between p-8 lg:p-10 
                h-[45vh] lg:h-[75vh] 
                w-full lg:min-w-[75vw] lg:w-fit 
                ${card.color} ${card.text} transition-all duration-500
              `}
            >
              <span className="text-xl lg:text-2xl font-mono font-bold">0{index + 1}</span>

              <h3 className="font-black uppercase tracking-tighter leading-[0.8] italic text-[11vw] lg:text-[10vw] pr-6 lg:pr-10">
                {t(`${card.key}.title`)}
              </h3>

              <div className="flex justify-between items-end">
                <p className="max-w-62.5 lg:max-w-xl font-medium uppercase text-[10px] lg:text-xl tracking-tighter leading-tight opacity-70">
                  {t(`${card.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}