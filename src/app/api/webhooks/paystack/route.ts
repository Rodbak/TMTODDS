import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paystackVerify, verifyPaystackWebhookSignature } from "@/lib/paystack";

async function activateSubscription(userId: string, planId: string) {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return;

  const now = new Date();
  const active = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { endsAt: "desc" },
  });

  const base = active && active.endsAt.getTime() > now.getTime() ? active.endsAt : now;
  const endsAt = new Date(base);
  endsAt.setDate(endsAt.getDate() + plan.durationDays);

  await prisma.subscription.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "EXPIRED" },
  });
  await prisma.subscription.create({
    data: { userId, planId, startsAt: now, endsAt, status: "ACTIVE" },
  });
}

export async function POST(req: Request) {
  const signature = req.headers.get("x-paystack-signature");
  const rawBody = await req.text();

  if (!signature) return new NextResponse("missing signature", { status: 400 });
  try {
    const ok = verifyPaystackWebhookSignature(rawBody, signature);
    if (!ok) return new NextResponse("invalid signature", { status: 401 });
  } catch {
    return new NextResponse("signature check failed", { status: 500 });
  }

  const payload: unknown = (() => {
    try {
      return JSON.parse(rawBody) as unknown;
    } catch {
      return null;
    }
  })();
  if (!payload) return new NextResponse("invalid json", { status: 400 });

  const event =
    typeof payload === "object" && payload !== null && "event" in payload
      ? (payload as { event?: unknown }).event
      : undefined;
  const data =
    typeof payload === "object" && payload !== null && "data" in payload
      ? (payload as { data?: unknown }).data
      : undefined;
  const reference =
    typeof data === "object" && data !== null && "reference" in data
      ? (data as { reference?: unknown }).reference
      : undefined;

  if (typeof reference !== "string" || !reference) return new NextResponse("ok", { status: 200 });

  // Idempotency: if already marked success, ok
  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment) return new NextResponse("ok", { status: 200 });
  if (payment.status === "SUCCESS") return new NextResponse("ok", { status: 200 });

  if (event !== "charge.success") {
    await prisma.payment.update({
      where: { reference },
      // rawJson is now a native Json column — pass object directly
      data: { rawJson: payload as Prisma.InputJsonValue },
    });
    return new NextResponse("ok", { status: 200 });
  }

  // Verify with Paystack for safety
  const ver = await paystackVerify(reference);
  if (!ver.ok) {
    return new NextResponse("verify failed", { status: 502 });
  }

  const paid = ver.raw?.data?.status === "success";
  await prisma.payment.update({
    where: { reference },
    data: { status: paid ? "SUCCESS" : "FAILED", rawJson: (ver.raw ?? Prisma.JsonNull) as Prisma.InputJsonValue },
  });

  if (paid) {
    await activateSubscription(payment.userId, payment.planId);
  }

  return NextResponse.json({ ok: true });
}

