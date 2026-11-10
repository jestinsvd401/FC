import { copy, type Locale } from "@/lib/i18n";

export function WardPicker({
  locale,
  wards,
  ward,
  month,
  path,
}: {
  locale: Locale;
  wards: { id: string; name: string }[];
  ward: string | null;
  month?: string;
  path: string;
}) {
  const t = copy(locale);
  if (wards.length < 2) return null;
  return (
    <form className="ward-form" method="get" action={path}>
      {month ? <input type="hidden" name="month" value={month} /> : null}
      <label>
        {t.chooseWard}
        <select name="ward" defaultValue={ward ?? ""}>
          {wards.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <button className="submit" type="submit">
        {t.save}
      </button>
    </form>
  );
}
