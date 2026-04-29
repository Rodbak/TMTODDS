export type OddsFormat = "decimal" | "fractional";

const STORAGE_KEY = "tmt_odds_format_v1";

export function getStoredOddsFormat(): OddsFormat {
  if (typeof window === "undefined") return "decimal";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "fractional" ? "fractional" : "decimal";
}

export function setStoredOddsFormat(fmt: OddsFormat) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, fmt);
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/** UK-style fractional odds from decimal (profit stake ratio). */
export function decimalToFractionalString(decimal: number): string {
  if (!Number.isFinite(decimal) || decimal < 1.01) return "—";
  const profit = decimal - 1;
  let bestNum = 1;
  let bestDen = 1;
  let bestErr = Infinity;
  for (let den = 1; den <= 32; den++) {
    const num = Math.round(profit * den);
    if (num < 1) continue;
    const err = Math.abs(num / den - profit);
    if (err < bestErr) {
      bestErr = err;
      bestNum = num;
      bestDen = den;
    }
  }
  const g = gcd(bestNum, bestDen);
  return `${bestNum / g}/${bestDen / g}`;
}

export function formatOdds(decimal: number, fmt: OddsFormat): string {
  if (fmt === "decimal") return decimal.toFixed(2);
  return decimalToFractionalString(decimal);
}
