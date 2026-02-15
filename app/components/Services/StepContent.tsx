"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
        <span className="word inline-block translate-y-[110%] will-change-transform py-2">
          {word}
        </span>
      </span>
    ));
  };

  useGSAP(() => {
    const words = container.current?.querySelectorAll(".word");

    if (words && words.length > 0) {
      // Use fromTo to ensure we reset the position on language change
      gsap.fromTo(words, 
        { y: "110%" },
        {
          y: 0,
          stagger: 0.02,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );
    }

    gsap.fromTo(".step-number", 
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { 
    scope: container, 
    dependencies: [title, text], // Re-run when text changes
    revertOnUpdate: true 
  });

  return (
    <div ref={container} className="content-block flex flex-col items-start max-w-2xl">
      <div className="relative mb-6">
        <span className="step-number absolute -top-32 -left-10 text-[14rem] font-black text-zinc-950/10 select-none z-0">
          {number}
        </span>
      </div>

      <h3 className="text-2xl md:text-4xl font-black uppercase mb-6 leading-[0.8] tracking-wider md:tracking-widest flex flex-wrap font-syne">
        {splitWords(title)}
      </h3>

      <div className="flex gap-6 items-start">
        <p className="text-lg md:text-xl leading-[0.8] tracking-tight flex flex-wrap">
          {splitWords(text)}
        </p>
      </div>
    </div>
  );
}