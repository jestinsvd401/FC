import type { ReactNode } from "react";
import { ORDER_LABELS, PAYMENT_LABELS, formatAddress, formatWhen, money } from "../../shared/marketplace";
import type { MarketplaceOrder } from "../types";
import { Stepper } from "./Stepper";

export function OrderView({
  order,
  mode,
  actions,
}: {
  order: MarketplaceOrder;
  mode: "buyer" | "seller" | "admin";
  actions?: ReactNode;
}) {
  return (
    <article className="order-sheet">
      <header className="order-head">
        <div>
          <p className="eyebrow">Order ID</p>
          <h1>{order.id}</h1>
        </div>
        <div>
          <p className="eyebrow">Order date</p>
          <strong>{formatWhen(order.createdAt)}</strong>
        </div>
        <div>
          <p className="eyebrow">Payment status</p>
          <strong className={`pay ${order.paymentStatus}`}>{PAYMENT_LABELS[order.paymentStatus]}</strong>
        </div>
        <div>
          <p className="eyebrow">Order status</p>
          <strong>{ORDER_LABELS[order.status]}</strong>
        </div>
      </header>
      <Stepper status={order.status} />
      {mode === "admin" && (
        <p className="monitor">
          Monitoring only. This transaction stays in the platform records after it is completed. A platform administrator reads the buyer, seller, status, and amount, and does not confirm payment, prepare goods, ship, or buy.
        </p>
      )}
      <div className="order-grid">
        <section>
          <h2>{mode === "buyer" ? "Seller" : "Buyer details"}</h2>
          {mode === "buyer" ? (
            <>
              <p className="lead">{order.seller.shopName}</p>
              <p>{order.seller.name}</p>
            </>
          ) : (
            <>
              <p className="lead">{order.buyer.name}</p>
              <p>{order.buyer.email}</p>
              <pre>{formatAddress(order.address)}</pre>
            </>
          )}
          {mode === "admin" && (
            <>
              <h2>Seller</h2>
              <p className="lead">{order.seller.shopName}</p>
              <p>
                {order.seller.name} · {order.seller.email}
              </p>
            </>
          )}
        </section>
        <section>
          <h2>Products</h2>
          <ul className="lines">
            {order.items.map((item) => (
              <li key={item.productId}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.quantity} × {money(item.price)}
                  </p>
                </div>
                <b>{money(item.price * item.quantity)}</b>
              </li>
            ))}
          </ul>
          <p className="total">
            Total amount <b>{money(order.total)}</b>
          </p>
          {order.shipmentNote && <p className="note">Shipment note: {order.shipmentNote}</p>}
          {order.status === "ready_to_ship" && (
            <p className="note">{order.prepared ? "Product prepared." : "Product still needs to be prepared."}</p>
          )}
        </section>
      </div>
      {actions}
      <section>
        <h2>{mode === "admin" ? "Transaction history" : mode === "buyer" ? "Order status" : "Fulfillment history"}</h2>
        <ol className="trail">
          {order.timeline.map((event, index) => (
            <li key={`${event.at}-${index}`}>
              <div>
                <strong>{ORDER_LABELS[event.status]}</strong>
                <p>{event.note}</p>
              </div>
              <small>
                {event.actorName} · {formatWhen(event.at)}
              </small>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
