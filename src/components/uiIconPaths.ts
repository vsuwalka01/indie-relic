// Extracted directly from the source artwork: Front pages layout ( INDIE RELIC ).pdf, page 2
// The carousel arrows and card 'add' icon are custom pixel glyphs, not stand-in Lucide icons.

export interface UiIcon { viewBox: string; paths: string[] }

export const arrowLeftIcon: UiIcon = {
  viewBox: '0 0 53.72 97.53',
  paths: [
    'M35.81,0.00H53.72V19.51H35.81Z',
    'M17.91,19.51H35.81V39.01H17.91Z',
    'M0.00,39.01H17.91V58.52H0.00Z',
    'M17.91,58.52H35.81V78.02H17.91Z',
    'M35.81,78.02H53.72V97.53H35.81Z',
  ],
};

export const arrowRightIcon: UiIcon = {
  viewBox: '0 0 53.72 97.53',
  paths: [
    'M0.00,0.00H17.91V19.51H0.00Z',
    'M17.91,19.51H35.81V39.01H17.91Z',
    'M35.81,39.01H53.72V58.52H35.81Z',
    'M17.91,58.52H35.81V78.02H17.91Z',
    'M0.00,78.02H17.91V97.53H0.00Z',
  ],
};

// Extracted from All products layout (Indie Relic).pdf — the smaller
// per-card chevron, distinct from the larger carousel arrows above.
export const smallArrowRightIcon: UiIcon = {
  viewBox: '0 0 17.15 24.91',
  paths: [
    'M5.72,0.00H11.43V6.23H5.72Z',
    'M11.43,6.23H17.15V12.45H11.43Z',
    'M5.72,12.45H11.43V18.68H5.72Z',
    'M0.00,18.68H5.72V24.91H0.00Z',
  ],
};

// Extracted from Front pages layout ( INDIE RELIC ).pdf, page 4 (testimonials)
export const starIcon: UiIcon = {
  viewBox: '0 0 31.43 29.94',
  paths: [
    'M25.34,29.94 L15.66,22.84 L5.91,29.84 L9.68,18.44 L0.00,11.34 L12.01,11.40 L15.78,0.00 L19.43,11.44 L31.43,11.50 L21.68,18.51 L25.34,29.94 Z',
  ],
};

export const dottedPlusIcon: UiIcon = {
  viewBox: '0 0 40.08 43.63',
  paths: [
    'M17.19,12.47H22.90V18.70H17.19Z',
    'M22.90,18.70H28.62V24.92H22.90Z',
    'M17.13,24.92H22.85V31.15H17.13Z',
    'M11.44,18.68H17.16V24.91H11.44Z',
    'M34.37,18.68H40.08V24.91H34.37Z',
    'M0.00,18.70H5.72V24.92H0.00Z',
    'M17.20,0.00H22.91V6.23H17.20Z',
    'M17.18,37.41H22.89V43.63H17.18Z',
  ],
};
