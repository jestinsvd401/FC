import type { GuideRecord } from "@/types/catalog";
import type { Locale } from "@/types/i18n";
import { LOCALES } from "@/types/i18n";

type Country = "id" | "vn" | "ph" | "th";

type Pack = {
  countryName: string;
  faqs: { topic: string; question: string; answer: string }[];
};

const PACKS: Record<Locale, Record<Country, Pack>> = {
  en: {
    id: {
      countryName: "Indonesia",
      faqs: [
        {
          topic: "eldercare",
          question: "How can I support parents at home?",
          answer:
            "Send money through a licensed remittance shop or bank, not a broker who keeps your ATM card. Call family on a schedule. BPJS and village office (kelurahan) can explain elder health aid. Indonesian Economic and Trade Office in Taipei: keep the number saved.",
        },
        {
          topic: "remittance",
          question: "What is a safer way to send money?",
          answer:
            "Use Bank Indonesia–licensed channels (bank, official remittance). Never hand your full PIN to a friend. Keep the receipt. If an agency withholds wages, call 1955 before you remit less than you earned.",
        },
        {
          topic: "government",
          question: "Where is government help?",
          answer:
            "KDEI Taipei handles passports and distress. For BPJS or family cards, family in Indonesia can apply at the local office with a letter you send. Do not pay a calo for “fast passport.”",
        },
      ],
    },
    vn: {
      countryName: "Vietnam",
      faqs: [
        {
          topic: "eldercare",
          question: "How can I support parents in Vietnam?",
          answer:
            "Agree who holds medicine money. Commune health stations help elders with insurance. Use a licensed transfer so siblings can withdraw locally. Save the Vietnamese Economic and Cultural Office in Taipei number.",
        },
        {
          topic: "remittance",
          question: "What is a safer way to send money?",
          answer:
            "Use a bank or licensed service to a family account in Vietnam. Avoid cash via a coworker. Photograph every receipt. Wage theft first: 1955, then remit.",
        },
        {
          topic: "government",
          question: "Where is government help?",
          answer:
            "The Vietnamese office in Taipei helps with passports and emergencies. Social insurance (BHXH) questions can be asked by family at home with your labor contract copy. Do not buy fake early-return papers.",
        },
      ],
    },
    ph: {
      countryName: "Philippines",
      faqs: [
        {
          topic: "eldercare",
          question: "How can I support parents in the Philippines?",
          answer:
            "PhilHealth and OSCA help seniors. Send through a licensed remittance and name one trusted relative. Keep the MWO / MECO Taipei contact for welfare cases.",
        },
        {
          topic: "remittance",
          question: "What is a safer way to send money?",
          answer:
            "Use banks or licensed operators (not an unlicensed padala). Keep the reference number. If the broker holds your ATM, that is a red flag — 1955.",
        },
        {
          topic: "government",
          question: "Where is government help?",
          answer:
            "MECO / MWO Taipei assists OWWA and passport issues. SSS and PhilHealth can often be paid through official partners. Never surrender your passport to a recruiter to “process benefits.”",
        },
      ],
    },
    th: {
      countryName: "Thailand",
      faqs: [
        {
          topic: "eldercare",
          question: "How can I support parents in Thailand?",
          answer:
            "Gold card / local health office can help elders. Send money to a parent’s bank account through a licensed agent. Save the Thai Trade and Economic Office in Taipei number.",
        },
        {
          topic: "remittance",
          question: "What is a safer way to send money?",
          answer:
            "Use a bank or licensed remittance to a Thai account. Keep the slip. Do not let a captain or broker keep your bank book.",
        },
        {
          topic: "government",
          question: "Where is government help?",
          answer:
            "The Thai office in Taipei helps with passports and distress. Village / district offices at home can advise on elder allowance. Avoid paying a broker for “fast documents.”",
        },
      ],
    },
  },
  "zh-TW": {
    id: {
      countryName: "印尼",
      faqs: [
        {
          topic: "eldercare",
          question: "如何照顧在印尼的父母？",
          answer:
            "透過合法匯款，不要把提款卡交給仲介。定期視訊。BPJS 與村公所可說明長者醫療。請存下駐臺北印尼經濟貿易代表處電話。",
        },
        {
          topic: "remittance",
          question: "怎樣匯款比較安全？",
          answer: "使用銀行或合法匯款業者。不要把完整密碼給別人。保留收據。若薪水被扣，先打 1955。",
        },
        {
          topic: "government",
          question: "政府能幫什麼？",
          answer: "KDEI 臺北可處理護照與急難。家屬可持你寄回的證明向當地公所申請。不要找黃牛辦「快速護照」。",
        },
      ],
    },
    vn: {
      countryName: "越南",
      faqs: [
        {
          topic: "eldercare",
          question: "如何支持在越南的父母？",
          answer: "講好醫藥費由誰保管。鄉鎮衛生所可協助長者保險。用合法匯款讓家人在當地領。請存駐臺北越南經濟文化辦事處電話。",
        },
        {
          topic: "remittance",
          question: "怎樣匯款比較安全？",
          answer: "匯到家人在越南的銀行帳戶。不要託同事帶現金。每張收據拍照。先處理欠薪再匯款：1955。",
        },
        {
          topic: "government",
          question: "政府能幫什麼？",
          answer: "駐臺北越南辦事處可協助護照與急難。家屬可持勞動契約影本詢問社會保險。不要買假的提早返國文件。",
        },
      ],
    },
    ph: {
      countryName: "菲律賓",
      faqs: [
        {
          topic: "eldercare",
          question: "如何支持在菲律賓的父母？",
          answer: "PhilHealth 與長者辦公室可協助。指定一位可信家人收款。請存 MECO / MWO 臺北福利窗口。",
        },
        {
          topic: "remittance",
          question: "怎樣匯款比較安全？",
          answer: "用銀行或合法業者，不要用無照 padala。保留編號。仲介扣 ATM 是警訊，請打 1955。",
        },
        {
          topic: "government",
          question: "政府能幫什麼？",
          answer: "MECO / MWO 可協助 OWWA 與護照。SSS、PhilHealth 應走正式通路。不要把護照交給仲介「代辦福利」。",
        },
      ],
    },
    th: {
      countryName: "泰國",
      faqs: [
        {
          topic: "eldercare",
          question: "如何支持在泰國的父母？",
          answer: "金卡或地方衛生所可協助長者。匯到父母銀行帳戶。請存駐臺北泰國貿易經濟辦事處電話。",
        },
        {
          topic: "remittance",
          question: "怎樣匯款比較安全？",
          answer: "用銀行或合法匯款。保留單據。不要讓船長或仲介保管存摺。",
        },
        {
          topic: "government",
          question: "政府能幫什麼？",
          answer: "駐臺北泰國辦事處可協助護照與急難。家鄉區公所可說明長者津貼。不要付黃牛辦「快速文件」。",
        },
      ],
    },
  },
  id: {
    id: {
      countryName: "Indonesia",
      faqs: [
        {
          topic: "eldercare",
          question: "Bagaimana merawat orang tua di kampung?",
          answer:
            "Kirim uang lewat bank atau remitansi resmi, jangan serahkan kartu ATM ke calo. Telepon rutin. BPJS dan kelurahan bisa bantu kesehatan lansia. Simpan nomor KDEI Taipei.",
        },
        {
          topic: "remittance",
          question: "Cara kirim uang yang lebih aman?",
          answer:
            "Pakai saluran berizin. Jangan beri PIN lengkap. Simpan resi. Jika gaji ditahan, hubungi 1955 dulu.",
        },
        {
          topic: "government",
          question: "Bantuan pemerintah ke mana?",
          answer:
            "KDEI Taipei urus paspor dan kedaruratan. Keluarga di Indonesia bisa ke kantor setempat dengan surat Anda. Jangan bayar calo paspor kilat.",
        },
      ],
    },
    vn: {
      countryName: "Vietnam",
      faqs: [
        {
          topic: "eldercare",
          question: "Dukungan orang tua di Vietnam?",
          answer: "Sepakati siapa yang pegang uang obat. Puskesmas komune membantu asuransi lansia. Transfer berizin. Simpan nomor kantor Vietnam di Taipei.",
        },
        {
          topic: "remittance",
          question: "Cara kirim uang yang lebih aman?",
          answer: "Ke rekening keluarga di Vietnam. Jangan titip tunai ke rekan. Foto resi. Utang gaji: 1955.",
        },
        {
          topic: "government",
          question: "Bantuan pemerintah ke mana?",
          answer: "Kantor Vietnam di Taipei bantu paspor. Keluarga bisa tanya BHXH dengan salinan kontrak. Jangan beli surat pulang palsu.",
        },
      ],
    },
    ph: {
      countryName: "Filipina",
      faqs: [
        {
          topic: "eldercare",
          question: "Dukungan orang tua di Filipina?",
          answer: "PhilHealth dan OSCA membantu lansia. Kirim ke satu kerabat tepercaya lewat remitansi resmi. Simpan kontak MWO/MECO Taipei.",
        },
        {
          topic: "remittance",
          question: "Cara kirim uang yang lebih aman?",
          answer: "Bank atau operator berizin, bukan padala ilegal. Simpan nomor referensi. Calo pegang ATM: 1955.",
        },
        {
          topic: "government",
          question: "Bantuan pemerintah ke mana?",
          answer: "MECO/MWO bantu OWWA dan paspor. SSS/PhilHealth lewat mitra resmi. Jangan serahkan paspor ke calo.",
        },
      ],
    },
    th: {
      countryName: "Thailand",
      faqs: [
        {
          topic: "eldercare",
          question: "Dukungan orang tua di Thailand?",
          answer: "Kartu emas / kantor kesehatan setempat membantu lansia. Transfer ke rekening orang tua. Simpan nomor kantor Thai di Taipei.",
        },
        {
          topic: "remittance",
          question: "Cara kirim uang yang lebih aman?",
          answer: "Bank atau remitansi resmi. Simpan slip. Jangan biarkan nakhoda simpan buku tabungan.",
        },
        {
          topic: "government",
          question: "Bantuan pemerintah ke mana?",
          answer: "Kantor Thai di Taipei bantu paspor. Kantor desa di kampung bisa jelaskan tunjangan lansia. Hindari calo dokumen.",
        },
      ],
    },
  },
  vi: {
    id: {
      countryName: "Indonesia",
      faqs: [
        {
          topic: "eldercare",
          question: "Hỗ trợ cha mẹ ở Indonesia?",
          answer: "Chuyển tiền qua kênh hợp pháp, đừng giao thẻ ATM cho môi giới. Gọi định kỳ. BPJS và UBND xã hỗ trợ người già. Lưu số KDEI Taipei.",
        },
        {
          topic: "remittance",
          question: "Cách gửi tiền an toàn hơn?",
          answer: "Dùng ngân hàng/dịch vụ có phép. Không đưa hết PIN. Giữ biên lai. Lương bị giữ: gọi 1955.",
        },
        {
          topic: "government",
          question: "Hỗ trợ nhà nước ở đâu?",
          answer: "KDEI Taipei giúp hộ chiếu và khẩn cấp. Gia đình nộp giấy bạn gửi về. Đừng mua hộ chiếu nhanh.",
        },
      ],
    },
    vn: {
      countryName: "Việt Nam",
      faqs: [
        {
          topic: "eldercare",
          question: "Hỗ trợ cha mẹ ở Việt Nam?",
          answer: "Thống nhất người giữ tiền thuốc. Trạm y tế xã hỗ trợ BHYT người già. Chuyển khoản hợp pháp. Lưu số văn phòng Việt Nam tại Taipei.",
        },
        {
          topic: "remittance",
          question: "Cách gửi tiền an toàn hơn?",
          answer: "Vào tài khoản gia đình tại Việt Nam. Đừng nhờ đồng nghiệp xách tiền mặt. Chụp biên lai. Nợ lương: 1955.",
        },
        {
          topic: "government",
          question: "Hỗ trợ nhà nước ở đâu?",
          answer: "Văn phòng tại Taipei giúp hộ chiếu. Gia đình hỏi BHXH với bản hợp đồng. Đừng mua giấy về nước giả.",
        },
      ],
    },
    ph: {
      countryName: "Philippines",
      faqs: [
        {
          topic: "eldercare",
          question: "Hỗ trợ cha mẹ ở Philippines?",
          answer: "PhilHealth và OSCA hỗ trợ người già. Gửi cho một người thân tin cậy qua kênh có phép. Lưu MWO/MECO Taipei.",
        },
        {
          topic: "remittance",
          question: "Cách gửi tiền an toàn hơn?",
          answer: "Ngân hàng hoặc công ty có phép, không padala chui. Giữ mã. Môi giới giữ ATM: 1955.",
        },
        {
          topic: "government",
          question: "Hỗ trợ nhà nước ở đâu?",
          answer: "MECO/MWO giúp OWWA và hộ chiếu. SSS/PhilHealth qua đối tác chính thức. Đừng nộp hộ chiếu cho môi giới.",
        },
      ],
    },
    th: {
      countryName: "Thái Lan",
      faqs: [
        {
          topic: "eldercare",
          question: "Hỗ trợ cha mẹ ở Thái Lan?",
          answer: "Thẻ vàng / trạm y tế địa phương giúp người già. Chuyển vào tài khoản bố mẹ. Lưu số văn phòng Thái tại Taipei.",
        },
        {
          topic: "remittance",
          question: "Cách gửi tiền an toàn hơn?",
          answer: "Ngân hàng hoặc chuyển tiền có phép. Giữ phiếu. Đừng để thuyền trưởng giữ sổ tiết kiệm.",
        },
        {
          topic: "government",
          question: "Hỗ trợ nhà nước ở đâu?",
          answer: "Văn phòng Thái tại Taipei giúp hộ chiếu. Ủy ban địa phương giải thích trợ cấp người già. Tránh cò giấy tờ.",
        },
      ],
    },
  },
  tl: {
    id: {
      countryName: "Indonesia",
      faqs: [
        {
          topic: "eldercare",
          question: "Paano tutulungan ang magulang sa Indonesia?",
          answer: "Magpadala sa lisensyadong remittance, huwag ibigay ang ATM sa broker. Regular na tumawag. BPJS at barangay office tumutulong sa nakatatanda. I-save ang KDEI Taipei.",
        },
        {
          topic: "remittance",
          question: "Mas ligtas na padala?",
          answer: "Bank o lisensyadong service. Huwag ibigay ang buong PIN. Ingatan ang resibo. Kung hawak ang sahod, 1955 muna.",
        },
        {
          topic: "government",
          question: "Saan ang tulong ng gobyerno?",
          answer: "KDEI Taipei para sa passport at emergency. Puwedeng mag-apply ang pamilya sa local office. Huwag magbayad ng calo para sa mabilisang passport.",
        },
      ],
    },
    vn: {
      countryName: "Vietnam",
      faqs: [
        {
          topic: "eldercare",
          question: "Paano tutulungan ang magulang sa Vietnam?",
          answer: "Pagkasunduan kung sino ang hahawak ng peri para sa gamot. Health station tumutulong sa insurance. Legal na transfer. I-save ang opisina ng Vietnam sa Taipei.",
        },
        {
          topic: "remittance",
          question: "Mas ligtas na padala?",
          answer: "Sa account ng pamilya sa Vietnam. Huwag magpaabot ng cash sa katrabaho. Picture ng resibo. Utang na sahod: 1955.",
        },
        {
          topic: "government",
          question: "Saan ang tulong ng gobyerno?",
          answer: "Opisina sa Taipei para sa passport. Puwedeng magtanong ang pamilya sa BHXH. Huwag bumili ng peke na papeles pauwi.",
        },
      ],
    },
    ph: {
      countryName: "Pilipinas",
      faqs: [
        {
          topic: "eldercare",
          question: "Paano tutulungan ang magulang sa Pilipinas?",
          answer: "PhilHealth at OSCA tumutulong sa seniors. Padala sa iisang pinagkakatiwalaang kamag-anak. I-save ang MWO/MECO Taipei.",
        },
        {
          topic: "remittance",
          question: "Mas ligtas na padala?",
          answer: "Bangko o lisensyadong operator, hindi illegal na padala. Ingatan ang reference number. Broker na hawak ang ATM: 1955.",
        },
        {
          topic: "government",
          question: "Saan ang tulong ng gobyerno?",
          answer: "MECO/MWO para sa OWWA at passport. SSS/PhilHealth sa opisyal na partner. Huwag ibigay ang passport sa recruiter.",
        },
      ],
    },
    th: {
      countryName: "Thailand",
      faqs: [
        {
          topic: "eldercare",
          question: "Paano tutulungan ang magulang sa Thailand?",
          answer: "Gold card / local health office tumutulong. Padala sa bank account ng magulang. I-save ang Thai office sa Taipei.",
        },
        {
          topic: "remittance",
          question: "Mas ligtas na padala?",
          answer: "Bangko o lisensyadong remittance. Ingatan ang slip. Huwag hayaang hawakan ng kapitan ang passbook.",
        },
        {
          topic: "government",
          question: "Saan ang tulong ng gobyerno?",
          answer: "Thai office sa Taipei para sa passport. Local office sa bayan para sa elder allowance. Iwasan ang broker ng dokumento.",
        },
      ],
    },
  },
  th: {
    id: {
      countryName: "อินโดนีเซีย",
      faqs: [
        {
          topic: "eldercare",
          question: "ดูแลพ่อแม่ที่อินโดนีเซียอย่างไร?",
          answer: "โอนผ่านช่องทางถูกกฎหมาย อย่ามอบบัตร ATM ให้นายหน้า โทรตามเวลา BPJS และสำนักงานตำบลช่วยผู้สูงอายุ เก็บเบอร์ KDEI ไทเป",
        },
        {
          topic: "remittance",
          question: "ส่งเงินอย่างไรให้ปลอดภัยขึ้น?",
          answer: "ใช้ธนาคารหรือผู้รับอนุญาต อย่าบอก PIN ทั้งหมด เก็บใบเสร็จ ถ้าถูกยึดค่าแรง โทร 1955 ก่อน",
        },
        {
          topic: "government",
          question: "ความช่วยเหลือจากรัฐอยู่ที่ไหน?",
          answer: "KDEI ไทเปช่วยหนังสือเดินทางและฉุกเฉิน ครอบครัวยื่นเอกสารที่คุณส่งกลับ อย่าจ่ายนายหน้าทำพาสปอร์ตด่วน",
        },
      ],
    },
    vn: {
      countryName: "เวียดนาม",
      faqs: [
        {
          topic: "eldercare",
          question: "ดูแลพ่อแม่ที่เวียดนามอย่างไร?",
          answer: "ตกลงคนถือเงินยา สถานีอนามัยตำบลช่วยประกันผู้สูงอายุ โอนถูกกฎหมาย เก็บเบอร์สำนักงานเวียดนามในไทเป",
        },
        {
          topic: "remittance",
          question: "ส่งเงินอย่างไรให้ปลอดภัยขึ้น?",
          answer: "เข้าบัญชีครอบครัวในเวียดนาม อย่าให้เพื่อนร่วมงานถือเงินสด ถ่ายใบเสร็จ ค่าแรงค้าง: 1955",
        },
        {
          topic: "government",
          question: "ความช่วยเหลือจากรัฐอยู่ที่ไหน?",
          answer: "สำนักงานในไทเปช่วยหนังสือเดินทาง ครอบครัวถาม BHXH ด้วยสำเนาสัญญา อย่าซื้อเอกสารกลับบ้านปลอม",
        },
      ],
    },
    ph: {
      countryName: "ฟิลิปปินส์",
      faqs: [
        {
          topic: "eldercare",
          question: "ดูแลพ่อแม่ที่ฟิลิปปินส์อย่างไร?",
          answer: "PhilHealth และ OSCA ช่วยผู้สูงอายุ ส่งให้ญาติที่ไว้ใจคนเดียวผ่านช่องทางถูกกฎหมาย เก็บเบอร์ MWO/MECO ไทเป",
        },
        {
          topic: "remittance",
          question: "ส่งเงินอย่างไรให้ปลอดภัยขึ้น?",
          answer: "ธนาคารหรือผู้รับอนุญาต ไม่ใช่ padala เถื่อน เก็บเลขอ้างอิง นายหน้ายึด ATM: 1955",
        },
        {
          topic: "government",
          question: "ความช่วยเหลือจากรัฐอยู่ที่ไหน?",
          answer: "MECO/MWO ช่วย OWWA และพาสปอร์ต SSS/PhilHealth ผ่านพันธมิตรทางการ อย่ามอบพาสปอร์ตให้นายหน้า",
        },
      ],
    },
    th: {
      countryName: "ไทย",
      faqs: [
        {
          topic: "eldercare",
          question: "ดูแลพ่อแม่ที่ไทยอย่างไร?",
          answer: "บัตรทอง / สอ. ช่วยผู้สูงอายุ โอนเข้าบัญชีพ่อแม่ เก็บเบอร์สำนักงานไทยในไทเป",
        },
        {
          topic: "remittance",
          question: "ส่งเงินอย่างไรให้ปลอดภัยขึ้น?",
          answer: "ธนาคารหรือผู้โอนเงินที่ได้รับอนุญาต เก็บสลิป อย่าให้กัปตันถือสมุดบัญชี",
        },
        {
          topic: "government",
          question: "ความช่วยเหลือจากรัฐอยู่ที่ไหน?",
          answer: "สำนักงานไทยในไทเปช่วยหนังสือเดินทาง ที่ว่าการอำเภออธิบายเบี้ยยังชีพ หลีกเลี่ยงนายหน้าเอกสาร",
        },
      ],
    },
  },
};

export function homeCountryGuides(): GuideRecord[] {
  return LOCALES.flatMap((locale) => {
    const pack = PACKS[locale];
    return (["id", "vn", "ph", "th"] as const).map((country) => {
      const item = pack[country];
      return {
        id: `home-${country}-${locale}`,
        category: "HOME_COUNTRY" as const,
        language: locale,
        title: item.countryName,
        content: JSON.stringify({
          kind: "home",
          country,
          countryName: item.countryName,
          faqs: item.faqs,
        }),
        imageUrl: country,
      };
    });
  });
}
