"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

const WORDS = ["DESIGNING...", "CODING...", "EVOLVING...", "F L U X"];
const CHARS = "!<>-_\\/[]{}—=+*^?#________";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => onComplete(),
    });

    // 1. Shuffle Logic για κάθε λέξη
    WORDS.forEach((word, index) => {
      const isLast = index === WORDS.length - 1;
      
      tl.to(textRef.current, {
        duration: isLast ? 0.8 : 0.4, // Η τελευταία λέξη μένει λίγο παραπάνω
        onStart: () => {
          // Pulse effect στο χρώμα
          gsap.to(textRef.current, {
            opacity: 0.7,
            repeat: 1,
            yoyo: true,
            duration: 0.1,
          });
        },
        onUpdate: function() {
          // Εδώ γίνεται το "μαγικό" shuffle
          const progress = this.progress();
          const scrambled = word
            .split("")
            .map((char, i) => {
              if (progress > i / word.length) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("");
          
          if (textRef.current) textRef.current.innerText = scrambled;
        },
        ease: "none",
        delay: index === 0 ? 0.5 : 0.1,
      });

      // Μικρή παύση ανάμεσα στις λέξεις (εκτός από την τελευταία)
      if (!isLast) {
        tl.to({}, { duration: 0.2 });
      }
    });

    // 2. Exit Animation (Raw & Fast)
    tl.to(container.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "expo.inOut",
      delay: 0.5,
    });

  }, { scope: container });

  return (
    <div 
      ref={container} 
      className="fixed inset-0 z-999 flex items-center justify-center bg-zinc-950 touch-none pointer-events-auto"
    >
      <div className="relative overflow-hidden px-10">
        <h1 
          ref={textRef}
          className="font-black font-syne text-3xl md:text-8xl uppercase tracking-tighter text-lime-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]"
        >
          {/* Αρχικό κείμενο κενό ή η πρώτη λέξη */}
          _
        </h1>
      </div>
      
      {/* Προαιρετικό: Ένα "scanline" εφέ για περισσότερο raw vibe */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />
    </div>
  );
}