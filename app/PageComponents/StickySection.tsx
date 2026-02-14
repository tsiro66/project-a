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
              invalidateOnRefresh: true, 
            },
          }
        );
      }

      // Κρίσιμη αλλαγή: Το Parallax ενεργοποιείται μόνο από 1280px και πάνω (xl)
      mm.add("(min-width: 1280px)", () => {
        ScrollTrigger.create({
          trigger: leftColumnRef.current,
          start: "top top",
          endTrigger: containerRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });

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

      // Για οθόνες κάτω από 1280px (Tablets/Mobile)
      mm.add("(max-width: 1279px)", () => {
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
      {/* Χρήση xl: αντί για lg: για να παραμείνει stacked στην ταμπλέτα */}
      <div className="flex flex-col xl:flex-row px-6 md:px-20">
        <div
          className="w-full xl:w-1/2 h-fit flex flex-col justify-start"
          ref={leftColumnRef}
        >
          {/* Ευθυγράμμιση κειμένου: κεντραρισμένο σε ταμπλέτα, αριστερά σε desktop (xl) */}
          <div className="flex flex-col xl:flex-row xl:items-start items-center text-center xl:text-left gap-0 xl:gap-10">
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
              <span className="block overflow-hidden px-4 pb-4 -mb-4">
                {splitText(titleText)}
              </span>
            </h2>
          </div>
        </div>

        {/* Spacing: Stacked layout για ταμπλέτες, Parallax layout για xl (1280px+) */}
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