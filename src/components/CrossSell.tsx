"use client";

import { interviewPacks, formatPackPrice } from "@/data/interviewPacks";
import { courses, formatPrice } from "@/data/courses";
import AddToCartButton from "@/components/AddToCartButton";

type Suggestion = {
  key: string;
  href: string;
  title: string;
  priceLabel: string;
  cart?: { type: "pack-starter" | "pack-kit" | "course"; slug: string; amountInPaise: number };
};

// "Do you also want to try" — a standard, low-risk cross-sell pattern
// (every e-commerce product page has some version of this) rather than
// something novel: someone already committed to buying is the easiest
// person to sell a second, related thing to. Picks one other pack, one
// paid course, and one of mentoring/mock-feedback — deliberately not
// exhaustive, three good suggestions beat ten mediocre ones.
export default function CrossSell({ excludeKey }: { excludeKey: string }) {
  const suggestions: Suggestion[] = [];

  const otherKit = interviewPacks.find((p) => `pack-kit:${p.slug}` !== excludeKey);
  if (otherKit) {
    suggestions.push({
      key: `pack-kit:${otherKit.slug}`,
      href: `/pack/${otherKit.slug}/kit`,
      title: `${otherKit.title} Interview Kit`,
      priceLabel: formatPackPrice(otherKit.kitPriceInPaise),
      cart: { type: "pack-kit", slug: otherKit.slug, amountInPaise: otherKit.kitPriceInPaise },
    });
  }

  const course = courses.find((c) => c.priceInPaise > 0 && `course:${c.slug}` !== excludeKey);
  if (course) {
    suggestions.push({
      key: `course:${course.slug}`,
      href: "/courses",
      title: course.title,
      priceLabel: formatPrice(course.priceInPaise),
      cart: { type: "course", slug: course.slug, amountInPaise: course.priceInPaise },
    });
  }

  suggestions.push({
    key: "mentoring",
    href: "/mentoring",
    title: "1:1 mentoring — time with someone who's done it",
    priceLabel: "Book a slot",
  });

  return (
    <div className="border border-paper-line rounded p-5">
      <p className="font-mono text-[10.5px] uppercase tracking-widest text-accent2 mb-3">Do you also want to try</p>
      <div className="flex flex-col gap-2">
        {suggestions.map((s) => (
          <div key={s.key} className="flex items-center justify-between gap-3 border-t border-paper-line pt-2.5 first:border-t-0 first:pt-0">
            <a href={s.href} className="text-sm hover:text-accent-ink flex-1">
              {s.title}
            </a>
            <span className="font-mono text-xs text-accent-ink flex-none">{s.priceLabel}</span>
            {s.cart && (
              <AddToCartButton
                item={{ key: s.key, type: s.cart.type, slug: s.cart.slug, label: s.title, amountInPaise: s.cart.amountInPaise }}
                className="font-mono text-[10.5px] border border-paper-line rounded px-2 py-1 flex-none"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
