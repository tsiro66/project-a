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
    let observer: ResizeObserver | null = null;
    let hasPlayed = false;
    // Track the breakpoint so we only rebuild on actual breakpoint crossings
    let wasDesktop = window.matchMedia("(min-width: 768px)").matches;

    const buildAnimation = (forceRebuild = false) => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      // On mobile, only rebuild if the breakpoint actually changed (not just viewport height)
      if (!forceRebuild && isDesktop === wasDesktop) return;
      wasDesktop = isDesktop;

      if (ctx) { ctx.revert(); ctx = null; }
      if (split) { split.revert(); split = null; }
      if (!textRef.current || !container.current) return;

      // If already played, just leave text visible — don't re-animate
      if (hasPlayed) {
        gsap.set(textRef.current, { autoAlpha: 1, y: 0 });
        return;
      }

      split = new SplitText(textRef.current, {
        type: isDesktop ? "words, lines" : "lines",
      });

      const targets = isDesktop ? split.words : split.lines;

      gsap.set(targets, {
        autoAlpha: 0,
        y: isDesktop ? 40 : 20,
        transformPerspective: 1000,
        backfaceVisibility: "hidden",
        force3D: true,
      });

      ctx = gsap.context(() => {
        gsap.to(targets, {
          y: 0,
          autoAlpha: 1,
          stagger: isDesktop ? 0.07 : 0.1,
          duration: isDesktop ? 1 : 0.6,
          ease: "power2.out",
          force3D: true,
          scrollTrigger: {
            trigger: container.current,
            start: isDesktop ? "top 70%" : "top 80%",
            once: true,
            onEnter: () => { hasPlayed = true; },
          },
        });
      }, container);
    };

    // ResizeObserver only fires on element dimension changes (not viewport height from address bar)
    // We watch document.body width to detect breakpoint crossings
    observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => buildAnimation(false), 400);
    });
    observer.observe(document.body);

    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          buildAnimation(true);
        });
      });
    });

    return () => {
      clearTimeout(resizeTimer);
      observer?.disconnect();
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