import type { Dictionary } from "@/types/i18n";

const en: Dictionary = {
  appName: "Migrant Helpdesk",
  tagline: "Safety, health, and support for migrant workers in Taiwan.",
  language: "Language",
  stackWired: "Next.js, Prisma, and Tailwind are wired.",
  nav: {
    home: "Home",
    supportChat: "Support Chat",
    healthNav: "Health Nav",
    safetyGuides: "Safety Guides",
    emergency: "Emergency",
  },
  home: {
    emergencyHotlines: "Emergency Hotlines",
    emergencyHotlinesHint: "Call 1955 — 24-hour migrant worker hotline",
    anonymousChat: "Anonymous Chat",
    anonymousChatHint: "Talk with a volunteer without sharing your name",
    selfCheck: "Self-Check",
    selfCheckHint: "Record mood and stress in private",
    healthNavigation: "Health Navigation",
    healthNavigationHint: "Find clinics with interpreters near you",
    workplaceSafety: "Workplace Safety",
    workplaceSafetyHint: "Know your rights and stay safe at work",
  },
  pages: {
    comingSoon: "This section is being prepared. Use Home for quick access.",
  },
  common: {
    search: "Search",
    loading: "Loading…",
    error: "Could not load data. Try again.",
    noResults: "No clinics match these filters.",
    allLanguages: "All languages",
    call: "Call",
  },
  health: {
    nhiTitle: "NHI coverage",
    clinicsTitle: "Clinic directory",
    searchClinics: "Search clinics by name or city",
    interpreterOnly: "Has interpreter",
    filterLanguage: "Filter by language",
    hasInterpreter: "Interpreter available",
    noInterpreter: "No interpreter listed",
    symptomsTitle: "Symptom translation card",
    symptomsHint: "Tap a symptom in your language, then show or play Mandarin at the clinic.",
    sayThis: "Say this in Mandarin",
    playMandarin: "Play pronunciation",
  },
  safety: {
    intro: "Open a workplace card for step-by-step safety instructions.",
    steps: "Steps",
  },
};

export default en;
