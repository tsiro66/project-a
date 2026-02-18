"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

type AnimatedTextSection = {
  part1: string;
  highlight: string;
  part2: string;
};

export default function AnimatedText({ section }: { section: AnimatedTextSection }) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { part1, highlight, part2 } = section;
  const contentKey = part1 + highlight + part2;

  useEffect(() => {
    if (!textRef.current || !container.current) return;

    let split: SplitText | null = null;
    let ctx: gsap.Context | null = null;
    let resizeTimer: ReturnType<typeof setTimeout>;

    const buildAnimation = () => {
      if (ctx) { ctx.revert(); ctx = null; }
      if (split) { split.revert(); split = null; }
      if (!textRef.current || !container.current) return;

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      split = new SplitText(textRef.current, {
        type: isDesktop ? "words, lines" : "lines",
      });

      const targets = isDesktop ? split.words : split.lines;

      ctx = gsap.context(() => {
        gsap.set(targets, {
          transformPerspective: 1000,
          backfaceVisibility: "hidden",
          force3D: true,
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
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });
        } else {
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
      }, container);
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildAnimation, 400);
    };

    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        buildAnimation();
        window.addEventListener("resize", handleResize);
      });
    });

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      if (ctx) ctx.revert();
      if (split) split.revert();
    };
  }, [part1, highlight, part2]);

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
        <span className="text-lime-400 highlighted-text">{highlight}</span>{" "}
        {part2}
      </div>
    </div>
  );
}