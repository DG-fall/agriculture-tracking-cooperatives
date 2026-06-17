// All dates stored UTC in DB. Display in GMT+1 (Africa/Dakar is UTC+0 actually,
// but spec requests GMT+1 Dakar display). We add 1h offset for display.
const OFFSET_MS = 1 * 60 * 60 * 1000;

export function fmtDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const local = new Date(d.getTime() + OFFSET_MS);
  return local.toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  });
}

export function fmtDateTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const local = new Date(d.getTime() + OFFSET_MS);
  return local.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }) + ' (GMT+1)';
}

export function shortCode(uuid?: string | null): string {
  if (!uuid) return '—';
  return uuid.split('-')[0].toUpperCase();
}
