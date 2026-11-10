import Link from "next/link";
import { MonthNav } from "@/components/month-nav";
import { Shell } from "@/components/shell";
import { WardPicker } from "@/components/ward-picker";
import { copy } from "@/lib/i18n";
import { formatDay, monthDays, parseMonth, percent, text } from "@/lib/format";
import { getLocale, loadContext } from "@/lib/session";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; ward?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = copy(locale);
  const month = parseMonth(params.month);
  const days = monthDays(month);
  const { supabase, profile, room, students, wards, focusId } = await loadContext(params.ward);
  const studentIds = profile.role === "teacher" ? students.map((student) => student.id) : focusId ? [focusId] : [];

  const attendanceQuery = room
    ? supabase
        .from("attendance")
        .select("status, student_id")
        .eq("class_id", room.id)
        .gte("day", days[0])
        .lte("day", days[days.length - 1])
    : null;
  const scoresQuery = room ? supabase.from("scores").select("*").eq("class_id", room.id).order("taken_on", { ascending: false }) : null;
  const eventsQuery = room
    ? supabase.from("events").select("*").eq("class_id", room.id).gte("event_date", days[0]).lte("event_date", days[days.length - 1]).order("event_date")
    : null;

  const [{ data: marks }, { data: scores }, { data: events }] = await Promise.all([
    attendanceQuery ?? Promise.resolve({ data: [] }),
    scoresQuery ?? Promise.resolve({ data: [] }),
    eventsQuery ?? Promise.resolve({ data: [] }),
  ]);

  const relevantMarks = (marks ?? []).filter((mark) => studentIds.includes(mark.student_id));
  const attended = relevantMarks.filter((mark) => mark.status === "present" || mark.status === "late").length;
  const relevantScores = (scores ?? []).filter((score) => studentIds.includes(score.student_id));
  const average = relevantScores.length
    ? relevantScores.reduce((sum, score) => sum + Number(score.score) / Number(score.max_score), 0) / relevantScores.length
    : 0;
  const welcome = profile.role === "teacher" ? t.welcomeTeacher : profile.role === "student" ? t.welcomeStudent : t.welcomeParent;
  const next = queryPath("/home", month, focusId);

  return (
    <Shell locale={locale} profile={profile} active="/home" next={next}>
      <h1>{room ? text(locale, { en: room.name_en, zh: room.name_zh, hi: room.name_hi }) : t.classroom}</h1>
      <p className="lede">{welcome}</p>
      <WardPicker locale={locale} wards={wards} ward={focusId} month={month} path="/home" />
      <MonthNav locale={locale} month={month} path="/home" ward={focusId} />
      <section className="cards">
        <article className="card">
          <span>{t.attendanceRate}</span>
          <strong>{percent(attended, relevantMarks.length)}</strong>
          <span>
            {attended} / {relevantMarks.length} {t.attended}
          </span>
        </article>
        <article className="card">
          <span>{t.average}</span>
          <strong>{relevantScores.length ? `${Math.round(average * 100)}%` : "–"}</strong>
          <span>{relevantScores.length}</span>
        </article>
        <article className="card">
          <span>{t.upcoming}</span>
          <strong>{(events ?? []).length}</strong>
          <span>{t.events}</span>
        </article>
      </section>
      <h2>{t.recentScores}</h2>
      <div className="list">
        {relevantScores.slice(0, 4).map((score) => (
          <article className="record" key={score.id}>
            <strong>
              {text(locale, { en: score.title_en, zh: score.title_zh, hi: score.title_hi })} · {score.score}/{score.max_score}
            </strong>
            <span className="meta">
              {text(locale, { en: score.subject_en, zh: score.subject_zh, hi: score.subject_hi })} · {formatDay(locale, score.taken_on)}
            </span>
          </article>
        ))}
        {relevantScores.length === 0 ? <p className="lede">{t.nothingYet}</p> : null}
      </div>
      <p>
        <Link href="/scores">{t.scores}</Link>
      </p>
    </Shell>
  );
}

function queryPath(path: string, month: string, ward: string | null) {
  const params = new URLSearchParams({ month });
  if (ward) params.set("ward", ward);
  return `${path}?${params.toString()}`;
}
