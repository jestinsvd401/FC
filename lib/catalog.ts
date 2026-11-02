import { homeCountryGuides } from "@/lib/home-country";
import type { ClinicRecord, GuideRecord, Industry } from "@/types/catalog";
import type { Locale } from "@/types/i18n";
import { LOCALES } from "@/types/i18n";

export const CLINICS: ClinicRecord[] = [
  {
    id: "ntuh",
    name: "National Taiwan University Hospital",
    address: "No. 7, Zhongshan S. Rd., Zhongzheng Dist., Taipei City 100",
    phone: "+886-2-2312-3456",
    hasInterpreter: true,
    languagesSupported: ["zh-TW", "en", "id", "vi"],
  },
  {
    id: "tpe-zhongxing",
    name: "Taipei City Hospital Zhongxing Branch",
    address: "No. 145, Zhengzhou Rd., Datong Dist., Taipei City 103",
    phone: "+886-2-2552-3234",
    hasInterpreter: true,
    languagesSupported: ["zh-TW", "en", "id", "vi", "th"],
  },
  {
    id: "mackay",
    name: "Mackay Memorial Hospital",
    address: "No. 92, Sec. 2, Zhongshan N. Rd., Zhongshan Dist., Taipei City 104",
    phone: "+886-2-2543-3535",
    hasInterpreter: true,
    languagesSupported: ["zh-TW", "en", "tl"],
  },
  {
    id: "cgmh-linkou",
    name: "Chang Gung Memorial Hospital, Linkou",
    address: "No. 5, Fuxing St., Guishan Dist., Taoyuan City 333",
    phone: "+886-3-328-1200",
    hasInterpreter: true,
    languagesSupported: ["zh-TW", "en", "id", "vi", "th"],
  },
  {
    id: "kmuh",
    name: "Kaohsiung Medical University Chung-Ho Memorial Hospital",
    address: "No. 100, Tzyou 1st Rd., Sanmin Dist., Kaohsiung City 807",
    phone: "+886-7-312-1101",
    hasInterpreter: true,
    languagesSupported: ["zh-TW", "en", "id", "vi"],
  },
  {
    id: "harmony",
    name: "Harmony Home Association Taiwan Clinic Partnership",
    address:
      "No. 15, Ln. 22, Sec. 1, Minsheng E. Rd., Zhongshan Dist., Taipei City 104",
    phone: "+886-2-2545-0737",
    hasInterpreter: true,
    languagesSupported: ["zh-TW", "en", "id", "vi", "tl", "th"],
  },
  {
    id: "tzuchi-hualien",
    name: "Hualien Tzu Chi Hospital",
    address: "No. 707, Sec. 3, Zhongyang Rd., Hualien City, Hualien County 970",
    phone: "+886-3-856-1825",
    hasInterpreter: false,
    languagesSupported: ["zh-TW", "en"],
  },
  {
    id: "vghtc",
    name: "Taichung Veterans General Hospital",
    address: "No. 1650, Sec. 4, Taiwan Blvd., Xitun Dist., Taichung City 407",
    phone: "+886-4-2359-2525",
    hasInterpreter: true,
    languagesSupported: ["zh-TW", "en", "id", "vi"],
  },
  {
    id: "chimei",
    name: "Chi Mei Medical Center",
    address: "No. 901, Zhonghua Rd., Yongkang Dist., Tainan City 710",
    phone: "+886-6-281-2811",
    hasInterpreter: true,
    languagesSupported: ["zh-TW", "en", "id", "vi", "th"],
  },
  {
    id: "ptch",
    name: "Pingtung Christian Hospital",
    address: "No. 60, Dalian Rd., Pingtung City, Pingtung County 900",
    phone: "+886-8-736-8686",
    hasInterpreter: true,
    languagesSupported: ["zh-TW", "en", "id", "vi", "th"],
  },
];

const NHI: Record<
  Locale,
  { coverage: [string, string]; card: [string, string]; visit: [string, string]; uninsured: [string, string] }
