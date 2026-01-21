"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => onComplete(),
    });

    // 1. Animate the text entrance and exit
    tl.from(".loader-text", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power3.out",
    })
    .to(".loader-text", {
      y: -40,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power3.in",
    });

    // 2. The Organic Reveal
    // We animate the "d" attribute of the path to flatten the curve as it lifts
    const curveValue = 300; // How deep the curve starts
    
    tl.to(pathRef.current, {
      attr: { d: `M0 0 L${window.innerWidth} 0 L${window.innerWidth} ${window.innerHeight} Q${window.innerWidth/2} ${window.innerHeight} 0 ${window.innerHeight} L0 0` },
      duration: 0.1, // Reset path
    })
    .to(container.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
    })
    .to(pathRef.current, {
      attr: { d: `M0 0 L${window.innerWidth} 0 L${window.innerWidth} ${window.innerHeight} Q${window.innerWidth/2} ${window.innerHeight + curveValue} 0 ${window.innerHeight} L0 0` },
      duration: 0.6,
      ease: "power2.in",
    }, "-=1.2") // Start stretching as it begins to lift
    .to(pathRef.current, {
      attr: { d: `M0 0 L${window.innerWidth} 0 L${window.innerWidth} ${window.innerHeight} Q${window.innerWidth/2} ${window.innerHeight} 0 ${window.innerHeight} L0 0` },
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.6"); // Flatten out as it finishes

  }, { scope: container });

  return (
    <div 
      ref={container} 
      className="fixed inset-0 z-999 flex items-center justify-center pointer-events-none bg-zinc-950 touch-none"
    >
      {/* The SVG Background */}
      <svg 
        ref={svgRef}
        className="absolute top-0 w-full h-[110vh] fill-zinc-950 transition-none"
      >
        <path ref={pathRef} />
      </svg>

      <div className="relative z-10 overflow-hidden">
        <h1 className="loader-text font-black text-4xl md:text-6xl uppercase tracking-tighter text-lime-400">
          loading
        </h1>
      </div>
    </div>
  );
}