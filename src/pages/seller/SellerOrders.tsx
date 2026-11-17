import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ORDER_LABELS, PAYMENT_LABELS, formatWhen, money } from "../../../shared/marketplace";
import { api } from "../../api";
import type { MarketplaceOrder } from "../../types";

type Queue = "process" | "payments" | "ship";

const queues: { id: Queue; label: string }[] = [
  { id: "process", label: "Orders to process" },
  { id: "payments", label: "Payments to confirm" },
  { id: "ship", label: "Products to ship" },
];

function inQueue(order: MarketplaceOrder, queue: Queue): boolean {
  if (queue === "payments") return order.status === "waiting_payment";
  if (queue === "ship") return order.status === "payment_confirmed" || order.status === "ready_to_ship";
  return order.status === "waiting_payment" || order.status === "payment_confirmed" || order.status === "ready_to_ship";
}

export function SellerOrders() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("queue");
  const queue: Queue = requested === "payments" || requested === "ship" ? requested : "process";
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ orders: MarketplaceOrder[] }>("/api/seller/orders")
      .then((data) => setOrders(data.orders))
      .catch((err: Error) => setError(err.message));
  }, []);

  const shown = orders.filter((order) => inQueue(order, queue));

  return (
    <section className="sheet">
      <p className="eyebrow">Seller</p>
      <h1>{queues.find((item) => item.id === queue)?.label}</h1>
      <p>
        These are the orders that still need you. Shipped and completed sales stay in{" "}
        <Link to="/sell/sales">sales history</Link> and are not deleted.
      </p>
      <div className="filters">
        {queues.map((item) => (
          <button
            key={item.id}
            className={queue === item.id ? "on" : ""}
            onClick={() => setParams(item.id === "process" ? {} : { queue: item.id })}
          >
            {item.label} ({orders.filter((order) => inQueue(order, item.id)).length})
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Order date</th>
              <th>Total amount</th>
              <th>Payment status</th>
              <th>Order status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link to={`/sell/orders/${order.id}`}>{order.id}</Link>
                </td>
                <td>{order.buyer.name}</td>
                <td>{formatWhen(order.createdAt)}</td>
                <td>{money(order.total)}</td>
                <td>{PAYMENT_LABELS[order.paymentStatus]}</td>
                <td>{ORDER_LABELS[order.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {shown.length === 0 && <p className="empty">Nothing in this queue.</p>}
    </section>
  );
}
