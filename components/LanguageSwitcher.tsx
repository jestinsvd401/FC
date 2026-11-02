"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { LOCALES, LOCALE_LABELS } from "@/types/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, dictionary } = useLanguage();

  return (
    <label className="flex min-h-12 items-center gap-2">
      <span className="sr-only">{dictionary.language}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
        className="min-h-12 w-[7.5rem] cursor-pointer rounded-xl border-2 border-zinc-900 bg-white px-2 text-sm font-semibold text-zinc-950 shadow-[2px_2px_0_#18181b] sm:w-[10.5rem] sm:px-3 sm:text-base"
        aria-label={dictionary.language}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
