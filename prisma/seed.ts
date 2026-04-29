import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { PLAN_KEYS } from "../src/lib/plans";

const prisma = new PrismaClient();

function generateReferralCode() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "TMT-";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

async function main() {
  const plans = [
    {
      key: PLAN_KEYS.FIXED_WEEKLY,
      name: "TMT Fixed Pass (Weekly)",
      priceGhs: 70,
      durationDays: 7,
      includesFixed: true,
      includesConfirmed: false,
      includesCorrectScore: false,
    },
    {
      key: PLAN_KEYS.FIXED_BIWEEKLY,
      name: "TMT Fixed Pass (Biweekly)",
      priceGhs: 130,
      durationDays: 14,
      includesFixed: true,
      includesConfirmed: false,
      includesCorrectScore: false,
    },
    {
      key: PLAN_KEYS.CONFIRMED_WEEKLY,
      name: "TMT Pro Confirmed (Weekly)",
      priceGhs: 150,
      durationDays: 7,
      includesFixed: true,
      includesConfirmed: true,
      includesCorrectScore: false,
    },
    {
      key: PLAN_KEYS.CONFIRMED_BIWEEKLY,
      name: "TMT Pro Confirmed (Biweekly)",
      priceGhs: 280,
      durationDays: 14,
      includesFixed: true,
      includesConfirmed: true,
      includesCorrectScore: false,
    },
    {
      key: PLAN_KEYS.ELITE_MONTHLY,
      name: "TMT Elite (All Access) — Monthly",
      priceGhs: 500,
      durationDays: 30,
      includesFixed: true,
      includesConfirmed: true,
      includesCorrectScore: false,
    },
    {
      key: PLAN_KEYS.CORRECT_SCORE_MONTHLY,
      name: "TMT Correct Score Vault — Monthly",
      priceGhs: 1000,
      durationDays: 30,
      includesFixed: true,
      includesConfirmed: true,
      includesCorrectScore: true,
    },
  ] as const;

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { key: p.key },
      update: {
        name: p.name,
        priceGhs: p.priceGhs,
        durationDays: p.durationDays,
        includesFixed: p.includesFixed,
        includesConfirmed: p.includesConfirmed,
        includesCorrectScore: p.includesCorrectScore,
      },
      create: p,
    });
  }

  const fullPlan = await prisma.plan.findUnique({
    where: { key: PLAN_KEYS.CORRECT_SCORE_MONTHLY },
  });
  if (!fullPlan) throw new Error("Missing correct_score_monthly plan");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@tmtodds.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin12345";

  const salt = await bcrypt.genSalt(12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail.toLowerCase(),
      phone: null,
      passwordHash: await bcrypt.hash(adminPassword, salt),
      role: "ADMIN",
      referralCode: generateReferralCode(),
    },
    select: { id: true },
  });

  const demoEmail = "demo@tmtodds.com";
  const demoPassword = "demo12345";
  const demo = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      phone: null,
      passwordHash: await bcrypt.hash(demoPassword, salt),
      role: "USER",
      referralCode: generateReferralCode(),
    },
    select: { id: true },
  });

  const now = new Date();
  const endsAt = new Date(now);
  endsAt.setDate(endsAt.getDate() + fullPlan.durationDays);

  await prisma.subscription.updateMany({
    where: { userId: { in: [admin.id, demo.id] }, status: "ACTIVE" },
    data: { status: "EXPIRED" },
  });

  // give both admin + demo full access for now
  await prisma.subscription.createMany({
    data: [
      {
        userId: admin.id,
        planId: fullPlan.id,
        startsAt: now,
        endsAt,
        status: "ACTIVE",
      },
      {
        userId: demo.id,
        planId: fullPlan.id,
        startsAt: now,
        endsAt,
        status: "ACTIVE",
      },
    ],
  });

  console.log("Seeded admin:", adminEmail, "password:", adminPassword);
  console.log("Seeded demo:", demoEmail, "password:", demoPassword);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

