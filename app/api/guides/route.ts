import { NextResponse } from "next/server";
import { z } from "zod";
import { listGuides } from "@/lib/data";
import { jsonError } from "@/lib/http";

const querySchema = z.object({
  category: z.enum(["HEALTH", "SAFETY", "HOME_COUNTRY"]).optional(),
  language: z.string().max(12).optional(),
});

export async function GET(request: Request) {
  try {
    const parsed = querySchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    );
    if (!parsed.success) return jsonError("Validation failed", 400);
    const { guides, source } = await listGuides(parsed.data);
    return NextResponse.json({ guides, source });
  } catch (error) {
    console.error(error);
    return jsonError("Could not load guides", 500);
  }
}
