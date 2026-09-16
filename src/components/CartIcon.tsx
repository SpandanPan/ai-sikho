"use client";

import { useCart } from "./CartContext";

// The one cart entry point in the whole site — top-right, bag icon, item
// count badge, standard e-commerce placement. Replaces the text "Cart"
// links that were previously duplicated across the nav and the Interview
// Pack section.
export default function CartIcon() {
  const { items } = useCart();

  return (
    <a href="/cart" className="relative flex items-center justify-center w-8 h-8 flex-none" aria-label={`Cart, ${items.length} item${items.length === 1 ? "" : "s"}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-soft">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {items.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent-ink text-paper text-[9px] font-mono font-semibold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
          {items.length}
        </span>
      )}
    </a>
  );
}
