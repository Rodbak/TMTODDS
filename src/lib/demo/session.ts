"use client";

import { DEMO_PLANS } from "@/lib/demo/data";

type Role = "USER" | "ADMIN";

export type DemoSession = {
  user: {
    id: string;
    email: string;
    role: Role;
  };
  activePlanKey: string | null;
  /** ISO start time for demo “subscription ends” calculation */
  subscriptionStartedAt?: string;
};

const KEY = "tmt_demo_session_v1";

export const DEMO_ACCOUNTS = {
  admin: { email: "admin@tmtodds.com", password: "admin12345", role: "ADMIN" as const },
  demo: { email: "demo@tmtodds.com", password: "demo12345", role: "USER" as const },
};

export function getDemoSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

function emitSessionChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tmt-session"));
}

export function setDemoSession(session: DemoSession) {
  localStorage.setItem(KEY, JSON.stringify(session));
  emitSessionChange();
}

export function clearDemoSession() {
  localStorage.removeItem(KEY);
  emitSessionChange();
}

export function demoLogin(email: string, password: string): DemoSession | null {
  const e = email.trim().toLowerCase();
  const started = new Date().toISOString();
  if (e === DEMO_ACCOUNTS.admin.email && password === DEMO_ACCOUNTS.admin.password) {
    return {
      user: { id: "u_admin", email: e, role: "ADMIN" },
      activePlanKey: "correct_score_monthly",
      subscriptionStartedAt: started,
    };
  }
  if (e === DEMO_ACCOUNTS.demo.email && password === DEMO_ACCOUNTS.demo.password) {
    return {
      user: { id: "u_demo", email: e, role: "USER" },
      activePlanKey: "correct_score_monthly",
      subscriptionStartedAt: started,
    };
  }
  return null;
}

export function planByKey(key: string | null) {
  if (!key) return null;
  return DEMO_PLANS.find((p) => p.key === key) ?? null;
}

