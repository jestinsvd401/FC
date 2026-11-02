import type { Dictionary } from "@/types/i18n";

const tl: Dictionary = {
  appName: "Migrant Helpdesk",
  tagline: "Kaligtasan, kalusugan, at tulong para sa mga migranteng manggagawa sa Taiwan.",
  language: "Wika",
  stackWired: "Naka-wire na ang Next.js, Prisma, at Tailwind.",
  nav: {
    home: "Home",
    supportChat: "Support Chat",
    healthNav: "Health Nav",
    safetyGuides: "Safety Guides",
    emergency: "Emergency",
  },
  home: {
    emergencyHotlines: "Emergency Hotlines",
    emergencyHotlinesHint: "Tumawag sa 1955 — 24-oras na hotline para sa migranteng manggagawa",
    anonymousChat: "Anonymous Chat",
    anonymousChatHint: "Makipag-usap sa volunteer nang hindi ibinibigay ang pangalan",
    selfCheck: "Self-Check",
    selfCheckHint: "Itala ang mood at stress nang pribado",
    healthNavigation: "Health Navigation",
    healthNavigationHint: "Maghanap ng klinikang may interpreter malapit sa iyo",
    workplaceSafety: "Workplace Safety",
    workplaceSafetyHint: "Alamin ang iyong mga karapatan at maging ligtas sa trabaho",
  },
  pages: {
    comingSoon: "Inihahanda pa ang seksyong ito. Gamitin ang Home para sa mabilisang access.",
  },
  common: {
    search: "Maghanap",
    loading: "Naglo-load…",
    error: "Hindi na-load ang data. Subukan ulit.",
    noResults: "Walang klinikang tumugma.",
    allLanguages: "Lahat ng wika",
    call: "Tumawag",
  },
  health: {
    nhiTitle: "NHI coverage",
    clinicsTitle: "Directory ng klinika",
    searchClinics: "Maghanap ng klinika ayon sa pangalan o lungsod",
    interpreterOnly: "May interpreter",
    filterLanguage: "I-filter ayon sa wika",
    hasInterpreter: "May interpreter",
    noInterpreter: "Walang listed na interpreter",
    symptomsTitle: "Symptom translation card",
    symptomsHint: "Pumili ng sintomas sa iyong wika, tapos ipakita o i-play ang Mandarin sa klinika.",
    sayThis: "Sabihin ito sa Mandarin",
    playMandarin: "I-play ang bigkas",
  },
  safety: {
    intro: "Buksan ang card ng industriya para sa sunud-sunod na safety instructions.",
    steps: "Mga hakbang",
  },
};

export default tl;
