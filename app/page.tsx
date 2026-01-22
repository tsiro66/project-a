import Hero from "./HeroPage/Hero";
import AnimatedText from "./HeroPage/AnimatedText";
import StickySection from "./HeroPage/StickySection";
import Contact from "./HeroPage/Contact";
import Footer from "./HeroPage/Footer";
import Cards from "./components/Cards";
import About from "./HeroPage/About";

export default function Home() {

  return (
    <main className="relative">
      <Hero />
      <AnimatedText />
      <About />
      <StickySection />
      <Cards />
      <Contact />
      <Footer />
    </main>
  );
}