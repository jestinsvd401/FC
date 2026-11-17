import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { money } from "../../shared/marketplace";
import { api } from "../api";
import { useAuth } from "../auth";
import type { Address } from "../../shared/marketplace";
import type { CartLine, MarketplaceOrder } from "../types";

const emptyAddress: Address = { recipient: "", line1: "", city: "", region: "", postal: "", country: "" };

export function Checkout() {
  const { user, refreshCart } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartLine[]>([]);
  const [address, setAddress] = useState<Address>(user?.address ?? emptyAddress);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<{ items: CartLine[] }>("/api/cart")
      .then((data) => setItems(data.items))
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    if (user?.address) setAddress(user.address);
  }, [user]);

  function setLine(productId: string, quantity: number) {
    setItems((current) => current.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
    setConfirmed(false);
  }

  const purchasable = items.filter((item) => item.purchasable && item.quantity > 0);
  const subtotal = purchasable.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const addressReady = Object.values(address).every((value) => value.trim().length > 1);

  async function submit() {
    setPending(true);
    setError("");
    try {
      const data = await api<{ orders: MarketplaceOrder[] }>("/api/orders", {
        method: "POST",
        body: {
          quantitiesConfirmed: true,
          address,
          items: purchasable.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        },
      });
      await refreshCart();
      if (data.orders.length === 1) navigate(`/orders/${data.orders[0].id}`);
      else navigate("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the order.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="sheet">
      <p className="eyebrow">Step 3 and 4</p>
      <h1>Confirm quantity and submit the order</h1>
      <ol className="mini-steps">
        <li>Add products to cart</li>
        <li>
          <Link to="/cart">Review selected items</Link>
        </li>
        <li className="now">Confirm quantity</li>
        <li>Submit the order</li>
      </ol>
      {items.length === 0 ? (
        <p className="empty">
          Nothing to confirm. <Link to="/">Browse the floor</Link>
        </p>
      ) : (
        <div className="checkout-layout">
          <div>
            <ul className="lines">
              {items.map((item) => (
                <li key={item.productId}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.shopName} · {item.available} available
                    </p>
                    {!item.purchasable && <p className="error">This line will not be ordered.</p>}
                    <label>
                      Confirm quantity
                      <input
                        type="number"
                        min={1}
                        max={Math.max(item.available, 1)}
                        value={item.quantity}
                        disabled={!item.purchasable}
                        onChange={(event) => setLine(item.productId, Number(event.target.value))}
                      />
                    </label>
                  </div>
                  <b>{money(item.price * item.quantity)}</b>
                </li>
              ))}
            </ul>
          </div>
          <form
            className="panel"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <h2>Ship to</h2>
            {(
              [
                ["recipient", "Recipient"],
                ["line1", "Address"],
                ["city", "City"],
                ["region", "Region"],
                ["postal", "Postal code"],
                ["country", "Country"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  value={address[key]}
                  onChange={(event) => setAddress({ ...address, [key]: event.target.value })}
                  required
                />
              </label>
            ))}
            <label className="check">
              <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
              I confirm these quantities.
            </label>
            <p className="total">
              Total <b>{money(subtotal)}</b>
            </p>
            <p className="note">Submitting opens each seller’s order at Waiting for payment confirmation.</p>
            {error && <p className="error">{error}</p>}
            <button className="button" disabled={!confirmed || !addressReady || pending || purchasable.length === 0}>
              {pending ? "Submitting…" : "Submit the order"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
