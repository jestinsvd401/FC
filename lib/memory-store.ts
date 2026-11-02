import { CLINICS, GUIDES } from "@/lib/catalog";
import type { ClinicRecord, GuideRecord } from "@/types/catalog";
import type {
  ChatMessageRecord,
  ChatSessionRecord,
  CheckInRecord,
} from "@/types/support";

export type AdminUser = {
  id: string;
  email: string;
  role: "WORKER" | "VOLUNTEER" | "ADMIN";
  languagePref: string;
};

type Memory = {
  checkIns: CheckInRecord[];
  sessions: ChatSessionRecord[];
  messages: ChatMessageRecord[];
  clinics: ClinicRecord[];
  guides: GuideRecord[];
  users: AdminUser[];
};

const globalForMemory = globalThis as unknown as { __mhStore?: Memory };

export function memoryStore(): Memory {
  if (!globalForMemory.__mhStore) {
    globalForMemory.__mhStore = {
      checkIns: [],
      sessions: [],
      messages: [],
      clinics: structuredClone(CLINICS),
      guides: structuredClone(GUIDES),
      users: [
        {
          id: "admin-1",
          email: "admin@example.com",
          role: "ADMIN",
          languagePref: "en",
        },
        {
          id: "vol-1",
          email: "volunteer@example.com",
          role: "VOLUNTEER",
          languagePref: "zh-TW",
        },
        {
          id: "work-1",
          email: "worker@example.com",
          role: "WORKER",
          languagePref: "id",
        },
      ],
    };
  }
  return globalForMemory.__mhStore;
}

export function newId() {
  return `mem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
