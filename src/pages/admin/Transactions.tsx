import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORDER_FLOW, ORDER_LABELS, formatWhen, money, type OrderStatus } from "../../../shared/marketplace";
import { api } from "../../api";
import type { MarketplaceOrder } from "../../types";

type Attention = "" | "incomplete" | "abnormal";

export function Transactions() {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [counts, setCounts] = useState<Partial<Record<OrderStatus, number>>>({});
  const [volume, setVolume] = useState(0);
  const [incompleteCount, setIncompleteCount] = useState(0);
  const [abnormalCount, setAbnormalCount] = useState(0);
  const [status, setStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [attention, setAttention] = useState<Attention>("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (orderId.trim()) params.set("orderId", orderId.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (attention) params.set("attention", attention);
    api<{
      orders: MarketplaceOrder[];
      counts: Record<OrderStatus, number>;
      volume: number;
      incompleteCount: number;
      abnormalCount: number;
    }>(`/api/admin/orders?${params.toString()}`)
      .then((data) => {
        setOrders(data.orders);
        setCounts(data.counts);
        setVolume(data.volume);
        setIncompleteCount(data.incompleteCount);
        setAbnormalCount(data.abnormalCount);
        setError("");
      })
      .catch((err: Error) => setError(err.message));
  }, [status, orderId, from, to, attention]);

  return (
    <section className="sheet">
      <p className="eyebrow">Platform admin</p>
      <h1>All transactions</h1>
      <p className="monitor">
        Every marketplace transaction stays in this ledger, including completed sales. This desk reads buyer, seller, status, and
        amount. It does not place orders, confirm payment, or ship.
      </p>
      {error && <p className="error">{error}</p>}
      <div className="stats">
        <article>
          <span>Recorded volume</span>
          <strong>{money(volume)}</strong>
        </article>
        <article>
          <span>Incomplete</span>
          <strong>{incompleteCount}</strong>
        </article>
        <article>
          <span>Needs attention</span>
          <strong>{abnormalCount}</strong>
        </article>
        {ORDER_FLOW.map((step) => (
          <article key={step}>
            <span>{ORDER_LABELS[step]}</span>
            <strong>{counts[step] ?? 0}</strong>
          </article>
        ))}
      </div>
      <div className="filters">
        <button className={!attention ? "on" : ""} onClick={() => setAttention("")}>
          All transactions
        </button>
        <button className={attention === "incomplete" ? "on" : ""} onClick={() => setAttention("incomplete")}>
          Incomplete
        </button>
        <button className={attention === "abnormal" ? "on" : ""} onClick={() => setAttention("abnormal")}>
          Abnormal
        </button>
      </div>
      <div className="filters">
        <button className={!status ? "on" : ""} onClick={() => setStatus("")}>
          Any status
        </button>
        {ORDER_FLOW.map((step) => (
          <button key={step} className={status === step ? "on" : ""} onClick={() => setStatus(step)}>
            {ORDER_LABELS[step]}
          </button>
        ))}
      </div>
      <div className="date-filters">
        <label>
          Search by order ID
          <input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="SI-18420" />
        </label>
        <label>
          From
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Date</th>
              <th>Transaction amount</th>
              <th>Transaction status</th>
              <th>Attention</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link to={`/admin/transactions/${order.id}`}>{order.id}</Link>
                </td>
                <td>
                  {order.buyer.name}
                  <small className="sub">{order.buyer.email}</small>
                </td>
                <td>
                  {order.seller.shopName}
                  <small className="sub">{order.seller.name}</small>
                </td>
                <td>{formatWhen(order.createdAt)}</td>
                <td>{money(order.total)}</td>
                <td>{ORDER_LABELS[order.status]}</td>
                <td className="flags">{order.flags?.length ? order.flags.join(", ") : order.incomplete ? "Incomplete" : "On record"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && <p className="empty">No transactions match that search.</p>}
    </section>
  );
}
