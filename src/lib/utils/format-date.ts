/**
 * Format an ISO timestamp as a human-readable CST/CDT string.
 * Uses America/Chicago so it auto-switches between CST and CDT.
 *
 * Example: "Apr 18, 2026 · 12:59 PM CDT"
 */
export function formatDateTimeCST(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';

  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });

  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

  const month = get('month');
  const day = get('day');
  const year = get('year');
  const hour = get('hour');
  const minute = get('minute');
  const dayPeriod = get('dayPeriod');
  const tzName = get('timeZoneName');

  return `${month} ${day}, ${year} · ${hour}:${minute} ${dayPeriod} ${tzName}`;
}

/**
 * Format a date-only string (YYYY-MM-DD) as a readable CST day string.
 * Constructs the Date from explicit Y/M/D parts to avoid UTC-midnight rollback.
 *
 * Example: "Sat, Jun 20, 2026"
 */
export function formatDateCST(dateStr: string): string {
  if (!dateStr) return '';

  // Accept both "YYYY-MM-DD" and full ISO strings
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return '';

  const [, y, m, d] = match;
  // Build a noon-UTC time so any timezone shift stays on the same calendar day
  const date = new Date(`${y}-${m}-${d}T12:00:00Z`);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
