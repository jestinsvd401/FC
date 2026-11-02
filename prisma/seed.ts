import {
  ChatStatus,
  GuideCategory,
  PrismaClient,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.checkIn.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.user.deleteMany();

  const worker = await prisma.user.create({
    data: {
      email: "worker@example.com",
      role: Role.WORKER,
      languagePref: "id",
    },
  });

  const volunteer = await prisma.user.create({
    data: {
      email: "volunteer@example.com",
      role: Role.VOLUNTEER,
      languagePref: "zh-TW",
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      role: Role.ADMIN,
      languagePref: "en",
    },
  });

  await prisma.clinic.createMany({
    data: [
      {
        name: "National Taiwan University Hospital",
        address: "No. 7, Zhongshan S. Rd., Zhongzheng Dist., Taipei City 100",
        phone: "+886-2-2312-3456",
        hasInterpreter: true,
        languagesSupported: ["zh-TW", "en", "id", "vi"],
      },
      {
        name: "Taipei City Hospital Zhongxing Branch",
        address: "No. 145, Zhengzhou Rd., Datong Dist., Taipei City 103",
        phone: "+886-2-2552-3234",
        hasInterpreter: true,
        languagesSupported: ["zh-TW", "en", "id", "vi", "th"],
      },
      {
        name: "Mackay Memorial Hospital",
        address: "No. 92, Sec. 2, Zhongshan N. Rd., Zhongshan Dist., Taipei City 104",
        phone: "+886-2-2543-3535",
        hasInterpreter: true,
        languagesSupported: ["zh-TW", "en", "tl"],
      },
      {
        name: "Chang Gung Memorial Hospital, Linkou",
        address: "No. 5, Fuxing St., Guishan Dist., Taoyuan City 333",
        phone: "+886-3-328-1200",
        hasInterpreter: true,
        languagesSupported: ["zh-TW", "en", "id", "vi", "th"],
      },
      {
        name: "Kaohsiung Medical University Chung-Ho Memorial Hospital",
        address: "No. 100, Tzyou 1st Rd., Sanmin Dist., Kaohsiung City 807",
        phone: "+886-7-312-1101",
        hasInterpreter: true,
        languagesSupported: ["zh-TW", "en", "id", "vi"],
      },
      {
        name: "Harmony Home Association Taiwan Clinic Partnership",
        address:
          "No. 15, Ln. 22, Sec. 1, Minsheng E. Rd., Zhongshan Dist., Taipei City 104",
        phone: "+886-2-2545-0737",
        hasInterpreter: true,
        languagesSupported: ["zh-TW", "en", "id", "vi", "tl", "th"],
      },
      {
        name: "Hualien Tzu Chi Hospital",
        address: "No. 707, Sec. 3, Zhongyang Rd., Hualien City, Hualien County 970",
        phone: "+886-3-856-1825",
        hasInterpreter: false,
        languagesSupported: ["zh-TW", "en"],
      },
    ],
  });

  await prisma.guide.createMany({
    data: [
      {
        category: GuideCategory.SAFETY,
        language: "id",
        title: "Keselamatan di tempat kerja",
        content:
          "Anda berhak atas lingkungan kerja yang aman. Jangan tangani mesin tanpa pelatihan. Jika atasan memaksa kerja berbahaya, catat waktu dan saksi, lalu hubungi 1955. Simpan kontrak, paspor, dan foto cedera. Jangan menyerahkan dokumen asli kecuali diwajibkan hukum.",
        imageUrl: null,
      },
      {
        category: GuideCategory.SAFETY,
        language: "vi",
        title: "An toàn nơi làm việc",
        content:
          "Bạn có quyền làm việc an toàn. Không vận hành máy khi chưa được huấn luyện. Nếu bị ép làm việc nguy hiểm, ghi lại thời gian và nhân chứng, rồi gọi 1955. Giữ hợp đồng, hộ chiếu và ảnh chấn thương. Không giao giấy tờ gốc trừ khi pháp luật yêu cầu.",
        imageUrl: null,
      },
      {
        category: GuideCategory.SAFETY,
        language: "tl",
        title: "Kaligtasan sa trabaho",
        content:
          "May karapatan kang magtrabaho nang ligtas. Huwag magpatakbo ng makina kung walang training. Kung pinipilit kang gumawa ng mapanganib na gawain, itala ang oras at saksi, tapos tawagan ang 1955. Ingatan ang kontrata, pasaporte, at litrato ng pinsala. Huwag ibigay ang orihinal na dokumento maliban kung hinihingi ng batas.",
        imageUrl: null,
      },
      {
        category: GuideCategory.SAFETY,
        language: "th",
        title: "ความปลอดภัยในที่ทำงาน",
        content:
          "คุณมีสิทธิทำงานอย่างปลอดภัย อย่าใช้เครื่องจักรหากยังไม่ได้ฝึก หากถูกบังคับให้ทำงานอันตราย ให้จดเวลาและพยาน แล้วโทร 1955 เก็บสัญญา หนังสือเดินทาง และรูปบาดแผล อย่ามอบเอกสารต้นฉบับเว้นแต่กฎหมายกำหนด",
        imageUrl: null,
      },
      {
        category: GuideCategory.HEALTH,
        language: "en",
        title: "How to see a doctor in Taiwan",
        content:
          "Bring your residence permit or passport. Many hospitals have interpreter desks. Ask for an interpreter (通譯) when you register. If you cannot pay, call 1955 or visit a public hospital social worker. For emergencies, call 119.",
        imageUrl: null,
      },
      {
        category: GuideCategory.HOME_COUNTRY,
        language: "id",
        title: "Kontak kedutaan dan pulang kampung",
        content:
          "Simpan nomor Kedutaan Besar Republik Indonesia di Taipei. Jika paspor hilang, laporkan ke polisi lalu ke kedutaan. Jangan bayar calo untuk 'pemulangan cepat'. 1955 dapat membantu sengketa gaji sebelum Anda pulang.",
        imageUrl: null,
      },
    ],
  });

  await prisma.chatSession.create({
    data: {
      workerId: worker.id,
      volunteerId: volunteer.id,
      status: ChatStatus.ACTIVE,
    },
  });

  await prisma.checkIn.create({
    data: {
      workerId: worker.id,
      moodScore: 3,
      stressLevel: 4,
      notes: "Long shift; worried about overtime pay.",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
