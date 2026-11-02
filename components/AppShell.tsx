"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6">
        {children}
      </main>
      <BottomNav />
    </LanguageProvider>
  );
}
