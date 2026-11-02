import type { Locale } from "@/types/i18n";

export type Symptom = {
  id: string;
  mandarin: string;
  pinyin: string;
  labels: Record<Locale, string>;
};

export const SYMPTOMS: Symptom[] = [
  {
    id: "fever",
    mandarin: "我發燒了",
    pinyin: "Wǒ fā shāo le",
    labels: {
      en: "I have a fever",
      "zh-TW": "我發燒了",
      id: "Saya demam",
      vi: "Tôi bị sốt",
      tl: "May lagnat ako",
      th: "ฉันมีไข้",
    },
  },
  {
    id: "headache",
    mandarin: "我頭痛",
    pinyin: "Wǒ tóu tòng",
    labels: {
      en: "I have a headache",
      "zh-TW": "我頭痛",
      id: "Saya sakit kepala",
      vi: "Tôi bị đau đầu",
      tl: "Masakit ang ulo ko",
      th: "ฉันปวดหัว",
    },
  },
  {
    id: "cough",
    mandarin: "我咳嗽",
    pinyin: "Wǒ ké sou",
    labels: {
      en: "I have a cough",
      "zh-TW": "我咳嗽",
      id: "Saya batuk",
      vi: "Tôi bị ho",
      tl: "Ubo ako",
      th: "ฉันไอ",
    },
  },
  {
    id: "stomach",
    mandarin: "我肚子痛",
    pinyin: "Wǒ dù zi tòng",
    labels: {
      en: "I have a stomachache",
      "zh-TW": "我肚子痛",
      id: "Saya sakit perut",
      vi: "Tôi đau bụng",
      tl: "Masakit ang tiyan ko",
      th: "ฉันปวดท้อง",
    },
  },
  {
    id: "chest",
    mandarin: "我胸痛",
    pinyin: "Wǒ xiōng tòng",
    labels: {
      en: "I have chest pain",
      "zh-TW": "我胸痛",
      id: "Dada saya sakit",
      vi: "Tôi đau ngực",
      tl: "Masakit ang dibdib ko",
      th: "ฉันเจ็บหน้าอก",
    },
  },
  {
    id: "dizzy",
    mandarin: "我頭暈",
    pinyin: "Wǒ tóu yūn",
    labels: {
      en: "I feel dizzy",
      "zh-TW": "我頭暈",
      id: "Saya pusing",
      vi: "Tôi bị chóng mặt",
      tl: "Nahihilo ako",
      th: "ฉันเวียนหัว",
    },
  },
  {
    id: "injury",
    mandarin: "我受傷了",
    pinyin: "Wǒ shòu shāng le",
    labels: {
      en: "I am injured",
      "zh-TW": "我受傷了",
      id: "Saya terluka",
      vi: "Tôi bị thương",
      tl: "Nasugatan ako",
      th: "ฉันได้รับบาดเจ็บ",
    },
  },
  {
    id: "breathe",
    mandarin: "我呼吸困難",
    pinyin: "Wǒ hū xī kùn nán",
    labels: {
      en: "I cannot breathe well",
      "zh-TW": "我呼吸困難",
      id: "Saya sulit bernapas",
      vi: "Tôi khó thở",
      tl: "Hirap akong huminga",
      th: "ฉันหายใจลำบาก",
    },
  },
];
