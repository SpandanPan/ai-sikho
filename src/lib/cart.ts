import { courses } from "@/data/courses";
import { interviewPacks } from "@/data/interviewPacks";

export type CartItemInput = { type: "pack-starter" | "pack-kit" | "course"; slug: string };

export type ResolvedCartItem = {
  key: string;
  label: string;
  amountInPaise: number;
  product: "STARTER_PACK" | "INTERVIEW_KIT" | "COURSE";
  courseSlug: string | null;
  packTrack: string | null;
};

// The one place that turns "what the client says is in the cart" into
// "what it actually costs" — always from the canonical data files, never
// from a client-sent price. A client could send any amountInPaise it
// wants; this function is what makes that irrelevant.
export function resolveCartItem(input: CartItemInput): ResolvedCartItem | null {
  if (input.type === "course") {
    const course = courses.find((c) => c.slug === input.slug);
    if (!course || course.priceInPaise <= 0) return null; // free courses have nothing to check out
    return {
      key: `course:${course.slug}`,
      label: course.title,
      amountInPaise: course.priceInPaise,
      product: "COURSE",
      courseSlug: course.slug,
      packTrack: null,
    };
  }

  const pack = interviewPacks.find((p) => p.slug === input.slug);
  if (!pack) return null;
  if (input.type === "pack-starter") {
    return {
      key: `pack-starter:${pack.slug}`,
      label: `${pack.title} — Starter Pack`,
      amountInPaise: pack.starterPriceInPaise,
      product: "STARTER_PACK",
      courseSlug: null,
      packTrack: pack.slug,
    };
  }
  return {
    key: `pack-kit:${pack.slug}`,
    label: `${pack.title} — Interview Kit`,
    amountInPaise: pack.kitPriceInPaise,
    product: "INTERVIEW_KIT",
    courseSlug: null,
    packTrack: pack.slug,
  };
}

export function calculateCartSubtotal(items: { amountInPaise: number }[]): number {
  return items.reduce((sum, i) => sum + i.amountInPaise, 0);
}

// Splits a total discount across items proportionally to their share of
// the subtotal — each Purchase row needs its own accurate
// amountInPaise/discountInPaise for accounting and per-item invoices, not
// just a correct cart-wide total. The last item absorbs whatever rounding
// drift is left so the parts always sum to exactly the whole discount,
// never a paisa more or less.
export function distributeDiscount(items: { amountInPaise: number }[], totalDiscountInPaise: number): number[] {
  if (items.length === 0) return [];
  const subtotal = calculateCartSubtotal(items);
  if (subtotal === 0) return items.map(() => 0);

  const shares = items.map((i) => Math.round((i.amountInPaise / subtotal) * totalDiscountInPaise));
  const drift = totalDiscountInPaise - shares.reduce((a, b) => a + b, 0);
  shares[shares.length - 1] += drift;
  return shares;
}
