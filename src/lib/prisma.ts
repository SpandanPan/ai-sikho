import { PrismaClient } from "@prisma/client";

// Reuse one client across hot reloads in dev, and across warm serverless
// invocations in production — prevents "too many connections" under load,
// on top of the pooled DATABASE_URL doing the same at the DB layer.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
