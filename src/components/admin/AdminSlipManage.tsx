"use client";

import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  pick: string;
  odds: number;
  resultStatus: "PENDING" | "WON" | "LOST" | "VOID";
  finalHomeScore: number | null;
  finalAwayScore: number | null;
};

export function AdminSlipManage({
  slip,
}: {
  slip: {
    id: string;
    status: "DRAFT" | "PUBLISHED";
    publishAt: string | null;
    title: string;
    tier: "FREE" | "FIXED" | "CONFIRMED" | "CORRECT_SCORE";
    slug: string;
    matches: Match[];
  };
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(slip.status);
  const [matches, setMatches] = useState<Match[]>(slip.matches);
  const [message, setMessage] = useState<string | null>(null);

  const summary = useMemo(() => {
    const won = matches.filter((m) => m.resultStatus === "WON").length;
    const lost = matches.filter((m) => m.resultStatus === "LOST").length;
    const pending = matches.filter((m) => m.resultStatus === "PENDING").length;
    return { won, lost, pending, total: matches.length };
  }, [matches]);

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-black/70 dark:text-white/70">
            Results:{" "}
            <span className="font-semibold">
              {summary.won}W / {summary.lost}L / {summary.pending}P
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold">
              <span>Status</span>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "DRAFT" | "PUBLISHED")
                }
                className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </label>
            <Button
              disabled={pending}
              onClick={() => {
                setMessage(null);
                startTransition(async () => {
                  const res = await fetch(`/api/admin/slips/${slip.id}`, {
                    method: "PATCH",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ status, matches }),
                  });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    setMessage(data?.error ?? "Save failed");
                    return;
                  }
                  setMessage("Saved.");
                });
              }}
            >
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        {message ? (
          <div className="mt-3 text-sm text-black/70 dark:text-white/70">
            {message}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black">
        <div className="text-lg font-black">Matches</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-xs text-black/60 dark:text-white/60">
                <th className="border-b border-black/10 py-2 pr-3 dark:border-white/10">
                  Match
                </th>
                <th className="border-b border-black/10 py-2 pr-3 dark:border-white/10">
                  Pick
                </th>
                <th className="border-b border-black/10 py-2 pr-3 dark:border-white/10">
                  Odds
                </th>
                <th className="border-b border-black/10 py-2 pr-3 dark:border-white/10">
                  Result
                </th>
                <th className="border-b border-black/10 py-2 dark:border-white/10">
                  FT score
                </th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, idx) => (
                <tr key={m.id}>
                  <td className="border-b border-black/10 py-3 pr-3 dark:border-white/10">
                    <div className="font-semibold">
                      {m.homeTeam} vs {m.awayTeam}
                    </div>
                    <div className="text-xs text-black/60 dark:text-white/60">
                      {m.market} • {m.pick}
                    </div>
                  </td>
                  <td className="border-b border-black/10 py-3 pr-3 dark:border-white/10">
                    {m.pick}
                  </td>
                  <td className="border-b border-black/10 py-3 pr-3 dark:border-white/10">
                    {m.odds.toFixed(2)}
                  </td>
                  <td className="border-b border-black/10 py-3 pr-3 dark:border-white/10">
                    <select
                      value={m.resultStatus}
                      onChange={(e) =>
                        setMatches((rows) =>
                          rows.map((r, i) =>
                            i === idx
                              ? {
                                  ...r,
                                  resultStatus: e.target.value as
                                    | "PENDING"
                                    | "WON"
                                    | "LOST"
                                    | "VOID",
                                }
                              : r,
                          ),
                        )
                      }
                      className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="WON">WON</option>
                      <option value="LOST">LOST</option>
                      <option value="VOID">VOID</option>
                    </select>
                  </td>
                  <td className="border-b border-black/10 py-3 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <input
                        value={m.finalHomeScore ?? ""}
                        onChange={(e) =>
                          setMatches((rows) =>
                            rows.map((r, i) =>
                              i === idx
                                ? {
                                    ...r,
                                    finalHomeScore:
                                      e.target.value === ""
                                        ? null
                                        : Number(e.target.value),
                                  }
                                : r,
                            ),
                          )
                        }
                        className="h-10 w-20 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                        placeholder="H"
                      />
                      <span className="text-black/60 dark:text-white/60">-</span>
                      <input
                        value={m.finalAwayScore ?? ""}
                        onChange={(e) =>
                          setMatches((rows) =>
                            rows.map((r, i) =>
                              i === idx
                                ? {
                                    ...r,
                                    finalAwayScore:
                                      e.target.value === ""
                                        ? null
                                        : Number(e.target.value),
                                  }
                                : r,
                            ),
                          )
                        }
                        className="h-10 w-20 rounded-xl border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-black"
                        placeholder="A"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {matches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-sm text-black/70 dark:text-white/70">
                    No matches.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

