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
  const content = t.raw("content");

  useGSAP(
    () => {
      // If content is empty or ref is missing, bail
      if (!textRef.current) return;

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
    // Adding content to dependencies ensures GSAP recalculates on lang change
    { scope: container, dependencies: [content] },
  );

  return (
    <div
      ref={container}
      className="min-h-screen flex items-center justify-center p-5 md:p-30 uppercase bg-zinc-950 text-zinc-100 overflow-hidden"
    >
      <div
        ref={textRef}
        // KEY FIX: The key ensures the DOM node is fresh for SplitText when content changes
        key={content}
        className="text-xl md:text-4xl lg:text-5xl text-center font-syne font-black leading-tight tracking-tighter"
        style={{ willChange: "transform" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}