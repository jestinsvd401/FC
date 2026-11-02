import { NextResponse } from "next/server";
import { checkInSchema } from "@/lib/admin-schemas";
import { jsonError, readJson } from "@/lib/http";
import { listCheckIns, saveCheckIn } from "@/lib/support-data";

export async function GET() {
  try {
    return NextResponse.json(await listCheckIns());
  } catch (error) {
    console.error(error);
    return jsonError("Could not load check-ins", 500);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await readJson(request, checkInSchema);
    if ("error" in parsed) return parsed.error;
    return NextResponse.json(await saveCheckIn(parsed.data));
  } catch (error) {
    console.error(error);
    return jsonError("Could not save check-in", 500);
  }
}
