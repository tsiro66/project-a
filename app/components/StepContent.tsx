"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger if not already done globally
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

  const splitWords = (phrase: string) => {
    return phrase.split(" ").map((word, i) => (
      <span key={i} className="inline-block overflow-hidden mr-[0.2em] -mb-2">
        {/* Changed translate-y-full to translate-y-[110%] to ensure it's hidden */}
        <span className="word inline-block translate-y-[110%] will-change-transform py-2">
          {word}
        </span>
      </span>
    ));
  };

  useGSAP(() => {
    const words = container.current?.querySelectorAll(".word");

    if (words) {
      gsap.to(words, {
        y: 0,
        stagger: 0.02,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }

    gsap.from(".step-number", {
      opacity: 0,
      scale: 0.8,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 90%",
      }
    });
  }, { scope: container });

  return (
    <div ref={container} className="content-block flex flex-col items-start max-w-2xl">
      <div className="relative mb-6">
        <span className="step-number absolute -top-32 -left-10 text-[14rem] font-black text-zinc-950/10 select-none z-0">
          {number}
        </span>
      </div>

      <h3 className="text-6xl md:text-8xl font-black uppercase mb-6 leading-[0.8] tracking-wider md:tracking-widest flex flex-wrap">
        {splitWords(title)}
      </h3>

      <div className="flex gap-6 items-start">
        <p className="text-xl md:text-2xl leading-[0.8] tracking-tight flex flex-wrap">
          {splitWords(text)}
        </p>
      </div>
    </div>
  );
}