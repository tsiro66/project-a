"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function AnimatedText() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("AnimatedText");

  const part1 = t("part1");
  const highlight = t("highlight");
  const part2 = t("part2");
  const contentKey = part1 + highlight + part2;
  
  useGSAP(
    () => {
      if (!textRef.current) return;

      const mm = gsap.matchMedia();
      let split: SplitText;

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          // PERFORMANCE FIX: Στο mobile κάνουμε split μόνο lines (λιγότερα DOM nodes)
          split = new SplitText(textRef.current, { 
            type: isDesktop ? "words, lines" : "lines" 
          });

          const targets = isDesktop ? split.words : split.lines;

          gsap.set(targets, {
            transformPerspective: 1000,
            backfaceVisibility: "hidden",
          });

          if (isDesktop) {
            gsap.from(targets, {
              y: 40,
              autoAlpha: 0,
              stagger: 0.07,
              duration: 1,
              ease: "power2.out",
              force3D: true,
              scrollTrigger: {
                trigger: container.current,
                start: "top 60%", // Λίγο πιο αργά για καλύτερο Performance
                end: "bottom 80%",
                scrub: true,
              },
            });
          } else {
            // Mobile Animation: Πιο ελαφρύ stagger
            gsap.from(targets, {
              y: 20,
              autoAlpha: 0,
              stagger: 0.1,
              duration: 0.6,
              ease: "power2.out",
              force3D: true,
              scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });
          }
        },
      );

      return () => {
        mm.revert();
        if (split) split.revert();
      };
    },
    { scope: container, dependencies: [part1, highlight, part2] },
  );

  return (
    <div
      ref={container}
      key={contentKey}
      className="min-h-[70vh] md:min-h-screen flex items-center justify-center p-5 md:p-30 uppercase bg-zinc-950 text-zinc-100 overflow-hidden"
    >
      <div
        ref={textRef}
        className="text-xl md:text-4xl lg:text-5xl text-center font-syne font-black leading-tight tracking-tighter"
        style={{ willChange: "transform, opacity" }}
      >
        {part1}{" "}
        <span className="text-lime-400 highlighted-text">
          {highlight}
        </span>{" "}
        {part2}
      </div>
    </div>
  );
}