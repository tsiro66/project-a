import Hero from "./PageComponents/Hero";
import AnimatedText from "./PageComponents/AnimatedText";
import StickySection from "./PageComponents/StickySection";
import Contact from "./PageComponents/Contact";
import Footer from "./PageComponents/Footer";
import Cards from "./components/Cards";
import About from "./PageComponents/About";

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