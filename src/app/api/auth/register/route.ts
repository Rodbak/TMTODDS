import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

function generateReferralCode() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "TMT-";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const emailRaw = typeof body?.email === "string" ? body.email.trim() : "";
  const phoneRaw = typeof body?.phone === "string" ? body.phone.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!emailRaw && !phoneRaw) {
    return NextResponse.json({ error: "Provide email or phone" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const email = emailRaw ? emailRaw.toLowerCase() : null;
  const phone = phoneRaw || null;

  // pre-checks for friendlier errors
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }
  if (phone) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) return NextResponse.json({ error: "Phone already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  // retry referral code collisions a few times
  let referralCode = generateReferralCode();
  for (let i = 0; i < 5; i++) {
    try {
      const user = await prisma.user.create({
        data: {
          email,
          phone,
          passwordHash,
          role: "USER",
          referralCode,
        },
        select: { id: true, role: true },
      });

      const token = await createSessionToken({ userId: user.id, role: user.role });
      await setSessionCookie(token);

      return NextResponse.json({ ok: true }, { status: 201 });
    } catch (e: unknown) {
      // unique conflict on referralCode, retry
      const code = typeof e === "object" && e !== null && "code" in e ? (e as { code?: unknown }).code : undefined;
      if (String(code) === "P2002") {
        referralCode = generateReferralCode();
        continue;
      }
      return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Registration failed" }, { status: 500 });
}

