import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES } from "../../shared/marketplace";
import { api } from "../api";
import { ProductCard } from "../components/ProductCard";
import { WorkflowMap } from "../components/Stepper";
import type { CatalogProduct } from "../types";

const roles = [
  ["Visitor", "Browse public product information."],
  ["Buyer", "Browse, add to cart, and place orders."],
  ["Seller", "List products, manage inventory, and process orders."],
  ["Platform admin", "Manage users and monitor transactions."],
];

export function Home() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (category) search.set("category", category);
    api<{ products: CatalogProduct[] }>(`/api/products?${search.toString()}`)
      .then((data) => {
        setProducts(data.products);
        setError("");
      })
      .catch((err: Error) => setError(err.message));
  }, [q, category]);

  function setCategory(next: string) {
    const following = new URLSearchParams(params);
    if (next) following.set("category", next);
    else following.delete("category");
    setParams(following);
  }

  return (
    <div className="floor">
      <section className="hero">
        <div>
          <p className="eyebrow">Person to person</p>
          <h1>Buy from a person. Sell what you have.</h1>
          <p>
            shop it.com connects a buyer’s cart to the seller who holds the stock. The platform admin watches the
            transaction and never steps into the sale.
          </p>
        </div>
        <WorkflowMap />
      </section>
      <section className="roles">
        {roles.map(([title, body]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <div className="filters">
        <button className={!category ? "on" : ""} onClick={() => setCategory("")}>
          All
        </button>
        {CATEGORIES.map((item) => (
          <button key={item} className={category === item ? "on" : ""} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="results-meta">
        <h2>{category || "On the floor"}</h2>
        <p>
          {products.length} listed {products.length === 1 ? "product" : "products"}
          {q ? ` matching “${q}”` : ""}
        </p>
      </div>
      {error && <p className="error">{error}</p>}
      {products.length === 0 ? (
        <p className="empty">Nothing on the floor matches that search. Hidden and removed listings stay off the public floor.</p>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
