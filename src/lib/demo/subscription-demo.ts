import type { DemoPlan } from "@/lib/demo/data";
import type { DemoSession } from "@/lib/demo/session";

export function demoSubscriptionEndsAt(
  session: DemoSession,
  plan: DemoPlan | null,
  now = new Date(),
): Date | null {
  if (!plan || !session.activePlanKey) return null;
  const startIso = session.subscriptionStartedAt;
  const start = startIso ? new Date(startIso) : now;
  if (Number.isNaN(start.getTime())) return null;
  return new Date(start.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
}

export function demoDaysRemaining(end: Date, now = new Date()): number {
  const ms = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export function demoProgressUsed(start: Date, end: Date, now = new Date()): number {
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 1;
  const used = now.getTime() - start.getTime();
  return Math.min(1, Math.max(0, used / total));
}
