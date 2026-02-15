"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function FAQ() {
  const t = useTranslations("FAQ");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const container = useRef<HTMLDivElement>(null);

  // We use raw to get the array of items from JSON
  const items = t.raw("items") as { q: string; a: string }[];

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useGSAP(
    () => {
      // Animate the answers when activeIndex changes
      items.forEach((_, i) => {
        const answer = document.querySelector(`#answer-${i}`);
        if (activeIndex === i) {
          gsap.to(answer, {
            height: "auto",
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        } else {
          gsap.to(answer, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          });
        }
      });
    },
    { dependencies: [activeIndex], scope: container },
  );

  return (
    <section
      id="faq-section"
      ref={container}
      className="bg-zinc-950 text-zinc-100 py-24 px-5 md:px-20 border-t border-zinc-800"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="font-syne font-black text-4xl md:text-6xl uppercase tracking-tighter mb-16">
          {t("title")}
        </h2>

        <div className="flex flex-col">
          {items.map((item, i) => (
            <div
              key={i}
              className="border-b border-zinc-800 group cursor-pointer overflow-hidden"
              onClick={() => toggle(i)}
            >
              <div className="flex items-center justify-between py-8">
                <span className="text-zinc-500 font-mono text-sm mr-6">
                  0{i + 1}
                </span>
                <h3
                  className={`flex-1 font-syne font-bold text-xl md:text-2xl uppercase transition-colors duration-300 ${activeIndex === i ? "text-lime-400" : "text-zinc-100"}`}
                >
                  {item.q}
                </h3>
                <div className="flex items-center justify-center w-6 h-6 ml-4 relative">
                  {/* Horizontal line */}
                  <div
                    className={`absolute w-full h-0.5 bg-zinc-500 transition-transform duration-500 
    ${activeIndex === i ? "rotate-180" : ""}`}
                  />
                  {/* Vertical line */}
                  <div
                    className={`absolute h-full w-0.5 bg-zinc-500 transition-all duration-500 
    ${activeIndex === i ? "rotate-90 opacity-0" : ""}`}
                  />
                </div>
              </div>

              <div id={`answer-${i}`} className="h-0 opacity-0 overflow-hidden">
                <p className="pb-8 text-zinc-400 font-inter text-lg max-w-2xl leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
