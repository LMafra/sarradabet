import { PrismaClient, Bet, Odd } from "@prisma/client";
import { BaseRepository } from "../../../core/base/BaseRepository";
import { FindManyParams } from "../../../core/interfaces/IRepository";
import {
  CreateBetInput,
  UpdateBetInput,
} from "../../../core/validation/ValidationSchemas";

export type BetWithOdds = Bet & {
  odds: (Odd & { totalVotes: number })[];
  totalVotes: number;
  category?: { id: number; title: string };
};

export class BetRepository extends BaseRepository<
  BetWithOdds,
  CreateBetInput,
  UpdateBetInput,
  { id: number }
> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findMany(params?: FindManyParams): Promise<BetWithOdds[]> {
    const { skip, take, orderBy, include, where } = params || {};

    const bets = await this.prisma.bet.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: "desc" },
      include: {
        odds: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        ...include,
      },
    });

    return bets.map(this.transformBetWithVotes);
  }

  async findUnique(where: { id: number }): Promise<BetWithOdds | null> {
    const bet = await this.prisma.bet.findUnique({
      where,
      include: {
        odds: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return bet ? this.transformBetWithVotes(bet) : null;
  }

  async create(data: CreateBetInput): Promise<BetWithOdds> {
    return this.executeTransaction(async (tx) => {
      const bet = await tx.bet.create({
        data: {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          odds: {
            create: data.odds.map((odd) => ({
              title: odd.title,
              value: odd.value,
            })),
          },
        },
        include: {
          odds: {
            include: {
              _count: {
                select: { votes: true },
              },
            },
          },
          category: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return this.transformBetWithVotes(bet);
    });
  }

  async update(
    where: { id: number },
    data: UpdateBetInput,
  ): Promise<BetWithOdds> {
    const updatedBet = await this.prisma.bet.update({
      where,
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.status && { status: data.status }),
      },
      include: {
        odds: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return this.transformBetWithVotes(updatedBet);
  }

  async delete(where: { id: number }): Promise<BetWithOdds> {
    // Ensure related odds are removed to satisfy FK constraints
    await this.prisma.odd.deleteMany({ where: { betId: where.id } });
    const deletedBet = await this.prisma.bet.delete({
      where,
      include: {
        odds: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return this.transformBetWithVotes(deletedBet);
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.bet.count({ where });
  }

  async findByStatus(status: string): Promise<BetWithOdds[]> {
    return this.findMany({
      where: { status },
    });
  }

  async findByCategory(categoryId: number): Promise<BetWithOdds[]> {
    return this.findMany({
      where: { categoryId },
    });
  }

  private transformBetWithVotes(bet: Bet & { odds: Array<Odd & { _count: { votes: number } }>; category?: { id: number; title: string } }): BetWithOdds {
    const totalVotes = bet.odds.reduce(
      (sum: number, odd: Odd & { _count: { votes: number } }) => sum + odd._count.votes,
      0,
    );

    return {
      ...bet,
      odds: bet.odds.map(({ _count, ...odd }: Odd & { _count: { votes: number } }) => ({
        ...odd,
        totalVotes: _count.votes,
      })),
      totalVotes,
    };
  }
}
