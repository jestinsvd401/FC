import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ORDER_LABELS, formatWhen, money } from "../../shared/marketplace";
import { api } from "../api";
import type { MarketplaceOrder } from "../types";

export function BuyerOrders() {
  const [params, setParams] = useSearchParams();
  const history = params.get("view") === "history";
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ orders: MarketplaceOrder[] }>("/api/orders")
      .then((data) => setOrders(data.orders))
      .catch((err: Error) => setError(err.message));
  }, []);

  const open = orders.filter((order) => order.status !== "completed");
  const purchases = orders.filter((order) => order.status === "completed");
  const shown = history ? purchases : open;

  return (
    <section className="sheet">
      <p className="eyebrow">Buyer</p>
      <h1>{history ? "Purchase history" : "My orders"}</h1>
      <p>
        {history
          ? "Completed purchases stay here as your record. They are not removed after delivery."
          : "Open orders keep their order status until the sale is completed. Finished purchases move to purchase history and remain there."}
      </p>
      <div className="filters">
        <button className={!history ? "on" : ""} onClick={() => setParams({})}>
          My orders ({open.length})
        </button>
        <button className={history ? "on" : ""} onClick={() => setParams({ view: "history" })}>
          Purchase history ({purchases.length})
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {shown.length === 0 ? (
        <p className="empty">{history ? "No completed purchases yet." : "No open orders. Browse the floor to start one."}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Seller</th>
                <th>Order date</th>
                <th>Total</th>
                <th>Order status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((order) => (
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
        </div>
      )}
    </section>
  );
}
