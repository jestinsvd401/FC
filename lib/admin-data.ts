import { ChatStatus, GuideCategory, Role } from "@prisma/client";
import { isMissingDatabase } from "@/lib/db-errors";
import { memoryStore, newId, type AdminUser } from "@/lib/memory-store";
import { prisma } from "@/lib/prisma";
import type { ClinicRecord, GuideRecord } from "@/types/catalog";

function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export async function adminStats() {
  try {
    const [activeChats, checkIns, clinics] = await Promise.all([
      prisma.chatSession.count({ where: { status: ChatStatus.ACTIVE } }),
      prisma.checkIn.count(),
      prisma.clinic.count(),
    ]);
    return { activeChats, checkIns, clinics, source: "postgres" as const };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("adminStats", error);
    const store = memoryStore();
    return {
      activeChats: store.sessions.filter((item) => item.status === "ACTIVE").length,
      checkIns: store.checkIns.length,
      clinics: store.clinics.length,
      source: "catalog" as const,
    };
  }
}

export async function adminListClinics(q: string, page: number, pageSize: number) {
  const query = q.trim().toLowerCase();
  try {
    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { address: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {};
    const [total, rows] = await Promise.all([
      prisma.clinic.count({ where }),
      prisma.clinic.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return { items: rows, total, page, pageSize, source: "postgres" as const };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("adminListClinics", error);
    const filtered = memoryStore().clinics.filter((clinic) =>
      `${clinic.name} ${clinic.address}`.toLowerCase().includes(query),
    );
    return { ...paginate(filtered, page, pageSize), source: "catalog" as const };
  }
}

export async function adminSaveClinic(
  input: Omit<ClinicRecord, "id"> & { id?: string },
) {
  try {
    if (input.id) {
      const row = await prisma.clinic.update({
        where: { id: input.id },
        data: {
          name: input.name,
          address: input.address,
          phone: input.phone,
          hasInterpreter: input.hasInterpreter,
          languagesSupported: input.languagesSupported,
        },
      });
      return { item: row, source: "postgres" as const };
    }
    const row = await prisma.clinic.create({
      data: {
        name: input.name,
        address: input.address,
        phone: input.phone,
        hasInterpreter: input.hasInterpreter,
        languagesSupported: input.languagesSupported,
      },
    });
    return { item: row, source: "postgres" as const };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("adminSaveClinic", error);
    const store = memoryStore();
    if (input.id) {
      const index = store.clinics.findIndex((item) => item.id === input.id);
      if (index >= 0) {
        store.clinics[index] = { ...store.clinics[index], ...input, id: input.id };
        return { item: store.clinics[index], source: "catalog" as const };
      }
    }
    const item: ClinicRecord = { ...input, id: newId() };
    store.clinics.unshift(item);
    return { item, source: "catalog" as const };
  }
}

export async function adminDeleteClinic(id: string) {
  try {
    await prisma.clinic.delete({ where: { id } });
    return { ok: true, source: "postgres" as const };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("adminDeleteClinic", error);
    const store = memoryStore();
    store.clinics = store.clinics.filter((item) => item.id !== id);
    return { ok: true, source: "catalog" as const };
  }
}

export async function adminListGuides(
  q: string,
  page: number,
  pageSize: number,
  category?: string,
  language?: string,
) {
  const query = q.trim().toLowerCase();
  try {
    const categoryFilter =
      category === "HEALTH" || category === "SAFETY" || category === "HOME_COUNTRY"
        ? (category as GuideCategory)
        : undefined;
    const where = {
      ...(categoryFilter ? { category: categoryFilter } : {}),
      ...(language ? { language } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" as const } },
              { content: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      prisma.guide.count({ where }),
      prisma.guide.findMany({
        where,
        orderBy: { title: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return { items: rows, total, page, pageSize, source: "postgres" as const };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("adminListGuides", error);
    const filtered = memoryStore().guides.filter((guide) => {
      if (category && guide.category !== category) return false;
      if (language && guide.language !== language) return false;
      if (!query) return true;
      return `${guide.title} ${guide.content}`.toLowerCase().includes(query);
    });
    return { ...paginate(filtered, page, pageSize), source: "catalog" as const };
  }
}

export async function adminSaveGuide(
  input: Omit<GuideRecord, "id"> & { id?: string },
) {
  try {
    if (input.id) {
      const row = await prisma.guide.update({
        where: { id: input.id },
        data: {
          category: input.category,
          language: input.language,
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,
        },
      });
      return { item: row, source: "postgres" as const };
    }
    const row = await prisma.guide.create({
      data: {
        category: input.category,
        language: input.language,
        title: input.title,
        content: input.content,
        imageUrl: input.imageUrl,
      },
    });
    return { item: row, source: "postgres" as const };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("adminSaveGuide", error);
    const store = memoryStore();
    if (input.id) {
      const index = store.guides.findIndex((item) => item.id === input.id);
      if (index >= 0) {
        store.guides[index] = { ...store.guides[index], ...input, id: input.id };
        return { item: store.guides[index], source: "catalog" as const };
      }
    }
    const item: GuideRecord = { ...input, id: newId() };
    store.guides.unshift(item);
    return { item, source: "catalog" as const };
  }
}

export async function adminDeleteGuide(id: string) {
  try {
    await prisma.guide.delete({ where: { id } });
    return { ok: true, source: "postgres" as const };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("adminDeleteGuide", error);
    const store = memoryStore();
    store.guides = store.guides.filter((item) => item.id !== id);
    return { ok: true, source: "catalog" as const };
  }
}

export async function adminListUsers(q: string, page: number, pageSize: number) {
  const query = q.trim().toLowerCase();
  try {
    const where = query ? { email: { contains: query, mode: "insensitive" as const } } : {};
    const [total, rows] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { email: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, email: true, role: true, languagePref: true },
      }),
    ]);
    return { items: rows, total, page, pageSize, source: "postgres" as const };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("adminListUsers", error);
    const filtered = memoryStore().users.filter((user) => user.email.toLowerCase().includes(query));
    return { ...paginate(filtered, page, pageSize), source: "catalog" as const };
  }
}

export async function adminSetUserRole(id: string, role: AdminUser["role"]) {
  try {
    const row = await prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: { id: true, email: true, role: true, languagePref: true },
    });
    return { item: row, source: "postgres" as const };
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("adminSetUserRole", error);
    const user = memoryStore().users.find((item) => item.id === id);
    if (!user) return { item: null, source: "catalog" as const };
    user.role = role;
    return { item: user, source: "catalog" as const };
  }
}

export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true },
    });
  } catch (error) {
    if (!isMissingDatabase(error)) console.error("findUserByEmail", error);
    return memoryStore().users.find((item) => item.email === email) ?? null;
  }
}
