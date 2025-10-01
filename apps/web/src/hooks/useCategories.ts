import { useQuery, useMutation } from "../core/hooks";
import { categoryService } from "../services/CategoryService";
import { CreateCategoryDto, UpdateCategoryDto } from "../types/category";

export function useCategories(params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}) {
  return useQuery(
    `categories-${JSON.stringify(params || {})}`,
    () => categoryService.getCategoriesWithPagination(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes - longer cache for categories
      refetchOnMount: false, // Don't refetch on mount if data exists
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  );
}

export function useCategory(id: number) {
  return useQuery(`category-${id}`, () => categoryService.getById(id), {
    enabled: !!id,
  });
}

export function useSearchCategories(searchTerm: string) {
  return useQuery(
    `categories-search-${searchTerm}`,
    () => categoryService.searchCategories(searchTerm),
    {
      enabled: !!searchTerm && searchTerm.length >= 2,
      staleTime: 30000, // 30 seconds
    },
  );
}

export function useCreateCategory() {
  return useMutation((data: CreateCategoryDto) => categoryService.create(data));
}

export function useUpdateCategory() {
  return useMutation(({ id, data }: { id: number; data: UpdateCategoryDto }) =>
    categoryService.update(id, data),
  );
}

export function useDeleteCategory() {
  return useMutation((id: number) => categoryService.delete(id));
}
