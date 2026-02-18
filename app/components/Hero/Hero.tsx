"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollIndicator from "./ScrollIndicator";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type HeroSection = {
  title1: string;
  title2: string;
  cyclingWords: string[];
};

export default function Hero({ section }: { section: HeroSection }) {
  const container = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const isDesktop = window.innerWidth >= 1024;

      const tl = gsap.timeline({
        delay: 0.1,
      });

      tl.to(bgRef.current, { scale: 1.1, duration: 2 })
        .fromTo(
          [".hero-title-top", ".hero-cycling-wrapper", ".hero-title-bottom"],
          { y: 60, opacity: 0, filter: isDesktop ? "blur(10px)" : "none" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
          },
          "-=1.5",
        )
        .fromTo(
          ".hero-subtext",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6",
        );

      const wordElements = gsap.utils.toArray(".word-item");
      if (wordElements.length > 0) {
        const loop = gsap.timeline({ repeat: -1, delay: 1.5 });
        wordElements.forEach((word) => {
          loop
            .fromTo(
              word as HTMLElement,
              { opacity: 0, x: isDesktop ? 100 : 40 },
              { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
            )
            .to(
              word as HTMLElement,
              {
                opacity: 0,
                x: isDesktop ? -100 : -40,
                duration: 0.6,
                ease: "power3.in",
              },
              "+=1.2",
            );
        });
      }

      mm.add("(min-width: 1024px)", () => {
        const xBgSetter = gsap.quickSetter(bgRef.current, "x", "px");
        const yBgSetter = gsap.quickSetter(bgRef.current, "y", "px");
        const xTextSetter = gsap.quickSetter(textContentRef.current, "x", "px");
        const yTextSetter = gsap.quickSetter(textContentRef.current, "y", "px");
        const rYSetter = gsap.quickSetter(
          textContentRef.current,
          "rotationY",
          "deg",
        );
        const rXSetter = gsap.quickSetter(
          textContentRef.current,
          "rotationX",
          "deg",
        );

        const handleMouseMove = (e: MouseEvent) => {
          const xRel = e.clientX / window.innerWidth - 0.5;
          const yRel = e.clientY / window.innerHeight - 0.5;

          xBgSetter(xRel * 20);
          yBgSetter(yRel * 20);
          xTextSetter(xRel * -40);
          yTextSetter(yRel * -40);
          rYSetter(xRel * 30);
          rXSetter(yRel * -30);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
      });

      return () => mm.revert();
    },
    { scope: container },
  );

  return (
    <div
      id="hero-section"
      ref={container}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full scale-[1.3] brightness-50"
      >
        <Image
          src="/hero-image.webp"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover will-change-transform"
          alt="Κατασκευή ιστοσελίδων | eshop | εφαρμογών"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div
        ref={textContentRef}
        className="relative z-10 text-white px-4 text-center will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex flex-col items-center md:gap-4 mb-12">
          <h1 className="hero-title-top opacity-0 text-2xl md:text-5xl lg:text-6xl font-black uppercase font-syne tracking-tighter leading-none">
            {section.title1}
          </h1>

          <div className="hero-cycling-wrapper opacity-0 inline-grid grid-cols-1 font-syne grid-rows-1 justify-items-center h-1 items-center my-4 w-full">
            {section.cyclingWords.map((word, i) => (
              <span
                key={i}
                className="word-item col-start-1 row-start-1 opacity-0 text-3xl md:text-6xl lg:text-7xl text-lime-400 italic font-black uppercase tracking-tighter highlighted-text whitespace-nowrap"
              >
                {word}
              </span>
            ))}
          </div>

          <h1 className="hero-title-bottom opacity-0 text-2xl md:text-5xl lg:text-6xl font-black uppercase font-syne tracking-tighter leading-none">
            {section.title2}
          </h1>
        </div>

        <p className="hero-subtext opacity-0 text-sm md:text-xl font-mono text-zinc-400 uppercase tracking-[0.3em]">
          High-end digital solutions
        </p>
      </div>

      <ScrollIndicator />
    </div>
  );
}
