import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAllWithVotes = async () => {
  return prisma.odd.findMany({
    include: {
      _count: { select: { votes: true } },
    },
  });
};

export const findByIdWithVotes = async (oddId: number) => {
  return prisma.odd.findUnique({
    where: { id: oddId },
    include: {
      _count: { select: { votes: true } },
    },
  });
};
