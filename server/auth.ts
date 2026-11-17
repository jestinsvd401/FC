import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string): { salt: string; passwordHash: string } {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, salt, 32).toString("hex");
  return { salt, passwordHash };
}

export function verifyPassword(password: string, salt: string, passwordHash: string): boolean {
  const next = scryptSync(password, salt, 32);
  const prev = Buffer.from(passwordHash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

export function newToken(): string {
  return randomBytes(32).toString("hex");
}
