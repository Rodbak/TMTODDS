import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const identifier = typeof body?.identifier === "string" ? body.identifier.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!identifier || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const identifierLower = identifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifierLower }, { phone: identifier }],
    },
    select: { id: true, role: true, passwordHash: true },
  });

  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = await createSessionToken({ userId: user.id, role: user.role });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}

