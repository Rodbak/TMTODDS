import type { Plan, SlipTier, Subscription } from "@prisma/client";

export function subscriptionActive(sub: Subscription) {
  return sub.status === "ACTIVE" && sub.endsAt.getTime() > Date.now();
}

export function planAllowsTier(plan: Plan, tier: SlipTier) {
  if (tier === "FREE") return true;
  if (tier === "FIXED") return plan.includesFixed;
  if (tier === "CONFIRMED") return plan.includesConfirmed;
  if (tier === "CORRECT_SCORE") return plan.includesCorrectScore;
  return false;
}

