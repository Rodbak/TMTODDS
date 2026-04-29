export function subscriptionEndAtUtc(startsAt: Date, durationDays: number) {
  const start = new Date(startsAt);
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 23, 59, 59, 999));
  end.setUTCDate(end.getUTCDate() + (durationDays - 1));
  return end;
}

