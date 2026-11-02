import { NextResponse } from "next/server";
import {
  activateChatSession,
  createChatSession,
  getChatSession,
} from "@/lib/support-data";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const result = await getChatSession(id);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { language?: string };
  const result = await createChatSession(body.language ?? "en");
  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const result = await activateChatSession(body.id);
  return NextResponse.json(result);
}
