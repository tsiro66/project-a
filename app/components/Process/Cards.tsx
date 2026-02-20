"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const LightTrail = dynamic(() => import("./LightTrail"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-zinc-950" />,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type CardContent = {
  title: string;
  description: string;
};

type CardsSection = {
  intro: CardContent;
  first: CardContent;
  second: CardContent;
  third: CardContent;
  fourth: CardContent;
  fifth: CardContent;
};

const cardKeys = [
  { key: "first", color: "bg-lime-400", text: "text-zinc-950" },
  { key: "second", color: "bg-zinc-50", text: "text-zinc-950" },
  { key: "third", color: "bg-zinc-800", text: "text-white" },
  { key: "fourth", color: "bg-lime-400", text: "text-zinc-950" },
  { key: "fifth", color: "bg-white", text: "text-zinc-950" },
] as const;

export default function Cards({ section }: { section: CardsSection }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [showCanvas, setShowCanvas] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top 300%",
        onEnter: () => {
          setShowCanvas(true)
          console.log("viewed")
        }
          ,
        once: true,
      });

      mm.add("(min-width: 1024px)", () => {
        if (!sectionRef.current) return;

        const getScrollAmount = () =>
          sectionRef.current!.scrollWidth - window.innerWidth;

        gsap.to(sectionRef.current, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount() * 0.5}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.from(".process-card", {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
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
          {showCanvas && <LightTrail />}
        </div>

        <div
          id="process-section"
          ref={sectionRef}
          className="flex relative items-center z-10 flex-col h-auto w-full gap-6 py-12 px-6 lg:flex-row lg:h-screen lg:w-max lg:gap-[5vw] lg:px-[5vw] lg:py-0"
        >
          {/* Intro Card */}
          <div className="relative shrink-0 flex flex-col justify-between p-8 h-auto min-h-100 lg:h-[75vh] w-full lg:w-[45vw] border border-zinc-800 bg-zinc-900 text-lime-400">
            <span className="text-xl lg:text-2xl font-mono font-bold">—</span>
            <h3 className="font-black uppercase tracking-tighter leading-[0.9] italic text-[12vw] lg:text-[7vw] my-6 lg:my-0">
              {section.intro.title}
            </h3>
            <div className="flex justify-between items-end gap-4">
              <p className="max-w-55 lg:max-w-xs font-medium uppercase text-sm lg:text-lg leading-tight text-zinc-400">
                {section.intro.description}
              </p>
              <div className="flex shrink-0 w-10 h-10 lg:w-16 lg:h-16 rounded-full border border-current items-center justify-center text-xl lg:text-3xl">
                <span className="rotate-0 lg:-rotate-90">↓</span>
              </div>
            </div>
          </div>

          {/* Process Cards */}
          {cardKeys.map((card, index) => (
            <div
              key={card.key}
              className={`process-card relative shrink-0 flex flex-col justify-between p-8 lg:p-10 h-[45vh] lg:h-[75vh] w-full lg:min-w-[75vw] lg:w-fit ${card.color} ${card.text}`}
            >
              <span className="text-xl lg:text-2xl font-mono font-bold">
                0{index + 1}
              </span>
              <h3 className="font-black uppercase tracking-tighter leading-[0.8] italic text-[10vw] lg:text-[10vw] pr-6 lg:pr-10">
                {section[card.key].title}
              </h3>
              <div className="flex justify-between items-end">
                <p className="max-w-62.5 lg:max-w-xl font-medium uppercase text-sm lg:text-2xl tracking-tighter leading-tight opacity-70">
                  {section[card.key].description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}