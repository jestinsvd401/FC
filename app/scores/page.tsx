import { PencilIcon, TrashIcon } from "@/components/icons";
import { Shell } from "@/components/shell";
import { WardPicker } from "@/components/ward-picker";
import { deleteScore, saveScore } from "@/lib/actions";
import { copy } from "@/lib/i18n";
import { formatDay, text } from "@/lib/format";
import { getLocale, loadContext } from "@/lib/session";

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: Promise<{ ward?: string; error?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = copy(locale);
  const { supabase, profile, room, students, wards, focusId } = await loadContext(params.ward);
  const { data: scores } = room
    ? await supabase.from("scores").select("*").eq("class_id", room.id).order("taken_on", { ascending: false })
    : { data: [] };
  const visible = (scores ?? []).filter((score) => profile.role === "teacher" || score.student_id === focusId);
  const names = new Map(students.map((student) => [student.id, student.name]));
  if (profile.role === "teacher") {
    const { data: roster } = room
      ? await supabase.from("enrollments").select("student_id, profiles(name)").eq("class_id", room.id)
      : { data: [] };
    for (const row of roster ?? []) names.set(row.student_id, nestedName(row.profiles));
  }
  const rosterStudents = [...names.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  const next = focusId ? `/scores?ward=${focusId}` : "/scores";

  return (
    <Shell locale={locale} profile={profile} active="/scores" next={next}>
      <h1>{t.scores}</h1>
      <p className="lede">{t.scoresHint}</p>
      {params.error ? <p className="error">{t.invalidNumber}</p> : null}
      <WardPicker locale={locale} wards={wards} ward={focusId} path="/scores" />
      {profile.role === "teacher" && room ? (
        <form className="record form-grid" action={saveScore}>
          <input type="hidden" name="classId" value={room.id} />
          <label>
            {t.studentName}
            <select name="studentId" required>
              {rosterStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.subject}
            <input name="subject" required maxLength={80} />
          </label>
          <label>
            {t.title}
            <input name="title" required maxLength={120} />
          </label>
          <label>
            {t.date}
            <input name="date" type="date" required />
          </label>
          <label>
            {t.score}
            <input name="score" type="number" min="0" step="0.5" required />
          </label>
          <label>
            {t.outOf}
            <input name="maxScore" type="number" min="1" step="0.5" required />
          </label>
          <button className="submit" type="submit">
            {t.addScore}
          </button>
        </form>
      ) : null}
      <div className="list" style={{ marginTop: 16 }}>
        {visible.map((score) => {
          const subject = text(locale, { en: score.subject_en, zh: score.subject_zh, hi: score.subject_hi });
          const title = text(locale, { en: score.title_en, zh: score.title_zh, hi: score.title_hi });
          return (
            <article className="record" key={score.id}>
              <div className="post-head">
                <strong>
                  {names.get(score.student_id) ?? ""} · {title}
                </strong>
                <span>
                  {score.score}/{score.max_score}
                </span>
              </div>
              <span className="meta">
                {subject} · {formatDay(locale, score.taken_on)}
              </span>
              {profile.role === "teacher" && room ? (
                <div className="row-actions">
                  <details className="editor">
                    <summary className="icon-btn" aria-label={t.edit}>
                      <PencilIcon />
                    </summary>
                    <form className="form-grid" action={saveScore}>
                      <input type="hidden" name="id" value={score.id} />
                      <input type="hidden" name="classId" value={room.id} />
                      <input type="hidden" name="studentId" value={score.student_id} />
                      <label>
                        {t.subject}
                        <input name="subject" defaultValue={subject} required />
                      </label>
                      <label>
                        {t.title}
                        <input name="title" defaultValue={title} required />
                      </label>
                      <label>
                        {t.date}
                        <input name="date" type="date" defaultValue={score.taken_on} required />
                      </label>
                      <label>
                        {t.score}
                        <input name="score" type="number" min="0" step="0.5" defaultValue={score.score} required />
                      </label>
                      <label>
                        {t.outOf}
                        <input name="maxScore" type="number" min="1" step="0.5" defaultValue={score.max_score} required />
                      </label>
                      <button className="submit" type="submit">
                        {t.save}
                      </button>
                    </form>
                  </details>
                  <form action={deleteScore}>
                    <input type="hidden" name="id" value={score.id} />
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
