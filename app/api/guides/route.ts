import { NextResponse } from "next/server";
import { listGuides } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const language = searchParams.get("language") ?? undefined;
  const { guides, source } = await listGuides({ category, language });
  return NextResponse.json({ guides, source });
}
