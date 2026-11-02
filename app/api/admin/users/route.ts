import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listQuerySchema, userRoleSchema } from "@/lib/admin-schemas";
import { adminListUsers, adminSetUserRole } from "@/lib/admin-data";
import { jsonError, readJson } from "@/lib/http";

export async function GET(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = listQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams.entries()),
  );
  if (!parsed.success) return jsonError("Validation failed", 400);
  return NextResponse.json(
    await adminListUsers(parsed.data.q ?? "", parsed.data.page, parsed.data.pageSize),
  );
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = await readJson(request, userRoleSchema);
  if ("error" in parsed) return parsed.error;
  const result = await adminSetUserRole(parsed.data.id, parsed.data.role);
  if (!result.item) return jsonError("User not found", 404);
  return NextResponse.json(result);
}
