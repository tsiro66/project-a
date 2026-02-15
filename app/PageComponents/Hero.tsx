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
      // 1. Entry Animation - Πιο γρήγορο για να μην καθυστερεί το LCP
      const tl = gsap.timeline({
        delay: 0.1,
        defaults: { ease: "power4.out" },
      });

      tl.to(bgRef.current, { scale: 1.1, duration: 2 })
        .fromTo(
          ".hero-text",
          { y: 60, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.2 },
          "-=1.5"
        )
        .fromTo(
          ".hero-subtext",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        );

      // 2. Cycling Words - "Σπασμένο" σε δικό του timeline
      const wordElements = gsap.utils.toArray(".word-item");
      if (wordElements.length > 0) {
        const loop = gsap.timeline({ repeat: -1, delay: 1 }); // Καθυστέρηση έναρξης
        wordElements.forEach((word) => {
          loop
            .fromTo(
              word as HTMLElement,
              { opacity: 0, x: 800 }, // Μικρότερο X για λιγότερο "θόρυβο" στο layout
              { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
            )
            .to(
              word as HTMLElement,
              { opacity: 0, x: -800, duration: 0.5, ease: "power2.in" },
              "+=0.8"
            );
        });
      }

      // 3. 3D Parallax & Tilt Logic
      const xBgSetter = gsap.quickSetter(bgRef.current, "x", "px");
      const yBgSetter = gsap.quickSetter(bgRef.current, "y", "px");
      const xTextSetter = gsap.quickSetter(textContentRef.current, "x", "px");
      const yTextSetter = gsap.quickSetter(textContentRef.current, "y", "px");
      const rYSetter = gsap.quickSetter(textContentRef.current, "rotationY", "deg");
      const rXSetter = gsap.quickSetter(textContentRef.current, "rotationX", "deg");

      const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 1024 || ScrollTrigger.isTouch === 1) return;

        const xRel = e.clientX / window.innerWidth - 0.5;
        const yRel = e.clientY / window.innerHeight - 0.5;

        xBgSetter(xRel * 20);
        yBgSetter(yRel * 20);
        xTextSetter(xRel * -40);
        yTextSetter(yRel * -40);
        
        // Το 3D εφέ που ζήτησες
        rYSetter(xRel * 30); 
        rXSetter(yRel * -30);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: container }
  );

  return (
    <div
      id="hero-section"
      ref={container}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black"
      style={{ perspective: "1000px" }} // Perspective για το 3D
    >
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full scale-[1.3] brightness-50 will-change-transform"
      >
        <Image
          src="/hero-image.webp"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
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