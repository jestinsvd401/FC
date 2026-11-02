import type { IndustryGuideContent, NhiGuideContent } from "@/types/catalog";

export function parseGuideContent(raw: string): NhiGuideContent | IndustryGuideContent | null {
  try {
    const parsed = JSON.parse(raw) as { kind?: string };
    if (parsed.kind === "nhi" || parsed.kind === "industry") {
      return parsed as NhiGuideContent | IndustryGuideContent;
    }
  } catch {
    return null;
  }
  return null;
}
