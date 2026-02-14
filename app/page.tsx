import Hero from "./PageComponents/Hero";
import AnimatedText from "./PageComponents/AnimatedText";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar/Navbar";

const StickySection = dynamic(() => import("./PageComponents/StickySection"));
const Cards = dynamic(() => import("./PageComponents/Cards"));
const FAQ = dynamic(() => import("./PageComponents/FAQ"));
const Contact = dynamic(() => import("./PageComponents/Contact"));
const Footer = dynamic(() => import("./PageComponents/Footer"));

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
