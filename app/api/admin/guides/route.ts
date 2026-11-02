import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { guidePatchSchema, guideSchema, listQuerySchema } from "@/lib/admin-schemas";
import { adminDeleteGuide, adminListGuides, adminSaveGuide } from "@/lib/admin-data";
import { jsonError, readJson } from "@/lib/http";

export async function GET(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = listQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams.entries()),
  );
  if (!parsed.success) return jsonError("Validation failed", 400);
  return NextResponse.json(
    await adminListGuides(
      parsed.data.q ?? "",
      parsed.data.page,
      parsed.data.pageSize,
      parsed.data.category,
      parsed.data.language,
    ),
  );
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = await readJson(request, guideSchema);
  if ("error" in parsed) return parsed.error;
  return NextResponse.json(
    await adminSaveGuide({ ...parsed.data, imageUrl: parsed.data.imageUrl ?? null }),
  );
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = await readJson(request, guidePatchSchema);
  if ("error" in parsed) return parsed.error;
  return NextResponse.json(
    await adminSaveGuide({
      category: parsed.data.category ?? "SAFETY",
      language: parsed.data.language ?? "en",
      title: parsed.data.title ?? "",
      content: parsed.data.content ?? "",
      imageUrl: parsed.data.imageUrl ?? null,
      id: parsed.data.id,
    }),
  );
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("id required", 400);
  return NextResponse.json(await adminDeleteGuide(id));
}
