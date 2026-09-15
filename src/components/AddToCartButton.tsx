"use client";

import { useState } from "react";
import { useCart, type CartEntry } from "./CartContext";
import { trackClick } from "@/lib/trackEvent";

export default function AddToCartButton({ item, className }: { item: CartEntry; className?: string }) {
  const { items, add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i) => i.key === item.key);

  function handleClick() {
    add(item);
    trackClick(`add-to-cart-${item.key}`);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className={className ?? "font-mono text-xs bg-ink text-paper rounded px-3.5 py-2"}
    >
      {justAdded ? "Added ✓" : inCart ? "In cart — add again" : "Add to cart"}
    </button>
  );
}
