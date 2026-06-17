export function shortCode(code: string) {
  if (!code) return '';
  return code.length > 12 ? code.substring(0,12) + '...' : code;
}

export function fmtDate(dateStr: string | undefined) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR');
  } catch {
    return dateStr;
  }
}

export function fmtDateTime(dateStr: string | undefined) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('fr-FR');
  } catch {
    return dateStr;
  }
}
