import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

const COOKIE_NAME = "tmt_session";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET env var");
  }
  return new TextEncoder().encode(secret);
}

export type SessionUser = {
  userId: string;
  role: "USER" | "ADMIN";
};

export const createSessionToken = async (user: SessionUser) => {
  const secretKey = getSecretKey();
  return await new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);
};

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export const getSession = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const secretKey = getSecretKey();
    const { payload, protectedHeader } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    if (protectedHeader.alg !== "HS256") return null;
    const userId = payload.sub;
    const role = payload.role;
    if (!userId || (role !== "USER" && role !== "ADMIN")) return null;
    return { userId, role };
  } catch {
    return null;
  }
});

export async function requireUser() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  if (session.role !== "ADMIN") return null;
  return session;
}

