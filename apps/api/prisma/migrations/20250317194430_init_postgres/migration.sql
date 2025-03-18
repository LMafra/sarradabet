/*
  Warnings:

  - You are about to drop the `odds` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "odds" DROP CONSTRAINT "odds_betId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_oddId_fkey";

-- DropTable
DROP TABLE "odds";

-- CreateTable
CREATE TABLE "odd" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "betId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "odd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "odd_betId_idx" ON "odd"("betId");

-- CreateIndex
CREATE INDEX "odd_value_idx" ON "odd"("value");

-- AddForeignKey
ALTER TABLE "odd" ADD CONSTRAINT "odd_betId_fkey" FOREIGN KEY ("betId") REFERENCES "bets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_oddId_fkey" FOREIGN KEY ("oddId") REFERENCES "odd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
