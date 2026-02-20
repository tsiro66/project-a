"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ThankYouContent() {

  useEffect(() => {
    window.gtag("event", "conversion", {
      send_to: "AW-17961934422/9KiFCJ3Q__obENa89fRC",
    });
  }, []);

  return (
    <main className="bg-zinc-950 min-h-screen flex items-center justify-center px-6 text-white">
      <div className="max-w-2xl w-full">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
          Message received
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold uppercase tracking-tighter italic text-lime-400 leading-none">
          Thank you.
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-zinc-400 max-w-lg leading-relaxed">
          We&apos;ll be in touch shortly.
        </p>
        <Link
          href="/"
          className="mt-12 group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-mono text-zinc-500 hover:text-white transition-colors"
        >
          <span className="w-8 h-px bg-zinc-800 group-hover:bg-lime-400 transition-colors" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
