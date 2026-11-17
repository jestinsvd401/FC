import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORDER_LABELS, STOCK_LABELS, money } from "../../../shared/marketplace";
import { api } from "../../api";
import { useAuth } from "../../auth";
import { WorkflowMap } from "../../components/Stepper";
import type { CatalogProduct, MarketplaceOrder } from "../../types";

export function SellerOverview() {
  const { user } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api<{ products: CatalogProduct[] }>("/api/seller/products"),
      api<{ orders: MarketplaceOrder[] }>("/api/seller/orders"),
    ])
      .then(([inventory, sales]) => {
        setProducts(inventory.products);
        setOrders(sales.orders);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const open = orders.filter(
    (order) => order.status === "waiting_payment" || order.status === "payment_confirmed" || order.status === "ready_to_ship",
  );
  const payments = orders.filter((order) => order.status === "waiting_payment");
  const toShip = orders.filter((order) => order.status === "payment_confirmed" || order.status === "ready_to_ship");
  const low = products.filter((product) => product.stockStatus !== "in_stock" && product.listingStatus !== "removed");

  return (
    <section className="sheet">
      <p className="eyebrow">Seller desk</p>
      <h1>{user?.shopName}</h1>
      {user?.sellerStatus !== "approved" && (
        <p className="monitor">
          This seller application is {user?.sellerStatus}. Inventory changes stay locked until a platform admin approves the shop.
          Sellers cannot approve platform administrators.
        </p>
      )}
      {error && <p className="error">{error}</p>}
      <div className="stats">
        <article>
          <span>Orders to process</span>
          <strong>{open.length}</strong>
        </article>
        <article>
          <span>Payments to confirm</span>
          <strong>{payments.length}</strong>
        </article>
        <article>
          <span>Products to ship</span>
          <strong>{toShip.length}</strong>
        </article>
        <article>
          <span>Listings</span>
          <strong>{products.filter((product) => product.listingStatus === "active").length}</strong>
        </article>
        <article>
          <span>Need stock attention</span>
          <strong>{low.length}</strong>
        </article>
      </div>
      <div className="two">
        <div>
          <h2>Orders waiting on you</h2>
          {open.length === 0 ? (
            <p className="empty">No open orders.</p>
          ) : (
            <ul className="plain">
              {open.map((order) => (
                <li key={order.id}>
                  <Link to={`/sell/orders/${order.id}`}>{order.id}</Link>
                  <span>
                    {order.buyer.name} · {money(order.total)} · {ORDER_LABELS[order.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2>Stock to check</h2>
          {low.length === 0 ? (
            <p className="empty">No low or empty listings.</p>
          ) : (
            <ul className="plain">
              {low.map((product) => (
                <li key={product.id}>
                  <Link to={`/sell/products/${product.id}/edit`}>{product.name}</Link>
                  <span>
                    {product.quantity} · {STOCK_LABELS[product.stockStatus]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <h2>How a sale moves</h2>
      <WorkflowMap />
    </section>
  );
}
