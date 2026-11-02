import type { Dictionary } from "@/types/i18n";

const zhTW: Dictionary = {
  appName: "移工互助台",
  tagline: "在臺移工的安全、健康與即時協助。",
  language: "語言",
  stackWired: "Next.js、Prisma 與 Tailwind 已接好。",
  nav: {
    home: "首頁",
    supportChat: "支援對話",
    healthNav: "就醫導引",
    safetyGuides: "安全指南",
    emergency: "緊急求助",
  },
  home: {
    emergencyHotlines: "緊急專線",
    emergencyHotlinesHint: "撥打 1955 — 移工 24 小時諮詢專線",
    anonymousChat: "匿名對話",
    anonymousChatHint: "不必具名，即可與志工對話",
    selfCheck: "心情回報",
    selfCheckHint: "私下記錄心情與壓力",
    healthNavigation: "就醫導引",
    healthNavigationHint: "找得到通譯的附近診所",
    workplaceSafety: "職場安全",
    workplaceSafetyHint: "了解權益，安全工作",
  },
  pages: {
    comingSoon: "此頁面建置中。請先回到首頁使用快捷入口。",
  },
  common: {
    search: "搜尋",
    loading: "載入中…",
    error: "資料載入失敗，請再試一次。",
    noResults: "沒有符合條件的診所。",
    allLanguages: "所有語言",
    call: "撥打",
  },
  health: {
    nhiTitle: "健保說明",
    clinicsTitle: "診所名錄",
    searchClinics: "用名稱或城市搜尋診所",
    interpreterOnly: "有通譯",
    filterLanguage: "依語言篩選",
    hasInterpreter: "有通譯",
    noInterpreter: "未列出通譯",
    symptomsTitle: "症狀翻譯卡",
    symptomsHint: "用母語點選症狀，再顯示或播放華語給醫護人員聽。",
    sayThis: "請用華語說",
    playMandarin: "播放發音",
  },
  safety: {
    intro: "點開工種卡片，查看逐步安全指示。",
    steps: "步驟",
  },
};

export default zhTW;
