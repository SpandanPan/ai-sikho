-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "contentAccessed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refundedAt" TIMESTAMP(3);
