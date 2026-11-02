"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border-4 border-zinc-950 bg-red-600 p-5 text-white">
      <h1 className="text-2xl font-black">Something went wrong</h1>
      <p className="mt-2 font-semibold">{error.message || "Please try again."}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 min-h-12 rounded-xl border-4 border-zinc-950 bg-white px-4 font-black text-zinc-950"
      >
        Retry
      </button>
    </div>
  );
}
