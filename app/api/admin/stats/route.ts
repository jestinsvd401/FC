import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminStats } from "@/lib/admin-data";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await adminStats());
}
