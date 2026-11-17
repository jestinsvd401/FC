import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORDER_LABELS, PAYMENT_LABELS, formatWhen, money } from "../../../shared/marketplace";
import { api } from "../../api";
import type { MarketplaceOrder } from "../../types";

interface SalesResponse {
  orders: MarketplaceOrder[];
  retained: boolean;
  summary: {
    monthLabel: string;
    monthlyRevenue: number;
    months: { month: string; label: string; revenue: number; completedOrders: number }[];
    completedOrders: number;
    pendingPayments: number;
    pendingPaymentAmount: number;
    waitingShipment: number;
    completedTotal: number;
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

  async function downloadCsv() {
    setError("");
    const response = await fetch("/api/seller/sales.csv", { credentials: "include" });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setError(body.error || "Could not download the sales history.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shop-it-sales.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!data && !error) return <p className="loading">Loading sales history…</p>;

  return (
    <section className="sheet">
      <div className="section-head">
        <div>
          <p className="eyebrow">Seller</p>
          <h1>Sales history</h1>
        </div>
        <button className="button" onClick={() => void downloadCsv()}>
          Download CSV
        </button>
      </div>
      <p>Every order for this shop stays in the sales history, including completed transactions.</p>
      {error && <p className="error">{error}</p>}
      {data && (
        <>
          <div className="stats">
            <article>
              <span>{data.summary.monthLabel} revenue</span>
              <strong>{money(data.summary.monthlyRevenue)}</strong>
            </article>
            <article>
              <span>Completed orders</span>
              <strong>{data.summary.completedOrders}</strong>
            </article>
            <article>
              <span>Pending payments</span>
              <strong>{data.summary.pendingPayments}</strong>
              <small>{money(data.summary.pendingPaymentAmount)} waiting</small>
            </article>
            <article>
              <span>Orders waiting for shipment</span>
              <strong>{data.summary.waitingShipment}</strong>
            </article>
          </div>
          {data.summary.months.length > 0 && (
            <ul className="months">
              {data.summary.months.map((month) => (
                <li key={month.month}>
                  <span>{month.label}</span>
                  <b>{money(month.revenue)}</b>
                  <small>
                    {month.completedOrders} completed {month.completedOrders === 1 ? "order" : "orders"}
                  </small>
                </li>
              ))}
            </ul>
          )}
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
