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

  // Get translations as strings
  const part1 = t("part1");
  const highlight = t("highlight");
  const part2 = t("part2");

  useGSAP(
    () => {
      if (!textRef.current) return;

      // SplitText works perfectly on nested spans
      const split = new SplitText(textRef.current, { type: "words, lines" });
      const words = split.words;

      gsap.set(words, {
        transformPerspective: 1000,
        backfaceVisibility: "hidden",
      });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          if (isDesktop) {
            gsap.from(words, {
              y: 40,
              autoAlpha: 0,
              stagger: 0.07,
              duration: 1,
              ease: "power2.out",
              force3D: true,
              scrollTrigger: {
                trigger: container.current,
                start: "top 50%",
                end: "bottom 70%",
                scrub: true,
              },
            });
          } else {
            gsap.from(words, {
              y: 20,
              autoAlpha: 0,
              stagger: 0.05,
              duration: 0.4,
              ease: "power2.out",
              force3D: true,
              scrollTrigger: {
                trigger: container.current,
                start: "top 20%",
                toggleActions: "play none none reverse",
              },
            });
          }
        },
      );

      return () => split.revert();
    },
    // Dependency array updated to track all parts
    { scope: container, dependencies: [part1, highlight, part2] },
  );

  return (
    <div
      ref={container}
      className="min-h-screen flex items-center justify-center p-5 md:p-30 uppercase bg-zinc-950 text-zinc-100 overflow-hidden"
    >
      <div
        ref={textRef}
        className="text-xl md:text-4xl lg:text-5xl text-center font-syne font-black leading-tight tracking-tighter"
        style={{ willChange: "transform" }}
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