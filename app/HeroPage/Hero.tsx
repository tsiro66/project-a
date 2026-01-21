"use client";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(bgRef.current, 
      { scale: 1.3, filter: "brightness(0%)" }, 
      { scale: 1, filter: "brightness(50%)", duration: 2 }
    )
    .from(".hero-text", {
      y: 100,
      skewY: 7,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2
    }, "-=1.2")
    .from(".hero-subtext", {
      opacity: 0,
      y: 20,
      duration: 1
    }, "-=0.8");

    // --- PARALLAX SCROLL ANIMATION ---
    // This moves the text up faster than the background
    gsap.to(textContentRef.current, {
      yPercent: -100, // Moves up as you scroll down
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top", 
        end: "bottom top",
        scrub: true, // Smoothly ties animation to scrollbar
      }
    });

  }, { scope: container });

  return (
    <div ref={container} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <Image
          src="/hero-image-4.jpg"
          fill
          priority
          className="object-cover"
          alt="Hero Image"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Parallax Content Container */}
      <div ref={textContentRef} className="relative z-10 text-white px-6 text-center">
        <div className="overflow-hidden mb-2">
          <h1 className="hero-text text-5xl md:text-7xl lg:text-9xl font-bold">
            Lorem ipsum<br /> dolor <span className="text-lime-400 italic">sit amet.</span>
          </h1>
        </div>
        <div className="overflow-hidden">
          <p className="hero-subtext text-lg md:text-2xl font-mono text-zinc-300 uppercase tracking-widest">
            consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>
  );
}