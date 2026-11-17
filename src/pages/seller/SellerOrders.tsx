import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORDER_LABELS, PAYMENT_LABELS, formatWhen, money } from "../../../shared/marketplace";
import { api } from "../../api";
import type { MarketplaceOrder } from "../../types";

export function SellerOrders() {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ orders: MarketplaceOrder[] }>("/api/seller/orders")
      .then((data) => setOrders(data.orders))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <section className="sheet">
      <p className="eyebrow">Fulfillment</p>
      <h1>Orders from buyers</h1>
      <p>Each row is a buyer action that landed on this shop. Open an order to confirm payment, prepare it, and ship it.</p>
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
            {orders.map((order) => (
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
      {orders.length === 0 && <p className="empty">No orders for this shop yet.</p>}
    </section>
  );
}
