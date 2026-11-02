import { NextResponse } from "next/server";
import { listClinics } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const language = searchParams.get("language") ?? undefined;
  const interpreter = searchParams.get("interpreter") === "1";
  const { clinics, source } = await listClinics({ q, language, interpreter });
  return NextResponse.json({ clinics, source });
}
