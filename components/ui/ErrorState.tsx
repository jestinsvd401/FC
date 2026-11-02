export function ErrorState({
  message,
  onRetry,
  retryLabel,
}: {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div className="rounded-2xl border-4 border-zinc-950 bg-red-600 p-4 text-white">
      <p className="font-black">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 min-h-12 rounded-xl border-4 border-zinc-950 bg-white px-4 font-black text-zinc-950"
        >
          {retryLabel ?? "Retry"}
        </button>
      ) : null}
    </div>
  );
}
