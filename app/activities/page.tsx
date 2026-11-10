import { PencilIcon, TrashIcon } from "@/components/icons";
import { Shell } from "@/components/shell";
import { WardPicker } from "@/components/ward-picker";
import { deleteActivity, saveActivity } from "@/lib/actions";
import { copy } from "@/lib/i18n";
import { text } from "@/lib/format";
import { getLocale, loadContext } from "@/lib/session";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ ward?: string; error?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = copy(locale);
  const { supabase, profile, room, wards, focusId } = await loadContext(params.ward);
  const { data: activities } = room
    ? await supabase.from("activities").select("*").eq("class_id", room.id)
    : { data: [] };
  const { data: roster } = room
    ? await supabase.from("enrollments").select("student_id, profiles(name)").eq("class_id", room.id)
    : { data: [] };
  const names = new Map((roster ?? []).map((row) => [row.student_id as string, nestedName(row.profiles)]));
  const visible = (activities ?? []).filter((activity) => profile.role === "teacher" || activity.student_id === focusId);
  const next = focusId ? `/activities?ward=${focusId}` : "/activities";

  return (
    <Shell locale={locale} profile={profile} active="/activities" next={next}>
      <h1>{t.activities}</h1>
      <p className="lede">{t.activitiesHint}</p>
      {params.error ? <p className="error">{t.required}</p> : null}
      <WardPicker locale={locale} wards={wards} ward={focusId} path="/activities" />
      {profile.role === "teacher" && room ? (
        <form className="record form-grid" action={saveActivity}>
          <input type="hidden" name="classId" value={room.id} />
          <label>
            {t.studentName}
            <select name="studentId" required>
              {[...names.entries()]
                .sort((a, b) => a[1].localeCompare(b[1]))
                .map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            {t.title}
            <input name="name" required maxLength={120} />
          </label>
          <label>
            {t.category}
            <input name="category" maxLength={80} />
          </label>
          <label>
            {t.schedule}
            <input name="schedule" maxLength={80} />
          </label>
          <label className="wide">
            {t.details}
            <textarea name="description" maxLength={1000} />
          </label>
          <button className="submit" type="submit">
            {t.addActivity}
          </button>
        </form>
      ) : null}
      <div className="list" style={{ marginTop: 16 }}>
        {visible.map((activity) => {
          const name = text(locale, { en: activity.name_en, zh: activity.name_zh, hi: activity.name_hi });
          const category = text(locale, { en: activity.category_en, zh: activity.category_zh, hi: activity.category_hi });
          const schedule = text(locale, { en: activity.schedule_en, zh: activity.schedule_zh, hi: activity.schedule_hi });
          const description = text(locale, { en: activity.description_en, zh: activity.description_zh, hi: activity.description_hi });
          return (
            <article className="record" key={activity.id}>
              <div className="post-head">
                <strong>
                  {names.get(activity.student_id) ?? ""} · {name}
                </strong>
                <span className="meta">{category}</span>
              </div>
              <span className="meta">{schedule}</span>
              <p>{description}</p>
              {profile.role === "teacher" && room ? (
                <div className="row-actions">
                  <details className="editor">
                    <summary className="icon-btn" aria-label={t.edit}>
                      <PencilIcon />
                    </summary>
                    <form className="form-grid" action={saveActivity}>
                      <input type="hidden" name="id" value={activity.id} />
                      <input type="hidden" name="classId" value={room.id} />
                      <input type="hidden" name="studentId" value={activity.student_id} />
                      <label>
                        {t.title}
                        <input name="name" defaultValue={name} required />
                      </label>
                      <label>
                        {t.category}
                        <input name="category" defaultValue={category} />
                      </label>
                      <label>
                        {t.schedule}
                        <input name="schedule" defaultValue={schedule} />
                      </label>
                      <label className="wide">
                        {t.details}
                        <textarea name="description" defaultValue={description} />
                      </label>
                      <button className="submit" type="submit">
                        {t.save}
                      </button>
                    </form>
                  </details>
                  <form action={deleteActivity}>
                    <input type="hidden" name="id" value={activity.id} />
                    <button className="icon-btn" type="submit" aria-label={t.remove}>
                      <TrashIcon />
                    </button>
                  </form>
                </div>
              ) : null}
            </article>
          );
        })}
        {visible.length === 0 ? <p className="lede">{t.nothingYet}</p> : null}
      </div>
    </Shell>
  );
}

function nestedName(value: { name: string } | { name: string }[] | null) {
  if (!value) return "";
  return Array.isArray(value) ? value[0]?.name ?? "" : value.name;
}
