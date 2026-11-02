"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <LanguageProvider>
      <Header />
      <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 overflow-x-hidden px-3 pb-28 pt-4 sm:px-4 sm:pt-6">
        {children}
      </main>
      {isAdmin ? null : <BottomNav />}
    </LanguageProvider>
  );
}
