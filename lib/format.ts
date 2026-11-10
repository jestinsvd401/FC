import { intlLocale, type Locale } from "@/lib/i18n";

export type Tri = { en: string; zh: string; hi: string };

export function text(locale: Locale, value: Tri) {
  const chosen = locale === "zh-Hant" ? value.zh : locale === "hi" ? value.hi : value.en;
  return chosen.trim() || value.en.trim() || value.zh.trim() || value.hi.trim();
}

export function parseMonth(value: string | undefined) {
  const now = new Date();
  const fallback = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return fallback;
  const month = Number(value.slice(5, 7));
  if (month < 1 || month > 12) return fallback;
  return value;
}

export function shiftMonth(month: string, delta: number) {
  const year = Number(month.slice(0, 4));
  const index = Number(month.slice(5, 7)) - 1 + delta;
  const date = new Date(Date.UTC(year, index, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthDays(month: string) {
  const year = Number(month.slice(0, 4));
  const index = Number(month.slice(5, 7)) - 1;
  const count = new Date(Date.UTC(year, index + 1, 0)).getUTCDate();
  return Array.from({ length: count }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    return `${month}-${day}`;
  });
}

export function formatMonth(locale: Locale, month: string) {
  const year = Number(month.slice(0, 4));
  const index = Number(month.slice(5, 7)) - 1;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, index, 1)));
}

export function formatDay(locale: Locale, iso: string) {
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(5, 7)) - 1;
  const day = Number(iso.slice(8, 10));
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, day)));
}

export function weekdayLabel(locale: Locale, iso: string) {
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(5, 7)) - 1;
  const day = Number(iso.slice(8, 10));
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "narrow",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, day)));
}

export function percent(part: number, whole: number) {
  if (whole <= 0) return "–";
  return `${Math.round((part / whole) * 100)}%`;
}
