import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORDER_LABELS, PAYMENT_LABELS, formatWhen, money } from "../../../shared/marketplace";
import { api } from "../../api";
import type { MarketplaceOrder } from "../../types";

interface SalesResponse {
  orders: MarketplaceOrder[];
  summary: {
    orderCount: number;
    paidTotal: number;
    completedTotal: number;
    unitsSold: number;
    openCount: number;
  };
}

export function Sales() {
  const [data, setData] = useState<SalesResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<SalesResponse>("/api/seller/sales")
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (!data && !error) return <p className="loading">Loading sales…</p>;

  return (
    <section className="sheet">
      <p className="eyebrow">Sales records</p>
      <h1>What this shop has sold</h1>
      {error && <p className="error">{error}</p>}
      {data && (
        <>
          <div className="stats">
            <article>
              <span>Completed revenue</span>
              <strong>{money(data.summary.completedTotal)}</strong>
            </article>
            <article>
              <span>Payment received</span>
              <strong>{money(data.summary.paidTotal)}</strong>
            </article>
            <article>
              <span>Units completed</span>
              <strong>{data.summary.unitsSold}</strong>
            </article>
            <article>
              <span>Open orders</span>
              <strong>{data.summary.openCount}</strong>
            </article>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Buyer</th>
                  <th>Products</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/sell/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>{order.buyer.name}</td>
                    <td>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</td>
                    <td>{formatWhen(order.createdAt)}</td>
                    <td>{money(order.total)}</td>
                    <td>{PAYMENT_LABELS[order.paymentStatus]}</td>
                    <td>{ORDER_LABELS[order.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
