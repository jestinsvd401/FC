import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(72),
});

export const clinicSchema = z.object({
  name: z.string().min(2).max(160),
  address: z.string().min(4).max(240),
  phone: z.string().min(6).max(40),
  hasInterpreter: z.boolean(),
  languagesSupported: z.array(z.string().min(2).max(12)).min(1).max(12),
});

export const clinicPatchSchema = clinicSchema.partial().extend({
  id: z.string().min(1),
});

export const guideSchema = z.object({
  category: z.enum(["HEALTH", "SAFETY", "HOME_COUNTRY"]),
  language: z.string().min(2).max(12),
  title: z.string().min(2).max(160),
  content: z.string().min(4).max(8000),
  imageUrl: z.string().max(240).optional().nullable(),
});

export const guidePatchSchema = guideSchema.partial().extend({
  id: z.string().min(1),
});

export const userRoleSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["WORKER", "VOLUNTEER", "ADMIN"]),
});

export const checkInSchema = z.object({
  moodScore: z.coerce.number().int().min(1).max(5),
  stressLevel: z.coerce.number().int().min(1).max(5),
  notes: z.string().max(2000).optional().default(""),
  language: z.string().min(2).max(12).optional().default("en"),
});

export const chatCreateSchema = z.object({
  language: z.string().min(2).max(12).optional().default("en"),
});

export const chatActivateSchema = z.object({
  id: z.string().min(1),
});

export const chatMessageSchema = z.object({
  sessionId: z.string().min(1),
  body: z.string().min(1).max(2000),
});

export const listQuerySchema = z.object({
  q: z.string().max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(8),
  category: z.enum(["HEALTH", "SAFETY", "HOME_COUNTRY"]).optional(),
  language: z.string().max(12).optional(),
});
