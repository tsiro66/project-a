"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StepContent from "../components/StepContent";
import { useTranslations } from "next-intl";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StickySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const t = useTranslations("StickySection");
  
  const titleText = t("title");

  // Helper to split text into spans for desktop character animation
  const splitText = (text: string) => {
    return text.trim().split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block translate-y-full opacity-0 will-change-transform"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const chars = titleRef.current?.querySelectorAll(".char");

      // --- DESKTOP CONFIGURATION (1280px+) ---
      mm.add("(min-width: 1280px)", () => {
        // 1. Intro Animation: Detailed character stagger
        if (chars && chars.length > 0) {
          gsap.fromTo(chars, 
            { y: "110%", opacity: 0 }, 
            {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // 2. Pinning the Left Column
        ScrollTrigger.create({
          trigger: leftColumnRef.current,
          start: "top top",
          endTrigger: containerRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });

        // 3. Parallax Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });

        tl.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top" },
          { scaleY: 4, duration: 1, ease: "none" },
          0
        )
        .to(
          titleRef.current,
          { y: 800, duration: 1, ease: "none" },
          0
        )
        .to(
          lineRef.current,
          { y: 1000, duration: 0.5, ease: "none" },
          0.5
        );
      });

      // --- MOBILE / TABLET CONFIGURATION (< 1280px) ---
      mm.add("(max-width: 1279px)", () => {
        // 1. Reduced Intro: Animate the whole title block at once (Better for performance)
        gsap.fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [titleText] }
  );

  return (
    <section
      id="services-section"
      ref={containerRef}
      className="relative w-full bg-lime-400 text-black py-20 overflow-hidden"
    >
      <div className="flex flex-col xl:flex-row px-6 md:px-20">
        <div
          className="w-full xl:w-1/2 h-fit flex flex-col justify-start"
          ref={leftColumnRef}
        >
          <div className="flex flex-col xl:flex-row xl:items-start items-center text-center xl:text-left gap-0 xl:gap-10">
            {/* The line: Vertical on Desktop, Horizontal on Mobile */}
            <div
              ref={lineRef}
              className="hidden xl:block xl:w-2.5 xl:h-60 bg-zinc-900 rounded-xs xl:origin-top"
              style={{ willChange: "transform" }}
            />

            <h2
              ref={titleRef}
              className="text-3xl md:text-4xl lg:text-6xl font-syne font-black italic tracking-tighter uppercase flex flex-col"
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Desktop: Animates spans | Mobile: Block animation handled by GSAP matchMedia */}
              <span className="block overflow-hidden px-4 pb-4 -mb-4">
                <span className="xl:hidden inline-block">{titleText}</span>
                <span className="hidden xl:inline-block">{splitText(titleText)}</span>
              </span>
            </h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full xl:w-1/2 flex flex-col items-center justify-center gap-20 xl:gap-[80vh] pt-20 xl:pt-96 xl:pb-[100vh]">
          <StepContent
            number="01"
            title={t("first.title")}
            text={t("first.description")}
          />
          <StepContent
            number="02"
            title={t("second.title")}
            text={t("second.description")}
          />
          <StepContent
            number="03"
            title={t("third.title")}
            text={t("third.description")}
          />
        </div>
      </div>
    </section>
  );
}