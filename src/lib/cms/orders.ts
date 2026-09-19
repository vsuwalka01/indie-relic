export const ORDER_STATUSES = ['new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export interface OrderItem {
  productId: number;
  name: string;
  craft: string;
  price: number;
  qty: number;
}

export interface ShippingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderEvent {
  at: string;
  label: string;
  /** Name of whoever caused it, or "Customer" for the order itself. */
  by: string;
}

export interface Order {
  id: string;
  /** Set when the order was placed by a signed-in customer; '' for guests. */
  customerId: string;
  /**
   * Unguessable secret handed over at checkout, so a guest can still track an
   * order they placed without an account. Signed-in customers are matched on
   * `customerId` instead and never need it.
   */
  token: string;
  number: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string };
  shipping: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode: string;
  total: number;
  status: OrderStatus;
  /** User id of the person responsible for fulfilling this order. */
  assignedTo: string;
  trackingNumber: string;
  courier: string;
  notes: string;
  timeline: OrderEvent[];
}

export function orderNumber(existing: Order[]): string {
  const year = new Date().getFullYear();
  const seq = existing.length + 1;
  return `IR-${year}-${String(seq).padStart(4, '0')}`;
}

export function formatAddress(a: ShippingAddress): string {
  return [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ');
}
