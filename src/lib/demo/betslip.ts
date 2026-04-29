export type BetslipLine = {
  slipId: string;
  slug: string;
  title: string;
  /** Combined decimal odds (product of legs) for display */
  combinedDecimal: number;
  legs: number;
  league?: string;
};

const KEY = "tmt_demo_betslip_v1";

export function emitBetslipChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tmt-betslip"));
}

export function getBetslip(): BetslipLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter(
      (x): x is BetslipLine =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as BetslipLine).slipId === "string" &&
        typeof (x as BetslipLine).slug === "string",
    );
  } catch {
    return [];
  }
}

export function setBetslip(lines: BetslipLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(lines));
  emitBetslipChange();
}

export function clearBetslip() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  emitBetslipChange();
}

export function addSlipToBetslip(line: BetslipLine): BetslipLine[] {
  const cur = getBetslip();
  if (cur.some((l) => l.slipId === line.slipId)) {
    emitBetslipChange();
    return cur;
  }
  const next = [...cur, line];
  setBetslip(next);
  return next;
}

export function removeSlipFromBetslip(slipId: string): BetslipLine[] {
  const next = getBetslip().filter((l) => l.slipId !== slipId);
  setBetslip(next);
  return next;
}
