import type {
  ChatMessageRecord,
  ChatSessionRecord,
  CheckInRecord,
} from "@/types/support";

type Memory = {
  checkIns: CheckInRecord[];
  sessions: ChatSessionRecord[];
  messages: ChatMessageRecord[];
};

const globalForMemory = globalThis as unknown as { __mhStore?: Memory };

export function memoryStore(): Memory {
  if (!globalForMemory.__mhStore) {
    globalForMemory.__mhStore = { checkIns: [], sessions: [], messages: [] };
  }
  return globalForMemory.__mhStore;
}

export function newId() {
  return `mem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
