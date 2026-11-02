"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Home,
  Hospital,
  MessageCircle,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

type NavItem = {
  href: string;
  icon: LucideIcon;
  labelKey: keyof ReturnType<typeof useLanguage>["dictionary"]["nav"];
};

const ITEMS: NavItem[] = [
  { href: "/", icon: Home, labelKey: "home" },
  { href: "/chat", icon: MessageCircle, labelKey: "supportChat" },
  { href: "/health", icon: Hospital, labelKey: "healthNav" },
  { href: "/safety", icon: BookOpen, labelKey: "safetyGuides" },
  { href: "/emergency", icon: PhoneCall, labelKey: "emergency" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-zinc-950 bg-zinc-950 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                  className={`flex min-h-16 flex-col items-center justify-center gap-0.5 px-0.5 text-center text-[10px] font-bold leading-tight min-[360px]:text-[11px] sm:text-xs ${
                  active ? "bg-amber-300 text-zinc-950" : "text-white"
                }`}
              >
                <Icon className="size-6" strokeWidth={2.4} aria-hidden />
                <span>{dictionary.nav[item.labelKey]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
