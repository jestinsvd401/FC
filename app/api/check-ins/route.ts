import { NextResponse } from "next/server";
import { listCheckIns, saveCheckIn } from "@/lib/support-data";

export async function GET() {
  const result = await listCheckIns();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    moodScore?: number;
    stressLevel?: number;
    notes?: string;
    language?: string;
  };
  const result = await saveCheckIn({
    moodScore: Number(body.moodScore) || 3,
    stressLevel: Number(body.stressLevel) || 3,
    notes: body.notes ?? "",
    language: body.language ?? "en",
  });
  return NextResponse.json(result);
}
