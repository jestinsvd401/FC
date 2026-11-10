import { PencilIcon, TrashIcon } from "@/components/icons";
import { MonthNav } from "@/components/month-nav";
import { Shell } from "@/components/shell";
import { deleteEvent, saveEvent } from "@/lib/actions";
import { copy } from "@/lib/i18n";
import { formatDay, monthDays, parseMonth, text } from "@/lib/format";
import { getLocale, loadContext } from "@/lib/session";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; ward?: string; error?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = copy(locale);
  const month = parseMonth(params.month);
  const days = monthDays(month);
  const { supabase, profile, room, wards, focusId } = await loadContext(params.ward);
  const { data: events } = room
    ? await supabase
        .from("events")
        .select("*")
        .eq("class_id", room.id)
        .gte("event_date", days[0])
        .lte("event_date", days[days.length - 1])
        .order("event_date")
    : { data: [] };
  const next = withQuery("/events", month, focusId);

  return (
    <Shell locale={locale} profile={profile} active="/events" next={next}>
      <h1>{t.events}</h1>
      <p className="lede">{t.eventsHint}</p>
      {params.error ? <p className="error">{t.required}</p> : null}
      <MonthNav locale={locale} month={month} path="/events" ward={focusId} />
      {profile.role === "teacher" && room ? (
        <form className="record form-grid" action={saveEvent}>
          <input type="hidden" name="classId" value={room.id} />
          <label>
            {t.title}
            <input name="title" required maxLength={120} />
          </label>
          <label>
            {t.date}
            <input name="date" type="date" required defaultValue={`${month}-01`} />
          </label>
          <label className="wide">
            {t.details}
            <textarea name="body" maxLength={1000} />
          </label>
          <button className="submit" type="submit">
            {t.addEvent}
          </button>
        </form>
      ) : null}
      <div className="list" style={{ marginTop: 16 }}>
        {(events ?? []).map((event) => {
          const title = text(locale, { en: event.title_en, zh: event.title_zh, hi: event.title_hi });
          const body = text(locale, { en: event.body_en, zh: event.body_zh, hi: event.body_hi });
          return (
            <article className="record" key={event.id}>
              <div className="post-head">
                <strong>{title}</strong>
                <span className="meta">{formatDay(locale, event.event_date)}</span>
              </div>
              <p>{body}</p>
              {profile.role === "teacher" && room ? (
                <div className="row-actions">
                  <details className="editor">
                    <summary className="icon-btn" aria-label={t.edit}>
                      <PencilIcon />
                    </summary>
                    <form className="form-grid" action={saveEvent}>
                      <input type="hidden" name="id" value={event.id} />
                      <input type="hidden" name="classId" value={room.id} />
                      <label>
                        {t.title}
                        <input name="title" defaultValue={title} required />
                      </label>
                      <label>
                        {t.date}
                        <input name="date" type="date" defaultValue={event.event_date} required />
                      </label>
                      <label className="wide">
                        {t.details}
                        <textarea name="body" defaultValue={body} />
                      </label>
                      <button className="submit" type="submit">
                        {t.save}
                      </button>
                    </form>
                  </details>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <input type="hidden" name="month" value={month} />
                    <button className="icon-btn" type="submit" aria-label={t.remove}>
                      <TrashIcon />
                    </button>
                  </form>
                </div>
              ) : null}
            </article>
          );
        })}
        {(events ?? []).length === 0 ? <p className="lede">{t.nothingYet}</p> : null}
      </div>
    </Shell>
  );
}

function withQuery(path: string, month: string, ward: string | null) {
  const params = new URLSearchParams({ month });
  if (ward) params.set("ward", ward);
  return `${path}?${params.toString()}`;
}
