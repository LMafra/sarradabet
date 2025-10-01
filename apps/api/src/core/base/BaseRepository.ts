import { PrismaClient } from "@prisma/client";
import {
  IRepository,
  FindManyParams,
  PaginationParams,
  PaginatedResult,
} from "../interfaces/IRepository";

export abstract class BaseRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereInput extends Record<string, unknown> = Record<string, unknown>,
> implements IRepository<T, CreateInput, UpdateInput, WhereInput>
{
  constructor(protected readonly prisma: PrismaClient) {}

  abstract findMany(params?: FindManyParams): Promise<T[]>;
  abstract findUnique(where: WhereInput): Promise<T | null>;
  abstract create(data: CreateInput): Promise<T>;
  abstract update(where: WhereInput, data: UpdateInput): Promise<T>;
  abstract delete(where: WhereInput): Promise<T>;
  abstract count(where?: WhereInput): Promise<number>;

  public async findManyWithPagination(
    params: PaginationParams,
    findManyParams?: Omit<FindManyParams, "skip" | "take" | "where"> & {
      where?: WhereInput;
    },
  ): Promise<PaginatedResult<T>> {
    const { page, limit, sortBy = "createdAt", sortOrder = "desc" } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.findMany({
        ...findManyParams,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.count(findManyParams?.where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  public async executeTransaction<R>(
    callback: (
      tx: Omit<
        PrismaClient,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >,
    ) => Promise<R>,
  ): Promise<R> {
    return this.prisma.$transaction(callback);
  }
}
