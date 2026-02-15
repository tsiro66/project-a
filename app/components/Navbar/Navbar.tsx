"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { MessageCircle } from "lucide-react";
import { useLenis } from "lenis/react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import { MenuButton } from "./MenuButton";
import { NAV_LINKS } from "./nav-data";
import Button from "../Button/Button";
import changeLocaleAction from "@/app/actions/ChangeLocaleAction";
import { Logo } from "./Logo";
import { Marquee } from "./Marquee";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const t = useTranslations("Navbar");
  const lenis = useLenis();

  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const currentLocaleKey = t("home");

  const scrollToSection = (id: string) => {
    if (isOpen) setIsOpen(false);

    lenis?.scrollTo(id, {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  // --- Optimized Animation Orchestration ---
  useGSAP(
    () => {
      // FIX: Set visibility to hidden immediately to prevent flash, then show when starting
      gsap.set(navRef.current, { 
        yPercent: -100, 
        opacity: 0,
        autoAlpha: 1 // This sets visibility to visible once GSAP is ready
      });

      gsap.to(navRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2,
      });

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
    { scope: navRef },
  );

  useGSAP(
    () => {
      if (!panelRef.current) return;

      gsap.to(panelRef.current, {
        maxWidth: isOpen ? "100%" : "48rem",
        height: isOpen ? "auto" : "3.5rem",
        borderRadius: isOpen ? "1rem" : "0.5rem",
        paddingBottom: isOpen ? "3rem" : "0rem",
        duration: 0.7,
        ease: "expo.inOut",
        force3D: true, 
      });

      if (isOpen) {
        gsap.fromTo(
          ".nav-link-item",
          { y: 30, opacity: 0, rotateX: -20 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "expo.out",
            delay: 0.1,
            overwrite: "auto",
          },
        );
      }
    },
    { dependencies: [isOpen, currentLocaleKey], scope: navRef },
  );

  return (
    <nav
      ref={navRef}
      // FIX: Added invisible to prevent the flash before JS loads
      className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 flex flex-col items-center pointer-events-auto invisible"
    >
      <div
        ref={panelRef}
        className="w-full flex flex-col items-center bg-zinc-900 px-4 rounded-lg pointer-events-auto shadow-2xl overflow-hidden"
        style={{ willChange: "width, height, transform" }}
      >
        <div className="w-full h-14 flex items-center justify-between shrink-0">
          <MenuButton
            isOpen={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            label={isOpen ? t("close") : t("menu")}
          />

          <Logo onClick={() => scrollToSection("#hero-section")} />

          <div
            onClick={() => scrollToSection("#contact-section")}
            className="pointer-events-auto"
          >
            <Button
              variant="nav"
              icon={<MessageCircle className="w-4 h-4 md:w-5 md:h-5 ml-2" />}
            >
              <span>{t("contact")}</span>
            </Button>
          </div>
        </div>

        {/* Expanded Navigation Menu */}
        {/* FIX: Use display: none (hidden) when not open to ensure it never "flashes" expanded */}
        <div
          className={`w-full flex-1 flex flex-col ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible h-0 hidden"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full h-full pt-12 px-4 md:px-12">
            <div className="flex flex-col gap-4 text-left border-r border-zinc-800/50">
              <p className="text-zinc-500 font-mono text-xs uppercase mb-4 tracking-widest nav-link-item">
                01 / Menu
              </p>
              {NAV_LINKS.map((link) => (
                <span
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="nav-link-item text-white text-3xl md:text-5xl font-syne font-bold block cursor-pointer hover:text-lime-400 transition-colors uppercase leading-none"
                >
                  {t(link.label)}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-4 text-left border-r border-zinc-800/50">
              <p className="text-zinc-500 font-mono text-xs uppercase mb-4 tracking-widest nav-link-item">
                02 / Info
              </p>
              <span className="nav-link-item text-zinc-400 text-xl font-syne hover:text-white cursor-pointer transition-colors">
                FAQ
              </span>
              <span className="nav-link-item text-zinc-400 text-xl font-syne hover:text-white cursor-pointer transition-colors">
                Privacy Policy
              </span>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center bg-zinc-800/20 rounded-xl p-8 nav-link-item">
              <p className="text-zinc-600 font-syne italic text-sm">
                Illustration Placeholder
              </p>
            </div>
          </div>

          <div className="nav-link-item w-full py-8 mt-auto flex justify-center border-t border-zinc-800/50">
            <LocaleSwitcher changeLocaleAction={changeLocaleAction} />
          </div>
        </div>
      </div>

      <div
        ref={bannerRef}
        className={`mt-3 w-full max-w-3xl -z-10 transition-all duration-500 ${
          isOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <Marquee />
      </div>
    </nav>
  );
}