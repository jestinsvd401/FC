"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { ChatMessageRecord, ChatSessionRecord } from "@/types/support";

function eveningOrWeekend(date = new Date()) {
  const hour = date.getHours();
  const day = date.getDay();
  return day === 0 || day === 6 || hour >= 18 || hour < 8;
}

export function AnonymousChat() {
  const { dictionary, locale } = useLanguage();
  const [session, setSession] = useState<ChatSessionRecord | null>(null);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const offHours = !eveningOrWeekend();

  useEffect(() => {
    if (!session) return;
    const timer = window.setInterval(() => {
      void fetch(`/api/chat/messages?sessionId=${session.id}`)
        .then((response) => response.json() as Promise<{ messages: ChatMessageRecord[] }>)
        .then((data) => setMessages(data.messages ?? []))
        .catch(() => undefined);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [session]);

  async function requestSession() {
    setBusy(true);
    try {
      const created = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: locale }),
      }).then((response) => response.json() as Promise<{ session: ChatSessionRecord }>);
      setSession(created.session);
      window.setTimeout(() => {
        void fetch("/api/chat/sessions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: created.session.id }),
        })
          .then((response) => response.json() as Promise<{ session: ChatSessionRecord }>)
          .then((data) => {
            if (data.session) setSession(data.session);
          });
      }, 1800);
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    if (!session || !draft.trim()) return;
    const text = draft.trim();
    setDraft("");
    await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id, body: text }),
    });
    const data = await fetch(`/api/chat/messages?sessionId=${session.id}`).then(
      (response) => response.json() as Promise<{ messages: ChatMessageRecord[] }>,
    );
    setMessages(data.messages ?? []);
  }

  const statusLabel =
    session?.status === "ACTIVE"
      ? dictionary.chat.connected
      : session
        ? dictionary.chat.pending
        : null;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">{dictionary.chat.title}</h1>
      <p className="text-lg font-semibold">{dictionary.chat.anonymousNote}</p>
      <p
        className={`rounded-2xl border-4 border-zinc-950 p-4 text-base font-bold ${
          offHours ? "bg-amber-300 text-zinc-950" : "bg-emerald-800 text-white"
        }`}
      >
        {offHours ? dictionary.chat.availabilityOffHours : dictionary.chat.availability}
      </p>

      {!session ? (
        <button
          type="button"
          onClick={() => void requestSession()}
          disabled={busy}
          className="min-h-16 w-full rounded-2xl border-4 border-zinc-950 bg-blue-800 text-xl font-black text-white"
        >
          {busy ? dictionary.common.loading : dictionary.chat.request}
        </button>
      ) : (
        <>
          <p className="inline-block rounded-xl border-4 border-zinc-950 bg-zinc-950 px-3 py-2 font-black text-amber-300">
            {statusLabel}
          </p>
          {session.status === "ACTIVE" ? (
            <div className="space-y-3">
              <ul className="min-h-48 space-y-2 rounded-2xl border-4 border-zinc-950 bg-white p-3">
                {messages.length === 0 ? (
                  <li className="font-bold text-zinc-700">{session.volunteerAlias}</li>
                ) : null}
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className={`max-w-[90%] rounded-xl border-4 border-zinc-950 px-3 py-2 font-bold ${
                      message.from === "worker"
                        ? "ml-auto bg-blue-800 text-white"
                        : "bg-amber-300 text-zinc-950"
                    }`}
                  >
                    {message.body}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={dictionary.chat.placeholder}
                  className="min-h-14 flex-1 rounded-xl border-4 border-zinc-950 px-3 text-lg font-semibold"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void send();
                  }}
                />
                <button
                  type="button"
                  onClick={() => void send()}
                  className="min-h-14 min-w-24 rounded-xl border-4 border-zinc-950 bg-zinc-950 px-4 text-lg font-black text-amber-300"
                >
                  {dictionary.chat.send}
                </button>
              </div>
            </div>
          ) : (
            <p className="font-bold">{dictionary.chat.waiting}</p>
          )}
        </>
      )}
    </div>
  );
}
