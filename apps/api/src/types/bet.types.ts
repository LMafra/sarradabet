import { Odd, Bet, BetStatus, BetResult } from "@prisma/client";
import { CreateOddDTO, CreateOddSchema } from "./odd.types";
import { z } from "zod";

// Base Prisma-generated types
export type BetEntity = Bet;
export type OddsEntity = Odd;

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
  title: z.string().min(2).max(50),
  description: z.string().optional(),
  odds: z.array(CreateOddSchema).min(1),
});

export const UpdateBetSchema = CreateBetSchema.partial().extend({
  status: BetStatusSchema.optional(),
  result: BetResultSchema.optional(),
});

export type CreateBetInput = z.infer<typeof CreateBetSchema>;
export type UpdateBetInput = z.infer<typeof UpdateBetSchema>;
