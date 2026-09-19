import 'server-only';

export interface SavedAddress {
  id: string;
  /** Home, Work, Mum's place — whatever the customer calls it. */
  label: string;
  /** Recipient, so you can send a piece to someone else. */
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  /** 10-digit Indian mobile, the account's identity. Verified by OTP. */
  phone: string;
  name: string;
  email: string;
  addresses: SavedAddress[];
  createdAt: string;
  lastLoginAt: string;
  /** False until they've completed the details step. */
  profileComplete: boolean;
}

export function newAddressId(): string {
  return `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function newCustomer(phone: string): Customer {
  const now = new Date().toISOString();
  return {
    id: `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    phone,
    name: '',
    email: '',
    addresses: [],
    createdAt: now,
    lastLoginAt: now,
    profileComplete: false,
  };
}

/** Indian mobile numbers: 10 digits starting 6–9. */
export function normalisePhone(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const digits = input.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

/**
 * Accounts saved before the address book existed carried a single `address`.
 * Fold it into the list so nobody loses the address they'd already entered.
 */
export function migrateCustomer(raw: Customer & { address?: Partial<SavedAddress> }): Customer {
  if (Array.isArray(raw.addresses)) return raw;

  const legacy = raw.address;
  const hasLegacy = legacy && (legacy.line1 || legacy.city || legacy.pincode);

  return {
    ...raw,
    addresses: hasLegacy
      ? [{
          id: newAddressId(),
          label: 'Home',
          name: raw.name ?? '',
          phone: raw.phone ?? '',
          line1: legacy!.line1 ?? '',
          line2: legacy!.line2 ?? '',
          city: legacy!.city ?? '',
          state: legacy!.state ?? '',
          pincode: legacy!.pincode ?? '',
          isDefault: true,
        }]
      : [],
  };
}

/** Exactly one default, and never zero when addresses exist. */
export function normaliseDefaults(addresses: SavedAddress[], preferId?: string): SavedAddress[] {
  if (!addresses.length) return addresses;
  const chosen =
    addresses.find((a) => a.id === preferId) ??
    addresses.find((a) => a.isDefault) ??
    addresses[0];
  return addresses.map((a) => ({ ...a, isDefault: a.id === chosen.id }));
}

/** What the browser is allowed to see about its own account. */
export function publicCustomer(c: Customer) {
  return {
    id: c.id,
    phone: c.phone,
    name: c.name,
    email: c.email,
    addresses: c.addresses,
    profileComplete: c.profileComplete,
    createdAt: c.createdAt,
  };
}

export type PublicCustomer = ReturnType<typeof publicCustomer>;
