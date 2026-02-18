"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MoveLeft } from "lucide-react"; // npm install lucide-react
import Magnetic from "./components/Button/Magnetic";

export default function NotFound() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Entry Animation
      gsap.fromTo(
        ".glitch-text",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power4.out" },
      );

      // 2. 3D Tilt Effect (Same as Hero)
      const rYSetter = gsap.quickSetter(textRef.current, "rotationY", "deg");
      const rXSetter = gsap.quickSetter(textRef.current, "rotationX", "deg");

      const handleMouseMove = (e: MouseEvent) => {
        const xRel = e.clientX / window.innerWidth - 0.5;
        const yRel = e.clientY / window.innerHeight - 0.5;

        rYSetter(xRel * 30);
        rXSetter(yRel * -30);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white"
      style={{ perspective: "1200px" }}
    >
      {/* Background Noise/Grid Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50" />

      {/* 3D Content Container */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <h2 className="glitch-text font-mono text-lime-400 text-sm md:text-base tracking-[0.5em] uppercase mb-4">
          Error 404
        </h2>

        <h1 className="glitch-text text-6xl md:text-8xl lg:text-9xl font-black font-syne uppercase tracking-tighter leading-none mb-8">
          Lost in <br />
          <span
            className="italic text-zinc-800 outline-text"
            style={{ WebkitTextStroke: "1px #a3e635" }}
          >
            the void
          </span>
        </h1>

        <p className="glitch-text max-w-md text-center font-mono text-zinc-500 text-sm md:text-base uppercase tracking-wider mb-12 px-6">
          The digital solution you are looking for has been relocated or no
          longer exists.
        </p>

        <Magnetic>
          <Link
            href="/"
            className="glitch-text group relative flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase text-sm transition-transform hover:scale-105 active:scale-95"
          >
            <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
            Back to Reality
            {/* Decorative Corner */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-lime-400" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-lime-400" />
          </Link>
        </Magnetic>
      </div>

      {/* Floating Background Element (Parallax Decor) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-lime-400/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
