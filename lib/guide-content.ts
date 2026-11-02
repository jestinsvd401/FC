import type {
  HomeGuideContent,
  IndustryGuideContent,
  NhiGuideContent,
} from "@/types/catalog";

export function parseGuideContent(
  raw: string,
): NhiGuideContent | IndustryGuideContent | HomeGuideContent | null {
  try {
    const parsed = JSON.parse(raw) as { kind?: string };
    if (parsed.kind === "nhi" || parsed.kind === "industry" || parsed.kind === "home") {
      return parsed as NhiGuideContent | IndustryGuideContent | HomeGuideContent;
    }
  } catch {
    return null;
  }
  return null;
}
