export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border-4 border-dashed border-zinc-950 bg-white p-5">
      <p className="text-lg font-black">{title}</p>
      {hint ? <p className="mt-1 font-semibold text-zinc-700">{hint}</p> : null}
    </div>
  );
}
