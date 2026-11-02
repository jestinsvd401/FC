"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { loginSchema } from "@/lib/admin-schemas";
import { ErrorState } from "@/components/ui/ErrorState";

type FormValues = { email: string; password: string };

export default function AdminLoginPage() {
  const { dictionary } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@example.com", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      setError(dictionary.admin.loginFailed);
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">{dictionary.admin.loginTitle}</h1>
      <p className="font-semibold">{dictionary.admin.loginHint}</p>
      {error ? <ErrorState message={error} /> : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...form.register("email")}
          type="email"
          className="min-h-14 w-full min-w-0 rounded-xl border-4 border-zinc-950 px-3 text-lg font-semibold"
          placeholder="admin@example.com"
        />
        <input
          {...form.register("password")}
          type="password"
          className="min-h-14 w-full min-w-0 rounded-xl border-4 border-zinc-950 px-3 text-lg font-semibold"
        />
        <button
          type="submit"
          className="min-h-14 w-full rounded-xl border-4 border-zinc-950 bg-zinc-950 text-lg font-black text-amber-300"
        >
          {dictionary.admin.login}
        </button>
      </form>
    </div>
  );
}
