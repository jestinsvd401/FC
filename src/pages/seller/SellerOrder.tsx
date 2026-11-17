import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PAYMENT_LABELS } from "../../../shared/marketplace";
import { api } from "../../api";
import { OrderView } from "../../components/OrderView";
import type { MarketplaceOrder } from "../../types";

export function SellerOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState<MarketplaceOrder | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<{ order: MarketplaceOrder }>(`/api/orders/${id}`)
      .then((data) => setOrder(data.order))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function act(action: string) {
    setPending(true);
    setError("");
    try {
      const data = await api<{ order: MarketplaceOrder }>(`/api/orders/${id}/advance`, {
        method: "POST",
        body: { action, note },
      });
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the order.");
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
      <Link to="/sell/orders">All shop orders</Link>
      {error && <p className="error">{error}</p>}
      <OrderView
        order={order}
        mode="seller"
        actions={
          <div className="actions">
            <p>
              Payment: <strong>{PAYMENT_LABELS[order.paymentStatus]}</strong>
            </p>
            {order.status === "waiting_payment" && (
              <>
                <p>Waiting for payment. Ready to Ship stays locked until you record payment.</p>
                <button className="button" disabled={pending} onClick={() => void act("payment_received")}>
                  Payment Received
                </button>
              </>
            )}
            {order.status === "payment_confirmed" && (
              <button className="button" disabled={pending} onClick={() => void act("ready_to_ship")}>
                Move to Ready to Ship
              </button>
            )}
            {order.status === "ready_to_ship" && !order.prepared && (
              <button className="button" disabled={pending} onClick={() => void act("prepare")}>
                Prepare the product
              </button>
            )}
            {order.status === "ready_to_ship" && order.prepared && (
              <>
                <label>
                  Shipment note
                  <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Carrier or packing note" />
                </label>
                <button className="button" disabled={pending} onClick={() => void act("confirm_shipment")}>
                  Confirm shipment
                </button>
              </>
            )}
            {order.status === "shipped" && <p className="note">Shipped. The buyer marks the order completed on arrival.</p>}
            {order.status === "completed" && <p className="note">This sale is complete.</p>}
          </div>
        }
      />
    </section>
  );
}