> = {
  en: {
    coverage: [
      "Who is covered",
      "Legal migrant workers with an ARC are enrolled in National Health Insurance (NHI). Your employer must register you. NHI lowers the cost of clinics, hospitals, and medicine.",
    ],
    card: [
      "Bring your NHI card",
      "Take your NHI card (健保卡) and ARC to every visit. If you do not have the card yet, bring the paper enrollment proof and your passport.",
    ],
    visit: [
      "How a visit works",
      "Register at the counter, ask for an interpreter (通譯), show the symptom card, then see the doctor. Pay the copay — it is much lower than the full cash price.",
    ],
    uninsured: [
      "If you are not enrolled",
      "That is often the employer's duty. Call 1955 or NHI 0800-030-598. Public hospital social workers can still help in an emergency. Call 119 for life-threatening cases.",
    ],
  },
  "zh-TW": {
    coverage: [
      "誰可以納保",
      "持居留證的合法移工應加入全民健康保險。雇主必須為你加保。健保可降低門診、住院與藥費。",
    ],
    card: [
      "請帶健保卡",
      "每次就醫請帶健保卡與居留證。還沒拿到卡片時，請帶加保證明與護照。",
    ],
    visit: [
      "怎麼看病",
      "先到櫃檯掛號，要求通譯，出示症狀卡，再看醫師。部分負擔遠低於自費。",
    ],
    uninsured: [
      "還沒加保怎麼辦",
      "加保常是雇主責任。請打 1955 或健保署 0800-030-598。急診時公立醫院社工仍可協助。危急請打 119。",
    ],
  },
  id: {
    coverage: [
      "Siapa yang ditanggung",
      "Pekerja migran legal dengan ARC harus masuk NHI (asuransi kesehatan Taiwan). Majikan wajib mendaftarkan Anda. NHI menurunkan biaya klinik, rumah sakit, dan obat.",
    ],
    card: [
      "Bawa kartu NHI",
      "Bawa kartu NHI (健保卡) dan ARC setiap berobat. Jika kartu belum ada, bawa bukti pendaftaran dan paspor.",
    ],
    visit: [
      "Cara berobat",
      "Daftar di loket, minta juru bahasa (通譯), tunjukkan kartu gejala, lalu temui dokter. Bayar copay — jauh lebih murah daripada bayar penuh.",
    ],
    uninsured: [
      "Jika belum terdaftar",
      "Itu sering kewajiban majikan. Hubungi 1955 atau NHI 0800-030-598. Pekerja sosial rumah sakit publik tetap bisa membantu gawat darurat. Nyawa terancam: 119.",
    ],
  },
  vi: {
    coverage: [
      "Ai được bảo hiểm",
      "Lao động di trú hợp pháp có ARC phải tham gia NHI. Chủ sử dụng lao động phải đăng ký. NHI giảm viện phí, khám bệnh và thuốc.",
    ],
    card: [
      "Mang thẻ NHI",
      "Mang thẻ NHI (健保卡) và ARC mỗi lần khám. Nếu chưa có thẻ, mang giấy đăng ký và hộ chiếu.",
    ],
    visit: [
      "Cách khám bệnh",
      "Đăng ký tại quầy, xin phiên dịch (通譯), đưa thẻ triệu chứng, rồi gặp bác sĩ. Phần đồng chi trả rẻ hơn nhiều so với tự trả hết.",
    ],
    uninsured: [
      "Nếu chưa được đăng ký",
      "Đây thường là trách nhiệm chủ. Gọi 1955 hoặc NHI 0800-030-598. Nhân viên xã hội bệnh viện công vẫn giúp cấp cứu. Nguy kịch: 119.",
    ],
  },
  tl: {
    coverage: [
      "Sino ang covered",
      "Ang legal na migranteng manggagawa na may ARC ay dapat naka-NHI. Tungkulin ng employer na irehistro ka. Binabawasan ng NHI ang gastos sa clinic, hospital, at gamot.",
    ],
    card: [
      "Dalhin ang NHI card",
      "Dalhin ang NHI card (健保卡) at ARC sa bawat bisita. Kung wala pa ang card, dalhin ang proof of enrollment at passport.",
    ],
    visit: [
      "Paano magpatingin",
      "Magpa-register sa counter, humingi ng interpreter (通譯), ipakita ang symptom card, tapos magpatingin. Ang copay ay mas mura kaysa full cash.",
    ],
    uninsured: [
      "Kung hindi ka naka-enroll",
      "Madalas ito ang tungkulin ng employer. Tumawag sa 1955 o NHI 0800-030-598. Matutulungan ka pa rin ng social worker sa public hospital sa emergency. 119 kung delikado ang buhay.",
    ],
  },
  th: {
    coverage: [
      "ใครได้รับความคุ้มครอง",
      "แรงงานข้ามชาติถูกกฎหมายที่มี ARC ต้องเข้า NHI นายจ้างต้องขึ้นทะเบียนให้ NHI ช่วยลดค่าคลินิก โรงพยาบาล และยา",
    ],
    card: [
      "พกบัตร NHI",
      "พกบัตร NHI (健保卡) และ ARC ทุกครั้ง หากยังไม่มีบัตร ให้พกหลักฐานการขึ้นทะเบียนและหนังสือเดินทาง",
    ],
    visit: [
      "ขั้นตอนการรักษา",
      "ลงทะเบียนที่เคาน์เตอร์ ขอล่าม (通譯) โชว์การ์ดอาการ แล้วพบแพทย์ จ่ายส่วนร่วมจ่าย ซึ่งถูกกว่าจ่ายเต็ม",
    ],
    uninsured: [
      "ถ้ายังไม่ได้ขึ้นทะเบียน",
      "มักเป็นหน้าที่ของนายจ้าง โทร 1955 หรือ NHI 0800-030-598 นักสังคมสงเคราะห์โรงพยาบาลรัฐช่วยฉุกเฉินได้ ชีวิตตกอันตรายโทร 119",
    ],
  },
};

