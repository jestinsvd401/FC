export function isMissingDatabase(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /P1001|P1017|Can't reach database|Environment variable not found: DATABASE_URL/i.test(
    message,
  );
}
