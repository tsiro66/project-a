import Hero from "./PageComponents/Hero";
import AnimatedText from "./PageComponents/AnimatedText";
import StickySection from "./PageComponents/StickySection";
import Contact from "./PageComponents/Contact";
import Footer from "./PageComponents/Footer";
import Cards from "./PageComponents/Cards";
import FAQ from "./PageComponents/FAQ";

export default function Home() {
  return (
    <main className="relative">
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
