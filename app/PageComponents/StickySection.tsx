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
  
  // Get the string to use as a dependency for the hook
  const titleText = t("title");

  const splitText = (text: string) => {
    return text.trim().split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block translate-y-full will-change-transform"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  useGSAP(
  () => {
    const mm = gsap.matchMedia();
    const chars = titleRef.current?.querySelectorAll(".char");

    // --- 1. CHARACTER REVEAL ---
    // Using fromTo ensures that even if the component re-renders, 
    // the starting position is forced back to 110%
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
            // invalidateOnRefresh ensures it recalculates if the page size changes
            invalidateOnRefresh: true, 
          },
        }
      );
    }

    // --- 2. DESKTOP PARALLAX ---
    mm.add("(min-width: 768px)", () => {
      // Pinning the left column
      ScrollTrigger.create({
        trigger: leftColumnRef.current,
        start: "top top",
        endTrigger: containerRef.current,
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
        id: "left-pin" // Adding IDs helps GSAP keep track
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
          id: "parallax-scroll"
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

    // --- 3. MOBILE ---
    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 20%",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    });

    // Refresh triggers to ensure all heights (including the right column) are correct
    ScrollTrigger.refresh();

  },
  { 
    scope: containerRef, 
    dependencies: [titleText], 
    revertOnUpdate: true 
  }
);

  return (
    <section
      id="services-section"
      ref={containerRef}
      className="relative w-full bg-lime-400 text-black py-20 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row px-6 md:px-20">
        <div
          className="w-full md:w-1/2 h-fit flex flex-col justify-start"
          ref={leftColumnRef}
        >
          <div className="flex flex-col md:flex-row md:items-start items-center text-center md:text-left gap-0 md:gap-10">
            <div
              ref={lineRef}
              className="hidden md:block md:w-2.5 md:h-60 bg-zinc-900 rounded-xs md:origin-top"
              style={{ willChange: "transform" }}
            />

            <h2
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-sans font-black uppercase tracking-tighter leading-[0.8] flex flex-col"
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Added pb-4 to prevent the last letter's descender from being clipped */}
              <span className="block overflow-hidden px-4 pb-4 -mb-4">
                {splitText(titleText)}
              </span>
            </h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-20 md:gap-[80vh] pt-20 md:pt-96 md:pb-[100vh]">
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