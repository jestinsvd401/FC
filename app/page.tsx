"use client";

import {
  Globe,
  HeartPulse,
  Hospital,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Users,
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function HomePage() {
  const { dictionary } = useLanguage();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border-4 border-zinc-950 bg-white p-5 shadow-[4px_4px_0_#09090b]">
        <h1 className="text-3xl font-black tracking-tight text-zinc-950">
          {dictionary.appName}
        </h1>
        <p className="mt-2 text-lg font-semibold leading-snug text-zinc-800">
          {dictionary.tagline}
        </p>
        <p className="mt-3 inline-block rounded-lg bg-zinc-950 px-3 py-1 text-sm font-bold text-amber-300">
          {dictionary.stackWired}
        </p>
      </section>

      <section className="grid gap-4" aria-label="Quick access">
        <DashboardCard
          href="tel:1955"
          external
          tone="emergency"
          icon={PhoneCall}
          title={dictionary.home.emergencyHotlines}
          hint={dictionary.home.emergencyHotlinesHint}
        />
        <DashboardCard
          href="/chat"
          tone="chat"
          icon={MessageCircle}
          title={dictionary.home.anonymousChat}
          hint={dictionary.home.anonymousChatHint}
        />
        <DashboardCard
          href="/check-in"
          tone="check"
          icon={HeartPulse}
          title={dictionary.home.selfCheck}
          hint={dictionary.home.selfCheckHint}
        />
        <DashboardCard
          href="/health"
          tone="health"
          icon={Hospital}
          title={dictionary.home.healthNavigation}
          hint={dictionary.home.healthNavigationHint}
        />
        <DashboardCard
          href="/safety"
          tone="safety"
          icon={ShieldCheck}
          title={dictionary.home.workplaceSafety}
          hint={dictionary.home.workplaceSafetyHint}
        />
        <DashboardCard
          href="/community"
          tone="community"
          icon={Users}
          title={dictionary.extra.community}
          hint={dictionary.extra.communityHint}
        />
        <DashboardCard
          href="/home-support"
          tone="home"
          icon={Globe}
          title={dictionary.extra.homeCountry}
          hint={dictionary.extra.homeCountryHint}
        />
      </section>
    </div>
  );
}
