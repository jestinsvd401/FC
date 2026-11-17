import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { roleHome } from "../components/Gate";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(form: FormData) {
    setPending(true);
    setError("");
    try {
      const user = await register({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role,
        shopName: form.get("shopName"),
      });
      navigate(roleHome(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="panel narrow">
      <p className="eyebrow">Register</p>
      <h1>Open a buyer or seller account</h1>
      <p>Seller applications stay pending until a platform admin approves them. Platform admin accounts are not created here.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(new FormData(event.currentTarget));
        }}
      >
        <div className="choice">
          <button type="button" className={role === "buyer" ? "on" : ""} onClick={() => setRole("buyer")}>
            Buyer
          </button>
          <button type="button" className={role === "seller" ? "on" : ""} onClick={() => setRole("seller")}>
            Seller
          </button>
        </div>
        <label>
          Name
          <input name="name" required minLength={2} />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required minLength={8} />
        </label>
        {role === "seller" && (
          <label>
            Shop name
            <input name="shopName" required minLength={2} placeholder="The name buyers will see" />
          </label>
        )}
        {error && <p className="error">{error}</p>}
        <button className="button" disabled={pending}>
          {pending ? "Creating…" : role === "seller" ? "Apply to sell" : "Create buyer account"}
        </button>
      </form>
      <p>
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
}
