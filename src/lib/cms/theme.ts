export interface Theme {
  preset: string;
  cream: string;
  navy: string;
  navyDark: string;
  gold: string;
  maroon: string;
}

export const DEFAULT_THEME: Theme = {
  preset: 'Heritage',
  cream: '#F4F1DC',
  navy: '#2F4D77',
  navyDark: '#172B53',
  gold: '#DAAC54',
  maroon: '#9E2027',
};

export const THEME_PRESETS: Theme[] = [
  DEFAULT_THEME,
  { preset: 'Indigo dye', cream: '#F2EFE6', navy: '#28405F', navyDark: '#131E33', gold: '#C9A227', maroon: '#7C2A36' },
  { preset: 'Terracotta', cream: '#F7F0E6', navy: '#6B3A2A', navyDark: '#3A1D14', gold: '#D08C3F', maroon: '#8C3A2E' },
  { preset: 'Palm & brass', cream: '#F3F2E7', navy: '#2C4A3B', navyDark: '#15291F', gold: '#C8A046', maroon: '#8A3B2F' },
  { preset: 'Ink & saffron', cream: '#F6F4EF', navy: '#2A2A33', navyDark: '#141419', gold: '#E2A03F', maroon: '#A33B2A' },
];

const HEX = /^#[0-9a-fA-F]{6}$/;

/** Colours land in a <style> tag, so anything not a plain hex is discarded. */
export function safeColor(value: unknown, fallback: string): string {
  return typeof value === 'string' && HEX.test(value.trim()) ? value.trim() : fallback;
}

export function sanitizeTheme(input: unknown): Theme {
  const t = (typeof input === 'object' && input !== null ? input : {}) as Partial<Theme>;
  return {
    preset: typeof t.preset === 'string' ? t.preset.slice(0, 60) : DEFAULT_THEME.preset,
    cream: safeColor(t.cream, DEFAULT_THEME.cream),
    navy: safeColor(t.navy, DEFAULT_THEME.navy),
    navyDark: safeColor(t.navyDark, DEFAULT_THEME.navyDark),
    gold: safeColor(t.gold, DEFAULT_THEME.gold),
    maroon: safeColor(t.maroon, DEFAULT_THEME.maroon),
  };
}

export function themeToCss(theme: Theme): string {
  const t = sanitizeTheme(theme);
  return `:root{--brand-cream:${t.cream};--brand-navy:${t.navy};--brand-navy-dark:${t.navyDark};--brand-gold:${t.gold};--brand-maroon:${t.maroon};}`;
}
