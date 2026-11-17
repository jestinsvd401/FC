import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORDER_LABELS, formatWhen, money } from "../../shared/marketplace";
import { api } from "../api";
import type { MarketplaceOrder } from "../types";

export function BuyerOrders() {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ orders: MarketplaceOrder[] }>("/api/orders")
      .then((data) => setOrders(data.orders))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <section className="sheet">
      <p className="eyebrow">Buyer</p>
      <h1>Order history</h1>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <p className="empty">No orders yet. Add a product to the cart and submit one.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Seller</th>
              <th>Order date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link to={`/orders/${order.id}`}>{order.id}</Link>
                </td>
                <td>{order.seller.shopName}</td>
                <td>{formatWhen(order.createdAt)}</td>
                <td>{money(order.total)}</td>
                <td>{ORDER_LABELS[order.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
