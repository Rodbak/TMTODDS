export const PLAN_KEYS = {
  FIXED_WEEKLY: "fixed_weekly",
  FIXED_BIWEEKLY: "fixed_biweekly",
  CONFIRMED_WEEKLY: "confirmed_weekly",
  CONFIRMED_BIWEEKLY: "confirmed_biweekly",
  ELITE_MONTHLY: "elite_monthly",
  CORRECT_SCORE_MONTHLY: "correct_score_monthly",
} as const;

export type PlanKey = (typeof PLAN_KEYS)[keyof typeof PLAN_KEYS];

export const SLIP_TIER_LABEL: Record<string, string> = {
  FREE: "Free Zone",
  FIXED: "Fixed",
  CONFIRMED: "Confirmed",
  CORRECT_SCORE: "Correct Score",
};

