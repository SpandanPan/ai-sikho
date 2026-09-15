import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { isValidDiscountPercent, normalizeCouponCode, MAX_COUPON_DISCOUNT_PERCENT } from "@/lib/coupons";

// Admin-only, same reasoning as onboarding mentors — a coupon is real
// discretionary discounting, not something anyone should self-serve.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { code, discountPercent, maxRedemptions, expiresAt } = body ?? {};

  if (typeof code !== "string" || !code.trim() || !isValidDiscountPercent(discountPercent)) {
    return NextResponse.json(
      { error: `code and a discountPercent between 1 and ${MAX_COUPON_DISCOUNT_PERCENT} are required` },
      { status: 400 }
    );
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: normalizeCouponCode(code),
      discountPercent,
      maxRedemptions: Number.isInteger(maxRedemptions) ? maxRedemptions : null,
      expiresAt: typeof expiresAt === "string" && expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json({ coupon });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}
