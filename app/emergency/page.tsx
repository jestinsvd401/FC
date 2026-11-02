"use client";

import { PhoneCall } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function EmergencyPage() {
  const { dictionary } = useLanguage();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-black text-zinc-950">
        {dictionary.nav.emergency}
      </h1>
      <a
        href="tel:1955"
        className="flex min-h-24 items-center justify-center gap-3 rounded-2xl border-4 border-zinc-950 bg-red-600 px-4 text-2xl font-black text-white shadow-[4px_4px_0_#09090b]"
      >
        <PhoneCall className="size-9" strokeWidth={2.5} aria-hidden />
        1955
      </a>
      <p className="text-lg font-semibold text-zinc-900">
        {dictionary.home.emergencyHotlinesHint}
      </p>
    </section>
  );
}
