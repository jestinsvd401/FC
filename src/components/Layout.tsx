import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

const roleLabel = {
  buyer: "Buyer",
  seller: "Seller",
  admin: "Platform admin",
};

export function Layout() {
  const { user, cartCount, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="shell">
      <header className="top">
        <Link to="/" className="brand" aria-label="shop it.com home">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="7" />
            <path d="M8 9h16v11.5c0 1.4-3.2 2.5-8 2.5s-8-1.1-8-2.5V9z" />
            <path d="M8 13h16" />
          </svg>
          <span>
            shop it<span>.com</span>
          </span>
        </Link>
        <form
          className="search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const next = query.trim();
            navigate(next ? `/?q=${encodeURIComponent(next)}` : "/");
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>
        <nav className="top-links">
          <Link to="/">Floor</Link>
          {user?.role === "buyer" && <Link to="/orders">My orders</Link>}
          {user?.role === "buyer" && (
            <Link to="/cart">
              Cart <b>{cartCount}</b>
            </Link>
          )}
          {user ? (
            <button
              className="text-button"
              onClick={() => {
                logout().then(() => navigate("/"));
              }}
            >
              {user.name}
              <small>{roleLabel[user.role]}</small>
            </button>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
        </nav>
      </header>
      {user?.role === "seller" && (
        <nav className="deskbar">
          <span>Seller desk</span>
          <NavLink to="/sell" end>
            Overview
          </NavLink>
          <NavLink to="/sell/inventory">Inventory</NavLink>
          <NavLink to="/sell/products/new">Add product</NavLink>
          <NavLink to="/sell/orders">Orders to process</NavLink>
          <NavLink to="/sell/sales">Sales history</NavLink>
        </nav>
      )}
      {user?.role === "admin" && (
        <nav className="deskbar admin">
          <span>Platform desk</span>
          <NavLink to="/admin" end>
            All transactions
          </NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/activity">Activity</NavLink>
        </nav>
      )}
      <main>
        <Outlet />
      </main>
      <footer>
        <strong>shop it.com</strong>
        <span>Person-to-person marketplace. Visitors browse, buyers purchase, sellers fulfill, and the platform admin monitors.</span>
      </footer>
    </div>
  );
}
