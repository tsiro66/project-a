"use client";
import { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useLenis } from "lenis/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

type FooterSection = {
  cyclingWords: string[];
  navTitle: string;
  navLinks: {
    home: string;
    services: string;
    process: string;
    contact: string;
  };
  contactTitle: string;
  availabilityTitle: string;
  availableStatus: string;
  bigTextStart: string;
  builtToImpress: string;
};

export default function Footer({ section }: { section: FooterSection }) {
  const footerRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  const words = section.cyclingWords;
  
  const longestWord = useMemo(() => {
    return words.reduce(
      (a: string, b: string) => (a.length > b.length ? a : b),
      "",
    );
  }, [words]);

  const navLinks = [
    { label: section.navLinks.home, id: "#hero-section" },
    { label: section.navLinks.services, id: "#services-section" },
    { label: section.navLinks.process, id: "#process-section" },
    { label: section.navLinks.contact, id: "#contact-section" },
  ];

  const scrollToSection = (id: string) => {
    lenis?.scrollTo(id, { duration: 1.5 });
  };

  useGSAP(
    () => {
      gsap.killTweensOf(".footer-link-item");
      gsap.killTweensOf(wordRef.current);

      gsap.fromTo(
        ".footer-link-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        },
      );

      gsap.fromTo(
        ".footer-big-text",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        },
      );

      const tl = gsap.timeline({ repeat: -1 });
      tl.set(wordRef.current, { text: "" });

      words.forEach((word: string) => {
        tl.to(wordRef.current, { duration: 0.6, text: word, ease: "none" })
          .to({}, { duration: 2 })
          .to(wordRef.current, { duration: 0.3, text: "", ease: "none" });
      });

      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: footerRef, dependencies: [words] },
  );

  return (
    <footer
      ref={footerRef}
      className="relative isolate bg-lime-400 text-zinc-950 px-6 py-10 md:py-20 md:px-12 lg:px-24 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-4 border-t border-zinc-950/20 pt-8 md:pt-12 w-full">
        <div className="flex flex-col gap-2 md:gap-4 h-full">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">
            {section.navTitle}
          </p>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <span
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="footer-link-item inline-block text-lg md:text-xl font-bold hover:italic transition-all w-fit cursor-pointer select-none"
              >
                {link.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-4 h-full">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">
            {section.contactTitle}
          </p>
          <div className="flex flex-col gap-1">
            <a
              href="mailto:info@flux-web.com"
              className="footer-link-item inline-block text-lg md:text-xl font-bold hover:italic transition-all w-fit underline decoration-zinc-950/30 underline-offset-4"
            >
              info@flux-web.com
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-4 col-span-2 md:col-span-1 border-t border-zinc-950/10 pt-6 md:pt-0 md:border-none">
          <p className="font-mono text-[10px] md:text-xs tracking-widest opacity-60">
            {section.availabilityTitle}
          </p>
          <div className="flex items-center gap-2 footer-link-item">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-950 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-950" />
            </span>
            <p className="text-lg md:text-xl font-bold tracking-tight">
              {section.availableStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Main Big Text */}
      <div className="mt-12 mb-8 md:mt-24 md:mb-12">
        <h2 className="footer-big-text text-2xl sm:text-5xl md:text-[6vw] leading-[0.85] font-black uppercase tracking-tighter">
          {section.bigTextStart}
          <br className="hidden md:block" />
          <span className="inline-grid align-bottom">
            <span className="invisible row-start-1 col-start-1 pointer-events-none select-none">
              {longestWord}
            </span>
            <span
              ref={wordRef}
              className="row-start-1 col-start-1 text-zinc-950"
            >
              {words[0]}
            </span>
          </span>
        </h2>
      </div>

      {/* Bottom Copyright */}
      <div className="flex justify-between items-center pt-6 border-t border-zinc-950/20">
        <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">
          © {new Date().getFullYear()} FLUX
        </div>
        <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">
          {section.builtToImpress}
        </div>
      </div>
    </footer>
  );
}
