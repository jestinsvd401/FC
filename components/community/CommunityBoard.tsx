"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { CommunityEvent, CommunityGroup } from "@/types/support";

const PRIVACY_KEY = "mh-community-privacy";

type Privacy = {
  hideLocation: boolean;
  hideOnline: boolean;
  hideContact: boolean;
};

const STRICT: Privacy = {
  hideLocation: true,
  hideOnline: true,
  hideContact: true,
};

export function CommunityBoard() {
  const { dictionary } = useLanguage();
  const [privacy, setPrivacy] = useState<Privacy>(STRICT);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(PRIVACY_KEY);
    if (raw) {
      try {
        setPrivacy({ ...STRICT, ...(JSON.parse(raw) as Privacy) });
      } catch {
        setPrivacy(STRICT);
      }
    }
    void fetch("/api/community")
      .then((response) => response.json() as Promise<{ groups: CommunityGroup[]; events: CommunityEvent[] }>)
      .then((data) => {
        setGroups(data.groups ?? []);
        setEvents(data.events ?? []);
      });
  }, []);

  function toggle(key: keyof Privacy) {
    setPrivacy((current) => {
      const next = { ...current, [key]: !current[key] };
      window.localStorage.setItem(PRIVACY_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">{dictionary.community.title}</h1>
      <p className="text-lg font-semibold">{dictionary.community.intro}</p>
      <p className="rounded-xl border-4 border-zinc-950 bg-zinc-950 px-3 py-2 font-black text-amber-300">
        {dictionary.community.membersOnly}
      </p>

      <section className="rounded-2xl border-4 border-zinc-950 bg-white p-4">
        <h2 className="text-xl font-black">{dictionary.community.privacyTitle}</h2>
        {(
          [
            ["hideLocation", dictionary.community.hideLocation],
            ["hideOnline", dictionary.community.hideOnline],
            ["hideContact", dictionary.community.hideContact],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={`mt-2 flex min-h-14 w-full items-center justify-between rounded-xl border-4 border-zinc-950 px-4 text-left text-base font-black ${
              privacy[key] ? "bg-emerald-800 text-white" : "bg-zinc-100 text-zinc-950"
            }`}
          >
            <span>{label}</span>
            <span>{privacy[key] ? dictionary.community.on : dictionary.community.off}</span>
          </button>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">{dictionary.community.groups}</h2>
        {groups.map((group) => (
          <article
            key={group.id}
            className="rounded-2xl border-4 border-zinc-950 bg-violet-800 p-4 text-white shadow-[3px_3px_0_#09090b]"
          >
            <h3 className="text-lg font-black">{group.name}</h3>
            <p className="mt-1 font-semibold">
              {privacy.hideLocation ? dictionary.community.cityHidden : group.city} · {group.interest}
            </p>
            <p className="mt-2 text-sm font-bold">
              {dictionary.community.vetted}: {group.vettedBy}
              {privacy.hideOnline
                ? ` · ${dictionary.community.membersHidden}`
                : ` · ${group.memberCount}`}
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">{dictionary.community.events}</h2>
        {events.map((event) => (
          <article
            key={event.id}
            className="rounded-2xl border-4 border-zinc-950 bg-white p-4 shadow-[3px_3px_0_#09090b]"
          >
            <h3 className="text-lg font-black">{event.title}</h3>
            <p className="mt-1 font-semibold">
              {event.when}
              {" · "}
              {privacy.hideLocation ? dictionary.community.cityHidden : event.city}
            </p>
            <p className="font-bold">
              {privacy.hideContact ? dictionary.community.hostHidden : event.host}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
