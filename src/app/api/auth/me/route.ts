import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { subscriptionActive } from "@/lib/access";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null, activePlan: null });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, phone: true, role: true, referralCode: true, points: true },
  });
  if (!user) return NextResponse.json({ user: null, activePlan: null });

  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    orderBy: { endsAt: "desc" },
    include: { plan: true },
  });

  const activePlan = sub && subscriptionActive(sub) ? sub.plan : null;

  return NextResponse.json({
    user,
    activePlan,
    subscription: sub
      ? {
          status: sub.status,
          startsAt: sub.startsAt,
          endsAt: sub.endsAt,
          active: subscriptionActive(sub),
        }
      : null,
  });
}

