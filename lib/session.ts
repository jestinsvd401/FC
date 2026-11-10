import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";

export type Role = "teacher" | "student" | "parent";

export type Profile = {
  id: string;
  name: string;
  role: Role;
};

export type ClassRoom = {
  id: string;
  name_en: string;
  name_zh: string;
  name_hi: string;
};

export type Ward = { id: string; name: string };

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get("locale")?.value;
  return isLocale(value) ? value : "en";
}

export async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;
  if (!id || typeof id !== "string") redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role")
    .eq("id", id)
    .maybeSingle();

  if (!profile || !isRole(profile.role)) redirect("/");
  return { supabase, profile: profile as Profile };
}

function isRole(value: string): value is Role {
  return value === "teacher" || value === "student" || value === "parent";
}

export async function loadContext(wardParam?: string) {
  const { supabase, profile } = await requireUser();

  if (profile.role === "teacher") {
    const { data: room } = await supabase
      .from("classes")
      .select("id, name_en, name_zh, name_hi")
      .eq("teacher_id", profile.id)
      .maybeSingle();
    const { data: students } = room
      ? await supabase
          .from("enrollments")
          .select("student_id, profiles(name)")
          .eq("class_id", room.id)
      : { data: [] };
    return {
      supabase,
      profile,
      room: room as ClassRoom | null,
      students: sortStudents(students ?? []),
      wards: [] as Ward[],
      focusId: null as string | null,
    };
  }

  if (profile.role === "student") {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("class_id")
      .eq("student_id", profile.id)
      .maybeSingle();
    const room = enrollment ? await loadClass(supabase, enrollment.class_id) : null;
    return {
      supabase,
      profile,
      room,
      students: [{ id: profile.id, name: profile.name }],
      wards: [] as Ward[],
      focusId: profile.id,
    };
  }

  const { data: links } = await supabase
    .from("guardians")
    .select("student_id, profiles!guardians_student_id_fkey(name)")
    .eq("parent_id", profile.id);
  const wards = (links ?? [])
    .map((link) => ({
      id: link.student_id as string,
      name: profileName(link.profiles),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const focusId = wards.some((ward) => ward.id === wardParam) ? wardParam! : wards[0]?.id ?? null;
  const { data: enrollment } = focusId
    ? await supabase.from("enrollments").select("class_id").eq("student_id", focusId).maybeSingle()
    : { data: null };
  const room = enrollment ? await loadClass(supabase, enrollment.class_id) : null;
  return {
    supabase,
    profile,
    room,
    students: wards.filter((ward) => ward.id === focusId),
    wards,
    focusId,
  };
}

async function loadClass(
  supabase: Awaited<ReturnType<typeof createClient>>,
  classId: string,
): Promise<ClassRoom | null> {
  const { data } = await supabase
    .from("classes")
    .select("id, name_en, name_zh, name_hi")
    .eq("id", classId)
    .maybeSingle();
  return (data as ClassRoom | null) ?? null;
}

function sortStudents(
  rows: { student_id: string; profiles: { name: string } | { name: string }[] | null }[],
) {
  return rows
    .map((row) => ({ id: row.student_id, name: profileName(row.profiles) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function profileName(value: { name: string } | { name: string }[] | null) {
  if (!value) return "";
  if (Array.isArray(value)) return value[0]?.name ?? "";
  return value.name;
}
