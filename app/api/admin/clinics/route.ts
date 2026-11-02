import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { clinicSchema, listQuerySchema } from "@/lib/admin-schemas";
import {
  adminDeleteClinic,
  adminListClinics,
  adminSaveClinic,
} from "@/lib/admin-data";
import { jsonError, readJson } from "@/lib/http";

export async function GET(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = listQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams.entries()),
  );
  if (!parsed.success) return jsonError("Validation failed", 400);
  return NextResponse.json(
    await adminListClinics(parsed.data.q ?? "", parsed.data.page, parsed.data.pageSize),
  );
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = await readJson(request, clinicSchema);
  if ("error" in parsed) return parsed.error;
  return NextResponse.json(await adminSaveClinic(parsed.data));
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = await readJson(request, clinicSchema.extend({ id: z.string().min(1) }));
  if ("error" in parsed) return parsed.error;
  return NextResponse.json(await adminSaveClinic(parsed.data));
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("id required", 400);
  return NextResponse.json(await adminDeleteClinic(id));
}
