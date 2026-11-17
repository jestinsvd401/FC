import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LISTING_LABELS, STOCK_LABELS, money } from "../../../shared/marketplace";
import { api } from "../../api";
import { useAuth } from "../../auth";
import type { CatalogProduct } from "../../types";

type Filter = "listed" | "hidden" | "removed" | "low" | "out" | "all";

export function Inventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [filter, setFilter] = useState<Filter>("listed");
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState("");
  const approved = user?.sellerStatus === "approved";

  function load() {
    return api<{ products: CatalogProduct[] }>("/api/seller/products").then((data) => setProducts(data.products));
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  async function saveQuantity(product: CatalogProduct, quantity: number) {
    setError("");
    try {
      const data = await api<{ product: CatalogProduct }>(`/api/seller/products/${product.id}/quantity`, {
        method: "PATCH",
        body: { quantity },
      });
      setProducts((current) => current.map((item) => (item.id === product.id ? data.product : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update quantity.");
    }
  }

  async function visibility(product: CatalogProduct, action: "hide" | "unhide" | "remove") {
    setError("");
    try {
      const data = await api<{ product: CatalogProduct }>(`/api/seller/products/${product.id}/visibility`, {
        method: "POST",
        body: { action },
      });
      setProducts((current) => current.map((item) => (item.id === product.id ? data.product : item)));
      setConfirmId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change the listing.");
    }
  }

  const visible = products.filter((product) => {
    if (filter === "listed") return product.listingStatus === "active";
    if (filter === "hidden") return product.listingStatus === "hidden";
    if (filter === "removed") return product.listingStatus === "removed";
    if (filter === "low") return product.stockStatus === "low_stock";
    if (filter === "out") return product.stockStatus === "out_of_stock";
    return true;
  });

  const filters: [Filter, string][] = [
    ["listed", "Listed"],
    ["hidden", "Hidden"],
    ["removed", "Removed"],
    ["low", "Low stock"],
    ["out", "Out of stock"],
    ["all", "All"],
  ];

  return (
    <section className="sheet">
      <div className="section-head">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Listed products</h1>
        </div>
        {approved && (
          <Link className="button" to="/sell/products/new">
            Add product
          </Link>
        )}
      </div>
      {!approved && <p className="monitor">Inventory is locked until the platform admin approves this seller.</p>}
      <div className="filters">
        {filters.map(([key, label]) => (
          <button key={key} className={filter === key ? "on" : ""} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Stock status</th>
              <th>Listing status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id}>
                <td className="product-cell">
                  <img src={product.image} alt="" />
                  <span>{product.name}</span>
                </td>
                <td>{product.category}</td>
                <td>{money(product.price)}</td>
                <td>
                  {approved && product.listingStatus !== "removed" ? (
                    <input
                      className="qty"
                      type="number"
                      min={0}
                      defaultValue={product.quantity}
                      key={`${product.id}-${product.quantity}`}
                      onBlur={(event) => {
                        const next = Number(event.target.value);
                        if (next !== product.quantity) void saveQuantity(product, next);
                      }}
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td>
                  <em className={`pill ${product.stockStatus}`}>{STOCK_LABELS[product.stockStatus]}</em>
                </td>
                <td>{LISTING_LABELS[product.listingStatus]}</td>
                <td className="action-cell">
                  {product.listingStatus !== "removed" && approved && (
                    <Link to={`/sell/products/${product.id}/edit`}>Edit</Link>
                  )}
                  {approved && product.listingStatus === "active" && (
                    <button onClick={() => void visibility(product, "hide")}>Hide</button>
                  )}
                  {approved && product.listingStatus === "hidden" && (
                    <button onClick={() => void visibility(product, "unhide")}>List again</button>
                  )}
                  {approved && product.listingStatus !== "removed" && confirmId !== product.id && (
                    <button onClick={() => setConfirmId(product.id)}>Remove</button>
                  )}
                  {confirmId === product.id && (
                    <button className="danger" onClick={() => void visibility(product, "remove")}>
                      Confirm remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visible.length === 0 && <p className="empty">No products in this view.</p>}
    </section>
  );
}
