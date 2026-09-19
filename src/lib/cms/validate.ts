import type { Product } from '@/lib/products';
import type { StateCraft } from '@/lib/stateCrafts';
import { DEFAULT_SETTINGS, type SiteSettings } from './settings';
import type { Coupon } from './coupons';
import { sanitizeTheme } from './theme';
import type { CollectionName } from './store';

type Result = { ok: true; value: unknown } | { ok: false; error: string };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const str = (v: unknown, max = 8000) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};
const strArray = (v: unknown, max = 60) =>
  Array.isArray(v) ? v.filter((i) => typeof i === 'string').slice(0, max).map((i) => str(i)) : [];

/**
 * Images are rendered into `src`, so only http(s) and site-relative paths are
 * accepted — this is what stops a saved `javascript:` or `data:` URL from
 * becoming stored XSS on the storefront.
 */
function safeImage(v: unknown): string {
  const raw = str(v, 2000).trim();
  if (!raw) return '';
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw;
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function product(input: unknown, index: number): Product | string {
  if (!isObject(input)) return `Item ${index + 1} is not an object`;
  const name = str(input.name, 200).trim();
  if (!name) return `Item ${index + 1} needs a name`;

  const id = Math.trunc(num(input.id));
  if (id <= 0) return `"${name}" needs a positive numeric id`;

  return {
    id,
    name,
    craft: str(input.craft, 120),
    price: Math.max(0, Math.round(num(input.price))),
    image: safeImage(input.image),
    gallery: strArray(input.gallery, 12).map(safeImage).filter(Boolean),
    intro: str(input.intro),
    aboutCraft: str(input.aboutCraft),
    ideaBehind: str(input.ideaBehind),
    description: str(input.description),
    details: str(input.details),
    shipping: str(input.shipping),
  };
}

function craft(input: unknown, index: number): StateCraft | string {
  if (!isObject(input)) return `Item ${index + 1} is not an object`;
  const state = str(input.state, 120).trim();
  if (!state) return `Item ${index + 1} needs a state`;

  const productId = input.productId === undefined || input.productId === null || input.productId === ''
    ? undefined
    : Math.trunc(num(input.productId));

  return {
    state,
    craft: str(input.craft, 200),
    region: str(input.region, 200),
    age: str(input.age, 120),
    tagline: str(input.tagline, 400),
    description: str(input.description),
    ...(productId && productId > 0 ? { productId } : {}),
  };
}

function settings(input: unknown): SiteSettings | string {
  if (!isObject(input)) return 'Settings must be an object';
  const stats = Array.isArray(input.stats)
    ? input.stats.slice(0, 8).map((s) => {
        const item = isObject(s) ? s : {};
        return {
          value: Math.round(num(item.value)),
          suffix: str(item.suffix, 20),
          label: str(item.label, 120),
        };
      })
    : DEFAULT_SETTINGS.stats;

  return {
    heroEyebrow: str(input.heroEyebrow, 300) || DEFAULT_SETTINGS.heroEyebrow,
    heroLines: strArray(input.heroLines, 6).filter(Boolean).length
      ? strArray(input.heroLines, 6).filter(Boolean)
      : DEFAULT_SETTINGS.heroLines,
    heroBody: str(input.heroBody) || DEFAULT_SETTINGS.heroBody,
    marqueeItems: strArray(input.marqueeItems, 20).filter(Boolean).length
      ? strArray(input.marqueeItems, 20).filter(Boolean)
      : DEFAULT_SETTINGS.marqueeItems,
    stats,
    featuredHeading: str(input.featuredHeading, 300) || DEFAULT_SETTINGS.featuredHeading,
    testimonialsHeading: str(input.testimonialsHeading, 300) || DEFAULT_SETTINGS.testimonialsHeading,
    newsletterHeading: str(input.newsletterHeading, 300) || DEFAULT_SETTINGS.newsletterHeading,
    newsletterBody: str(input.newsletterBody) || DEFAULT_SETTINGS.newsletterBody,
  };
}

function coupon(input: unknown, index: number): Coupon | string {
  if (!isObject(input)) return `Item ${index + 1} is not an object`;

  const code = str(input.code, 40).trim().toUpperCase().replace(/\s+/g, '');
  if (!code) return `Coupon ${index + 1} needs a code`;
  if (!/^[A-Z0-9_-]+$/.test(code)) return `"${code}" can only use letters, numbers, - and _`;

  const type = input.type === 'fixed' ? 'fixed' : 'percent';
  const rawValue = Math.max(0, Math.round(num(input.value)));

  return {
    code,
    description: str(input.description, 300),
    type,
    // A percentage over 100 would hand out more than the order is worth.
    value: type === 'percent' ? Math.min(rawValue, 100) : rawValue,
    minSubtotal: Math.max(0, Math.round(num(input.minSubtotal))),
    maxUses: Math.max(0, Math.round(num(input.maxUses))),
    usedCount: Math.max(0, Math.round(num(input.usedCount))),
    expiresAt: /^\d{4}-\d{2}-\d{2}$/.test(str(input.expiresAt, 10)) ? str(input.expiresAt, 10) : '',
    active: input.active !== false,
  };
}

export function validateCollection(name: CollectionName, body: unknown): Result {
  const payload = isObject(body) && 'data' in body ? (body as { data: unknown }).data : body;

  if (name === 'settings') {
    const value = settings(payload);
    return typeof value === 'string' ? { ok: false, error: value } : { ok: true, value };
  }

  if (name === 'theme') {
    return { ok: true, value: sanitizeTheme(payload) };
  }

  if (name === 'coupons') {
    if (!Array.isArray(payload)) return { ok: false, error: 'Coupons must be a list' };
    const out: Coupon[] = [];
    for (let i = 0; i < payload.length; i++) {
      const item = coupon(payload[i], i);
      if (typeof item === 'string') return { ok: false, error: item };
      if (out.some((c) => c.code === item.code)) return { ok: false, error: `Duplicate code "${item.code}"` };
      out.push(item);
    }
    return { ok: true, value: out };
  }

  if (!Array.isArray(payload)) return { ok: false, error: `${name} must be a list` };
  if (payload.length > 500) return { ok: false, error: 'Too many items' };

  const mapper = name === 'products' ? product : craft;
  const out = [];
  for (let i = 0; i < payload.length; i++) {
    const item = mapper(payload[i], i);
    if (typeof item === 'string') return { ok: false, error: item };
    out.push(item);
  }

  if (name === 'products') {
    const ids = new Set(out.map((p) => (p as Product).id));
    if (ids.size !== out.length) return { ok: false, error: 'Two products share the same id' };
  }

  return { ok: true, value: out };
}
