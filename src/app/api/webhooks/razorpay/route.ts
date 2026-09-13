import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

// Razorpay calls this after a payment. Verify the signature before trusting
// anything in the body — otherwise anyone could POST a fake "paid" event
// and unlock the pack for free.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET ?? "")
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    await prisma.purchase.updateMany({
      where: { razorpayOrderId: payment.order_id },
      data: {
        status: "PAID",
        razorpayPaymentId: payment.id,
      },
    });
  }

  return NextResponse.json({ received: true });
}
