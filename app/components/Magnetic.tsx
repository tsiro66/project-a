"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Magnetic({ children }: { children: React.ReactNode }) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = triggerRef.current;
      const content = contentRef.current;

      if (!element) return;

      const xTo = gsap.quickTo(element, "x", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
      const yTo = gsap.quickTo(element, "y", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });

      const mm = gsap.matchMedia();

      // Ενεργοποίηση ΜΟΝΟ για οθόνες μεγαλύτερες από 1024px (Desktop)
      mm.add("(min-width: 1024px)", () => {
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { height, width, left, top } = element.getBoundingClientRect();
          const x = clientX - (left + width / 2);
          const y = clientY - (top + height / 2);

          xTo(x * 0.5);
          yTo(y * 0.5);
        };

        const handleMouseLeave = () => {
          xTo(0);
          yTo(0);
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      });

      // Το matchMedia καθαρίζει αυτόματα τα πάντα στο revert
      return () => mm.revert();
    },
    { scope: triggerRef },
  );

  return (
    <div ref={triggerRef} className="inline-block p-10 -m-10">
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
