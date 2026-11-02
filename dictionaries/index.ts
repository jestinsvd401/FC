import type { Dictionary, Locale } from "@/types/i18n";
import en from "./en";
import zhTW from "./zh-TW";
import id from "./id";
import vi from "./vi";
import tl from "./tl";
import th from "./th";

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  "zh-TW": zhTW,
  id,
  vi,
  tl,
  th,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
