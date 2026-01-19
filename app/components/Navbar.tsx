"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const bannerRef = useRef(null);
  const navRef = useRef(null); // Ref for the entire navbar container
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Initial Entry Animation
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
      });

      // 2. Scroll Animation for the Banner
      gsap.to(bannerRef.current, {
        y: -50,
        duration: 0.4,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "500px top",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: navRef },
  );

  useGSAP(
    () => {
      if (!panelRef.current) return;

      gsap.to(panelRef.current, {
        maxWidth: isOpen ? "calc(100vw - 3rem)" : "48rem",
        height: isOpen ? "calc(100vh - 10rem)" : "3.5rem", // Standard bar height when closed
        borderRadius: isOpen ? "1rem" : "0.5rem",
        paddingBottom: isOpen ? "3rem" : "0rem",
        duration: 0.9,
        ease: "power4.inOut",
      });

      document.body.style.overflow = isOpen ? "hidden" : "auto";
    },
    { dependencies: [isOpen], scope: navRef },
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 flex flex-col items-center pointer-events-none"
    >
      {/* 1. Main Navbar Bar */}
      <div
        ref={panelRef}
        className="w-full max-w-3xl flex flex-col items-center bg-zinc-900 px-6 overflow-hidden rounded-lg"
      >
        {/* Header Row: This keeps items at the top during expansion */}
        <div className="w-full h-14 flex items-center justify-between shrink-0">
          {/* Left: Menu Button */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 group pointer-events-auto cursor-pointer text-white z-10"
          >
            {/* Container for the lines needs a relative position and specific height */}
            <div className="relative w-7 h-5 flex flex-col justify-center items-center">
              <span
                className={`absolute h-px bg-white transition-all duration-300 
      ${isOpen ? "w-6 rotate-45" : "w-7 -translate-y-1.5 group-hover:w-3"}`}
              ></span>

              <span
                className={`absolute h-px bg-white transition-all duration-300 
      ${isOpen ? "w-6 -rotate-45" : "w-7 translate-y-1.5"}`}
              ></span>
            </div>

            <span className="text-xl font-medium hidden md:block">
              {isOpen ? "Close" : "Menu"}
            </span>
          </button>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 text-white">
            <span className="text-2xl md:text-3xl font-bold tracking-tighter uppercase">
              Tsiro
            </span>
          </div>

          {/* Right: Action Button */}
          <Magnetic>
            <button
              className="group bg-lime-400 text-zinc-900 px-3 md:px-5 h-9 rounded-3xl text-sm md:text-lg font-medium 
          hover:rounded-sm transition-all duration-300 ease-in-out pointer-events-auto cursor-pointer flex items-center overflow-hidden"
            >
              Contact
              <div className="flex items-center w-0 h-6 opacity-0 group-hover:w-8 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 md:w-5 md:h-5 ml-2"
                >
                  <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                </svg>
              </div>
            </button>
          </Magnetic>
        </div>

        {/* Placeholder for Expanded Content */}
        {isOpen && (
          <div className="w-full flex-1 flex flex-col items-center justify-center pointer-events-auto">
            {/* You can place your menu links here */}
          </div>
        )}
      </div>

      {/* 2. Floating Ticker (Separate Element) */}
      <div
        ref={bannerRef}
        className={`mt-3 w-full max-w-3xl -z-10 transition-opacity duration-500 ${isOpen ? "opacity-0" : "opacity-100"}`}
      >
        <div className="bg-lime-400 py-1 rounded-lg flex whitespace-nowrap overflow-hidden">
          <div className="flex animate-marquee shrink-0">
            <MarqueeContent />
          </div>
          <div className="flex animate-marquee shrink-0">
            <MarqueeContent />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MarqueeContent() {
  return (
    <>
      <span className="text-[10px] md:text-xs font-medium uppercase px-6 text-zinc-900">
        Available for projects
      </span>
      <span className="text-[10px] md:text-xs font-medium uppercase px-6 text-zinc-900">
        •
      </span>
      <span className="text-[10px] md:text-xs font-medium uppercase px-6 text-zinc-900">
        Open to work
      </span>
      <span className="text-[10px] md:text-xs font-medium uppercase px-6 text-zinc-900">
        •
      </span>
      <span className="text-[10px] md:text-xs font-medium uppercase px-6 text-zinc-900">
        Design & Development
      </span>
      <span className="text-[10px] md:text-xs font-medium uppercase px-6 text-zinc-900">
        •
      </span>
    </>
  );
}
