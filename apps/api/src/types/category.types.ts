import { Category } from "@prisma/client";
import { z } from "zod";

export type CategoryEntity = Category;

export type CategoryResponse = CategoryEntity & {
  bets?: number;
};

export type CategoryQueryParams = {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

export const CreateCategorySchema = z.object({
  title: z.string().min(2).max(50),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
