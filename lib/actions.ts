"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { requireUser } from "@/lib/session";

const statuses = new Set(["present", "absent", "late", "excused"]);

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/?error=1");
  redirect("/home");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function setLocale(formData: FormData) {
  const locale = String(formData.get("locale") ?? "");
  if (isLocale(locale)) {
    const store = await cookies();
    store.set("locale", locale, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  }
  redirect(safePath(String(formData.get("next") ?? "/home")));
}

export async function setAttendance(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile.role !== "teacher") redirect("/attendance");
  const classId = uuid(formData.get("classId"));
  const studentId = uuid(formData.get("studentId"));
  const day = dateValue(formData.get("day"));
  const status = String(formData.get("status") ?? "");
  const month = String(formData.get("month") ?? "");
  if (!classId || !studentId || !day || !statuses.has(status)) redirect(monthPath("/attendance", month));

  const { data: existing } = await supabase
    .from("attendance")
    .select("id")
    .eq("class_id", classId)
    .eq("student_id", studentId)
    .eq("day", day)
    .maybeSingle();

  const query = existing
    ? supabase.from("attendance").update({ status }).eq("id", existing.id)
    : supabase.from("attendance").insert({ class_id: classId, student_id: studentId, day, status });
  await query;
  revalidatePath("/attendance");
  revalidatePath("/home");
  redirect(monthPath("/attendance", month));
}

export async function saveScore(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile.role !== "teacher") redirect("/scores");
  const locale = await currentLocale();
  const classId = uuid(formData.get("classId"));
  const studentId = uuid(formData.get("studentId"));
  const id = uuid(formData.get("id"));
  const subject = clip(formData.get("subject"), 80);
  const title = clip(formData.get("title"), 120);
  const score = numberValue(formData.get("score"));
  const maxScore = numberValue(formData.get("maxScore"));
  const takenOn = dateValue(formData.get("date"));
  if (!classId || !studentId || !subject || !title || score === null || maxScore === null || score > maxScore || !takenOn) {
    redirect("/scores?error=1");
  }

  const fields = {
    ...localeFields(locale, "subject", subject),
    ...localeFields(locale, "title", title),
    score,
    max_score: maxScore,
    taken_on: takenOn,
  };
  const query = id
    ? supabase.from("scores").update(fields).eq("id", id)
    : supabase.from("scores").insert({ ...fields, class_id: classId, student_id: studentId });
  const { error } = await query;
  if (error) redirect("/scores?error=1");
  revalidatePath("/scores");
  revalidatePath("/home");
  redirect("/scores");
}

export async function deleteScore(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile.role !== "teacher") redirect("/scores");
  const id = uuid(formData.get("id"));
  if (id) await supabase.from("scores").delete().eq("id", id);
  revalidatePath("/scores");
  revalidatePath("/home");
  redirect("/scores");
}

export async function saveEvent(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile.role !== "teacher") redirect("/events");
  const locale = await currentLocale();
  const classId = uuid(formData.get("classId"));
  const id = uuid(formData.get("id"));
  const title = clip(formData.get("title"), 120);
  const body = clip(formData.get("body"), 1000);
  const eventDate = dateValue(formData.get("date"));
  const month = eventDate?.slice(0, 7) ?? "";
  if (!classId || !title || !eventDate) redirect(monthPath("/events", month, "error=1"));

  const fields = {
    ...localeFields(locale, "title", title),
    ...localeFields(locale, "body", body),
    event_date: eventDate,
  };
  const query = id
    ? supabase.from("events").update(fields).eq("id", id)
    : supabase.from("events").insert({ ...fields, class_id: classId, created_by: profile.id });
  const { error } = await query;
  if (error) redirect(monthPath("/events", month, "error=1"));
  revalidatePath("/events");
  revalidatePath("/home");
  redirect(monthPath("/events", month));
}

export async function deleteEvent(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile.role !== "teacher") redirect("/events");
  const id = uuid(formData.get("id"));
  const month = String(formData.get("month") ?? "");
  if (id) await supabase.from("events").delete().eq("id", id);
  revalidatePath("/events");
  revalidatePath("/home");
  redirect(monthPath("/events", month));
}

export async function saveActivity(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile.role !== "teacher") redirect("/activities");
  const locale = await currentLocale();
  const classId = uuid(formData.get("classId"));
  const studentId = uuid(formData.get("studentId"));
  const id = uuid(formData.get("id"));
  const name = clip(formData.get("name"), 120);
  const category = clip(formData.get("category"), 80);
  const schedule = clip(formData.get("schedule"), 80);
  const description = clip(formData.get("description"), 1000);
  if (!classId || !studentId || !name) redirect("/activities?error=1");

  const fields = {
    ...localeFields(locale, "name", name),
    ...localeFields(locale, "category", category),
    ...localeFields(locale, "schedule", schedule),
    ...localeFields(locale, "description", description),
  };
  const query = id
    ? supabase.from("activities").update(fields).eq("id", id)
    : supabase.from("activities").insert({ ...fields, class_id: classId, student_id: studentId });
  const { error } = await query;
  if (error) redirect("/activities?error=1");
  revalidatePath("/activities");
  revalidatePath("/home");
  redirect("/activities");
}

export async function deleteActivity(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile.role !== "teacher") redirect("/activities");
  const id = uuid(formData.get("id"));
  if (id) await supabase.from("activities").delete().eq("id", id);
  revalidatePath("/activities");
  revalidatePath("/home");
  redirect("/activities");
}

export async function addPost(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile.role === "parent") redirect("/home");
  const classId = uuid(formData.get("classId"));
  const body = clip(formData.get("body"), 2000);
  if (!classId || !body) redirect("/discussion?error=1");
  const { error } = await supabase.from("posts").insert({
    class_id: classId,
    author_id: profile.id,
    body,
  });
  if (error) redirect("/discussion?error=1");
  revalidatePath("/discussion");
  redirect("/discussion");
}

export async function deletePost(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile.role === "parent") redirect("/home");
  const id = uuid(formData.get("id"));
  if (id) await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/discussion");
  redirect("/discussion");
}

function localeFields(locale: Locale, key: string, value: string) {
  const suffix = locale === "zh-Hant" ? "zh" : locale === "hi" ? "hi" : "en";
  return { [`${key}_${suffix}`]: value };
}

async function currentLocale(): Promise<Locale> {
  const value = (await cookies()).get("locale")?.value;
  return isLocale(value) ? value : "en";
}

function uuid(value: FormDataEntryValue | null) {
  const text = String(value ?? "");
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(text) ? text : "";
}

function dateValue(value: FormDataEntryValue | null) {
  const text = String(value ?? "");
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function numberValue(value: FormDataEntryValue | null) {
  const number = Number(String(value ?? ""));
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.round(number * 100) / 100;
}

function clip(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function safePath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/home";
  return value;
}

function monthPath(path: string, month: string, extra?: string) {
  const safeMonth = /^\d{4}-\d{2}$/.test(month) ? month : "";
  const params = new URLSearchParams();
  if (safeMonth) params.set("month", safeMonth);
  if (extra) {
    const [key, val] = extra.split("=");
    if (key && val) params.set(key, val);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
