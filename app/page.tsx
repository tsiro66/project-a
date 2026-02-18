import dynamic from "next/dynamic";
import { getLocale, getTranslations } from "next-intl/server";

const StickySection = dynamic(() => import("./components/Services/StickySection"));
const Cards = dynamic(() => import("./components/Process/Cards"));
const FAQ = dynamic(() => import("./components/FAQ/FAQ"));
const Contact = dynamic(() => import("./components/Contact/Contact"));
const Footer = dynamic(() => import("./components/Footer"));
const Hero = dynamic(() => import("./components/Hero/Hero"))
const Navbar = dynamic(() => import("./components/Navbar/Navbar"))
const AnimatedText = dynamic(() => import("./components/Text/AnimatedText"))


export default async function Home() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <main className="relative">
    <Navbar section={t.raw('Navbar')} currentLocale={locale} />
      <section className="relative z-20">
        <Hero section={t.raw('Hero')} />
      </section>
      <section className="relative z-20">
        <AnimatedText section={t.raw('AnimatedText')} />
      </section>
      <section className="relative z-20">
        <StickySection section={t.raw('StickySection')} />
      </section>
      <section className="relative z-30 [clip-path:inset(0_0_0_0)]">
        <Cards section={t.raw('Cards')} />
      </section>
      <section className="relative z-20">
        <FAQ section={t.raw('FAQ')} />
      </section>
      <section className="relative z-20">
        <Contact section={t.raw('Contact')} />
      </section>
      <section className="sticky bottom-0 overflow-hidden z-10">
        <Footer section={t.raw('Footer')} />
      </section>
    </main>
  );
}