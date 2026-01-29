import Hero from "./PageComponents/Hero";
import AnimatedText from "./PageComponents/AnimatedText";
import StickySection from "./PageComponents/StickySection";
import Contact from "./PageComponents/Contact";
import Footer from "./PageComponents/Footer";
import Cards from "./PageComponents/Cards";
import About from "./PageComponents/About";
import LightTrail from "./components/LightTrail";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <AnimatedText />
      {/* <About /> */}
      <StickySection />
      <Cards />
      <Contact />
      {/* <div className="h-screen w-full">
        <LightTrail />
      </div> */}
      <Footer />
    </main>
  );
}
