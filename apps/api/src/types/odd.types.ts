import { Odd } from "@prisma/client";
import { z } from "zod";

export type OddEntity = Odd;

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
  value: z.coerce.number().positive(),
});

export type CreateOddDTO = z.infer<typeof CreateOddSchema>;
