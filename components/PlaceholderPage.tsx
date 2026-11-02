"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export function PlaceholderPage({
  title,
}: {
  title: (dictionary: ReturnType<typeof useLanguage>["dictionary"]) => string;
}) {
  const { dictionary } = useLanguage();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-black text-zinc-950">{title(dictionary)}</h1>
      <p className="rounded-2xl border-4 border-zinc-950 bg-white p-5 text-lg font-semibold text-zinc-900">
        {dictionary.pages.comingSoon}
      </p>
    </section>
  );
}
