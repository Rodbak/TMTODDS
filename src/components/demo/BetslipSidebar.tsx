"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  clearBetslip,
  getBetslip,
  removeSlipFromBetslip,
  type BetslipLine,
} from "@/lib/demo/betslip";
import {
  type OddsFormat,
  formatOdds,
  getStoredOddsFormat,
  setStoredOddsFormat,
} from "@/lib/odds-format";

export function BetslipSidebar() {
  const [lines, setLines] = useState<BetslipLine[]>([]);
  const [fmt, setFmt] = useState<OddsFormat>("decimal");

  const refresh = useCallback(() => {
    setLines(getBetslip());
  }, []);

  useEffect(() => {
    setFmt(getStoredOddsFormat());
    refresh();
    const on = () => refresh();
    window.addEventListener("tmt-betslip", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("tmt-betslip", on);
      window.removeEventListener("storage", on);
    };
  }, [refresh]);

  const combined = useMemo(() => {
    if (!lines.length) return 1;
    return lines.reduce((acc, l) => acc * l.combinedDecimal, 1);
  }, [lines]);

  const setFormat = (next: OddsFormat) => {
    setFmt(next);
    setStoredOddsFormat(next);
    window.dispatchEvent(new CustomEvent("tmt-odds-format"));
  };

  return (
    <div className="grid gap-4">
      <div className="tmt-glow tmt-panel-strong rounded-2xl p-4 md:p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          Odds display
        </div>
        <div className="mt-2 inline-flex rounded-lg border border-white/10 bg-black/30 p-0.5">
          <button
            type="button"
            onClick={() => setFormat("decimal")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${
              fmt === "decimal" ? "bg-[#00e676] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            Decimal
          </button>
          <button
            type="button"
            onClick={() => setFormat("fractional")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${
              fmt === "fractional" ? "bg-[#00e676] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            Fractional
          </button>
        </div>
        <p className="mt-2 text-[11px] text-white/45">Saved in this browser.</p>
      </div>

      <div className="tmt-panel-strong rounded-2xl border border-[#00e676]/20 p-4 md:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              Betslip
            </div>
            <div className="mt-1 text-lg font-black text-white">Your picks</div>
          </div>
          <span className="rounded-md border border-white/10 bg-black/40 px-2 py-0.5 text-[11px] font-black text-white/80">
            {lines.length}
          </span>
        </div>

        {lines.length === 0 ? (
          <p className="mt-3 text-sm text-white/55">
            Tap <span className="font-bold text-[#b9ffd4]">Add to slip</span> on any line to build a
            demo betslip—same habit as a sportsbook app.
          </p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {lines.map((l) => (
              <li
                key={l.slug}
                className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm"
              >
                <div className="font-semibold text-white">{l.title}</div>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/50">
                  <span>
                    {l.legs} leg{l.legs === 1 ? "" : "s"} ·{" "}
                    <span className="font-mono font-bold text-[#b9ffd4]">
                      {formatOdds(l.combinedDecimal, fmt)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      removeSlipFromBetslip(l.slipId);
                      refresh();
                    }}
                    className="font-bold text-rose-300 hover:text-rose-200"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2">
                  <Button as="link" href={`/slips/${l.slug}`} variant="secondary" size="sm">
                    Open slip
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 ? (
          <div className="mt-4 border-t border-white/10 pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/55">Combined (demo)</span>
              <span className="tmt-odds font-mono text-base">{formatOdds(combined, fmt)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearBetslip();
                  refresh();
                }}
              >
                Clear slip
              </Button>
              <Button as="link" href="/#packages" variant="primary" size="sm">
                Unlock VIP
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="tmt-panel rounded-2xl p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Account</div>
        <div className="mt-3 grid gap-2">
          <a
            href="/login"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
          >
            Sign in (demo) →
          </a>
          <a
            href="/account"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
          >
            Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
