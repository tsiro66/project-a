"use client";
import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import AnimatedText from "./components/AnimatedText";
import StickySection from "./components/StickySection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling while the curtain is down
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  return (
    <main className="relative">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      {/* The Hero and other sections remain in the DOM. 
         The loader slides UP and away, revealing them.
      */}
      <Hero />
      <AnimatedText />
      <StickySection />
      <Contact />
      <Footer />
    </main>
  );
}