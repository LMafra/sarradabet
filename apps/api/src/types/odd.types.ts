import { Odds } from "@prisma/client";
import { z } from "zod";

export type OddEntity = Odds;

// DTO Types
export type CreateOddDTO = {
  value: string;
};

export type OddResponse = OddEntity & {
  odds: OddEntity[];
  totalVotes?: number;
};

// Query Params Types
export type OddQueryParams = {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

export const CreateOddSchema = z.object({
  value: z.number().positive(),
});

export type CreateOddInput = z.infer<typeof CreateOddSchema>;
