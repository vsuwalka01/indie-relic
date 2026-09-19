/** Editable site-wide copy. Shared by the CMS and the public pages. */
export interface SiteSettings {
  heroEyebrow: string;
  heroLines: string[];
  heroBody: string;
  marqueeItems: string[];
  stats: { value: number; suffix: string; label: string }[];
  featuredHeading: string;
  testimonialsHeading: string;
  newsletterHeading: string;
  newsletterBody: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  heroEyebrow: 'Living traditions. Everyday objects.',
  heroLines: ['Indian', 'Traditions,', 'Reimagined.'],
  heroBody:
    'Indie Relic bridges the gap between traditional Indian artistry and contemporary lifestyle needs. We collaborate closely with local artisans to adapt timeless techniques into modern collections — ensuring our rich heritage stays alive, functional, and cherished in everyday spaces.',
  marqueeItems: [
    'Handmade in India',
    '31 states, one atlas',
    'Artisan-owned workshops',
    'Fair wages, always',
    'Made to be cherished',
  ],
  stats: [
    { value: 31, suffix: '', label: 'States mapped' },
    { value: 240, suffix: '+', label: 'Artisan partners' },
    { value: 12, suffix: '', label: 'Living crafts' },
    { value: 400, suffix: ' yrs', label: 'Oldest tradition' },
  ],
  featuredHeading: 'Tradition, brought home.',
  testimonialsHeading: 'Objects become memories.',
  newsletterHeading: 'A letter from the workshops.',
  newsletterBody:
    'New collections, artisan stories, and the occasional dispatch from the road — once a month, never more.',
};
