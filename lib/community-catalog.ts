import type { CommunityEvent, CommunityGroup } from "@/types/support";

export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: "circle-id-taipei",
    name: "Circle 7 — Taipei rest-day friends",
    city: "Taipei",
    interest: "Language & rest-day meals",
    memberCount: 28,
    vettedBy: "TIWA partner desk",
  },
  {
    id: "circle-vi-taoyuan",
    name: "Circle 12 — Taoyuan factory choir",
    city: "Taoyuan",
    interest: "Music",
    memberCount: 16,
    vettedBy: "Harmony Home outreach",
  },
  {
    id: "circle-tl-kaohsiung",
    name: "Circle 4 — Kaohsiung Sunday group",
    city: "Kaohsiung",
    interest: "Faith & mutual aid",
    memberCount: 41,
    vettedBy: "Migrants' church network",
  },
  {
    id: "circle-th-keelung",
    name: "Circle 9 — Keelung harbor rest club",
    city: "Keelung",
    interest: "Fishing rest days",
    memberCount: 19,
    vettedBy: "Harbor welfare desk",
  },
];

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: "evt-taipei-park",
    title: "Vetted park picnic (members only)",
    when: "Saturday 16:00",
    city: "Taipei — 228 Peace Park gate",
    host: "Circle 7 hosts (alias only)",
    spots: 12,
  },
  {
    id: "evt-taichung-cook",
    title: "Shared cooking — no addresses exchanged",
    when: "Sunday 11:00",
    city: "Taichung community kitchen",
    host: "Circle 12 hosts (alias only)",
    spots: 8,
  },
  {
    id: "evt-kaohsiung-hike",
    title: "Easy trail meetup — daylight only",
    when: "Sunday 08:30",
    city: "Kaohsiung — Shoushan visitor center",
    host: "Circle 4 hosts (alias only)",
    spots: 10,
  },
];
