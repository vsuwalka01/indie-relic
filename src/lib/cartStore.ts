import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  craft: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  /** Bumped on every add, so the header badge can key an animation off it. */
  lastAddedAt: number;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAddedAt: 0,
      add: (item, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        set({
          items: existing
            ? items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
            : [...items, { ...item, qty }],
          lastAddedAt: Date.now(),
        });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, qty) =>
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
        }),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'indie-relic-cart' },
  ),
);
