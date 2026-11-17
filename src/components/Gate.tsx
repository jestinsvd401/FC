import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Role } from "../../shared/marketplace";
import { useAuth } from "../auth";

function denial(actual: Role, needed: Role): { title: string; body: string } {
  if (needed === "seller" && actual === "buyer") {
    return {
      title: "Buyers cannot manage inventory.",
      body: "Listings, stock, payment confirmation, and shipping stay on the seller desk. Your tools are the floor, the cart, and your orders.",
    };
  }
  if (needed === "admin" && actual === "seller") {
    return {
      title: "Sellers cannot approve platform administrators.",
      body: "User approval and transaction monitoring belong to the platform admin. This account lists products, updates inventory, and fulfills its own orders.",
    };
  }
  if (actual === "admin") {
    return {
      title: "Platform administrators monitor transactions.",
      body: "This desk does not buy, list, or ship. You can review every order, manage users, and read marketplace activity without acting as the buyer or the seller.",
    };
  }
  if (needed === "buyer" && actual === "seller") {
    return {
      title: "Sellers do not purchase from this account.",
      body: "Cart and checkout belong to buyer accounts. Use the seller desk to list products and fulfill orders.",
    };
  }
  return {
    title: "Buyers cannot manage platform users.",
    body: "Approving sellers and monitoring every transaction is the platform admin desk.",
  };
}

export function Gate({ role, children }: { role: Role; children: ReactNode }) {
  const { user, ready } = useAuth();
  if (!ready) return <p className="loading">Opening the desk…</p>;
  if (!user) {
    return (
      <section className="panel narrow">
        <p className="eyebrow">Sign in</p>
        <h1>This desk needs an account.</h1>
        <p>Visitors can browse the floor. Cart, inventory, and oversight open after you sign in with the matching role.</p>
        <Link className="button" to="/login">
          Sign in
        </Link>
      </section>
    );
  }
  if (user.role !== role) {
    const message = denial(user.role, role);
    return (
      <section className="panel narrow">
        <p className="eyebrow">Access limited</p>
        <h1>{message.title}</h1>
        <p>{message.body}</p>
        <Link className="button" to={user.role === "seller" ? "/sell" : user.role === "admin" ? "/admin" : "/"}>
          Back to your desk
        </Link>
      </section>
    );
  }
  return children;
}

export function roleHome(role: Role): string {
  if (role === "seller") return "/sell";
  if (role === "admin") return "/admin";
  return "/";
}
