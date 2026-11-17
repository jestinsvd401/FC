import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORDER_FLOW, ORDER_LABELS, PAYMENT_LABELS, formatWhen, money, type OrderStatus } from "../../../shared/marketplace";
import { api } from "../../api";
import type { MarketplaceOrder } from "../../types";

export function Transactions() {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [counts, setCounts] = useState<Partial<Record<OrderStatus, number>>>({});
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (query.trim()) params.set("q", query.trim());
    api<{ orders: MarketplaceOrder[]; counts: Record<OrderStatus, number>; volume: number }>(
      `/api/admin/orders?${params.toString()}`,
    )
      .then((data) => {
        setOrders(data.orders);
        setCounts(data.counts);
        setVolume(data.volume);
      })
      .catch((err: Error) => setError(err.message));
  }, [status, query]);

  return (
    <section className="sheet">
      <p className="eyebrow">Platform admin</p>
      <h1>Monitor transactions</h1>
      <p className="monitor">
        This desk reads the marketplace. It does not place orders, confirm payment, or ship. Buyers and sellers keep those actions.
      </p>
      {error && <p className="error">{error}</p>}
      <div className="stats">
        <article>
          <span>Recorded volume</span>
          <strong>{money(volume)}</strong>
        </article>
        {ORDER_FLOW.map((step) => (
          <article key={step}>
            <span>{ORDER_LABELS[step]}</span>
            <strong>{counts[step] ?? 0}</strong>
          </article>
        ))}
      </div>
      <div className="filters">
        <button className={!status ? "on" : ""} onClick={() => setStatus("")}>
          All
        </button>
        {ORDER_FLOW.map((step) => (
          <button key={step} className={status === step ? "on" : ""} onClick={() => setStatus(step)}>
            {ORDER_LABELS[step]}
          </button>
        ))}
      </div>
      <label>
        Search transactions
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order ID, buyer, or seller" />
      </label>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link to={`/admin/transactions/${order.id}`}>{order.id}</Link>
                </td>
                <td>{order.buyer.name}</td>
                <td>{order.seller.shopName}</td>
                <td>{formatWhen(order.createdAt)}</td>
                <td>{money(order.total)}</td>
                <td>{PAYMENT_LABELS[order.paymentStatus]}</td>
                <td>{ORDER_LABELS[order.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
