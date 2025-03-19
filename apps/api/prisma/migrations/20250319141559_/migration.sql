/*
  Warnings:

  - You are about to drop the column `result` on the `bets` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OddResult" AS ENUM ('pending', 'won', 'lost');

-- AlterTable
ALTER TABLE "bets" DROP COLUMN "result";

-- AlterTable
ALTER TABLE "odd" ADD COLUMN     "result" "OddResult" NOT NULL DEFAULT 'pending';

-- DropEnum
DROP TYPE "BetResult";
