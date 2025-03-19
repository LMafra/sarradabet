import { Odd, OddResult } from "@prisma/client";
import { z } from "zod";

export type OddEntity = Odd;

export type OddResponse = OddEntity & {
  totalVotes?: number;
};

export type OddQueryParams = {
  result?: OddResult[];
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

export const OddResultSchema = z.nativeEnum(OddResult);

export const CreateOddSchema = z.object({
  title: z.string().min(2).max(50),
  value: z.coerce.number().positive(),
  result: OddResultSchema.optional(),
});

export type CreateOddDTO = z.infer<typeof CreateOddSchema>;
