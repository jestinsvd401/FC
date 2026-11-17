import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { OrderView } from "../components/OrderView";
import type { MarketplaceOrder } from "../types";

export function BuyerOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState<MarketplaceOrder | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<{ order: MarketplaceOrder }>(`/api/orders/${id}`)
      .then((data) => setOrder(data.order))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function complete() {
    setPending(true);
    setError("");
    try {
      const data = await api<{ order: MarketplaceOrder }>(`/api/orders/${id}/complete`, { method: "POST", body: {} });
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete the order.");
    } finally {
      setPending(false);
    }
  }

  if (!order && error) {
    return (
      <section className="panel narrow">
        <h1>Order unavailable</h1>
        <p>{error}</p>
      </section>
    );
  }
  if (!order) return <p className="loading">Loading order…</p>;

  return (
    <section className="sheet">
      <Link to="/orders">All orders</Link>
      {error && <p className="error">{error}</p>}
      <OrderView
        order={order}
        mode="buyer"
        actions={
          order.status === "shipped" ? (
            <div className="actions">
              <button className="button" disabled={pending} onClick={() => void complete()}>
                Mark completed
              </button>
              <p>Confirm the package arrived. This closes the transaction.</p>
            </div>
          ) : order.status === "waiting_payment" ? (
            <p className="note">Waiting for the seller to confirm payment. You do not ship or manage their inventory.</p>
          ) : null
        }
      />
    </section>
  );
}
