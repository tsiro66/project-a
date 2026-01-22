"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "../components/Button";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const container = useRef(null);

  useGSAP(() => {
  // Specify HTMLElement here
  const sections = gsap.utils.toArray<HTMLElement>("section");

  sections.forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 20,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
}, { scope: container });
  return (
    <main ref={container} className="bg-background text-foreground min-h-screen">
      
      {/* 1. HERO SECTION: MASSIVE TYPOGRAPHY */}
      <section className="px-4 md:px-10 pt-32 pb-20 border-b border-white/10">
        <h1 className="text-[14vw] md:text-[10vw] leading-[0.9] font-medium uppercase tracking-tighter">
          Lorem ipsum <br />
          <span className="italic font-mono font-normal text-zinc-500 lowercase">dolor sit</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 mt-12 gap-6">
          <div className="md:col-span-4">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-lime-400">/ Info</p>
          </div>
          <div className="md:col-span-8">
            <p className="text-xl md:text-3xl font-light leading-snug text-zinc-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </section>

      {/* 2. STATS/NUMBERS: THE GRID */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-b border-white/10">
        {[
          { label: "Founded", val: "2026" },
          { label: "Projects", val: "12+" },
          { label: "Status", val: "Available" },
          { label: "Location", val: "Global" },
        ].map((stat, i) => (
          <div key={i} className="p-6 md:p-10 border-r border-white/10 last:border-r-0 flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">{stat.label}</span>
            <span className="text-2xl font-mono">{stat.val}</span>
          </div>
        ))}
      </section>

      {/* 3. CORE CONTENT: SPLIT LAYOUT */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-white/10">
        <div className="p-6 md:p-20 border-b md:border-b-0 md:border-r border-white/10">
          <h2 className="text-3xl uppercase font-semibold mb-10">Lorem Ipsum</h2>
          <p className="text-zinc-400 leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
        </div>
        <div className="p-6 md:p-20 flex flex-col justify-between">
          <div className="space-y-4">
            {["Design", "Motion", "Code"].map((item) => (
              <div key={item} className="flex justify-between items-center border-b border-white/5 py-4">
                <span className="uppercase tracking-widest text-sm italic">{item}</span>
                <span className="text-xs font-mono text-zinc-600">01—03</span>
              </div>
            ))}
          </div>
          <div className="mt-20 aspect-video bg-zinc-900 rounded-sm relative overflow-hidden">
             {/* Placeholder for visual element */}
             <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.5em] text-zinc-700">
                Media_Asset
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}