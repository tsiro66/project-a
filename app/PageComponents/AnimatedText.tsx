"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registering inside the component file is safe
gsap.registerPlugin(ScrollTrigger, SplitText);

export default function AnimatedText() {
  const container = useRef(null);
  const textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum atque, officia dolores itaque neque labore vero possimus facere autem facilis quia officiis, eaque laborum quidem, sint soluta voluptas aut velit.";

  useGSAP(() => {
    // 1. Initialize SplitText scoped to this component
    const childSplit = new SplitText(".split-target", {
      type: "words,chars",
      wordsClass: "word-wrapper",
      charsClass: "word",
    });

    // 2. Animate
    gsap.fromTo(
      childSplit.chars,
      { opacity: 0.1, y: 10 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current, // Use the ref directly
          start: "top 30%",
          end: "+=500",
          scrub: 1.5,
        },
      }
    );
  }, { scope: container }); // Scoping is key!

  return (
    <div ref={container} className="min-h-screen flex items-center justify-center p-10 md:p-30 uppercase bg-zinc-200 text-black">
      <div className="text-2xl md:text-4xl lg:text-6xl text-center split-target font-mono">
        {textContent}
      </div>
    </div>
  );
}