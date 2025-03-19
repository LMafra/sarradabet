/*
  Warnings:

  - Added the required column `categoryId` to the `bets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bets" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
