import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { roleHome } from "../components/Gate";

const demos = [
  ["Maya Chen", "maya@shopit.com", "Platform admin"],
  ["Jonah Hale", "jonah@shopit.com", "Seller · approved"],
  ["Priya Nair", "priya@shopit.com", "Seller · approved"],
  ["Elena Voss", "elena@shopit.com", "Buyer"],
  ["Chris Adeyemi", "chris@shopit.com", "Buyer"],
  ["Sam Ortiz", "sam@shopit.com", "Seller · waiting approval"],
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("elena@shopit.com");
  const [password, setPassword] = useState("shopit-demo");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(nextEmail = email, nextPassword = password) {
    setPending(true);
    setError("");
    try {
      const user = await login(nextEmail, nextPassword);
      navigate(roleHome(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="split">
      <section className="panel">
        <p className="eyebrow">Account</p>
        <h1>Sign in to your desk</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="button" disabled={pending} type="submit">
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p>
          New here? <Link to="/register">Create a buyer or seller account</Link>
        </p>
      </section>
      <section className="panel demo">
        <p className="eyebrow">Sample floor</p>
        <h2>Open a role</h2>
        <p>Every sample account uses the password <code>shopit-demo</code>. Visitors can skip this and browse the floor.</p>
        <div className="demo-list">
          {demos.map(([name, mail, role]) => (
            <button key={mail} onClick={() => void submit(mail, "shopit-demo")}>
              <strong>{name}</strong>
              <span>{role}</span>
            </button>
          ))}
        </div>
        <Link to="/">Continue as a visitor</Link>
      </section>
    </div>
  );
}
