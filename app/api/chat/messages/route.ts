import { NextResponse } from "next/server";
import { addMessage, listMessages, volunteerReply } from "@/lib/support-data";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }
  return NextResponse.json({ messages: listMessages(sessionId) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { sessionId?: string; body?: string };
  if (!body.sessionId || !body.body?.trim()) {
    return NextResponse.json({ error: "sessionId and body required" }, { status: 400 });
  }
  const workerMessage = addMessage(body.sessionId, body.body.trim(), "worker");
  const reply = volunteerReply(body.sessionId);
  return NextResponse.json({ messages: [workerMessage, reply] });
}
