import { redirect } from "next/navigation";
import { TrashIcon } from "@/components/icons";
import { Shell } from "@/components/shell";
import { addPost, deletePost } from "@/lib/actions";
import { copy } from "@/lib/i18n";
import { intlLocale } from "@/lib/i18n";
import { getLocale, loadContext } from "@/lib/session";

export default async function DiscussionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = copy(locale);
  const { supabase, profile, room } = await loadContext();
  if (profile.role === "parent") redirect("/home");

  const { data: posts } = room
    ? await supabase.from("posts").select("id, body, created_at, author_id, profiles(name, role)").eq("class_id", room.id).order("created_at")
    : { data: [] };

  return (
    <Shell locale={locale} profile={profile} active="/discussion" next="/discussion">
      <h1>{t.discussion}</h1>
      <p className="lede">{t.discussionHint}</p>
      {params.error ? <p className="error">{t.required}</p> : null}
      <div className="list">
        {(posts ?? []).map((post) => {
          const author = authorOf(post.profiles);
          const role = author.role === "teacher" ? t.roleTeacher : t.roleStudent;
          return (
            <article className="post" key={post.id}>
              <div className="post-head">
                <strong>
                  {author.name} · {role}
                </strong>
                <span className="meta">
                  {new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: "medium", timeStyle: "short" }).format(new Date(post.created_at))}
                </span>
              </div>
              <p>{post.body}</p>
              {profile.role === "teacher" || post.author_id === profile.id ? (
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button className="icon-btn" type="submit" aria-label={t.remove}>
                    <TrashIcon />
                  </button>
                </form>
              ) : null}
            </article>
          );
        })}
        {(posts ?? []).length === 0 ? <p className="lede">{t.nothingYet}</p> : null}
      </div>
      {room ? (
        <form className="record stack" action={addPost}>
          <input type="hidden" name="classId" value={room.id} />
          <label>
            {t.message}
            <textarea name="body" required maxLength={2000} />
          </label>
          <button className="submit" type="submit">
            {t.post}
          </button>
        </form>
      ) : null}
    </Shell>
  );
}

function authorOf(value: { name: string; role: string } | { name: string; role: string }[] | null) {
  const row = Array.isArray(value) ? value[0] : value;
  return { name: row?.name ?? "", role: row?.role ?? "student" };
}
