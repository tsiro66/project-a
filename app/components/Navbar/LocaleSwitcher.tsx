"use client";

import changeLocaleAction from "@/app/actions/ChangeLocaleAction";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (locale: "en" | "el") => {
    startTransition(async () => {
      await changeLocaleAction(locale);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-6 font-syne">
      {(["en", "el"] as const).map((cur) => (
        <button
          key={cur}
          onClick={() => handleSwitch(cur)}
          disabled={isPending}
          className={`text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer relative group ${
            currentLocale === cur
              ? "text-lime-400"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          {cur === "en" ? "English" : "Ελληνικα"}
          {currentLocale === cur && (
            <span className="absolute -bottom-1 left-0 w-full h-px bg-lime-400" />
          )}
        </button>
      ))}
    </div>
  );
}