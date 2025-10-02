import { z } from "zod";

export enum OddResult {
  pending = "pending",
  won = "won",
  lost = "lost",
}

export interface OddEntity {
  id: number;
  title: string;
  value: number;
  betId: number;
  result: OddResult;
  createdAt: Date;
  updatedAt: Date;
}

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
