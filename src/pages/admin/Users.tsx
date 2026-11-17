import { useEffect, useState } from "react";
import { formatWhen } from "../../../shared/marketplace";
import { api } from "../../api";
import type { PublicUser } from "../../types";

const roleLabel = { buyer: "Buyer", seller: "Seller", admin: "Platform admin" };

export function Users() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [error, setError] = useState("");

  function load() {
    return api<{ users: PublicUser[] }>("/api/admin/users").then((data) => setUsers(data.users));
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  async function act(id: string, action: string) {
    setError("");
    try {
      await api(`/api/admin/users/${id}`, { method: "PATCH", body: { action } });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the user.");
    }
  }

  return (
    <section className="sheet">
      <p className="eyebrow">People</p>
      <h1>Manage users</h1>
      <p className="monitor">
        Approve seller applications, or suspend a buyer or seller. Platform administrator access cannot be granted from this desk.
      </p>
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Seller</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{roleLabel[person.role]}</td>
                <td>{person.role === "seller" ? person.sellerStatus : "—"}</td>
                <td>{formatWhen(person.createdAt)}</td>
                <td className="action-cell">
                  {person.role === "admin" && <span>Platform owner</span>}
                  {person.role === "seller" && person.sellerStatus !== "approved" && (
                    <button onClick={() => void act(person.id, "approve")}>Approve seller</button>
                  )}
                  {person.role === "seller" && person.sellerStatus === "pending" && (
                    <button onClick={() => void act(person.id, "reject")}>Reject</button>
                  )}
                  {person.role !== "admin" && !person.suspended && (
                    <button onClick={() => void act(person.id, "suspend")}>Suspend</button>
                  )}
                  {person.suspended && <button onClick={() => void act(person.id, "restore")}>Restore</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
