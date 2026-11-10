import { setLocale } from "@/lib/actions";
import { localeLabels, locales, type Locale } from "@/lib/i18n";

export function LanguageSwitch({ locale, next, label }: { locale: Locale; next: string; label: string }) {
  return (
    <form className="lang-switch" action={setLocale} aria-label={label}>
      <input type="hidden" name="next" value={next} />
      {locales.map((code) => (
        <button
          key={code}
          className="icon-btn lang"
          name="locale"
          value={code}
          aria-pressed={code === locale}
          type="submit"
        >
          {localeLabels[code]}
        </button>
      ))}
    </form>
  );
}
