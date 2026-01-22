"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../components/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%", // Starts when the section enters the view
        },
      });

      // Animate the section title
      tl.from(".contact-title", {
        y: 100,
        opacity: 0,
        skewY: 3,
        duration: 1.2,
        ease: "power4.out",
      })
        // Stagger the input lines rising up
        .from(
          ".form-row",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.8",
        );
    },
    { scope: container },
  );

  return (
    <section
      id="contact-section"
      ref={container}
      className="bg-zinc-950 h-screen py-24 px-6 md:px-12 lg:px-24 text-white flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="overflow-hidden mb-16 mt-16">
          <h2 className="contact-title text-5xl md:text-8xl font-bold uppercase tracking-tighter">
            Let&apos;s build <br />
            <span className="text-lime-400 italic">something great</span>
          </h2>
        </div>

        <form
          ref={formRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16"
        >
          {/* Name Field */}
          <div className="form-row flex flex-col gap-4 border-b border-zinc-800 pb-4 focus-within:border-lime-400 transition-colors duration-500">
            <label className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              01 / Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="bg-transparent text-2xl md:text-3xl outline-none placeholder:text-zinc-700"
            />
          </div>

          {/* Email Field */}
          <div className="form-row flex flex-col gap-4 border-b border-zinc-800 pb-4 focus-within:border-lime-400 transition-colors duration-500">
            <label className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              02 / Email
            </label>
            <input
              type="email"
              placeholder="Email Address"
              className="bg-transparent text-2xl md:text-3xl outline-none placeholder:text-zinc-700"
            />
          </div>

          {/* Project Details */}
          <div className="form-row md:col-span-2 flex flex-col gap-4 border-b border-zinc-800 pb-4 focus-within:border-lime-400 transition-colors duration-500">
            <label className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              03 / Message
            </label>
            <textarea
              rows={2}
              placeholder="Tell us about your project"
              className="bg-transparent text-2xl md:text-3xl outline-none placeholder:text-zinc-700 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="form-row md:col-span-2 flex justify-center md:justify-end">
              <Button type="submit">
                <span className="relative z-10">Send Inquiry</span>
              </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
