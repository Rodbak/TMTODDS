export type SlipTier = "FREE" | "FIXED" | "CONFIRMED" | "CORRECT_SCORE";

export type SubscriptionLike = {
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  endsAt: Date;
};

export type PlanLike = {
  includesFixed: boolean;
  includesConfirmed: boolean;
  includesCorrectScore: boolean;
};

export function subscriptionActive(sub: SubscriptionLike) {
  return sub.status === "ACTIVE" && sub.endsAt.getTime() > Date.now();
}

export function planAllowsTier(plan: PlanLike, tier: SlipTier) {
  if (tier === "FREE") return true;
  if (tier === "FIXED") return plan.includesFixed;
  if (tier === "CONFIRMED") return plan.includesConfirmed;
  if (tier === "CORRECT_SCORE") return plan.includesCorrectScore;
  return false;
}

