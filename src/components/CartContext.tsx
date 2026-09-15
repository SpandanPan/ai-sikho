"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartEntry = {
  key: string; // "course:rag-basics", "pack-starter:agentic-ai", "pack-kit:agentic-ai"
  type: "pack-starter" | "pack-kit" | "course";
  slug: string;
  label: string;
  amountInPaise: number;
};

type CartContextValue = {
  items: CartEntry[];
  add: (item: CartEntry) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cart";

// localStorage only — a cart is a per-browser convenience, not account
// state; it doesn't need to be readable server-side or synced across
// devices. Real prices are re-resolved server-side at checkout regardless
// (src/lib/cart.ts's resolveCartItem) — nothing here is trusted for money.
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // private mode / storage disabled — cart just won't persist, not fatal
    }
  }, []);

  function persist(next: CartEntry[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore — see above
    }
  }

  function add(item: CartEntry) {
    setItems((prev) => {
      const next = [...prev.filter((i) => i.key !== item.key), item]; // no duplicates — adding an already-present item just re-confirms it
      persist(next);
      return next;
    });
  }

  function remove(key: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i.key !== key);
      persist(next);
      return next;
    });
  }

  function clear() {
    setItems([]);
    persist([]);
  }

  return <CartContext.Provider value={{ items, add, remove, clear }}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
