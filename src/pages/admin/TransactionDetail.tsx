import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api";
import { OrderView } from "../../components/OrderView";
import type { MarketplaceOrder } from "../../types";

export function TransactionDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<MarketplaceOrder | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ order: MarketplaceOrder }>(`/api/orders/${id}`)
      .then((data) => setOrder(data.order))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  if (!order && error) {
    return (
      <section className="panel narrow">
        <h1>Transaction unavailable</h1>
        <p>{error}</p>
      </section>
    );
  }
  if (!order) return <p className="loading">Loading transaction…</p>;

  return (
    <section className="sheet">
      <Link to="/admin">All transactions</Link>
      <OrderView order={order} mode="admin" />
    </section>
  );
}
