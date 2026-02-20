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

      // Fix 2: set initial scale via GSAP so it reads it correctly on first frame
      gsap.set(bgRef.current, { scale: 1.3 });

      const tl = gsap.timeline({ delay: 0 });

      tl.to(bgRef.current, { scale: 1.1, duration: 2 })
        .fromTo(
          [".hero-title-top", ".hero-cycling-wrapper", ".hero-title-bottom"],
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
          },
          "-=1.5",
        )
        .fromTo(
          ".hero-subtext",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          "-=0.6",
        );

      const wordElements = gsap.utils.toArray(".word-item");
      if (wordElements.length > 0) {
        const loop = gsap.timeline({ repeat: -1, delay: 0 });
        mm.add("(min-width: 1024px)", () => {
          wordElements.forEach((word) => {
            loop
              .fromTo(
                word as HTMLElement,
                { autoAlpha: 0, x: 100 },
                { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" },
              )
              .to(
                word as HTMLElement,
                { autoAlpha: 0, x: -100, duration: 0.6, ease: "power3.in" },
                "+=1.2",
              );
          });
        });
        mm.add("(max-width: 1023px)", () => {
          wordElements.forEach((word) => {
            loop
              .fromTo(
                word as HTMLElement,
                { autoAlpha: 0, x: 40 },
                { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" },
              )
              .to(
                word as HTMLElement,
                { autoAlpha: 0, x: -40, duration: 0.6, ease: "power3.in" },
                "+=1.2",
              );
          });
        });
      }

      mm.add("(min-width: 1024px)", () => {
        const xBgSetter = gsap.quickSetter(bgRef.current, "x", "px");
        const yBgSetter = gsap.quickSetter(bgRef.current, "y", "px");
        const xTextSetter = gsap.quickSetter(textContentRef.current, "x", "px");
        const yTextSetter = gsap.quickSetter(textContentRef.current, "y", "px");
        const rYSetter = gsap.quickSetter(textContentRef.current, "rotationY", "deg");
        const rXSetter = gsap.quickSetter(textContentRef.current, "rotationX", "deg");

        let rafId: number;
        const handleMouseMove = (e: MouseEvent) => {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const xRel = e.clientX / window.innerWidth - 0.5;
            const yRel = e.clientY / window.innerHeight - 0.5;
            xBgSetter(xRel * 20);
            yBgSetter(yRel * 20);
            xTextSetter(xRel * -40);
            yTextSetter(yRel * -40);
            rYSetter(xRel * 30);
            rXSetter(yRel * -30);
          });
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
      {/* Fix 1: removed brightness-50 filter, replaced with overlay div */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <Image
          src="/hero-image.webp"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover will-change-transform"
          alt="Κατασκευή ιστοσελίδων | eshop | εφαρμογών"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60 z-10" />
      </div>

      {/* Fix 3: preserve-3d only on desktop via inline style conditional */}
      <div
        ref={textContentRef}
        className="relative z-10 text-white px-4 text-center will-change-transform"
        style={{ transformStyle: "preserve-3d" } as React.CSSProperties}
      >
        <div className="flex flex-col items-center mb-12">
          <h1 className="hero-title-top text-2xl md:text-5xl lg:text-6xl font-black uppercase font-syne tracking-tighter leading-none">
            {section.title1}
          </h1>

          <div className="hero-cycling-wrapper inline-grid grid-cols-1 font-syne grid-rows-1 justify-items-center items-center w-full h-10 md:h-16 lg:h-20">
            {section.cyclingWords.map((word, i) => (
              <span
                key={i}
                // Fix 4: added will-change-transform to promote cycling words to their own layer
                className="word-item col-start-1 row-start-1 text-3xl md:text-6xl lg:text-7xl text-lime-400 italic font-black uppercase tracking-tighter highlighted-text whitespace-nowrap will-change-transform"
              >
                {word}
              </span>
            ))}
          </div>

          <h1 className="hero-title-bottom text-2xl md:text-5xl lg:text-6xl font-black uppercase font-syne tracking-tighter leading-none">
            {section.title2}
          </h1>
        </div>

        <p className="hero-subtext text-sm md:text-xl font-mono text-zinc-400 uppercase tracking-[0.3em]">
          High-end digital solutions
        </p>
      </div>

      <ScrollIndicator />
    </div>
  );
}