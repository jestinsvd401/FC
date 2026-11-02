"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { ClinicRecord } from "@/types/catalog";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

const formSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(4),
  phone: z.string().min(6),
  hasInterpreter: z.boolean(),
  languagesSupported: z.string().min(2),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminClinicsPage() {
  const { dictionary } = useLanguage();
  const [items, setItems] = useState<ClinicRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      hasInterpreter: true,
      languagesSupported: "zh-TW,en",
    },
  });

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ q, page: String(page), pageSize: "8" });
    void fetch(`/api/admin/clinics?${params}`)
      .then((response) => {
        if (!response.ok) throw new Error("list");
        return response.json() as Promise<{ items: ClinicRecord[]; total: number }>;
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

  async function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      hasInterpreter: values.hasInterpreter,
      languagesSupported: values.languagesSupported.split(",").map((item) => item.trim()).filter(Boolean),
    };
    const response = await fetch("/api/admin/clinics", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { ...payload, id: editing } : payload),
    });
    if (response.ok) {
      setEditing(null);
      form.reset();
      load();
    }
  }

  async function remove(id: string) {
    await fetch(`/api/admin/clinics?id=${id}`, { method: "DELETE" });
    load();
  }

  const pages = Math.max(1, Math.ceil(total / 8));

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">{dictionary.admin.clinics}</h1>
      <input
        value={q}
        onChange={(event) => {
          setPage(1);
          setQ(event.target.value);
        }}
        placeholder={dictionary.common.search}
        className="min-h-12 w-full min-w-0 rounded-xl border-4 border-zinc-950 px-3 font-semibold"
      />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 rounded-2xl border-4 border-zinc-950 bg-white p-3">
        <input {...form.register("name")} placeholder={dictionary.admin.name} className="min-h-12 w-full min-w-0 rounded-xl border-4 border-zinc-950 px-3 font-semibold" />
        <input {...form.register("address")} placeholder={dictionary.admin.address} className="min-h-12 w-full min-w-0 rounded-xl border-4 border-zinc-950 px-3 font-semibold" />
        <input {...form.register("phone")} placeholder={dictionary.admin.phone} className="min-h-12 w-full min-w-0 rounded-xl border-4 border-zinc-950 px-3 font-semibold" />
        <input {...form.register("languagesSupported")} placeholder="zh-TW,en,id" className="min-h-12 w-full min-w-0 rounded-xl border-4 border-zinc-950 px-3 font-semibold" />
        <label className="flex min-h-12 items-center gap-2 font-black">
          <input type="checkbox" {...form.register("hasInterpreter")} className="size-6" />
          {dictionary.health.interpreterOnly}
        </label>
        <button type="submit" className="min-h-12 w-full rounded-xl border-4 border-zinc-950 bg-amber-300 font-black">
          {editing ? dictionary.admin.save : dictionary.admin.add}
        </button>
      </form>
      {loading ? <CardSkeleton /> : null}
      {error ? <ErrorState message={dictionary.common.error} onRetry={load} /> : null}
      {!loading && !error && items.length === 0 ? <EmptyState title={dictionary.common.noResults} /> : null}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border-4 border-zinc-950 bg-white p-3">
            <p className="font-black break-words">{item.name}</p>
            <p className="text-sm font-semibold break-words">{item.address}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="min-h-11 rounded-lg border-4 border-zinc-950 px-3 font-black"
                onClick={() => {
                  setEditing(item.id);
                  form.reset({
                    name: item.name,
                    address: item.address,
                    phone: item.phone,
                    hasInterpreter: item.hasInterpreter,
                    languagesSupported: item.languagesSupported.join(","),
                  });
                }}
              >
                {dictionary.admin.edit}
              </button>
              <button
                type="button"
                className="min-h-11 rounded-lg border-4 border-zinc-950 bg-red-600 px-3 font-black text-white"
                onClick={() => void remove(item.id)}
              >
                {dictionary.admin.delete}
              </button>
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
