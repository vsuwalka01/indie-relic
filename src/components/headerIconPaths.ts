// Extracted directly from the source artwork: Front pages layout ( INDIE RELIC ).pdf
// These are the actual header pictogram icons (account / search / bag), not stand-in Lucide icons.

export interface HeaderIcon { viewBox: string; paths: string[] }

export const personIcon: HeaderIcon = {
  viewBox: '0 0 35.26 56.78',
  paths: [
    'M0.00,22.11H35.26V56.78H0.00Z Z',
    'M28.08,9.99 C28.08,15.50 23.44,19.98 17.72,19.98 C12.00,19.98 7.36,15.50 7.36,9.99 C7.36,4.47 12.00,0.00 17.72,0.00 C23.44,0.00 28.08,4.47 28.08,9.99 Z',
  ],
};

export const searchIcon: HeaderIcon = {
  viewBox: '0 0 53.70 54.48',
  paths: [
    'M15.35,0.00H23.03V8.36H15.35Z Z',
    'M23.03,8.36H30.71V16.73H23.03Z Z',
    'M7.68,8.36H15.35V16.73H7.68Z Z',
    'M30.58,16.73H38.26V25.09H30.58Z Z',
    'M0.00,16.73H7.68V25.09H0.00Z Z',
    'M23.03,25.09H30.71V33.46H23.03Z Z',
    'M7.68,25.09H15.35V33.46H7.68Z Z',
    'M15.35,33.46H23.03V41.82H15.35Z Z',
    'M46.03,54.48 L53.70,46.07 L30.70,25.09 L23.03,33.50 L46.03,54.48 Z',
  ],
};

export const bagIcon: HeaderIcon = {
  viewBox: '0 0 34.38 54.47',
  paths: [
    'M0.00,20.67H34.38V54.47H0.00Z Z',
    'M13.80,0.00H20.70V7.52H13.80Z Z',
    'M20.70,7.51H27.59V15.03H20.70Z Z',
    'M6.90,7.51H13.80V15.03H6.90Z Z',
    'M27.48,15.03H34.37V22.54H27.48Z Z',
    'M0.00,15.03H6.90V22.54H0.00Z Z',
    'M20.70,22.54H27.59V30.06H20.70Z Z',
    'M6.90,22.54H13.80V30.06H6.90Z Z',
    'M13.80,30.06H20.70V37.57H13.80Z Z',
  ],
};
