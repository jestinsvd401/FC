import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatWhen } from "../../../shared/marketplace";
import { api } from "../../api";
import type { ActivityItem } from "../../types";

export function Activity() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ activity: ActivityItem[] }>("/api/admin/activity")
      .then((data) => setActivity(data.activity))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <section className="sheet">
      <p className="eyebrow">Review</p>
      <h1>Marketplace activity</h1>
      <p>Listings, approvals, and order movement across shops. This feed is read-only.</p>
      {error && <p className="error">{error}</p>}
      <ol className="trail">
        {activity.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.message}</strong>
              <p>{item.actorName}</p>
            </div>
            <small>
              {formatWhen(item.at)}
              {item.orderId && (
                <>
                  {" "}
                  · <Link to={`/admin/transactions/${item.orderId}`}>{item.orderId}</Link>
                </>
              )}
            </small>
          </li>
        ))}
      </ol>
    </section>
  );
}
