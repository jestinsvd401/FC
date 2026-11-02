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
  checkIn: {
    title: string;
    step: string;
    moodLabel: string;
    stressLabel: string;
    journalPrompt: string;
    journalPlaceholder: string;
    next: string;
    back: string;
    save: string;
    saved: string;
    breatheTitle: string;
    inhale: string;
    hold: string;
    exhale: string;
    recent: string;
  };
  chat: {
    title: string;
    anonymousNote: string;
    request: string;
    pending: string;
    connected: string;
    waiting: string;
    availability: string;
    availabilityOffHours: string;
    send: string;
    placeholder: string;
  };
  community: {
    title: string;
    intro: string;
    membersOnly: string;
    privacyTitle: string;
    hideLocation: string;
    hideOnline: string;
    hideContact: string;
    on: string;
    off: string;
    groups: string;
    events: string;
    vetted: string;
    cityHidden: string;
    membersHidden: string;
    hostHidden: string;
  };
  homeSupport: {
    title: string;
    intro: string;
    eldercare: string;
    remittance: string;
    government: string;
  };
  extra: {
    community: string;
    communityHint: string;
    homeCountry: string;
    homeCountryHint: string;
  };
  admin: {
    dashboard: string;
    clinics: string;
    guides: string;
    users: string;
    login: string;
    logout: string;
    loginTitle: string;
    loginHint: string;
    loginFailed: string;
    activeChats: string;
    checkIns: string;
    clinicCount: string;
    add: string;
    edit: string;
    save: string;
    delete: string;
    prev: string;
    next: string;
    name: string;
    address: string;
    phone: string;
    title: string;
    staff: string;
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
