export const colors = {
  primary: '#15803d',
  primaryDark: '#14532d',
  primaryLight: '#22c55e',
  primaryLighter: '#dcfce7',
  accent: '#ea580c',
  accentLight: '#ffedd5',
  bg: '#f0fdf4',
  bgAlt: '#ffffff',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  success: '#15803d',
  successLight: '#dcfce7',
  warning: '#eab308',
  warningLight: '#fef9c3',
  blue: '#3b82f6',
  blueLight: '#dbeafe',
};

export const statutMeta: Record<string, { label: string; color: string; bg: string }> = {
  en_stock: { label: 'En stock', color: '#15803d', bg: '#dcfce7' },
  vendu: { label: 'Vendu', color: '#1e40af', bg: '#dbeafe' },
  perdu: { label: 'Perdu', color: '#dc2626', bg: '#fee2e2' },
  en_transit: { label: 'En transit', color: '#ca8a04', bg: '#fef9c3' },
};

export const radius = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, full: 9999 };
export const spacing = { xs: 6, sm: 12, md: 18, lg: 26, xl: 36 };
