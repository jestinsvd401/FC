import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/lib/actions";
import { copy, type Locale } from "@/lib/i18n";
import type { Profile, Role } from "@/lib/session";
import { LanguageSwitch } from "@/components/language-switch";
import {
  ActivityIcon,
  CalendarIcon,
  ChatIcon,
  EventIcon,
  HomeIcon,
  ScoreIcon,
  UserIcon,
} from "@/components/icons";

const links: { href: string; key: "home" | "attendance" | "scores" | "events" | "activities" | "discussion"; icon: ReactNode; roles: Role[] }[] = [
  { href: "/home", key: "home", icon: <HomeIcon />, roles: ["teacher", "student", "parent"] },
  { href: "/attendance", key: "attendance", icon: <CalendarIcon />, roles: ["teacher", "student", "parent"] },
  { href: "/scores", key: "scores", icon: <ScoreIcon />, roles: ["teacher", "student", "parent"] },
  { href: "/events", key: "events", icon: <EventIcon />, roles: ["teacher", "student", "parent"] },
  { href: "/activities", key: "activities", icon: <ActivityIcon />, roles: ["teacher", "student", "parent"] },
  { href: "/discussion", key: "discussion", icon: <ChatIcon />, roles: ["teacher", "student"] },
];

export function Shell({
  locale,
  profile,
  active,
  next,
  children,
}: {
  locale: Locale;
  profile: Profile;
  active: string;
  next: string;
  children: ReactNode;
}) {
  const t = copy(locale);
  const roleName = profile.role === "teacher" ? t.roleTeacher : profile.role === "student" ? t.roleStudent : t.roleParent;

  return (
    <>
      <header className="topbar">
        <Link href="/home" className="brand">
          {t.classroom}
        </Link>
        <nav className="nav">
          {links
            .filter((link) => link.roles.includes(profile.role))
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={active === link.href ? "icon-btn nav-link is-active" : "icon-btn nav-link"}
                aria-current={active === link.href ? "page" : undefined}
              >
                {link.icon}
                <span>{t[link.key]}</span>
              </Link>
            ))}
        </nav>
        <div className="account-tools">
          <LanguageSwitch locale={locale} next={next} label={t.language} />
          <form action={signOut}>
            <button className="icon-btn" type="submit" aria-label={t.signOut} title={`${profile.name} · ${roleName}`}>
              <UserIcon />
            </button>
          </form>
        </div>
      </header>
      <main className="page">{children}</main>
    </>
  );
}
