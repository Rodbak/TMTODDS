/** Relative / calendar labels for kickoff (client + server safe). */
export function formatKickoffLabel(iso: string | undefined, now = new Date()): string {
  if (!iso) return "—";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return "—";

  const diffMs = t.getTime() - now.getTime();
  const abs = Math.abs(diffMs);
  const mins = Math.round(abs / 60000);

  if (diffMs > 0 && abs < 48 * 60 * 60 * 1000) {
    if (mins < 1) return "Starting soon";
    if (mins < 60) return `in ${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h < 24) return m ? `in ${h}h ${m}m` : `in ${h}h`;
  }

  const sameDay =
    t.getFullYear() === now.getFullYear() &&
    t.getMonth() === now.getMonth() &&
    t.getDate() === now.getDate();
  if (sameDay) {
    return `Today ${t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    t.getFullYear() === tomorrow.getFullYear() &&
    t.getMonth() === tomorrow.getMonth() &&
    t.getDate() === tomorrow.getDate();
  if (isTomorrow) {
    return `Tomorrow ${t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  }

  return t.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatKickoffGmtLabel(iso: string | undefined): string {
  if (!iso) return "—";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return "—";

  const weekday = t.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
  const day = t.toLocaleDateString("en-GB", { day: "2-digit", timeZone: "UTC" });
  const month = t.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  const time = t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
  return `${weekday} ${day} ${month} · ${time} GMT`;
}

export function isKickoffOnCalendarDay(iso: string | undefined, dayStart: Date): boolean {
  if (!iso) return false;
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return false;
  const end = new Date(dayStart);
  end.setDate(end.getDate() + 1);
  return t >= dayStart && t < end;
}
