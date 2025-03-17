import { Bet, BetStatus, BetResult } from "@prisma/client";
import { z } from "zod";

// Base Prisma-generated types
export type BetEntity = Bet;
export type OddsEntity = Odds;

// DTO Types
export type CreateBetDTO = {
  title: string;
  description?: string;
  odds: CreateOddDTO[];
};

export type UpdateBetDTO = Partial<CreateBetDTO> & {
  status?: BetStatus;
  result?: BetResult;
};

export type BetResponse = BetEntity & {
  odds: OddsEntity[];
  totalVotes?: number;
};

// Query Params Types
export type BetQueryParams = {
  status?: BetStatus[];
  result?: BetResult[];
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

// Zod Schemas
export const BetStatusSchema = z.nativeEnum(BetStatus);
export const BetResultSchema = z.nativeEnum(BetResult);

export const CreateBetSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  odds: z
    .array(
      z.object({
        value: z.number().positive(),
      }),
    )
    .min(1),
});

export const UpdateBetSchema = CreateBetSchema.partial().extend({
  status: BetStatusSchema.optional(),
  result: BetResultSchema.optional(),
});

export type CreateBetInput = z.infer<typeof CreateBetSchema>;
export type UpdateBetInput = z.infer<typeof UpdateBetSchema>;
