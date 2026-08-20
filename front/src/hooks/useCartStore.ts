import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.productId !== productId) };
          }
          return {
            items: state.items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
          };
        }),

      clear: () => set({ items: [] }),
    }),
    { name: "atiosport-cart" },
  ),
);

export function useCartHydrated() {
  return useSyncExternalStore(
    (callback) => useCartStore.persist.onFinishHydration(callback),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
