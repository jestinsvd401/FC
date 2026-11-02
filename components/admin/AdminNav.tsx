"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Hospital,
  LayoutDashboard,
  LogOut,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const LINKS: { href: string; key: "dashboard" | "clinics" | "guides" | "users"; icon: LucideIcon }[] = [
  { href: "/admin/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/admin/clinics", key: "clinics", icon: Hospital },
  { href: "/admin/guides", key: "guides", icon: BookOpen },
  { href: "/admin/users", key: "users", icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { dictionary } = useLanguage();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (pathname.startsWith("/admin/login")) return null;

  return (
    <nav className="mb-4 flex flex-wrap gap-2">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group inline-flex min-h-12 items-center gap-2 rounded-xl border-4 border-zinc-950 px-3 py-2 text-sm font-black ${
              active ? "bg-zinc-950 text-amber-300" : "bg-white hover:bg-amber-200"
            }`}
          >
            <Icon className="size-5" strokeWidth={2.5} aria-hidden />
            {dictionary.admin[link.key]}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => void logout()}
        className="group inline-flex min-h-12 items-center gap-2 rounded-xl border-4 border-zinc-950 bg-red-600 px-3 text-sm font-black text-white hover:bg-red-500"
      >
        <LogOut className="size-5" strokeWidth={2.5} aria-hidden />
        {dictionary.admin.logout}
      </button>
    </nav>
  );
}
