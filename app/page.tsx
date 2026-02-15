import Hero from "./components/Hero/Hero";
import AnimatedText from "./components/Text/AnimatedText";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar/Navbar";

const StickySection = dynamic(() => import("./components/Services/StickySection"));
const Cards = dynamic(() => import("./components/Process/Cards"));
const FAQ = dynamic(() => import("./components/FAQ/FAQ"));
const Contact = dynamic(() => import("./components/Contact/Contact"));
const Footer = dynamic(() => import("./components/Footer"));

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <section className="relative z-20">
        <Hero />
      </section>
      <section className="relative z-20">
        <AnimatedText />
      </section>
      <section className="relative z-20">
        <StickySection />
      </section>
      <section className="relative z-30 [clip-path:inset(0_0_0_0)]">
        <Cards />
      </section>
      <section className="relative z-20">
        <FAQ />
      </section>
      <section className="relative z-20">
        <Contact />
      </section>
      <section className="sticky bottom-0 overflow-hidden z-10">
        <Footer />
      </section>
    </main>
  );
}
