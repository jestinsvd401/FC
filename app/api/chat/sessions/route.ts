import { NextResponse } from "next/server";
import { chatActivateSchema, chatCreateSchema } from "@/lib/admin-schemas";
import { jsonError, readJson } from "@/lib/http";
import {
  activateChatSession,
  createChatSession,
  getChatSession,
} from "@/lib/support-data";

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return jsonError("id required");
    return NextResponse.json(await getChatSession(id));
  } catch (error) {
    console.error(error);
    return jsonError("Could not load session", 500);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await readJson(request, chatCreateSchema);
    if ("error" in parsed) return parsed.error;
    return NextResponse.json(await createChatSession(parsed.data.language));
  } catch (error) {
    console.error(error);
    return jsonError("Could not create session", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const parsed = await readJson(request, chatActivateSchema);
    if ("error" in parsed) return parsed.error;
    return NextResponse.json(await activateChatSession(parsed.data.id));
  } catch (error) {
    console.error(error);
    return jsonError("Could not activate session", 500);
  }
}
