import { NextResponse } from "next/server";
import { chatMessageSchema } from "@/lib/admin-schemas";
import { jsonError, readJson } from "@/lib/http";
import { addMessage, listMessages, volunteerReply } from "@/lib/support-data";

export async function GET(request: Request) {
  try {
    const sessionId = new URL(request.url).searchParams.get("sessionId");
    if (!sessionId) return jsonError("sessionId required");
    return NextResponse.json({ messages: listMessages(sessionId) });
  } catch (error) {
    console.error(error);
    return jsonError("Could not load messages", 500);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await readJson(request, chatMessageSchema);
    if ("error" in parsed) return parsed.error;
    const workerMessage = addMessage(parsed.data.sessionId, parsed.data.body.trim(), "worker");
    const reply = volunteerReply(parsed.data.sessionId);
    return NextResponse.json({ messages: [workerMessage, reply] });
  } catch (error) {
    console.error(error);
    return jsonError("Could not send message", 500);
  }
}
