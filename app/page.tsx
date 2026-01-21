import Hero from "./HeroPage/Hero";
import AnimatedText from "./HeroPage/AnimatedText";
import StickySection from "./HeroPage/StickySection";
import Contact from "./HeroPage/Contact";
import Footer from "./HeroPage/Footer";

export default function Home() {

  return (
    <main className="relative">
      <Hero />
      <AnimatedText />
      <StickySection />
      <Contact />
      <Footer />
    </main>
  );
}