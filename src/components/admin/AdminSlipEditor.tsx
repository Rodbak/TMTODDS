"use client";

import type React from "react";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

type Tier = "FREE" | "FIXED" | "CONFIRMED" | "CORRECT_SCORE";

type MatchRow = {
  homeTeam: string;
  awayTeam: string;
  league?: string;
  kickoffAt?: string;
  market: string;
  pick: string;
  odds: number;
  bookmaker?: string;
  bestSiteUrl?: string;
  researchUrls?: string; // comma-separated in the form; parseUrls() converts to string[] before POST
};

export function AdminSlipEditor() {
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [tier, setTier] = useState<Tier>("FREE");
  const [bodyMd, setBodyMd] = useState(
    "## Notes\n\n- Stake: \n- Total odds: \n\n## Research links\n\n- SofaScore: \n- Flashscore: \n",
  );
  const [publishNow, setPublishNow] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchRow[]>([
    { homeTeam: "", awayTeam: "", market: "1X2", pick: "", odds: 1.5 },
  ]);

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (!bodyMd.trim()) return false;
    if (!matches.length) return true;
    return matches.every(
      (m) =>
        m.homeTeam.trim() &&
        m.awayTeam.trim() &&
        m.market.trim() &&
        m.pick.trim() &&
        Number.isFinite(m.odds) &&
        m.odds > 1,
    );
  }, [title, bodyMd, matches]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black">
        <div className="grid gap-1">
          <div className="text-sm font-semibold">Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-black"
            placeholder="e.g. UCL Night — Confirmed Picks"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-sm font-semibold">Tier</span>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as Tier)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-black"
            >
              <option value="FREE">Free</option>
              <option value="FIXED">Fixed</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CORRECT_SCORE">Correct Score</option>
            </select>
          </label>

          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm font-semibold">Publishing</span>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={publishNow}
                  onChange={(e) => setPublishNow(e.target.checked)}
                />
                Publish now
              </label>
              <span className="text-xs text-black/60 dark:text-white/60">
                (Scheduling can be added next)
              </span>
            </div>
          </label>
        </div>

        <div className="grid gap-1">
          <div className="text-sm font-semibold">Slip notes (Markdown)</div>
          <textarea
            value={bodyMd}
            onChange={(e) => setBodyMd(e.target.value)}
            rows={10}
            className="rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-black"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-black">Matches</div>
            <div className="text-sm text-black/70 dark:text-white/70">
              Add fixtures and links (SofaScore, Flashscore, FotMob, etc.).
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setMatches((m) => [
                ...m,
                { homeTeam: "", awayTeam: "", market: "1X2", pick: "", odds: 1.5 },
              ])
            }
          >
            Add row
          </Button>
        </div>

        <div className="mt-4 grid gap-3">
          {matches.map((m, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-black/10 p-4 dark:border-white/10"
            >
              <div className="grid gap-3 md:grid-cols-6">
                <label className="grid gap-1 md:col-span-2">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                    Teams
                  </span>
                  <div className="flex gap-2">
                    <input
                      value={m.homeTeam}
                      onChange={(e) => updateRow(setMatches, idx, { homeTeam: e.target.value })}
                      className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                      placeholder="Home"
                    />
                    <input
                      value={m.awayTeam}
                      onChange={(e) => updateRow(setMatches, idx, { awayTeam: e.target.value })}
                      className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                      placeholder="Away"
                    />
                  </div>
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                    League
                  </span>
                  <input
                    value={m.league ?? ""}
                    onChange={(e) => updateRow(setMatches, idx, { league: e.target.value })}
                    className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                    placeholder="EPL"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                    Kickoff (optional)
                  </span>
                  <input
                    value={m.kickoffAt ?? ""}
                    onChange={(e) => updateRow(setMatches, idx, { kickoffAt: e.target.value })}
                    className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                    placeholder="2026-04-28 19:00"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                    Market
                  </span>
                  <input
                    value={m.market}
                    onChange={(e) => updateRow(setMatches, idx, { market: e.target.value })}
                    className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                    placeholder="BTTS"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                    Pick
                  </span>
                  <input
                    value={m.pick}
                    onChange={(e) => updateRow(setMatches, idx, { pick: e.target.value })}
                    className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                    placeholder="Yes"
                  />
                </label>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-6">
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                    Odds
                  </span>
                  <input
                    value={String(m.odds)}
                    onChange={(e) =>
                      updateRow(setMatches, idx, { odds: Number(e.target.value) })
                    }
                    className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                    placeholder="1.85"
                  />
                </label>

                <label className="grid gap-1 md:col-span-2">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                    Bookmaker
                  </span>
                  <input
                    value={m.bookmaker ?? ""}
                    onChange={(e) => updateRow(setMatches, idx, { bookmaker: e.target.value })}
                    className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                    placeholder="SportyBet"
                  />
                </label>

                <label className="grid gap-1 md:col-span-2">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                    Best site URL
                  </span>
                  <input
                    value={m.bestSiteUrl ?? ""}
                    onChange={(e) => updateRow(setMatches, idx, { bestSiteUrl: e.target.value })}
                    className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                    placeholder="https://..."
                  />
                </label>

                <div className="flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMatches((rows) => rows.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <label className="mt-3 grid gap-1">
                <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                  Research links (comma-separated URLs)
                </span>
                <input
                  value={m.researchUrls ?? ""}
                  onChange={(e) => updateRow(setMatches, idx, { researchUrls: e.target.value })}
                  className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                  placeholder="https://www.sofascore.com/... , https://www.flashscore.com/..."
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          disabled={pending || !canSubmit}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const res = await fetch("/api/admin/slips", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  title,
                  tier,
                  bodyMd,
                  publishNow,
                  matches: matches.map((m) => ({
                    ...m,
                    odds: Number(m.odds),
                    researchUrls: parseUrls(m.researchUrls ?? ""),
                  })),
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) {
                setError(data?.error ?? "Failed to create slip");
                return;
              }
              window.location.href = `/admin/slips/${data.id}`;
            });
          }}
        >
          {pending ? "Saving..." : "Create slip"}
        </Button>

        <Button as="link" href="/admin/slips" variant="secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
}

function updateRow(
  setMatches: React.Dispatch<React.SetStateAction<MatchRow[]>>,
  idx: number,
  patch: Partial<MatchRow>,
) {
  setMatches((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
}

function parseUrls(raw: string) {
  const urls = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return urls.length ? urls : [];
}

