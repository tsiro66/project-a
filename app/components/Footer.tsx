"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {

      gsap.from(".footer-link", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          // Change '95%' to 'bottom' to trigger earlier
          start: "top bottom-=50px",
          toggleActions: "play none none none",
          once: true, // Animation only happens once
        },
        // This removes the opacity:0 style after the animation completes
        onComplete: () => {
          gsap.set(".footer-link", { clearProps: "all" });
        },
      });

      gsap.from(".footer-big-text", {
        y: 60,
        skewY: 2,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
      });

      // 2. Text Cycling Logic
      const words = ["YOURSELF", "EVERYONE", "US"];
      const mainTimeline = gsap.timeline({
        repeat: -1,
        delay: 2,
      });

      words.forEach((word) => {
        mainTimeline
          .to(wordRef.current, {
            duration: 0.7,
            text: word,
            ease: "none",
          })
          .to({}, { duration: 1.5 });
      });
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="relative bg-lime-400 text-zinc-950 px-6 py-10 md:py-20 md:px-12 lg:px-24 flex flex-col justify-between overflow-hidden"
    >
      {/* Grid Layout Fix: Added 'w-full' and ensured explicit heights aren't cutting off content */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-4 border-t border-zinc-950/20 pt-8 md:pt-12 w-full">
        {/* Nav Column */}
        <div className="flex flex-col gap-2 md:gap-4 h-full">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">
            01 / Nav
          </p>
          <div className="flex flex-col gap-1">
            {["Work", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="footer-link inline-block text-lg md:text-xl font-bold hover:italic transition-all w-fit"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Socials Column */}
        <div className="flex flex-col gap-2 md:gap-4 h-full">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">
            02 / Socials
          </p>
          <div className="flex flex-col gap-1">
            {["Instagram", "Twitter", "LinkedIn"].map((item) => (
              <a
                key={item}
                href="#"
                className="footer-link inline-block text-lg md:text-xl font-bold hover:italic transition-all w-fit"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Location Column */}
        <div className="flex flex-col gap-2 md:gap-4 col-span-2 md:col-span-1 border-t border-zinc-950/10 pt-6 md:pt-0 md:border-none">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">
            03 / Location
          </p>
          <p className="footer-link text-lg md:text-xl font-bold">
            Patras, GR{" "}
            <span className="hidden md:inline">— 38° 14&apos; N</span>
          </p>
        </div>
      </div>

      <div className="mt-12 mb-8 md:mt-24 md:mb-12">
        <h2 className="footer-big-text text-4xl sm:text-5xl md:text-9xl leading-[0.9] font-black uppercase tracking-tighter">
          Impress{" "}
          <span ref={wordRef} className="italic md:pr-4">
            US
          </span>{" "}
          <br className="md:hidden" /> with your ideas
        </h2>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-zinc-950/20">
        <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">
          © {new Date().getFullYear()}
        </div>
        <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">
          Built to Impress
        </div>
      </div>
    </footer>
  );
}
