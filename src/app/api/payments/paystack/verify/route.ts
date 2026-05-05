import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { paystackVerify } from "@/lib/paystack";

async function activateSubscription(userId: string, planId: string) {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return;

  const now = new Date();
  const active = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { endsAt: "desc" },
    include: { plan: true },
  });

  // If current active is still valid, extend from its end; else start now.
  const base = active && active.endsAt.getTime() > now.getTime() ? active.endsAt : now;
  const endsAt = new Date(base);
  endsAt.setDate(endsAt.getDate() + plan.durationDays);

  await prisma.subscription.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "EXPIRED" },
  });

  await prisma.subscription.create({
    data: {
      userId,
      planId,
      startsAt: now,
      endsAt,
      status: "ACTIVE",
    },
  });
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");
  if (!reference) return NextResponse.json({ error: "Missing reference" }, { status: 400 });

  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: { plan: true },
  });
  if (!payment || payment.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (payment.status === "SUCCESS") return NextResponse.json({ paid: true });

  const ver = await paystackVerify(reference);
  if (!ver.ok) return NextResponse.json({ paid: false, error: ver.error }, { status: 502 });

  const paid = ver.raw?.data?.status === "success";
  await prisma.payment.update({
    where: { reference },
    data: { status: paid ? "SUCCESS" : "FAILED", rawJson: JSON.stringify(ver.raw ?? {}) },
  });

  if (paid) {
    await activateSubscription(payment.userId, payment.planId);
  }

  return NextResponse.json({ paid });
}

