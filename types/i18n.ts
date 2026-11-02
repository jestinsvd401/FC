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
  common: {
    search: string;
    loading: string;
    error: string;
    noResults: string;
    allLanguages: string;
    call: string;
  };
  health: {
    nhiTitle: string;
    clinicsTitle: string;
    searchClinics: string;
    interpreterOnly: string;
    filterLanguage: string;
    hasInterpreter: string;
    noInterpreter: string;
    symptomsTitle: string;
    symptomsHint: string;
    sayThis: string;
    playMandarin: string;
  };
  safety: {
    intro: string;
    steps: string;
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
