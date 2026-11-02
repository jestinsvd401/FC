"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

const LINKS = [
  { href: "/admin/dashboard", key: "dashboard" as const },
  { href: "/admin/clinics", key: "clinics" as const },
  { href: "/admin/guides", key: "guides" as const },
  { href: "/admin/users", key: "users" as const },
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
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`min-h-12 rounded-xl border-4 border-zinc-950 px-3 py-2 text-sm font-black ${
              active ? "bg-zinc-950 text-amber-300" : "bg-white"
            }`}
          >
            {dictionary.admin[link.key]}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => void logout()}
        className="min-h-12 rounded-xl border-4 border-zinc-950 bg-red-600 px-3 text-sm font-black text-white"
      >
        {dictionary.admin.logout}
      </button>
    </nav>
  );
}
