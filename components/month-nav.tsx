import Link from "next/link";
import { ChevronIcon } from "@/components/icons";
import { copy, type Locale } from "@/lib/i18n";
import { formatMonth, shiftMonth } from "@/lib/format";

export function MonthNav({
  locale,
  month,
  path,
  ward,
}: {
  locale: Locale;
  month: string;
  path: string;
  ward?: string | null;
}) {
  const t = copy(locale);
  return (
    <div className="month-bar">
      <Link className="icon-btn" href={href(path, shiftMonth(month, -1), ward)} aria-label={t.previousMonth}>
        <ChevronIcon direction="left" />
      </Link>
      <h2>{formatMonth(locale, month)}</h2>
      <Link className="icon-btn" href={href(path, shiftMonth(month, 1), ward)} aria-label={t.nextMonth}>
        <ChevronIcon direction="right" />
      </Link>
    </div>
  );
}

function href(path: string, month: string, ward?: string | null) {
  const params = new URLSearchParams({ month });
  if (ward) params.set("ward", ward);
  return `${path}?${params.toString()}`;
}
