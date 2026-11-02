import {
  ChatStatus,
  PrismaClient,
  Role,
} from "@prisma/client";
import { CLINICS, GUIDES } from "../lib/catalog";

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

  await prisma.clinic.createMany({ data: CLINICS });
  await prisma.guide.createMany({ data: GUIDES });

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
