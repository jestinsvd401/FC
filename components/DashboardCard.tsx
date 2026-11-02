import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  href: string;
  title: string;
  hint: string;
  icon: LucideIcon;
  tone: "emergency" | "chat" | "check" | "health" | "safety" | "community" | "home";
  external?: boolean;
};

const tones: Record<
  DashboardCardProps["tone"],
  { card: string; iconWrap: string }
> = {
  emergency: {
    card: "bg-red-600 text-white",
    iconWrap: "bg-white text-red-700",
  },
  chat: {
    card: "bg-blue-800 text-white",
    iconWrap: "bg-amber-300 text-zinc-950",
  },
  check: {
    card: "bg-emerald-800 text-white",
    iconWrap: "bg-white text-emerald-800",
  },
  health: {
    card: "bg-sky-700 text-white",
    iconWrap: "bg-white text-sky-800",
  },
  safety: {
    card: "bg-zinc-950 text-amber-300",
    iconWrap: "bg-amber-300 text-zinc-950",
  },
  community: {
    card: "bg-violet-800 text-white",
    iconWrap: "bg-white text-violet-800",
  },
  home: {
    card: "bg-orange-700 text-white",
    iconWrap: "bg-white text-orange-800",
  },
};

export function DashboardCard({
  href,
  title,
  hint,
  icon: Icon,
  tone,
  external,
}: DashboardCardProps) {
  const className = `flex min-h-[6.5rem] items-center gap-4 rounded-2xl border-4 border-zinc-950 px-4 py-4 shadow-[4px_4px_0_#09090b] ${tones[tone].card}`;

  const content = (
    <>
      <span
        className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 border-zinc-950 ${tones[tone].iconWrap}`}
      >
        <Icon className="size-8" strokeWidth={2.5} aria-hidden />
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-xl font-black leading-tight">{title}</span>
        <span className="mt-1 block text-sm font-semibold leading-snug opacity-95">
          {hint}
        </span>
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
