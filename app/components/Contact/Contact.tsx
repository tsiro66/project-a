"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import Button from "../Button/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Contact");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initial Form Entrance Animation
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      });

      tl.from(".contact-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      }).from(
        ".form-row",
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.6",
      );
    },
    { scope: container },
  );

  // Success Message Entrance Animation
  useGSAP(
    () => {
      if (isSubmitted) {
        gsap.from(".success-content > *", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power4.out",
        });
      }
    },
    { scope: successRef, dependencies: [isSubmitted] },
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSubmitted(true);
        formRef.current?.reset();
      } else {
        const errorData = await res.json();
        console.error("Server Error:", errorData);
        // Minimal fallback for errors
        alert("Error sending message. Please try again.");
      }
    } catch (err) {
      console.error("Connection Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact-section"
      ref={container}
      className="bg-zinc-950 min-h-screen py-12 md:py-24 px-6 md:px-12 lg:px-24 text-white flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* State 1: Success Message */}
        {isSubmitted ? (
          <div ref={successRef} className="success-content py-20">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-bold uppercase tracking-tighter italic text-lime-400">
              {t("successTitle") || "Success"}
            </h2>
            <p className="mt-6 text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed">
              {t("successMessage") || "Your message has been sent. We'll be in touch shortly."}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-12 group flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-mono text-zinc-500 hover:text-white transition-colors"
            >
              <span className="w-8 h-px bg-zinc-800 group-hover:bg-lime-400 transition-colors" />
              {t("sendAnother") || "Send another message"}
            </button>
          </div>
        ) : (
          /* State 2: The Form */
          <>
            <div className="overflow-hidden mb-12">
              <h2 className="contact-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.9] break-words">
                {t("title")} <br />
                <span className="text-lime-400 italic text-[0.85em] highlighted-text">
                  {t("subtitle")}
                </span>
              </h2>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
            >
              {/* 01 / Name */}
              <div className="form-row flex flex-col gap-2 border-b border-zinc-800 pb-2 focus-within:border-lime-400 transition-colors duration-500">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  01 / {t("labelName")}
                </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder={t("placeholderName")}
                  className="bg-transparent text-xl md:text-2xl outline-none placeholder:text-zinc-800"
                  required
                />
              </div>

              {/* 02 / Email */}
              <div className="form-row flex flex-col gap-2 border-b border-zinc-800 pb-2 focus-within:border-lime-400 transition-colors duration-500">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  02 / {t("labelEmail")}
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t("placeholderEmail")}
                  className="bg-transparent text-xl md:text-2xl outline-none placeholder:text-zinc-800"
                  required
                />
              </div>

              {/* 03 / Phone */}
              <div className="form-row flex flex-col gap-2 border-b border-zinc-800 pb-2 focus-within:border-lime-400 transition-colors duration-500">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  03 / {t("labelPhone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder={t("placeholderPhone")}
                  className="bg-transparent text-xl md:text-2xl outline-none placeholder:text-zinc-800"
                  required
                />
              </div>

              {/* 04 / Budget Range */}
              <div className="form-row flex flex-col gap-3 border-b border-zinc-800 pb-4">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  04 / {t("labelBudget")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {["< 1k", "1k - 5k", "5k - 10k", "10k+"].map((level) => (
                    <label key={level} className="group cursor-pointer">
                      <input
                        type="radio"
                        name="budget"
                        value={level}
                        className="hidden peer"
                      />
                      <span className="inline-block text-[11px] uppercase font-medium border border-zinc-800 px-3 py-1 rounded-full peer-checked:bg-lime-400 peer-checked:text-black peer-checked:border-lime-400 transition-all duration-300">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 05 / Message */}
              <div className="form-row md:col-span-2 flex flex-col gap-2 border-b border-zinc-800 pb-2 focus-within:border-lime-400 transition-colors duration-500">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  05 / {t("labelMessage")}
                </label>
                <textarea
                  name="message"
                  rows={1}
                  placeholder={t("placeholderMessage")}
                  className="bg-transparent text-xl md:text-2xl outline-none placeholder:text-zinc-800 resize-none overflow-hidden"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              </div>

              {/* Submit */}
              <div className="form-row md:col-span-2 flex justify-end mt-4">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 px-10 flex items-center justify-center min-w-30">
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                    ) : (
                      t("button")
                    )}
                  </span>
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}