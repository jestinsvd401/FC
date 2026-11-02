export type CheckInRecord = {
  id: string;
  workerId: string;
  moodScore: number;
  stressLevel: number;
  notes: string | null;
  createdAt: string;
};

export type ChatStatusValue = "PENDING" | "ACTIVE" | "CLOSED";

export type ChatSessionRecord = {
  id: string;
  workerId: string;
  volunteerId: string | null;
  volunteerAlias: string;
  status: ChatStatusValue;
  createdAt: string;
};

export type ChatMessageRecord = {
  id: string;
  sessionId: string;
  from: "worker" | "volunteer";
  body: string;
  createdAt: string;
};

export type CommunityGroup = {
  id: string;
  name: string;
  city: string;
  interest: string;
  memberCount: number;
  vettedBy: string;
};

export type CommunityEvent = {
  id: string;
  title: string;
  when: string;
  city: string;
  host: string;
  spots: number;
};

export type HomeCountryCode = "id" | "vn" | "ph" | "th";
