"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { CheckInRecord } from "@/types/support";

export function SelfCheck() {
  const { dictionary, locale } = useLanguage();
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [notes, setNotes] = useState("");
  const [phase, setPhase] = useState(dictionary.checkIn.inhale);
  const [saved, setSaved] = useState(false);
  const [recent, setRecent] = useState<CheckInRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const labels = [
      dictionary.checkIn.inhale,
      dictionary.checkIn.hold,
      dictionary.checkIn.exhale,
    ];
    let i = 0;
    const timer = window.setInterval(() => {
      i = (i + 1) % 3;
      setPhase(labels[i]);
    }, 2666);
    return () => window.clearInterval(timer);
  }, [dictionary.checkIn.exhale, dictionary.checkIn.hold, dictionary.checkIn.inhale]);

  useEffect(() => {
    fetch("/api/check-ins")
      .then((response) => response.json() as Promise<{ checkIns: CheckInRecord[] }>)
      .then((data) => setRecent(data.checkIns ?? []))
      .catch(() => undefined);
  }, [saved]);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodScore: mood,
          stressLevel: stress,
          notes,
          language: locale,
        }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">{dictionary.checkIn.title}</h1>

      <section className="rounded-2xl border-4 border-zinc-950 bg-emerald-800 p-5 text-white shadow-[4px_4px_0_#09090b]">
        <p className="text-lg font-black">{dictionary.checkIn.breatheTitle}</p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="mh-breathe flex size-36 items-center justify-center rounded-full border-4 border-zinc-950 bg-amber-300 text-center text-lg font-black text-zinc-950">
            {phase}
          </div>
        </div>
      </section>

      <p className="font-black">
        {dictionary.checkIn.step} {step}/3
      </p>

      {step === 1 ? (
        <label className="block rounded-2xl border-4 border-zinc-950 bg-white p-4">
          <span className="text-xl font-black">{dictionary.checkIn.moodLabel}</span>
          <input
            type="range"
            min={1}
            max={5}
            value={mood}
            onChange={(event) => setMood(Number(event.target.value))}
            className="mt-4 h-8 w-full accent-zinc-950"
          />
          <span className="mt-2 block text-3xl font-black">{mood}</span>
        </label>
      ) : null}

      {step === 2 ? (
        <label className="block rounded-2xl border-4 border-zinc-950 bg-white p-4">
          <span className="text-xl font-black">{dictionary.checkIn.stressLabel}</span>
          <input
            type="range"
            min={1}
            max={5}
            value={stress}
            onChange={(event) => setStress(Number(event.target.value))}
            className="mt-4 h-8 w-full accent-red-600"
          />
          <span className="mt-2 block text-3xl font-black">{stress}</span>
        </label>
      ) : null}

      {step === 3 ? (
        <label className="block rounded-2xl border-4 border-zinc-950 bg-white p-4">
          <span className="text-xl font-black">{dictionary.checkIn.journalPrompt}</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={dictionary.checkIn.journalPlaceholder}
            className="mt-3 min-h-32 w-full rounded-xl border-4 border-zinc-950 p-3 text-lg font-semibold"
          />
        </label>
      ) : null}

      <div className="flex gap-2">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((value) => value - 1)}
            className="min-h-14 flex-1 rounded-xl border-4 border-zinc-950 bg-white text-lg font-black"
          >
            {dictionary.checkIn.back}
          </button>
        ) : null}
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((value) => value + 1)}
            className="min-h-14 flex-1 rounded-xl border-4 border-zinc-950 bg-amber-300 text-lg font-black"
          >
            {dictionary.checkIn.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="min-h-14 flex-1 rounded-xl border-4 border-zinc-950 bg-emerald-700 text-lg font-black text-white"
          >
            {saving ? dictionary.common.loading : dictionary.checkIn.save}
          </button>
        )}
      </div>

      {saved ? (
        <p className="rounded-xl border-4 border-zinc-950 bg-amber-300 p-3 text-lg font-black">
          {dictionary.checkIn.saved}
        </p>
      ) : null}

      {recent.length > 0 ? (
        <section>
          <h2 className="text-xl font-black">{dictionary.checkIn.recent}</h2>
          <ul className="mt-2 space-y-2">
            {recent.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border-4 border-zinc-950 bg-white p-3 font-bold"
              >
                {dictionary.checkIn.moodLabel} {item.moodScore} ·{" "}
                {dictionary.checkIn.stressLabel} {item.stressLevel}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
