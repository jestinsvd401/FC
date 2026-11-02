"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

type Stats = { activeChats: number; checkIns: number; clinics: number };

export default function AdminDashboardPage() {
  const { dictionary } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    void fetch("/api/admin/stats")
      .then((response) => {
        if (!response.ok) throw new Error("stats");
        return response.json() as Promise<Stats>;
      })
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <CardSkeleton />;
  if (error || !stats) {
    return <ErrorState message={dictionary.common.error} onRetry={load} />;
  }

  const cards = [
    { label: dictionary.admin.activeChats, value: stats.activeChats },
    { label: dictionary.admin.checkIns, value: stats.checkIns },
    { label: dictionary.admin.clinicCount, value: stats.clinics },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">{dictionary.admin.dashboard}</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border-4 border-zinc-950 bg-zinc-950 p-4 text-amber-300"
          >
            <p className="text-sm font-bold">{card.label}</p>
            <p className="mt-1 text-4xl font-black">{card.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
