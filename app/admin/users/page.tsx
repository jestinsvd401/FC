"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { AdminUser } from "@/lib/memory-store";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminUsersPage() {
  const { dictionary } = useLanguage();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ q, page: String(page), pageSize: "8" });
    void fetch(`/api/admin/users?${params}`)
      .then((response) => {
        if (!response.ok) throw new Error("list");
        return response.json() as Promise<{ items: AdminUser[]; total: number }>;
      })
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [page, q]);

  useEffect(() => {
    load();
  }, [load]);

  async function setRole(id: string, role: AdminUser["role"]) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    load();
  }

  const pages = Math.max(1, Math.ceil(total / 8));

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">{dictionary.admin.users}</h1>
      <input
        value={q}
        onChange={(event) => {
          setPage(1);
          setQ(event.target.value);
        }}
        placeholder={dictionary.common.search}
        className="min-h-12 w-full min-w-0 rounded-xl border-4 border-zinc-950 px-3 font-semibold"
      />
      {loading ? <CardSkeleton /> : null}
      {error ? <ErrorState message={dictionary.common.error} onRetry={load} /> : null}
      {!loading && !error && items.length === 0 ? <EmptyState title={dictionary.common.noResults} /> : null}
      <ul className="space-y-2">
        {items.map((user) => (
          <li key={user.id} className="rounded-xl border-4 border-zinc-950 bg-white p-3">
            <p className="font-black break-all">{user.email}</p>
            <p className="text-sm font-bold">{user.role}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["WORKER", "VOLUNTEER", "ADMIN"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => void setRole(user.id, role)}
                  className={`min-h-11 rounded-lg border-4 border-zinc-950 px-3 text-sm font-black ${
                    user.role === role ? "bg-zinc-950 text-amber-300" : "bg-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="min-h-12 flex-1 rounded-xl border-4 border-zinc-950 font-black disabled:opacity-40">
          {dictionary.admin.prev}
        </button>
        <button type="button" disabled={page >= pages} onClick={() => setPage((value) => value + 1)} className="min-h-12 flex-1 rounded-xl border-4 border-zinc-950 font-black disabled:opacity-40">
          {dictionary.admin.next}
        </button>
      </div>
    </div>
  );
}
