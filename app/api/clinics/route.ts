import { NextResponse } from "next/server";
import { z } from "zod";
import { listClinics } from "@/lib/data";
import { jsonError } from "@/lib/http";

const querySchema = z.object({
  q: z.string().max(80).optional(),
  language: z.string().max(12).optional(),
  interpreter: z.enum(["0", "1"]).optional(),
});

export async function GET(request: Request) {
  try {
    const parsed = querySchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    );
    if (!parsed.success) return jsonError("Validation failed", 400);
    const { clinics, source } = await listClinics({
      q: parsed.data.q,
      language: parsed.data.language,
      interpreter: parsed.data.interpreter === "1",
    });
    return NextResponse.json({ clinics, source });
  } catch (error) {
    console.error(error);
    return jsonError("Could not load clinics", 500);
  }
}
