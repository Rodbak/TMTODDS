import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { paystackInitialize } from "@/lib/paystack";

function makeReference() {
  // Paystack reference must be unique; keep it URL-safe
  return `tmt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const planKey = typeof body?.planKey === "string" ? body.planKey : null;
  if (!planKey) return NextResponse.json({ error: "Missing planKey" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, phone: true },
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = user.email ?? `${user.id}@tmtodds.local`;

  const plan = await prisma.plan.findUnique({ where: { key: planKey } });
  if (!plan) return NextResponse.json({ error: "Unknown plan" }, { status: 404 });

  const reference = makeReference();
  const amount = plan.priceGhs;

  await prisma.payment.create({
    data: {
      provider: "PAYSTACK",
      status: "PENDING",
      userId: user.id,
      planId: plan.id,
      amount,
      currency: "GHS",
      reference,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const callbackUrl = `${appUrl.replace(/\/$/, "")}/payment/success?reference=${encodeURIComponent(reference)}`;

  const init = await paystackInitialize({
    email,
    amountPesewas: amount * 100,
    reference,
    callbackUrl,
    metadata: { planKey, userId: user.id },
  });

  if (!init.ok) {
    await prisma.payment.update({
      where: { reference },
      data: { status: "FAILED", rawJson: JSON.stringify(init.raw ?? {}) },
    });
    return NextResponse.json({ error: init.error }, { status: 502 });
  }

  await prisma.payment.update({
    where: { reference },
    data: { rawJson: JSON.stringify(init.raw ?? {}) },
  });

  return NextResponse.json({ authorizationUrl: init.authorizationUrl, reference });
}

