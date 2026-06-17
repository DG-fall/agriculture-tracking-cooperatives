// TraceAgri brand palette — deep forest green, warm cream, terracotta accent
export const colors = {
  primary: '#1B4332',
  primaryDark: '#0E2A1E',
  primaryLight: '#2D6A4F',
  primaryLighter: '#DCE9E1',
  accent: '#C2562E',
  accentLight: '#F6E2D6',
  bg: '#F7F2E7',
  bgAlt: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A2B22',
  textMuted: '#6B7A70',
  textLight: '#A0AC9F',
  border: '#E7E0D0',
  borderLight: '#F0EADC',
  danger: '#C0392B',
  dangerLight: '#F7E1DD',
  success: '#1B4332',
  successLight: '#DCE9E1',
  warning: '#C2562E',
  warningLight: '#F6E2D6',
  blue: '#2D6A4F',
  blueLight: '#DCE9E1',
};

export const statutMeta: Record<string, { label: string; color: string; bg: string }> = {
  en_stock: { label: 'En stock', color: '#1B4332', bg: '#DCE9E1' },
  vendu: { label: 'Vendu', color: '#2D6A4F', bg: '#DCE9E1' },
  perdu: { label: 'Perdu', color: '#C0392B', bg: '#F7E1DD' },
  en_transit: { label: 'En transit', color: '#C2562E', bg: '#F6E2D6' },
};

export const radius = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, full: 9999 };
export const spacing = { xs: 6, sm: 12, md: 18, lg: 26, xl: 36 };
