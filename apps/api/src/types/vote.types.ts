import { z } from "zod";

export interface VoteEntity {
  id: number;
  oddId: number;
  createdAt: Date;
}

export type VoteResponse = VoteEntity & {
  odd?: number;
};

export type VoteQueryParams = {
  oddId?: number;
  page?: number;
  limit?: number;
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
};

export const CreateVoteSchema = z.object({
  oddId: z.number().int().positive(),
});

export type CreateVoteDTO = z.infer<typeof CreateVoteSchema>;
