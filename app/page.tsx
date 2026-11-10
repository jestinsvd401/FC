import { LoginIcon } from "@/components/icons";
import { LanguageSwitch } from "@/components/language-switch";
import { signIn } from "@/lib/actions";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/session";

const samples = [
  ["teacher", "teacher@classroom.school", "Harbor-Teacher-1"],
  ["student", "aisha@classroom.school", "Harbor-Student-1"],
  ["parent", "priya@classroom.school", "Harbor-Parent-1"],
] as const;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const locale = await getLocale();
  const t = copy(locale);
  const params = await searchParams;
  const roleLabel = { teacher: t.teacher, student: t.student, parent: t.parent };

  return (
    <main className="login-screen">
      <section className="login-card">
        <div className="login-head">
          <div>
            <h1>{t.classroom}</h1>
            <p className="lede">{t.sampleNote}</p>
          </div>
          <div className="login-tools">
            <LanguageSwitch locale={locale} next="/" label={t.language} />
            <button className="icon-btn" type="submit" form="sign-in" aria-label={t.signIn}>
              <LoginIcon />
            </button>
          </div>
        </div>
        <form id="sign-in" className="stack" action={signIn}>
          <label>
            {t.email}
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            {t.password}
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {params.error ? <p className="error">{t.invalidLogin}</p> : null}
          <button className="submit" type="submit">
            {t.signIn}
          </button>
        </form>
        <div className="samples">
          <h2>{t.sampleAccounts}</h2>
          <dl>
            {samples.map(([role, email, password]) => (
              <span key={role} style={{ display: "contents" }}>
                <dt>{roleLabel[role]}</dt>
                <dd>
                  {email}
                  <br />
                  {password}
                </dd>
              </span>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
