export type ClinicRecord = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hasInterpreter: boolean;
  languagesSupported: string[];
};

export type NhiTopic = "coverage" | "card" | "visit" | "uninsured";
export type Industry = "factory" | "fishing" | "caregiving";

export type NhiGuideContent = {
  kind: "nhi";
  topic: NhiTopic;
  body: string;
};

export type IndustryGuideContent = {
  kind: "industry";
  industry: Industry;
  summary: string;
  steps: string[];
};

export type HomeGuideContent = {
  kind: "home";
  country: "id" | "vn" | "ph" | "th";
  countryName: string;
  faqs: { topic: string; question: string; answer: string }[];
};

export type GuideRecord = {
  id: string;
  category: "HEALTH" | "SAFETY" | "HOME_COUNTRY";
  language: string;
  title: string;
  content: string;
  imageUrl: string | null;
};
