import { MonthNav } from "@/components/month-nav";
import { Shell } from "@/components/shell";
import { StatusIcon } from "@/components/icons";
import { WardPicker } from "@/components/ward-picker";
import { setAttendance } from "@/lib/actions";
import { copy, type Copy } from "@/lib/i18n";
import { monthDays, parseMonth, text, weekdayLabel } from "@/lib/format";
import { getLocale, loadContext } from "@/lib/session";

const order = ["present", "late", "absent", "excused"] as const;

export default async function AttendancePage({
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
  const visible = profile.role === "teacher" ? students : students.filter((student) => student.id === focusId);
  const { data: marks } = room
    ? await supabase.from("attendance").select("student_id, day, status").eq("class_id", room.id).gte("day", days[0]).lte("day", days[days.length - 1])
    : { data: [] };
  const byKey = new Map((marks ?? []).map((mark) => [`${mark.student_id}:${mark.day}`, mark.status as string]));
  const next = withQuery("/attendance", month, focusId);

  return (
    <Shell locale={locale} profile={profile} active="/attendance" next={next}>
      <h1>{t.attendance}</h1>
      <p className="lede">{t.attendanceHint}</p>
      <WardPicker locale={locale} wards={wards} ward={focusId} month={month} path="/attendance" />
      <MonthNav locale={locale} month={month} path="/attendance" ward={focusId} />
      <div className="grid-wrap">
        <table>
          <thead>
            <tr>
              <th className="name">{t.studentName}</th>
              {days.map((day) => (
                <th key={day}>
                  {weekdayLabel(locale, day)}
                  <br />
                  {Number(day.slice(8))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((student) => (
              <tr key={student.id}>
                <td className="name">{student.name}</td>
                {days.map((day) => {
                  const status = byKey.get(`${student.id}:${day}`) ?? "";
                  const label = status ? t[status as keyof Copy] : t.empty;
                  if (profile.role !== "teacher" || !room) {
                    return (
                      <td key={day}>
                        <span className={`icon-btn mark mark-${status || "empty"}`} title={label}>
                          <StatusIcon status={status} />
                        </span>
                      </td>
                    );
                  }
                  const nextStatus = order[(Math.max(0, order.indexOf(status as (typeof order)[number])) + (status ? 1 : 0)) % order.length];
                  return (
                    <td key={day}>
                      <form action={setAttendance}>
                        <input type="hidden" name="classId" value={room.id} />
                        <input type="hidden" name="studentId" value={student.id} />
                        <input type="hidden" name="day" value={day} />
                        <input type="hidden" name="status" value={status ? nextStatus : "present"} />
                        <input type="hidden" name="month" value={month} />
                        <button className={`icon-btn mark mark-${status || "empty"}`} type="submit" aria-label={`${student.name} ${day} ${label}`}>
                          <StatusIcon status={status} />
                        </button>
                      </form>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {room ? null : <p className="lede">{t.nothingYet}</p>}
      <p className="meta">{text(locale, room ? { en: room.name_en, zh: room.name_zh, hi: room.name_hi } : { en: "", zh: "", hi: "" })}</p>
    </Shell>
  );
}

function withQuery(path: string, month: string, ward: string | null) {
  const params = new URLSearchParams({ month });
  if (ward) params.set("ward", ward);
  return `${path}?${params.toString()}`;
}