type IndustryCopy = {
  title: string;
  summary: string;
  steps: string[];
};

const INDUSTRY: Record<Locale, Record<Industry, IndustryCopy>> = {
  en: {
    factory: {
      title: "Factory",
      summary: "Machines, chemicals, and overtime are the biggest risks. You have the right to training and protective gear.",
      steps: [
        "Wear the helmet, gloves, goggles, and ear protection the factory must provide.",
        "Never clean or unjam a machine while it is on. Ask for lock-out training.",
        "If you were not trained for a task, say no and write down the time and supervisor name.",
        "Photograph injuries and keep your NHI card. Do not sign papers you do not understand.",
        "Call 1955 if pay is cut after an injury or if you are punished for reporting danger.",
      ],
    },
    fishing: {
      title: "Fishing",
      summary: "Decks are wet and hours are long. A life jacket and rest are safety rights, not favors.",
      steps: [
        "Wear a life jacket on deck, especially at night or in rough water.",
        "Know where the radio, flares, and first-aid kit are before the boat leaves.",
        "Drink water and rest between hauls. Exhaustion causes falls overboard.",
        "Your passport should stay with you. Holding documents is a warning sign — call 1955.",
        "If someone is missing overboard, shout, throw a flotation device, and mark GPS.",
      ],
    },
    caregiving: {
      title: "Caregiving",
      summary: "Lifting people and long night shifts strain your back and mind. You may refuse unsafe medical tasks.",
      steps: [
        "Bend your knees to lift. Ask for a belt or a second person for heavy transfers.",
        "You are not a nurse. Refuse injections or medical procedures without training.",
        "You are entitled to rest days. Record hours if you work through the night.",
        "Verbal abuse and withheld food or pay are violations — save messages and call 1955.",
        "If the employer keeps your documents, contact 1955 or a local migrant center the same day.",
      ],
    },
  },
  "zh-TW": {
    factory: {
      title: "工廠",
      summary: "機器、化學品與超時加班是最大風險。你有權接受訓練並使用防護用具。",
      steps: [
        "穿戴工廠應提供的安全帽、手套、護目鏡與耳塞。",
        "機器運轉時不要清理或排除卡住。要求上鎖訓練。",
        "沒受訓的工作可以拒絕，並記下時間與主管姓名。",
        "拍下傷勢、帶著健保卡。看不懂的文件不要簽。",
        "因工受傷被扣薪或因回報危險被處罰，請打 1955。",
      ],
    },
    fishing: {
      title: "漁船",
      summary: "甲板濕滑、工時很長。救生衣與休息是安全權利，不是恩惠。",
      steps: [
        "在甲板上穿救生衣，夜間或風浪大時更要穿。",
        "開船前先知道無線電、信號彈與急救箱位置。",
        "補水並在兩次作業間休息。疲勞容易落海。",
        "護照應由你本人保管。被扣證件請打 1955。",
        "有人落海：大聲呼叫、丟浮具、記下 GPS。",
      ],
    },
    caregiving: {
      title: "家庭看護",
      summary: "搬抬與長夜班傷害腰背與心理。未受訓的醫療動作可以拒絕。",
      steps: [
        "搬抬時彎膝。過重時要求腰帶或第二人幫忙。",
        "你不是護理人員。沒受訓不要打針或做醫療處置。",
        "你有休息日。過夜工作請記錄工時。",
        "辱罵、不給吃或不給薪都是違法，請存證並打 1955。",
        "雇主扣留證件，當天打 1955 或找移工中心。",
      ],
    },
  },
  id: {
    factory: {
      title: "Pabrik",
      summary: "Mesin, bahan kimia, dan lembur adalah risiko terbesar. Anda berhak atas pelatihan dan APD.",
      steps: [
        "Pakai helm, sarung tangan, kacamata, dan penutup telinga yang wajib disediakan pabrik.",
        "Jangan bersihkan atau perbaiki mesin yang masih menyala. Minta pelatihan lock-out.",
        "Jika belum dilatih, tolak tugas itu. Catat waktu dan nama atasan.",
        "Foto luka dan simpan kartu NHI. Jangan tanda tangani surat yang tidak Anda pahami.",
        "Hubungi 1955 jika gaji dipotong setelah cedera atau Anda dihukum karena laporkan bahaya.",
      ],
    },
    fishing: {
      title: "Kapal ikan",
      summary: "Geladak licin dan jam kerja panjang. Jaket pelampung dan istirahat adalah hak keselamatan.",
      steps: [
        "Pakai jaket pelampung di geladak, terutama malam hari atau ombak besar.",
        "Tahu lokasi radio, suar, dan kotak P3K sebelum kapal berangkat.",
        "Minum air dan istirahat antar tarikan jaring. Kelelahan menyebabkan jatuh ke laut.",
        "Paspor harus dipegang Anda. Dokumen ditahan adalah tanda bahaya — hubungi 1955.",
        "Jika ada yang jatuh ke laut: teriak, lempar pelampung, catat GPS.",
      ],
    },
    caregiving: {
      title: "Perawat lansia",
      summary: "Mengangkat orang dan shift malam merusak punggung dan mental. Tugas medis tanpa pelatihan boleh ditolak.",
      steps: [
        "Tekuk lutut saat mengangkat. Minta sabuk atau orang kedua untuk pindahan berat.",
        "Anda bukan perawat. Tolak suntikan atau tindakan medis tanpa pelatihan.",
        "Anda berhak hari istirahat. Catat jam jika bekerja semalaman.",
        "Umpatan, menahan makan, atau menahan gaji adalah pelanggaran — simpan bukti, hubungi 1955.",
        "Jika majikan menahan dokumen, hubungi 1955 atau pusat pekerja migran hari itu juga.",
      ],
    },
  },
  vi: {
    factory: {
      title: "Nhà máy",
      summary: "Máy móc, hóa chất và tăng ca là rủi ro lớn. Bạn có quyền được huấn luyện và đồ bảo hộ.",
      steps: [
        "Đeo mũ, găng, kính và nút tai mà nhà máy phải cung cấp.",
        "Không vệ sinh hay gỡ kẹt khi máy đang chạy. Yêu cầu huấn luyện khóa máy.",
        "Chưa được dạy thì được từ chối. Ghi giờ và tên quản đốc.",
        "Chụp ảnh vết thương, giữ thẻ NHI. Đừng ký giấy không hiểu.",
        "Gọi 1955 nếu bị cắt lương sau tai nạn hoặc bị phạt vì báo nguy hiểm.",
      ],
    },
    fishing: {
      title: "Tàu cá",
      summary: "Boong ướt, giờ làm dài. Áo phao và nghỉ ngơi là quyền an toàn.",
      steps: [
        "Mặc áo phao trên boong, nhất là ban đêm hoặc sóng lớn.",
        "Biết vị trí bộ đàm, pháo hiệu và tủ thuốc trước khi tàu rời bến.",
        "Uống nước và nghỉ giữa các mẻ lưới. Mệt dễ rơi xuống biển.",
        "Hộ chiếu phải do bạn giữ. Bị giữ giấy tờ là dấu hiệu nguy — gọi 1955.",
        "Có người rơi biển: hô to, ném phao, ghi GPS.",
      ],
    },
    caregiving: {
      title: "Chăm sóc tại nhà",
      summary: "Bế nâng và ca đêm làm đau lưng và tâm lý. Việc y tế chưa được dạy thì được từ chối.",
      steps: [
        "Gập gối khi nâng. Xin đai hoặc người thứ hai khi quá nặng.",
        "Bạn không phải y tá. Từ chối tiêm hoặc thủ thuật nếu chưa học.",
        "Bạn có ngày nghỉ. Ghi giờ nếu làm xuyên đêm.",
        "Chửi mắng, nhịn ăn hoặc giữ lương là vi phạm — lưu bằng chứng, gọi 1955.",
        "Chủ giữ giấy tờ thì gọi 1955 hoặc trung tâm lao động di trú trong ngày.",
      ],
    },
  },
  tl: {
    factory: {
      title: "Pabrika",
      summary: "Makinarya, kemikal, at overtime ang pinakamalaking panganib. May karapatan kang magkaroon ng training at PPE.",
      steps: [
        "Isuot ang helmet, gloves, goggles, at ear protection na dapat ibigay ng pabrika.",
        "Huwag linisin o ayusin ang makinang nakabukas. Humingi ng lock-out training.",
        "Kung walang training, puwedeng tumanggi. Itala ang oras at pangalan ng supervisor.",
        "Kunan ng litrato ang pinsala at ingatan ang NHI card. Huwag pumirma sa hindi naiintindihan.",
        "Tumawag sa 1955 kung binawasan ang sahod pagkatapos masugatan o pinarusahan ka sa pag-ulat ng panganib.",
      ],
    },
    fishing: {
      title: "Pangingisda",
      summary: "Madulas ang deck at mahaba ang oras. Ang life jacket at pahinga ay karapatan sa kaligtasan.",
      steps: [
        "Magsuot ng life jacket sa deck, lalo na sa gabi o malakas na alon.",
        "Alamin ang radio, flare, at first-aid kit bago umalis ang bangka.",
        "Uminom ng tubig at magpahinga sa pagitan ng hila. Ang pagod ang dahilan ng mahulog sa dagat.",
        "Dapat nasa iyo ang passport. Kung kinukuha ang dokumento, tawagan ang 1955.",
        "Kung may mahulog sa dagat: sumigaw, ihagis ang pampalutang, itala ang GPS.",
      ],
    },
    caregiving: {
      title: "Caregiving",
      summary: "Ang pagbubuhat at mahabang gabi ay nakakasira ng likod at isip. Puwede kang tumanggi sa medical na gawaing walang training.",
      steps: [
        "Yumuko sa tuhod kapag magbubuhat. Humingi ng belt o pangalawang tao sa mabigat na transfer.",
        "Hindi ka nurse. Tumanggi sa injection o procedure kung walang training.",
        "May rest day ka. Itala ang oras kung magtatrabaho buong gabi.",
        "Ang mura, pagkakait ng pagkain o sahod ay paglabag — i-save ang ebidensya at tumawag sa 1955.",
        "Kung hawak ng employer ang dokumento, tumawag sa 1955 o migrant center sa araw ding iyon.",
      ],
    },
  },
  th: {
    factory: {
      title: "โรงงาน",
      summary: "เครื่องจักร สารเคมี และโอทีคือความเสี่ยงหลัก คุณมีสิทธิ์ได้ฝึกและอุปกรณ์ป้องกัน",
      steps: [
        "สวมหมวก ถุงมือ แว่น และที่อุดหูที่โรงงานต้องจัดให้",
        "อย่าทำความสะอาดหรือแก้เครื่องขณะเปิดอยู่ ขอฝึก lock-out",
        "งานที่ยังไม่ได้ฝึกปฏิเสธได้ จดเวลาและชื่อหัวหน้า",
        "ถ่ายรูปบาดแผล พกบัตร NHI อย่าเซ็นเอกสารที่ไม่เข้าใจ",
        "ถูกหักเงินหลังบาดเจ็บหรือถูกลงโทษเพราะรายงานอันตราย โทร 1955",
      ],
    },
    fishing: {
      title: "เรือประมง",
      summary: "ดาดฟ้าเปียก ชั่วโมงยาว เสื้อชูชีพและการพักคือสิทธิความปลอดภัย",
      steps: [
        "สวมเสื้อชูชีพบนดาดฟ้า โดยเฉพาะกลางคืนหรือคลื่นแรง",
        "รู้ที่วิทยุ ประทัดสัญญาณ และตู้ยา ก่อนเรือออก",
        "ดื่มน้ำและพักระหว่างยกอวน ความเหนื่อยทำให้ตกน้ำ",
        "พาสปอร์ตควรอยู่กับคุณ ถูกยึดเอกสารให้โทร 1955",
        "มีคนตกน้ำ: ตะโกน โยนทุ่น บันทึก GPS",
      ],
    },
    caregiving: {
      title: "ผู้ดูแล",
      summary: "การยกผู้ป่วยและกะดึกทำร้ายหลังและจิตใจ งานการแพทย์ที่ไม่ได้ฝึกปฏิเสธได้",
      steps: [
        "งอเข่าเวลายก ขอดายหรือคนช่วยถ้าหนัก",
        "คุณไม่ใช่พยาบาล ปฏิเสธการฉีดยาหรือหัตถการถ้าไม่ได้เรียน",
        "คุณมีวันหยุด จดชั่วโมงถ้าทำงานข้ามคืน",
        "ด่าทอ งดอาหาร หรือยึดค่าแรงคือการละเมิด เก็บหลักฐานแล้วโทร 1955",
        "นายจ้างยึดเอกสาร โทร 1955 หรือศูนย์แรงงานข้ามชาติในวันนั้น",
      ],
    },
  },
};

