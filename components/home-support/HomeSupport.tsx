"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { parseGuideContent } from "@/lib/guide-content";
import type { GuideRecord, HomeGuideContent } from "@/types/catalog";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export function HomeSupport() {
  const { dictionary, locale } = useLanguage();
  const [guides, setGuides] = useState<GuideRecord[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({
      category: "HOME_COUNTRY",
      language: locale,
    });
    setLoading(true);
    setError(false);
    void fetch(`/api/guides?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("guides");
        return response.json() as Promise<{ guides: GuideRecord[] }>;
      })
      .then((data) => setGuides(data.guides ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [locale]);

  const cards = guides
    .map((guide) => {
      const parsed = parseGuideContent(guide.content);
      if (!parsed || parsed.kind !== "home") return null;
      return { guide, parsed };
    })
    .filter((row): row is { guide: GuideRecord; parsed: HomeGuideContent } => row !== null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">{dictionary.homeSupport.title}</h1>
      <p className="text-lg font-semibold">{dictionary.homeSupport.intro}</p>
      {loading ? <CardSkeleton /> : null}
      {error ? <ErrorState message={dictionary.common.error} /> : null}
      {!loading && !error && cards.length === 0 ? (
        <EmptyState title={dictionary.common.noResults} />
      ) : null}
      <ul className="grid gap-4">
        {cards.map(({ guide, parsed }) => (
          <li key={guide.id}>
            <article className="rounded-2xl border-4 border-zinc-950 bg-orange-700 text-white shadow-[4px_4px_0_#09090b]">
              <button
                type="button"
                onClick={() => setOpenId(openId === guide.id ? null : guide.id)}
                className="flex min-h-20 w-full items-center justify-between px-4 py-4 text-left text-2xl font-black"
              >
                {parsed.countryName}
              </button>
              {openId === guide.id ? (
                <div className="space-y-3 border-t-4 border-zinc-950 bg-white p-4 text-zinc-950">
                  {parsed.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="rounded-xl border-4 border-zinc-950 p-3"
                    >
                      <p className="text-sm font-black uppercase text-orange-800">
                        {faq.topic === "eldercare"
                          ? dictionary.homeSupport.eldercare
                          : faq.topic === "remittance"
                            ? dictionary.homeSupport.remittance
                            : dictionary.homeSupport.government}
                      </p>
                      <p className="mt-1 text-lg font-black">{faq.question}</p>
                      <p className="mt-1 font-semibold leading-snug">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
