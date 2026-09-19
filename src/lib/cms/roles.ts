/**
 * Role definitions, shared by the server and the admin UI. Kept apart from
 * users.ts so the browser can reason about permissions without pulling in
 * password hashing, which is server-only.
 */

export const ROLES = ['owner', 'manager', 'fulfilment', 'editor'] as const;
export type Role = (typeof ROLES)[number];

export type Permission =
  | 'products'
  | 'crafts'
  | 'settings'
  | 'theme'
  | 'coupons'
  | 'orders'
  | 'orders:assign'
  | 'users';

/**
 * Who can touch what. `fulfilment` deliberately cannot reach pricing or
 * content — someone packing boxes has no reason to edit the storefront.
 */
const PERMISSIONS: Record<Role, Permission[]> = {
  owner: ['products', 'crafts', 'settings', 'theme', 'coupons', 'orders', 'orders:assign', 'users'],
  manager: ['products', 'crafts', 'settings', 'theme', 'coupons', 'orders', 'orders:assign'],
  fulfilment: ['orders'],
  editor: ['products', 'crafts', 'settings', 'theme'],
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner — full access, including users',
  manager: 'Manager — shop, content and orders',
  fulfilment: 'Fulfilment — orders only',
  editor: 'Editor — content only, no orders',
};

export function can(role: Role, permission: Permission): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

/** A user record with the password hash removed — safe to send to the browser. */
export interface PublicUser {
  id: string;
  name: string;
  username: string;
  role: Role;
  active: boolean;
  createdAt: string;
}
