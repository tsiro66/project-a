"use client";

import { Locale, useLocale } from "next-intl";

type Props = {
  changeLocaleAction: (locale: Locale) => Promise<void>;
};

export default function LocaleSwitcher({ changeLocaleAction }: Props) {
  const locale = useLocale();

  return (
    <div className="flex gap-6 font-syne">
      {["en", "el"].map((cur) => (
        <button
          key={cur}
          onClick={() => changeLocaleAction(cur as Locale)}
          className={`text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer relative group ${
            locale === cur
              ? "text-lime-400"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          {cur === "en" ? "English" : "Ελληνικά"}
          {/* Subtle underline for the active locale */}
          {locale === cur && (
            <span className="absolute -bottom-1 left-0 w-full h-px bg-lime-400" />
          )}
        </button>
      ))}
    </div>
  );
}