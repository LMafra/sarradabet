import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBetWithOdds = async (data: BetCreateInput) => {
  return prisma.$transaction(async (tx) => {
    const bet = await tx.bet.create({
      data: {
        title: data.title,
        description: data.description,
        odds: {
          create: data.odds,
        },
      },
      include: { odds: true },
    });
    return bet;
  });
};
