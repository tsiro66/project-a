"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import ScrollIndicator from "../components/ScrollIndicator";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("Hero");
  const words = t.raw("cyclingWords") as string[];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // --- SHARED / MOBILE OPTIMIZED LOGIC ---
      const tl = gsap.timeline({
        delay: 0.1,
       onStart: () => {
      // Hide the preloader as the Hero animation begins
      const loader = document.getElementById("initial-loader");
      if (loader) {
        gsap.to(loader, {
          yPercent: -100, // Slides up like a curtain
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: () => loader.remove() // Clean up the DOM
        });
      }
    }
  });

      // Entry Animation: Remove blur on mobile to save TBT
      const isDesktop = window.innerWidth >= 1024;
      
      tl.to(bgRef.current, { scale: 1.1, duration: 2 })
        .fromTo(
          ".hero-text",
          { y: 60, opacity: 0, filter: isDesktop ? "blur(10px)" : "none" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.2 },
          "-=1.5"
        )
        .fromTo(
          ".hero-subtext",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        );

      // Cycling Words: Optimized with a single timeline stagger for mobile performance
      const wordElements = gsap.utils.toArray(".word-item");
      if (wordElements.length > 0) {
        const loop = gsap.timeline({ repeat: -1, delay: 1 });
        wordElements.forEach((word) => {
          loop
            .fromTo(
              word as HTMLElement,
              { opacity: 0, x: isDesktop ? 80 : 30 }, // Smaller X on mobile
              { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
            )
            .to(
              word as HTMLElement,
              { opacity: 0, x: isDesktop ? -80 : -30, duration: 0.5, ease: "power2.in" },
              "+=0.8"
            );
        });
      }

      // --- DESKTOP ONLY LOGIC (3D & Parallax) ---
      mm.add("(min-width: 1024px)", () => {
        const xBgSetter = gsap.quickSetter(bgRef.current, "x", "px");
        const yBgSetter = gsap.quickSetter(bgRef.current, "y", "px");
        const xTextSetter = gsap.quickSetter(textContentRef.current, "x", "px");
        const yTextSetter = gsap.quickSetter(textContentRef.current, "y", "px");
        const rYSetter = gsap.quickSetter(textContentRef.current, "rotationY", "deg");
        const rXSetter = gsap.quickSetter(textContentRef.current, "rotationX", "deg");

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
    { scope: container }
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
          alt="Hero Image"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div
        ref={textContentRef}
        className="relative z-10 text-white px-4 text-center will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="mb-4">
          <h1 className="hero-text opacity-0 text-2xl md:text-5xl lg:text-6xl font-black uppercase font-syne tracking-tighter leading-tight">
            {t("title")} <br />
            <span className="inline-grid grid-cols-1 grid-rows-1 justify-items-center h-[1.2em]">
              {words.map((word, i) => (
                <span
                  key={i}
                  className="word-item col-start-1 row-start-1 opacity-0 text-lime-400 italic highlighted-text"
                  // Note: Consider moving text-shadow to a desktop-only CSS class if mobile TBT is still high
                  style={{ textShadow: "0 0 12px rgba(163, 230, 53, 0.6)" }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>
        </div>
        <p className="hero-subtext opacity-0 text-lg md:text-2xl font-mono text-zinc-400 uppercase tracking-[0.3em]">
          High-end digital solutions
        </p>
      </div>

      <ScrollIndicator />
    </div>
  );
}