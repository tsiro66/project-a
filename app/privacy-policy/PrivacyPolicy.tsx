/* eslint-disable react/jsx-no-comment-textnodes */
// PrivacyPolicy.tsx
import { MoveLeft, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import LocaleSwitcher from "../components/Navbar/LocaleSwitcher";

type PrivacySection = {
  title: string;
  content: string;
  list?: string[];
};

type PrivacyContent = {
  back: string;
  title1: string;
  title2: string;
  lastUpdated: string;
  date: string;
  summaryTitle: string;
  summaryText: string;
  summaryPoints: string[];
  sections: PrivacySection[];
  contactTitle: string;
  contactText: string;
  address: string;
  switchLanguage: string;
};

export default async function PrivacyPolicy() {
  const t = await getTranslations('Privacy');
  const locale = await getLocale();
  const section = t.raw('') as unknown as PrivacyContent;

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono py-20 px-6 md:px-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lime-400 hover:text-white transition-colors mb-12 uppercase text-sm tracking-widest"
        >
          <MoveLeft size={16} /> {section.back}
        </Link>

        <h1 className="text-5xl md:text-7xl font-black font-syne text-white uppercase tracking-tighter mb-4">
          {section.title1} <br />
          <span className="text-lime-400 italic font-normal">{section.title2}</span>
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs">
          {section.lastUpdated} // {section.date}
        </p>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto border border-zinc-800 bg-zinc-900/30 p-8 md:p-12 backdrop-blur-sm">

        {/* Summary Box */}
        <div className="mb-16 border border-lime-400/30 bg-lime-400/5 p-6 rounded-sm">
          <h2 className="text-lime-400 uppercase font-bold mb-4 flex items-center gap-2">
            <ShieldCheck size={18} /> {section.summaryTitle}
          </h2>
          <p className="text-sm leading-relaxed mb-4">{section.summaryText}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs uppercase tracking-tight text-zinc-400">
            {section.summaryPoints.map((point, i) => (
              <li key={i}>• {point}</li>
            ))}
          </ul>
        </div>

        <div className="prose prose-invert prose-lime max-w-none prose-h2:font-syne prose-h2:uppercase prose-h2:tracking-tight prose-h2:text-white prose-a:text-lime-400">

          {/* Dynamic Legal Sections */}
          {section.sections.map((item, index) => (
            <section key={index} className="mb-12">
              <h2 className="text-xl border-b border-zinc-800 pb-4 mb-6 flex items-center gap-3">
                <span className="text-lime-400 text-sm font-mono">0{index + 1}.</span> {item.title}
              </h2>
              <p className="whitespace-pre-line">{item.content}</p>
              {item.list && (
                <ul className="list-disc pl-5 mt-4 space-y-2 text-sm">
                  {item.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Contact Section */}
          <section className="mt-20 pt-10 border-t border-zinc-800">
            <h2 className="text-xl border-b border-zinc-800 pb-4 mb-6 flex items-center gap-3">
              <span className="text-lime-400 text-sm font-mono">06.</span> {section.contactTitle}
            </h2>
            <p className="mb-8">{section.contactText}</p>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:info@flux-web.com"
                className="inline-flex items-center justify-center gap-2 border border-lime-400 px-8 py-4 text-lime-400 hover:bg-lime-400 hover:text-black transition-all font-bold uppercase tracking-widest text-sm"
              >
                info@flux-web.com <ExternalLink size={14} />
              </a>
              <address className="not-italic text-xs text-zinc-500 text-center uppercase tracking-widest">
                Flux <br /> {section.address}
              </address>
            </div>
          </section>
        </div>

        {/* Locale Switcher */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">{section.switchLanguage}</p>
          <LocaleSwitcher currentLocale={locale} />
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-4xl mx-auto mt-20 text-center border-t border-zinc-900 pt-10 opacity-30 flex justify-center items-center gap-4">
        <ShieldCheck size={20} />
        <span className="text-xs uppercase tracking-widest">Secure Infrastructure // Flux 2026</span>
      </div>
    </div>
  );
}