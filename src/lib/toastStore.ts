import { create } from 'zustand';

interface Toast {
  id: number;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string) => void;
  dismiss: (id: number) => void;
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message) => {
    const id = Date.now() + Math.random();
    set({ toasts: [...get().toasts, { id, message }] });
    setTimeout(() => get().dismiss(id), 2200);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
