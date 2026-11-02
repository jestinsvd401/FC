import { cookies } from "next/headers";
import { jsonError } from "@/lib/http";

export const ADMIN_COOKIE = "mh_role";
export const ADMIN_EMAIL_COOKIE = "mh_email";

export function demoAdminPassword() {
  return process.env.ADMIN_DEMO_PASSWORD ?? "helpdesk-admin";
}

export async function getAdminRole() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value ?? null;
}

export async function requireAdmin() {
  const role = await getAdminRole();
  if (role !== "ADMIN") {
    return jsonError("Admin only", 401);
  }
  return null;
}

export async function setAdminSession(email: string) {
  const jar = await cookies();
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
  jar.set(ADMIN_COOKIE, "ADMIN", options);
  jar.set(ADMIN_EMAIL_COOKIE, email, options);
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  jar.delete(ADMIN_EMAIL_COOKIE);
}
