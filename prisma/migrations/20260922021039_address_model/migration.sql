/*
  Warnings:

  - You are about to drop the column `firstName` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `line1` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `address` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Made the column `postalCode` on table `addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "line1",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "addressLineOne" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "postalCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "lowStockAt" INTEGER NOT NULL DEFAULT 5;
