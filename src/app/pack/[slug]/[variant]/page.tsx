import { notFound } from "next/navigation";
import { interviewPacks, formatPackPrice } from "@/data/interviewPacks";
import AddToCartButton from "@/components/AddToCartButton";
import CrossSell from "@/components/CrossSell";

export function generateStaticParams() {
  return interviewPacks.flatMap((p) => [
    { slug: p.slug, variant: "starter" },
    { slug: p.slug, variant: "kit" },
  ]);
}

export default function PackDetailPage({ params }: { params: { slug: string; variant: string } }) {
  const pack = interviewPacks.find((p) => p.slug === params.slug);
  if (!pack || (params.variant !== "starter" && params.variant !== "kit")) notFound();

  const isKit = params.variant === "kit";
  const title = isKit ? `${pack.title} Interview Kit` : `${pack.title} Starter Pack`;
  const price = isKit ? pack.kitPriceInPaise : pack.starterPriceInPaise;
  const description = isKit ? pack.kitDescription : pack.starterDescription;
  const contents = isKit ? pack.kitContents : "25 questions + 1 checklist";

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">
        {pack.title} · {isKit ? "Interview Kit" : "Starter Pack"}
      </p>
      <h1 className="font-display text-2xl font-semibold mb-4">{title}</h1>

      <div className="border border-paper-line rounded p-6 mb-6">
        <p className="text-ink-soft mb-4">{description}</p>
        <p className="font-mono text-[10.5px] uppercase text-ink-soft mb-1">What's included</p>
        <p className="text-sm mb-5">{contents}.</p>

        <div className="flex items-center justify-between">
          <div className="font-display text-2xl text-accent-ink">{formatPackPrice(price)}</div>
          <AddToCartButton
            item={{
              key: `pack-${params.variant}:${pack.slug}`,
              type: params.variant === "kit" ? "pack-kit" : "pack-starter",
              slug: pack.slug,
              label: title,
              amountInPaise: price,
            }}
            className="font-mono text-sm bg-ink text-paper rounded px-4 py-2.5"
          />
        </div>
        <p className="text-[10.5px] text-ink-soft mt-2 text-right">
          All sales are final — see <a href="/refund-policy" className="underline">refund policy</a>.
        </p>
      </div>

      <CrossSell excludeKey={`pack-${params.variant}:${pack.slug}`} />
    </main>
  );
}
