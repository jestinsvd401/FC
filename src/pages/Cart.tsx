import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { money } from "../../shared/marketplace";
import { api } from "../api";
import { useAuth } from "../auth";
import type { CartLine } from "../types";

export function Cart() {
  const { refreshCart } = useAuth();
  const [items, setItems] = useState<CartLine[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: CartLine[]; subtotal: number }>("/api/cart");
    setItems(data.items);
    setSubtotal(data.subtotal);
    await refreshCart();
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  async function update(productId: string, quantity: number) {
    setError("");
    try {
      const data = await api<{ items: CartLine[]; subtotal: number }>("/api/cart", {
        method: "PUT",
        body: { productId, quantity },
      });
      setItems(data.items);
      setSubtotal(data.subtotal);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the cart.");
    }
  }

  const blocked = items.some((item) => !item.purchasable);

  return (
    <section className="sheet">
      <p className="eyebrow">Step 2 of 4</p>
      <h1>Review selected items</h1>
      <p>Check the seller, price, and quantity. The next step confirms those quantities before the order is submitted.</p>
      {error && <p className="error">{error}</p>}
      {items.length === 0 ? (
        <div className="empty">
          <p>The cart is empty.</p>
          <Link className="button" to="/">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <ul className="lines cart-lines">
            {items.map((item) => (
              <li key={item.productId}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.shopName} · {money(item.price)}
                  </p>
                  {!item.purchasable && <p className="error">Unavailable. {item.available} left, listing is {item.listingStatus}.</p>}
                  <label>
                    Quantity
                    <input
                      type="number"
                      min={0}
                      max={Math.max(item.available, item.quantity)}
                      defaultValue={item.quantity}
                      key={`${item.productId}-${item.quantity}`}
                      onBlur={(event) => {
                        const next = Number(event.target.value);
                        if (Number.isInteger(next) && next >= 0 && next !== item.quantity) {
                          void update(item.productId, next);
                        }
                      }}
                    />
                  </label>
                  <button className="text-button" onClick={() => void update(item.productId, 0)}>
                    Remove
                  </button>
                </div>
                <b>{money(item.lineTotal)}</b>
              </li>
            ))}
          </ul>
          <div className="checkout-bar">
            <p>
              Subtotal <b>{money(subtotal)}</b>
            </p>
            {blocked ? (
              <p className="error">Remove unavailable items before confirming quantities.</p>
            ) : (
              <Link className="button" to="/checkout">
                Confirm quantity
              </Link>
            )}
          </div>
        </>
      )}
    </section>
  );
}
