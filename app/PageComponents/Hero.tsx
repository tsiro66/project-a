"use client";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useAnimationReady } from "../contexts/AnimationContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const { canAnimate } = useAnimationReady();
  const container = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Hero");

  useGSAP(
    () => {
      if (!canAnimate) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Reset the background brightness and scale
      tl.to(bgRef.current, {
        scale: 1.1,
        filter: "brightness(50%)",
        duration: 2,
      })
      // 2. Animate text FROM skewed/hidden TO upright/visible
      .fromTo(
        ".hero-text",
        {
          y: 100,
          skewY: 7,
          opacity: 0,
        },
        {
          y: 0,
          skewY: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.2,
        },
        "-=1.2"
      )
      .fromTo(
        ".hero-subtext",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=0.8"
      );

      // --- PARALLAX SCROLL ---
      gsap.to(textContentRef.current, {
        yPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // --- MOUSE PARALLAX ---
      const handleMouseMove = (e: MouseEvent) => {
        if (ScrollTrigger.isTouch === 1) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xPercent = clientX / innerWidth - 0.5;
        const yPercent = clientY / innerHeight - 0.5;

        gsap.to(bgRef.current, {
          x: xPercent * 20,
          y: yPercent * 20,
          duration: 0.8,
          ease: "power2.out",
        });

        gsap.to(textContentRef.current, {
          x: xPercent * -40,
          y: yPercent * -40,
          rotationY: xPercent * 20,
          rotationX: yPercent * -20,
          transformPerspective: 1000,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: container, dependencies: [canAnimate] }
  );

  return (
    <div
      id="hero-section"
      ref={container}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image: Start dark and slightly larger */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full scale-[1.3] brightness-0 will-change-transform"
      >
        <Image
          src="/hero-image-5.jpg"
          fill
          priority
          className="object-cover"
          alt="Hero Image"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div
        ref={textContentRef}
        className="relative z-10 text-white px-6 text-center will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="mb-2">
          {/* ONLY keep opacity-0 here to prevent the flash. GSAP handles the skew. */}
          <h1 className="hero-text opacity-0 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            {t("title")} < br />
            <span className="text-lime-400 italic">{t("italic")}</span>
          </h1>
        </div>

        <p className="hero-subtext opacity-0 text-lg md:text-2xl font-mono text-zinc-300 uppercase tracking-widest">
          High-end digital solutions
        </p>
      </div>
    </div>
  );
}