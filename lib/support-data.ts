import { ChatStatus, Role } from "@prisma/client";
import { isMissingDatabase } from "@/lib/db-errors";
import { memoryStore, newId } from "@/lib/memory-store";
import { prisma } from "@/lib/prisma";
import type {
  ChatMessageRecord,
  ChatSessionRecord,
  CheckInRecord,
} from "@/types/support";

const ANON_EMAIL = "anonymous.worker@helpdesk.local";
const VOLUNTEER_EMAIL = "volunteer@example.com";
const VOLUNTEER_ALIAS = "Counselor M.";

const REPLIES = [
  "I hear you. You do not have to share your legal name. What feels most urgent right now?",
  "Thank you for telling me. You can pause anytime. Would you like ideas for 1955 or a local center?",
  "That sounds heavy. You are not alone. We can go one step at a time.",
];

async function ensurePeople(language: string) {
  const worker = await prisma.user.upsert({
    where: { email: ANON_EMAIL },
    update: { languagePref: language },
    create: { email: ANON_EMAIL, role: Role.WORKER, languagePref: language },
  });
  const volunteer = await prisma.user.upsert({
    where: { email: VOLUNTEER_EMAIL },
    update: {},
    create: {
      email: VOLUNTEER_EMAIL,
      role: Role.VOLUNTEER,
      languagePref: "zh-TW",
    },
  });
  return { worker, volunteer };
}

function mapSession(
  row: {
    id: string;
    workerId: string;
    volunteerId: string | null;
    status: ChatStatus;
    createdAt: Date;
  },
  alias = VOLUNTEER_ALIAS,
): ChatSessionRecord {
  return {
    id: row.id,
    workerId: row.workerId,
    volunteerId: row.volunteerId,
    volunteerAlias: alias,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function saveCheckIn(input: {
  moodScore: number;
  stressLevel: number;
  notes: string;
  language: string;
}): Promise<{ checkIn: CheckInRecord; source: "postgres" | "catalog" }> {
  const moodScore = Math.min(5, Math.max(1, Math.round(input.moodScore)));
  const stressLevel = Math.min(5, Math.max(1, Math.round(input.stressLevel)));
  const notes = input.notes.trim() || null;
  try {
    const { worker } = await ensurePeople(input.language);
    const row = await prisma.checkIn.create({
      data: { workerId: worker.id, moodScore, stressLevel, notes },
    });
    return {
      source: "postgres",
      checkIn: {
        id: row.id,
        workerId: row.workerId,
        moodScore: row.moodScore,
        stressLevel: row.stressLevel,
        notes: row.notes,
        createdAt: row.createdAt.toISOString(),
      },
    };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("saveCheckIn", error);
    const checkIn: CheckInRecord = {
      id: newId(),
      workerId: "anonymous",
      moodScore,
      stressLevel,
      notes,
      createdAt: new Date().toISOString(),
    };
    memoryStore().checkIns.unshift(checkIn);
    return { checkIn, source: "catalog" };
  }
}

export async function listCheckIns(): Promise<{
  checkIns: CheckInRecord[];
  source: "postgres" | "catalog";
}> {
  try {
    const rows = await prisma.checkIn.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return {
      source: "postgres",
      checkIns: rows.map((row) => ({
        id: row.id,
        workerId: "anonymous",
        moodScore: row.moodScore,
        stressLevel: row.stressLevel,
        notes: row.notes,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("listCheckIns", error);
    return { checkIns: memoryStore().checkIns.slice(0, 8), source: "catalog" };
  }
}

export async function createChatSession(language: string): Promise<{
  session: ChatSessionRecord;
  source: "postgres" | "catalog";
}> {
  try {
    const { worker } = await ensurePeople(language);
    const row = await prisma.chatSession.create({
      data: { workerId: worker.id, status: ChatStatus.PENDING },
    });
    return { session: mapSession(row), source: "postgres" };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("createChatSession", error);
    const session: ChatSessionRecord = {
      id: newId(),
      workerId: "anonymous",
      volunteerId: null,
      volunteerAlias: VOLUNTEER_ALIAS,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    memoryStore().sessions.unshift(session);
    return { session, source: "catalog" };
  }
}

export async function getChatSession(id: string): Promise<{
  session: ChatSessionRecord | null;
  source: "postgres" | "catalog";
}> {
  try {
    const row = await prisma.chatSession.findUnique({ where: { id } });
    if (row) return { session: mapSession(row), source: "postgres" };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("getChatSession", error);
  }
  const session = memoryStore().sessions.find((item) => item.id === id) ?? null;
  return { session, source: "catalog" };
}

export async function activateChatSession(id: string): Promise<{
  session: ChatSessionRecord | null;
  source: "postgres" | "catalog";
}> {
  try {
    const { volunteer } = await ensurePeople("en");
    const row = await prisma.chatSession.update({
      where: { id },
      data: { status: ChatStatus.ACTIVE, volunteerId: volunteer.id },
    });
    return { session: mapSession(row), source: "postgres" };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("activateChatSession", error);
    const session = memoryStore().sessions.find((item) => item.id === id);
    if (session) {
      session.status = "ACTIVE";
      session.volunteerId = "volunteer-sim";
      return { session, source: "catalog" };
    }
    return { session: null, source: "catalog" };
  }
}

export function listMessages(sessionId: string): ChatMessageRecord[] {
  return memoryStore().messages.filter((item) => item.sessionId === sessionId);
}

export function addMessage(sessionId: string, body: string, from: "worker" | "volunteer") {
  const message: ChatMessageRecord = {
    id: newId(),
    sessionId,
    from,
    body,
    createdAt: new Date().toISOString(),
  };
  memoryStore().messages.push(message);
  return message;
}

export function volunteerReply(sessionId: string) {
  const count = listMessages(sessionId).filter((item) => item.from === "volunteer").length;
  const body = REPLIES[count % REPLIES.length];
  return addMessage(sessionId, body, "volunteer");
}
