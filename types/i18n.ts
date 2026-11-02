export const LOCALES = ["en", "zh-TW", "id", "vi", "tl", "th"] as const;

export type Locale = (typeof LOCALES)[number];

export type Dictionary = {
  appName: string;
  tagline: string;
  language: string;
  stackWired: string;
  nav: {
    home: string;
    supportChat: string;
    healthNav: string;
    safetyGuides: string;
    emergency: string;
  };
  home: {
    emergencyHotlines: string;
    emergencyHotlinesHint: string;
    anonymousChat: string;
    anonymousChatHint: string;
    selfCheck: string;
    selfCheckHint: string;
    healthNavigation: string;
    healthNavigationHint: string;
    workplaceSafety: string;
    workplaceSafetyHint: string;
  };
  pages: {
    comingSoon: string;
  };
};

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-TW": "繁體中文",
  id: "Bahasa Indonesia",
  vi: "Tiếng Việt",
  tl: "Tagalog",
  th: "ไทย",
};
