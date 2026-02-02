"use client";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // --- INTRO ANIMATION ---
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        bgRef.current,
        { scale: 1.3, filter: "brightness(0%)" },
        { scale: 1.1, filter: "brightness(50%)", duration: 2 },
      )
        .from(
          ".hero-text",
          {
            y: 100,
            skewY: 7,
            opacity: 0,
            duration: 1.5,
            stagger: 0.2,
          },
          "-=1.2",
        )
        .from(
          ".hero-subtext",
          {
            opacity: 0,
            y: 20,
            duration: 1,
          },
          "-=0.8",
        );

      // --- PARALLAX SCROLL ANIMATION ---
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

      // --- MOUSE PARALLAX LOGIC ---
      const handleMouseMove = (e: MouseEvent) => {
        if (ScrollTrigger.isTouch === 1) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Calculate movement range (-0.5 to 0.5)
        const xPercent = clientX / innerWidth - 0.5;
        const yPercent = clientY / innerHeight - 0.5;

        // 1. Move Background (Subtle inverse move)
        gsap.to(bgRef.current, {
          x: xPercent * 20,
          y: yPercent * 20,
          duration: 0.8,
          ease: "power2.out",
        });

        // 2. Rotate and Move Text
        gsap.to(textContentRef.current, {
          x: xPercent * -40, // Slight counter-movement for depth
          y: yPercent * -40,
          rotationY: xPercent * 20, // Adjust 30 for more/less intensity
          rotationX: yPercent * -20, // Negative to "look" toward mouse
          transformPerspective: 1000, // Essential for the 3D depth effect
          duration: 0.8,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Cleanup listener on unmount
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: container },
  );

  return (
    <div
      id="hero-section"
      ref={container}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full scale-110 will-change-transform"
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

      {/* Parallax Content Container */}
      <div
        ref={textContentRef}
        className="relative z-10 text-white px-6 text-center will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className=" mb-2">
          <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            Θελεις το site
            <br /> σου να{" "}
            <span className="text-lime-400 italic">εντυπωσιάζει ?</span>
          </h1>
        </div>

        <p className="hero-subtext text-lg md:text-2xl font-mono text-zinc-300 uppercase tracking-widest">
          High-end digital solutions
        </p>
      </div>
    </div>
  );
}
