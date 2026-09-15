import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { buildInvoiceData, formatInvoiceNumber, describeProduct } from "@/lib/invoice";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";

// Assigns the invoice number lazily, once, the first time anyone actually
// opens this — atomic via the InvoiceCounter singleton row (see
// prisma/schema.prisma) so two concurrent opens can't claim the same
// number.
async function assignInvoiceNumber(purchaseId: string): Promise<string> {
  return prisma.$transaction(async (tx) => {
    const counter = await tx.invoiceCounter.upsert({
      where: { id: "singleton" },
      update: { nextNumber: { increment: 1 } },
      create: { id: "singleton", nextNumber: 2 },
    });
    const assigned = formatInvoiceNumber(counter.nextNumber - 1);
    await tx.purchase.update({ where: { id: purchaseId }, data: { invoiceNumber: assigned } });
    return assigned;
  });
}

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/signin?callbackUrl=/invoice/${params.id}`);

  const purchase = await prisma.purchase.findUnique({ where: { id: params.id }, include: { user: true } });
  // Same response whether it doesn't exist or belongs to someone else —
  // don't leak which purchase IDs are real to a stranger poking at URLs.
  if (!purchase || (purchase.userId !== session.user.id && !isAdminEmail(session.user.email))) notFound();

  if (purchase.status !== "PAID") {
    return (
      <main className="mx-auto max-w-lg px-5 py-16">
        <p className="text-sm text-ink-soft">This purchase hasn&apos;t been paid yet — no invoice to show.</p>
      </main>
    );
  }

  const invoiceNumber = purchase.invoiceNumber ?? (await assignInvoiceNumber(purchase.id));
  const invoice = buildInvoiceData({
    invoiceNumber,
    date: purchase.createdAt,
    buyerName: purchase.user.name ?? purchase.user.email ?? purchase.user.phone ?? "Customer",
    buyerEmail: purchase.user.email,
    description: describeProduct(purchase),
    totalPaidInPaise: purchase.amountInPaise,
    discountInPaise: purchase.discountInPaise ?? 0,
  });

  const inr = (p: number) => `₹${(p / 100).toFixed(2)}`;

  return (
    <main className="mx-auto max-w-2xl px-5 py-12 print:py-0">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <p className="font-mono text-xs uppercase tracking-widest text-accent2">Invoice</p>
        <PrintInvoiceButton />
      </div>

      <div className="border border-paper-line rounded p-8 print:border-0 print:p-0">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-display text-xl font-semibold">{invoice.seller.name}</h1>
            {invoice.seller.address && <p className="text-xs text-ink-soft whitespace-pre-line">{invoice.seller.address}</p>}
            {invoice.seller.gstin && <p className="text-xs text-ink-soft mt-1">GSTIN: {invoice.seller.gstin}</p>}
          </div>
          <div className="text-right">
            <p className="font-mono text-sm">{invoice.invoiceNumber}</p>
            <p className="text-xs text-ink-soft">{invoice.date.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="font-mono text-[10.5px] uppercase text-ink-soft mb-1">Billed to</p>
          <p className="text-sm font-semibold">{invoice.buyer.name}</p>
          {invoice.buyer.email && <p className="text-xs text-ink-soft">{invoice.buyer.email}</p>}
        </div>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b border-paper-line text-left">
              <th className="py-2 font-mono text-[10.5px] uppercase text-ink-soft">Description</th>
              <th className="py-2 font-mono text-[10.5px] uppercase text-ink-soft text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-paper-line">
              <td className="py-2">{invoice.lineItem.description}</td>
              <td className="py-2 text-right font-mono">{inr(invoice.lineItem.amountInPaise)}</td>
            </tr>
            {invoice.discountInPaise > 0 && (
              <tr className="border-b border-paper-line text-accent2">
                <td className="py-2">Coupon discount</td>
                <td className="py-2 text-right font-mono">-{inr(invoice.discountInPaise)}</td>
              </tr>
            )}
            {invoice.gst && (
              <tr className="border-b border-paper-line">
                <td className="py-2">GST ({invoice.gst.ratePercent}%, included above)</td>
                <td className="py-2 text-right font-mono">{inr(invoice.gst.amountInPaise)}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="text-right">
            <p className="font-mono text-[10.5px] uppercase text-ink-soft">Total paid</p>
            <p className="font-display text-2xl text-accent-ink">{inr(invoice.totalInPaise)}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
