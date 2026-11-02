import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({
    ok: true,
    product: "Migrant Helpdesk",
    prisma: Boolean(prisma),
  });
}
