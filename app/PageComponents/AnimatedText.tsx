"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function AnimatedText() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const rawContent = `Η ΕΠΙΧΕΙΡΗΣΗ ΣΟΥ ΔΕΝ ΕΙΝΑΙ TEMPLATE. ΓΙΑΤΙ ΝΑ ΕΙΝΑΙ ΤΟ SITE ΣΟΥ? ΣΤΗ FLUX <span class="text-lime-400">ΚΑΤΑΣΤΡΕΦΟΥΜΕ ΤΟ ΣΥΝΗΘΙΣΜΕΝΟ.</span> 
  DESIGN ΠΟΥ ΣΟΚΑΡΕΙ, ΚΩΔΙΚΑΣ ΠΟΥ ΠΟΥΛΑΕΙ.`;

  useGSAP(
    () => {
      // Δημιουργούμε το SplitText ΕΚΤΟΣ του matchMedia για να είναι έτοιμο
      const split = new SplitText(textRef.current, { type: "words, lines" });
      const words = split.words;

      // Προσθέτουμε GPU acceleration στα words αμέσως
      gsap.set(words, {
        transformPerspective: 1000,
        backfaceVisibility: "hidden",
      });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          if (isDesktop) {
            // DESKTOP: Scrub animation για λέξη-λέξη
            gsap.from(words, {
              y: 40,
              autoAlpha: 0,
              stagger: 1,
              duration: 0.5,
              force3D: true,
              scrollTrigger: {
                trigger: container.current,
                start: "top 50%",
                end: "bottom 100%",
                scrub: true,
              },
            });
          } else {
            gsap.from(words, {
              y: 20,
              autoAlpha: 0,
              stagger: 0.07,
              duration: 0.5,
              ease: "power2.out",
              force3D: true,
              scrollTrigger: {
                trigger: container.current,
                start: "top 30%",
                toggleActions: "play none none reverse",
              },
            });
          }
        },
      );

      return () => split.revert();
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className=" min-h-screen flex items-center justify-center p-10 md:p-30 uppercase bg-zinc-950 text-zinc-100 overflow-hidden"
    >
      <div
        ref={textRef}
        className="text-2xl md:text-4xl lg:text-5xl text-center font-syne font-black leading-tight tracking-tighter"
        style={{ willChange: "transform" }}
        dangerouslySetInnerHTML={{ __html: rawContent }}
      />
    </div>
  );
}
