"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Factory, Fish, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { parseGuideContent } from "@/lib/guide-content";
import type { GuideRecord, Industry } from "@/types/catalog";

const INDUSTRY_META: Record<
  Industry,
  { icon: typeof Factory; card: string; iconWrap: string }
> = {
  factory: {
    icon: Factory,
    card: "bg-zinc-950 text-amber-300",
    iconWrap: "bg-amber-300 text-zinc-950",
  },
  fishing: {
    icon: Fish,
    card: "bg-blue-900 text-white",
    iconWrap: "bg-white text-blue-900",
  },
  caregiving: {
    icon: HeartHandshake,
    card: "bg-emerald-800 text-white",
    iconWrap: "bg-white text-emerald-800",
  },
};

export function SafetyGuides() {
  const { dictionary, locale } = useLanguage();
  const [guides, setGuides] = useState<GuideRecord[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({
      category: "SAFETY",
      language: locale,
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

  const industryGuides = useMemo(() => {
    const order: Industry[] = ["factory", "fishing", "caregiving"];
    return order
      .map((industry) => {
        const guide = guides.find((item) => {
          const parsed = parseGuideContent(item.content);
          return parsed?.kind === "industry" && parsed.industry === industry;
        });
        if (!guide) return null;
        const parsed = parseGuideContent(guide.content);
        if (!parsed || parsed.kind !== "industry") return null;
        return { guide, parsed };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
  }, [guides]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-zinc-950">{dictionary.nav.safetyGuides}</h1>
        <p className="mt-2 text-lg font-semibold">{dictionary.safety.intro}</p>
      </div>
      {loading && industryGuides.length === 0 ? (
        <p className="font-bold">{dictionary.common.loading}</p>
      ) : null}
      <ul className="grid gap-4">
        {industryGuides.map(({ guide, parsed }) => {
          const meta = INDUSTRY_META[parsed.industry];
          const Icon = meta.icon;
          const open = openId === guide.id;
          return (
            <li key={guide.id}>
              <article className={`rounded-2xl border-4 border-zinc-950 shadow-[4px_4px_0_#09090b] ${meta.card}`}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : guide.id)}
                  className="flex min-h-24 w-full items-center gap-4 px-4 py-4 text-left"
                >
                  <span
                    className={`flex size-16 shrink-0 items-center justify-center rounded-2xl border-4 border-zinc-950 ${meta.iconWrap}`}
                    aria-hidden
                  >
                    <Icon className="size-9" strokeWidth={2.4} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-2xl font-black leading-tight">
                      {guide.title}
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-snug opacity-95">
                      {parsed.summary}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-8 shrink-0 transition ${open ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <div className="space-y-2 border-t-4 border-zinc-950 bg-white p-4 text-zinc-950">
                    <p className="text-sm font-black uppercase tracking-wide">
                      {dictionary.safety.steps}
                    </p>
                    <ol className="space-y-2">
                      {parsed.steps.map((step, index) => (
                        <li
                          key={step}
                          className="flex min-h-14 gap-3 rounded-xl border-4 border-zinc-950 bg-zinc-100 px-3 py-3 text-base font-bold leading-snug"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-amber-300">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </article>
            </li>
          );
        })}
      </ul>
      {error ? (
        <p className="font-bold text-red-700">{dictionary.common.error}</p>
      ) : null}
    </div>
  );
}
