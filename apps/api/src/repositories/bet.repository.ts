import { PrismaClient } from "@prisma/client";
import { CreateBetDTO } from "../types/bet.types";

const prisma = new PrismaClient();

export const getAllBetsFromRepository = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
) => {
  const skip = (page - 1) * limit;

  return prisma.bet.findMany({
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      odds: true,
    },
  });
};

export const createBetWithOdds = async (data: CreateBetDTO) => {
  return prisma.$transaction(async (tx) => {
    return tx.bet.create({
      data: {
        title: data.title,
        description: data.description,
        odds: {
          create: data.odds.map((odd) => ({
            title: odd.title,
            value: odd.value,
          })),
        },
      },
      include: { odds: true },
    });
  });
};
