import { PrismaClient } from "@prisma/client";
import { CreateVoteDTO } from "../types/vote.types";

const prisma = new PrismaClient();

export const createVoteWithOdds = async (data: CreateVoteDTO) => {
  return prisma.$transaction(async (tx: any) => {
    return tx.vote.create({
      data: {
        oddId: data.oddId,
      },
    });
  });
};
