import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { products as seedProducts, type Product } from '@/lib/products';
import { STATE_CRAFTS as seedCrafts, type StateCraft } from '@/lib/stateCrafts';
import { DEFAULT_SETTINGS, type SiteSettings } from './settings';
import { DEFAULT_COUPONS, type Coupon } from './coupons';
import { DEFAULT_THEME, type Theme } from './theme';
import { seedOwner, type User } from './users';
import type { Order } from './orders';
import { migrateCustomer, type Customer } from './customers';
import type { Challenge } from './otp';
import type { RevokedToken } from './revoked';

export type Collections = {
  products: Product[];
  crafts: StateCraft[];
  settings: SiteSettings;
  coupons: Coupon[];
  orders: Order[];
  users: User[];
  theme: Theme;
  customers: Customer[];
  otps: Challenge[];
  revoked: RevokedToken[];
};

export type CollectionName = keyof Collections;

const SEEDS: Collections = {
  products: seedProducts,
  crafts: seedCrafts,
  settings: DEFAULT_SETTINGS,
  coupons: DEFAULT_COUPONS,
  orders: [],
  users: [],
  theme: DEFAULT_THEME,
  customers: [],
  otps: [],
  revoked: [],
};

/**
 * Collection names are used to build file paths and blob keys, so they are
 * matched against this list rather than interpolated directly — an unchecked
 * name from a request URL would otherwise be a path traversal.
 */
const VALID: CollectionName[] = ['products', 'crafts', 'settings', 'coupons', 'orders', 'users', 'theme', 'customers', 'otps', 'revoked'];

export function isCollection(name: string): name is CollectionName {
  return (VALID as string[]).includes(name);
}

// Vercel connects new stores with short-lived OIDC credentials and exposes the
// store id. Older/manual setups may still use a read-write token.
const useBlob = Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
const dataDir = path.join(process.cwd(), 'data');
const filePath = (name: CollectionName) => path.join(dataDir, `${name}.json`);
const blobKey = (name: CollectionName) => `cms/${name}.json`;

async function readFromFile<K extends CollectionName>(name: K): Promise<Collections[K] | null> {
  try {
    return JSON.parse(await fs.readFile(filePath(name), 'utf8'));
  } catch {
    return null;
  }
}

async function readFromBlob<K extends CollectionName>(name: K): Promise<Collections[K] | null> {
  const { get } = await import('@vercel/blob');
  const result = await get(blobKey(name), { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text());
}

/** Stored content, falling back to the code-defined seed when nothing is saved yet. */
export async function read<K extends CollectionName>(name: K): Promise<Collections[K]> {
  const stored = useBlob ? await readFromBlob(name) : await readFromFile(name);

  if (stored === null) {
    // With no saved users, the env-var owner is the only way in.
    if (name === 'users') {
      const owner = seedOwner();
      return (owner ? [owner] : []) as Collections[K];
    }
    return SEEDS[name];
  }

  // An object saved before a new field existed would be missing it.
  if (name === 'settings') {
    return { ...DEFAULT_SETTINGS, ...(stored as SiteSettings) } as Collections[K];
  }
  if (name === 'theme') {
    return { ...DEFAULT_THEME, ...(stored as Theme) } as Collections[K];
  }
  if (name === 'customers') {
    // Older records predate the address book.
    return (stored as unknown as Customer[]).map(migrateCustomer) as Collections[K];
  }
  if (name === 'users') {
    // Keep the env owner available even after other users are saved, so a lost
    // admin account can never lock everyone out of the CMS.
    const users = stored as User[];
    const owner = seedOwner();
    if (owner && !users.some((u) => u.id === owner.id)) {
      return [owner, ...users] as Collections[K];
    }
  }

  return stored;
}

export async function write<K extends CollectionName>(name: K, value: Collections[K]): Promise<void> {
  const body = JSON.stringify(value, null, 2);

  if (useBlob) {
    const { put } = await import('@vercel/blob');
    await put(blobKey(name), body, {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(filePath(name), body, 'utf8');
}

export const storageMode = () => (useBlob ? 'Vercel Blob' : 'local JSON files');

/**
 * Serialises read-modify-write against one collection.
 *
 * Every collection is a single JSON document, so `read` → change → `write`
 * from two requests at once means the second overwrites the first. That lost
 * concurrent orders outright: each caller got a success response and an order
 * number, while only the last write survived. Mutations now queue per
 * collection so each one sees the previous one's result.
 *
 * The queue is per process. A single server (or one warm serverless instance)
 * is fully protected; simultaneous writes from two *different* instances can
 * still interleave, which needs a database with real compare-and-set to close.
 */
const mutationQueues = new Map<CollectionName, Promise<unknown>>();

export function mutate<K extends CollectionName, R>(
  name: K,
  change: (current: Collections[K]) => Promise<R> | R,
): Promise<R> {
  const previous = mutationQueues.get(name) ?? Promise.resolve();

  const run = previous
    .catch(() => undefined) // a failed mutation must not stall the queue
    .then(async () => {
      const current = await read(name);
      return change(current);
    });

  mutationQueues.set(name, run);
  return run;
}

/** Convenience: mutate a collection by returning its next value. */
export async function update<K extends CollectionName>(
  name: K,
  next: (current: Collections[K]) => Collections[K] | Promise<Collections[K]>,
): Promise<Collections[K]> {
  return mutate(name, async (current) => {
    const value = await next(current);
    await write(name, value);
    return value;
  });
}
