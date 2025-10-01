import { PrismaClient, Category } from "@prisma/client";
import { BaseRepository } from "../../../core/base/BaseRepository";
import { FindManyParams } from "../../../core/interfaces/IRepository";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../../core/validation/ValidationSchemas";

export type CategoryWithStats = Category & {
  _count: {
    bet: number;
  };
};

export class CategoryRepository extends BaseRepository<
  CategoryWithStats,
  CreateCategoryInput,
  UpdateCategoryInput,
  { id: number }
> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findMany(params?: FindManyParams): Promise<CategoryWithStats[]> {
    const { skip, take, orderBy, include, where } = params || {};

    const result = await this.prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: "desc" },
      include: {
        _count: {
          select: {
            bet: true,
          },
        },
        ...include,
      },
    });

    return result as unknown as CategoryWithStats[];
  }

  async findUnique(where: { id: number }): Promise<CategoryWithStats | null> {
    const result = await this.prisma.category.findUnique({
      where,
      include: {
        _count: {
          select: {
            bet: true,
          },
        },
      },
    });

    return result as unknown as CategoryWithStats | null;
  }

  async create(data: CreateCategoryInput): Promise<CategoryWithStats> {
    const category = await this.prisma.category.create({
      data: {
        title: data.title,
      },
      include: {
        _count: {
          select: {
            bet: true,
          },
        },
      },
    });

    return category as unknown as CategoryWithStats;
  }

  async update(
    where: { id: number },
    data: UpdateCategoryInput,
  ): Promise<CategoryWithStats> {
    const updatedCategory = await this.prisma.category.update({
      where,
      data: {
        ...(data.title && { title: data.title }),
      },
      include: {
        _count: {
          select: {
            bet: true,
          },
        },
      },
    });

    return updatedCategory as unknown as CategoryWithStats;
  }

  async delete(where: { id: number }): Promise<CategoryWithStats> {
    const deletedCategory = await this.prisma.category.delete({
      where,
      include: {
        _count: {
          select: {
            bet: true,
          },
        },
      },
    });

    return deletedCategory as unknown as CategoryWithStats;
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.category.count({ where });
  }

  async findByTitle(title: string): Promise<CategoryWithStats | null> {
    const result = await this.prisma.category.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: {
            bet: true,
          },
        },
      },
    });

    return result as unknown as CategoryWithStats | null;
  }

  async searchByTitle(searchTerm: string): Promise<CategoryWithStats[]> {
    const result = await this.prisma.category.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: {
            bet: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return result as unknown as CategoryWithStats[];
  }
}
