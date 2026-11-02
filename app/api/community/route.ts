import { NextResponse } from "next/server";
import { COMMUNITY_EVENTS, COMMUNITY_GROUPS } from "@/lib/community-catalog";

export async function GET() {
  return NextResponse.json({
    groups: COMMUNITY_GROUPS,
    events: COMMUNITY_EVENTS,
    source: "catalog",
  });
}
