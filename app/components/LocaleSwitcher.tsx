"use client";

import { Locale, useLocale } from "next-intl";

type Props = {
  changeLocaleAction: (locale: Locale) => Promise<void>;
};

export default function LocaleSwitcher({ changeLocaleAction }: Props) {
  const locale = useLocale();

  return (
    <div className="flex justify-center gap-2 text-2xl font-bold font-syne ">
      {["en", "el"].map((cur) => (
        <button
          key={cur}
          onClick={() => changeLocaleAction(cur as Locale)}
          className={`text-white uppercase transition-colors duration-300 cursor-pointer px-2 py-1 ${
            locale === cur
              ? "bg-lime-400 rounded text-zinc-900"
              : " hover:text-lime-400"
          }`}
        >
          {cur.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
