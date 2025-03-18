import { Odd } from "@prisma/client";
import { z } from "zod";

export type OddEntity = Odd;

// DTO Types
export type CreateOddDTO = {
  title: string;
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
  title: z.string().min(2).max(50),
  value: z.number().positive(),
});

export type CreateOddInput = z.infer<typeof CreateOddSchema>;
