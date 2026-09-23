/*
  Warnings:

  - Changed the type of `interval` on the `plans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "interval",
ADD COLUMN     "interval" "BillingInterval" NOT NULL;