function nhiGuides(): GuideRecord[] {
  return LOCALES.flatMap((locale) => {
    const pack = NHI[locale];
    return (["coverage", "card", "visit", "uninsured"] as const).map((topic) => {
      const [title, body] = pack[topic];
      return {
        id: `nhi-${topic}-${locale}`,
        category: "HEALTH" as const,
        language: locale,
        title,
        content: JSON.stringify({ kind: "nhi", topic, body }),
        imageUrl: null,
      };
    });
  });
}

function industryGuides(): GuideRecord[] {
  return LOCALES.flatMap((locale) => {
    const pack = INDUSTRY[locale];
    return (["factory", "fishing", "caregiving"] as const).map((industry) => {
      const copy = pack[industry];
      return {
        id: `safety-${industry}-${locale}`,
        category: "SAFETY" as const,
        language: locale,
        title: copy.title,
        content: JSON.stringify({
          kind: "industry",
          industry,
          summary: copy.summary,
          steps: copy.steps,
        }),
        imageUrl: industry,
      };
    });
  });
}

export const GUIDES: GuideRecord[] = [
  ...nhiGuides(),
  ...industryGuides(),
  ...homeCountryGuides(),
];

export function filterClinics(options: {
  q?: string;
  interpreter?: boolean;
  language?: string;
}): ClinicRecord[] {
  const q = options.q?.trim().toLowerCase() ?? "";
  return CLINICS.filter((clinic) => {
    if (options.interpreter && !clinic.hasInterpreter) return false;
    if (
      options.language &&
      options.language !== "all" &&
      !clinic.languagesSupported.includes(options.language)
    ) {
      return false;
    }
    if (!q) return true;
    const haystack = `${clinic.name} ${clinic.address} ${clinic.phone}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function filterGuides(options: {
  category?: string;
  language?: string;
}): GuideRecord[] {
  return GUIDES.filter((guide) => {
    if (options.category && guide.category !== options.category) return false;
    if (options.language && guide.language !== options.language) return false;
    return true;
  });
}
