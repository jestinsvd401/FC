"use client";

import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function Header() {
  const { dictionary } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-zinc-950 bg-amber-300">
      <div className="mx-auto flex max-w-3xl min-w-0 items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <Link
          href="/"
          className="flex min-h-12 min-w-0 items-center gap-2 rounded-xl px-1 text-zinc-950 sm:gap-3"
        >
          <HeartHandshake className="size-7 shrink-0 sm:size-8" strokeWidth={2.4} aria-hidden />
          <span className="truncate text-lg font-black leading-tight tracking-tight sm:text-2xl">
            {dictionary.appName}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/admin/login"
            className="hidden min-h-12 items-center rounded-xl border-2 border-zinc-950 bg-white px-2 text-xs font-black sm:inline-flex"
          >
            {dictionary.admin.staff}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
