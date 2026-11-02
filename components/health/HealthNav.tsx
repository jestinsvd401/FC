"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Hospital,
  Languages,
  PhoneCall,
  Search,
  ShieldPlus,
  Volume2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { parseGuideContent } from "@/lib/guide-content";
import { SYMPTOMS } from "@/lib/symptoms";
import type { ClinicRecord, GuideRecord } from "@/types/catalog";
import { LOCALES, LOCALE_LABELS } from "@/types/i18n";

const NHI_ICONS = [ShieldPlus, CreditCard, Hospital, PhoneCall] as const;

export function HealthNav() {
  const { dictionary, locale } = useLanguage();
  const [guides, setGuides] = useState<GuideRecord[]>([]);
  const [clinics, setClinics] = useState<ClinicRecord[]>([]);
  const [query, setQuery] = useState("");
  const [interpreterOnly, setInterpreterOnly] = useState(true);
  const [clinicLanguage, setClinicLanguage] = useState<string>(locale);
  const [selectedSymptom, setSelectedSymptom] = useState(SYMPTOMS[0]?.id ?? "fever");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setClinicLanguage(locale);
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({
      language: locale,
      category: "HEALTH",
    });
    fetch(`/api/guides?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("guides");
        return response.json() as Promise<{ guides: GuideRecord[] }>;
      })
      .then((data) => setGuides(data.guides))
      .catch((err: unknown) => {
        if ((err as { name?: string }).name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (interpreterOnly) params.set("interpreter", "1");
    if (clinicLanguage !== "all") params.set("language", clinicLanguage);
    fetch(`/api/clinics?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("clinics");
        return response.json() as Promise<{ clinics: ClinicRecord[] }>;
      })
      .then((data) => setClinics(data.clinics))
      .catch((err: unknown) => {
        if ((err as { name?: string }).name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [query, interpreterOnly, clinicLanguage]);

  const nhiCards = useMemo(
    () =>
      guides
        .map((guide) => {
          const parsed = parseGuideContent(guide.content);
          if (!parsed || parsed.kind !== "nhi") return null;
          return { guide, body: parsed.body };
        })
        .filter((row): row is { guide: GuideRecord; body: string } => row !== null),
    [guides],
  );

  const symptom = SYMPTOMS.find((item) => item.id === selectedSymptom) ?? SYMPTOMS[0];

  function playMandarin() {
    if (!symptom || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(symptom.mandarin);
    utterance.lang = "zh-TW";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-zinc-950">{dictionary.nav.healthNav}</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-black">{dictionary.health.nhiTitle}</h2>
        {loading && nhiCards.length === 0 ? (
          <p className="font-bold">{dictionary.common.loading}</p>
        ) : null}
        <div className="grid gap-3">
          {nhiCards.map((card, index) => {
            const Icon = NHI_ICONS[index % NHI_ICONS.length];
            return (
              <article
                key={card.guide.id}
                className="rounded-2xl border-4 border-zinc-950 bg-sky-700 p-4 text-white shadow-[4px_4px_0_#09090b]"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-zinc-950 bg-white text-sky-800">
                    <Icon className="size-7" strokeWidth={2.5} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-black leading-tight">{card.guide.title}</h3>
                    <p className="mt-1 text-sm font-semibold leading-snug">{card.body}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">{dictionary.health.clinicsTitle}</h2>
        <label className="block">
          <span className="sr-only">{dictionary.health.searchClinics}</span>
          <span className="flex min-h-14 items-center gap-2 rounded-2xl border-4 border-zinc-950 bg-white px-3">
            <Search className="size-6 shrink-0" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dictionary.health.searchClinics}
              className="min-h-12 w-full bg-transparent text-lg font-semibold outline-none"
            />
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setInterpreterOnly((value) => !value)}
            className={`min-h-12 rounded-xl border-4 border-zinc-950 px-4 text-base font-black ${
              interpreterOnly ? "bg-amber-300 text-zinc-950" : "bg-white text-zinc-950"
            }`}
          >
            <Languages className="mr-2 inline size-5" aria-hidden />
            {dictionary.health.interpreterOnly}
          </button>
          <select
            value={clinicLanguage}
            onChange={(event) => setClinicLanguage(event.target.value)}
            className="min-h-12 min-w-[10rem] rounded-xl border-4 border-zinc-950 bg-white px-3 text-base font-bold"
            aria-label={dictionary.health.filterLanguage}
          >
            <option value="all">{dictionary.common.allLanguages}</option>
            {LOCALES.map((code) => (
              <option key={code} value={code}>
                {LOCALE_LABELS[code]}
              </option>
            ))}
          </select>
        </div>
        {clinics.length === 0 ? (
          <p className="rounded-2xl border-4 border-zinc-950 bg-white p-4 font-bold">
            {dictionary.common.noResults}
          </p>
        ) : (
          <ul className="grid gap-3">
            {clinics.map((clinic) => (
              <li
                key={clinic.id}
                className="rounded-2xl border-4 border-zinc-950 bg-white p-4 shadow-[3px_3px_0_#09090b]"
              >
                <p className="text-lg font-black leading-tight">{clinic.name}</p>
                <p className="mt-1 font-semibold text-zinc-800">{clinic.address}</p>
                <a
                  href={`tel:${clinic.phone.replace(/[^+0-9]/g, "")}`}
                  className="mt-3 inline-flex min-h-12 items-center rounded-xl border-4 border-zinc-950 bg-zinc-950 px-4 text-base font-black text-amber-300"
                >
                  {dictionary.common.call} {clinic.phone}
                </a>
                <p className="mt-3 text-sm font-bold">
                  {clinic.hasInterpreter
                    ? dictionary.health.hasInterpreter
                    : dictionary.health.noInterpreter}
                  {" · "}
                  {clinic.languagesSupported
                    .map((code) => LOCALE_LABELS[code as keyof typeof LOCALE_LABELS] ?? code)
                    .join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border-4 border-zinc-950 bg-amber-300 p-4 shadow-[4px_4px_0_#09090b]">
        <h2 className="text-xl font-black">{dictionary.health.symptomsTitle}</h2>
        <p className="font-semibold">{dictionary.health.symptomsHint}</p>
        <div className="grid grid-cols-2 gap-2">
          {SYMPTOMS.map((item) => {
            const active = item.id === selectedSymptom;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedSymptom(item.id)}
                className={`min-h-16 rounded-xl border-4 border-zinc-950 px-2 text-sm font-black leading-tight ${
                  active ? "bg-zinc-950 text-amber-300" : "bg-white text-zinc-950"
                }`}
              >
                {item.labels[locale]}
              </button>
            );
          })}
        </div>
        {symptom ? (
          <div className="rounded-xl border-4 border-zinc-950 bg-white p-4">
            <p className="text-sm font-bold uppercase tracking-wide">{dictionary.health.sayThis}</p>
            <p className="mt-1 text-3xl font-black">{symptom.mandarin}</p>
            <p className="text-lg font-bold text-zinc-700">{symptom.pinyin}</p>
            <button
              type="button"
              onClick={playMandarin}
              className="mt-3 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-4 border-zinc-950 bg-red-600 text-lg font-black text-white"
            >
              <Volume2 className="size-7" aria-hidden />
              {dictionary.health.playMandarin}
            </button>
          </div>
        ) : null}
      </section>

      {error ? (
        <p className="font-bold text-red-700">{dictionary.common.error}</p>
      ) : null}
    </div>
  );
}
