import { filterClinics, filterGuides } from "@/lib/catalog";
import { isMissingDatabase } from "@/lib/db-errors";
import { prisma } from "@/lib/prisma";
import type { ClinicRecord, GuideRecord } from "@/types/catalog";

export async function listClinics(options: {
  q?: string;
  interpreter?: boolean;
  language?: string;
}): Promise<{ clinics: ClinicRecord[]; source: "postgres" | "catalog" }> {
  try {
    const clinics = await prisma.clinic.findMany({
      where: {
        ...(options.interpreter ? { hasInterpreter: true } : {}),
        ...(options.language && options.language !== "all"
          ? { languagesSupported: { has: options.language } }
          : {}),
        ...(options.q
          ? {
              OR: [
                { name: { contains: options.q, mode: "insensitive" } },
                { address: { contains: options.q, mode: "insensitive" } },
                { phone: { contains: options.q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
    });
    return { clinics, source: "postgres" };
  } catch (error) {
    if (!isMissingDatabase(error)) {
      console.error("listClinics", error);
    }
    return { clinics: filterClinics(options), source: "catalog" };
  }
}

export async function listGuides(options: {
  category?: string;
  language?: string;
}): Promise<{ guides: GuideRecord[]; source: "postgres" | "catalog" }> {
  try {
    const category =
      options.category === "HEALTH" ||
      options.category === "SAFETY" ||
      options.category === "HOME_COUNTRY"
        ? options.category
        : undefined;
    const guides = await prisma.guide.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(options.language ? { language: options.language } : {}),
      },
      orderBy: { title: "asc" },
    });
    return { guides, source: "postgres" };
  } catch (error) {
    if (!isMissingDatabase(error)) {
      console.error("listGuides", error);
    }
    return { guides: filterGuides(options), source: "catalog" };
  }
}
