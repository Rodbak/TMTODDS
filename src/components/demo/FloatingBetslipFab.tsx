"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { clearBetslip, getBetslip, removeSlipFromBetslip } from "@/lib/demo/betslip";
import { formatOdds, getStoredOddsFormat, type OddsFormat } from "@/lib/odds-format";

export function FloatingBetslipFab() {
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const [fmt, setFmt] = useState<OddsFormat>("decimal");

  const refresh = useCallback(() => setTick((x) => x + 1), []);

  const lines = useMemo(() => {
    void tick;
    return getBetslip();
  }, [tick]);

  const combined = useMemo(() => {
    if (!lines.length) return 1;
    return lines.reduce((acc, l) => acc * l.combinedDecimal, 1);
  }, [lines]);

  useEffect(() => {
    setFmt(getStoredOddsFormat());
    const onBet = () => refresh();
    const onOdds = () => setFmt(getStoredOddsFormat());
    window.addEventListener("tmt-betslip", onBet);
    window.addEventListener("tmt-odds-format", onOdds);
    return () => {
      window.removeEventListener("tmt-betslip", onBet);
      window.removeEventListener("tmt-odds-format", onOdds);
    };
  }, [refresh]);

  if (lines.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-[4.5rem] right-3 z-[45] flex h-12 min-w-12 items-center justify-center rounded-full border border-[#00e676]/40 bg-[#0a101c] px-3 font-black text-[#b9ffd4] shadow-lg md:bottom-6 md:hidden"
      >
        Slip{" "}
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#00e676] px-1 text-[11px] text-black">
          {lines.length}
        </span>
      </button>

      {open ? (
        <button
          type="button"
          aria-label="Close betslip"
          className="fixed inset-0 z-[44] bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {open ? (
        <div className="fixed bottom-[7.25rem] left-3 right-3 z-[46] max-h-[min(70vh,420px)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1729] p-4 shadow-2xl md:hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-black uppercase tracking-wide text-white/55">Betslip</div>
            <button type="button" className="text-xs font-bold text-white/50 hover:text-white" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <ul className="mt-3 grid gap-2">
            {lines.map((l) => (
              <li key={l.slug} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm">
                <div className="font-semibold text-white">{l.title}</div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-white/50">
                  <span>
                    {l.legs} leg{l.legs === 1 ? "" : "s"} ·{" "}
                    <span className="font-mono font-bold text-[#b9ffd4]">{formatOdds(l.combinedDecimal, fmt)}</span>
                  </span>
                  <button
                    type="button"
                    className="font-bold text-rose-300 hover:text-rose-200"
                    onClick={() => {
                      removeSlipFromBetslip(l.slipId);
                      refresh();
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
            <span className="text-white/50">Combined</span>
            <span className="tmt-odds font-mono">{formatOdds(combined, fmt)}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearBetslip();
                refresh();
                setOpen(false);
              }}
            >
              Clear
            </Button>
            <Button as="link" href="/#packages" variant="primary" size="sm" onClick={() => setOpen(false)}>
              VIP
            </Button>
          </div>
          <Button as="link" href="/slips" variant="secondary" size="sm" className="mt-2 w-full" onClick={() => setOpen(false)}>
            More lines
          </Button>
        </div>
      ) : null}
    </>
  );
}
