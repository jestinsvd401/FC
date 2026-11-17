import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { STOCK_LABELS, money } from "../../shared/marketplace";
import { api } from "../api";
import { useAuth } from "../auth";
import type { CatalogProduct } from "../types";

export function ProductPage() {
  const { id } = useParams();
  const { user, refreshCart } = useAuth();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ product: CatalogProduct }>(`/api/products/${id}`)
      .then((data) => setProduct(data.product))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  if (error && !product) {
    return (
      <section className="panel narrow">
        <h1>This listing is not on the floor.</h1>
        <p>{error}</p>
        <Link to="/">Back to the floor</Link>
      </section>
    );
  }
  if (!product) return <p className="loading">Loading product…</p>;

  const max = Math.max(product.quantity, 0);
  const unavailable = product.quantity < 1;

  async function addToCart() {
    setError("");
    setMessage("");
    try {
      await api("/api/cart", { method: "POST", body: { productId: product!.id, quantity } });
      await refreshCart();
      setMessage("Added to cart. Review the selected items before you submit an order.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add to cart.");
    }
  }

  return (
    <article className="detail">
      <div className="detail-photo">
        <img src={product.image} alt={product.name} />
      </div>
      <div>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="shop">
          Sold by {product.shopName} · {product.sellerName}
        </p>
        <p className="price">{money(product.price)}</p>
        <p className={`stock-line ${product.stockStatus}`}>
          {STOCK_LABELS[product.stockStatus]}
          {product.quantity > 0 ? ` · ${product.quantity} available` : ""}
        </p>
        <p className="description">{product.description}</p>
        {user?.role === "buyer" && (
          <div className="buy-box">
            <label>
              Quantity
              <input
                type="number"
                min={1}
                max={Math.max(max, 1)}
                value={quantity}
                disabled={unavailable}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
            <button className="button" disabled={unavailable} onClick={addToCart}>
              {unavailable ? "Out of stock" : "Add to cart"}
            </button>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <Link to="/cart">Review selected items</Link>
          </div>
        )}
        {!user && (
          <div className="buy-box">
            <p>Visitors can check the price and availability. Sign in as a buyer to select a quantity and add it to a cart.</p>
            <Link className="button" to="/login">
              Sign in to buy
            </Link>
          </div>
        )}
        {user?.role === "seller" && (
          <div className="buy-box">
            <p>Sellers do not purchase from this account. Inventory and order fulfillment live on the seller desk.</p>
            <Link className="button" to="/sell/inventory">
              Open inventory
            </Link>
          </div>
        )}
        {user?.role === "admin" && (
          <div className="buy-box">
            <p>Platform administrators monitor transactions and do not act as the buyer or the seller.</p>
            <Link className="button" to="/admin">
              Monitor transactions
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
