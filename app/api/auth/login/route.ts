import { NextResponse } from "next/server";
import { demoAdminPassword, setAdminSession } from "@/lib/admin-auth";
import { loginSchema } from "@/lib/admin-schemas";
import { findUserByEmail } from "@/lib/admin-data";
import { jsonError, readJson } from "@/lib/http";

export async function POST(request: Request) {
  const parsed = await readJson(request, loginSchema);
  if ("error" in parsed) return parsed.error;
  const { email, password } = parsed.data;
  if (password !== demoAdminPassword()) {
    return jsonError("Invalid credentials", 401);
  }
  const user = await findUserByEmail(email.toLowerCase());
  if (!user || user.role !== "ADMIN") {
    return jsonError("Admin only", 403);
  }
  await setAdminSession(user.email);
  return NextResponse.json({ ok: true, email: user.email });
}
