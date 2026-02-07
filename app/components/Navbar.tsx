"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Button from "./Button";
import { MessageCircle } from "lucide-react";
import { useLenis } from "lenis/react"; // 1. Import the hook
import LocaleSwitcher from "./LocaleSwitcher";
import { useAnimationReady } from "../contexts/AnimationContext";
import changeLocaleAction from "../actions/ChangeLocaleAction";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const { canAnimate } = useAnimationReady();
  const lenis = useLenis(); // 2. Initialize the hook
  const bannerRef = useRef(null);
  const navRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Navbar");

  const currentLocaleKey = t("home");

  // 3. Updated Scroll Functions using Lenis
  const scrollToContact = () => {
    if (isOpen) {
      setIsOpen(false);
      // Immediately unlock body so Lenis can calculate position
      document.body.style.overflow = "";
    }

    lenis?.scrollTo("#contact-section", {
      duration: 1.5,
      // Smoother easing for high-end feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    });
  };

  const scrollToHero = () => {
    if (isOpen) {
      setIsOpen(false);
      document.body.style.overflow = "";
    }

    lenis?.scrollTo("#hero-section", {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  // Entry Animation
  useGSAP(
    () => {
      if (!canAnimate) return;

      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power4.out",
          delay: 0.2,
        },
      );

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
    { scope: navRef, dependencies: [canAnimate] },
  );

  // 4. Cleaned Toggle Animation
  useGSAP(
    () => {
      if (!panelRef.current) return;

      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        // Unlock immediately when closing to allow scrolling to start
        document.body.style.overflow = "";
      }

      gsap.to(panelRef.current, {
        maxWidth: isOpen ? "100%" : "48rem",
        height: isOpen ? "85vh" : "3.5rem",
        borderRadius: isOpen ? "1rem" : "0.5rem",
        paddingBottom: isOpen ? "3rem" : "0rem",
        duration: 0.7,
        ease: "expo.inOut",
        force3D: true,
      });
    },
    { dependencies: [isOpen], scope: navRef },
  );

  // Locale Change Animation
  useGSAP(
    () => {
      if (!isOpen) return;
      gsap.fromTo(
        ".nav-item",
        { y: 30, opacity: 0, rotateX: -20 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "expo.out",
          overwrite: "auto",
        },
      );
    },
    { dependencies: [currentLocaleKey, isOpen], scope: navRef },
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 flex flex-col items-center pointer-events-none opacity-0 -translate-y-full"
    >
      <div
        ref={panelRef}
        className="w-full flex flex-col items-center bg-zinc-900 px-4 rounded-lg pointer-events-auto shadow-2xl"
        style={{ willChange: "width, height", transform: "translateZ(0)" }}
      >
        <div className="w-full h-14 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="nav-item flex items-center gap-2 group pointer-events-auto cursor-pointer text-white z-10"
          >
            <div className="relative w-7 h-5 flex flex-col justify-center items-start">
              <span className={`absolute h-px bg-white transition-all duration-300 ${isOpen ? "w-6 rotate-45" : "w-7 -translate-y-1.5 group-hover:w-3"}`}></span>
              <span className={`absolute h-px bg-white transition-all duration-300 ${isOpen ? "w-6 -rotate-45" : "w-7 translate-y-1.5"}`}></span>
            </div>
            <span className="text-xl font-medium hidden md:block font-syne">
              {isOpen ? t("close") : t("menu")}
            </span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 text-white" onClick={scrollToHero}>
            <span className="text-xl md:text-3xl font-syne font-black tracking-wider uppercase pointer-events-auto cursor-pointer">
              FLUX
            </span>
          </div>

          <div onClick={scrollToContact} className="nav-item pointer-events-auto">
            <Button variant="nav" icon={<MessageCircle className="w-4 h-4 md:w-5 md:h-5 ml-2" />}>
              <span>{t("contact")}</span>
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="w-full flex-1 flex flex-col items-center justify-center pointer-events-auto">
            <div key={currentLocaleKey} className="flex flex-col gap-8 text-center" style={{ perspective: "1000px" }}>
              <span onClick={scrollToHero} className="nav-item text-white text-4xl md:text-6xl font-syne font-black uppercase block cursor-pointer">
                {t("home")}
              </span>
              <span className="nav-item text-white text-4xl md:text-6xl font-syne font-black uppercase block cursor-pointer">
                {t("about")}
              </span>
              <span onClick={scrollToContact} className="nav-item text-white text-4xl md:text-6xl font-syne font-black uppercase block cursor-pointer">
                {t("contact")}
              </span>
              <div className="mt-4">
                <LocaleSwitcher changeLocaleAction={changeLocaleAction} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={bannerRef} className={`mt-3 w-full max-w-3xl -z-10 transition-all duration-500 ${isOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        <div className="bg-lime-400 py-1 rounded-lg flex whitespace-nowrap overflow-hidden shadow-2xl">
          <div className="flex animate-marquee shrink-0"><MarqueeContent /></div>
          <div className="flex animate-marquee shrink-0"><MarqueeContent /></div>
        </div>
      </div>
    </nav>
  );
}

function MarqueeContent() {
  return (
    <>
      {["Web Development", "•", "E-commerce", "•", "Digital Marketing", "•"].map((text, i) => (
        <span key={i} className="text-[10px] md:text-xs font-medium uppercase px-6 text-zinc-900">{text}</span>
      ))}
    </>
  );
}