"use client";

import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function Header() {
  const { dictionary } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-zinc-950 bg-amber-300">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex min-h-12 items-center gap-3 rounded-xl px-1 text-zinc-950"
        >
          <HeartHandshake className="size-8 shrink-0" strokeWidth={2.4} aria-hidden />
          <span className="text-xl font-black leading-tight tracking-tight sm:text-2xl">
            {dictionary.appName}
          </span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
