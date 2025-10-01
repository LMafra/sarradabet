import { useQuery, useMutation } from "../core/hooks";
import { betService } from "../services/BetService";
import { CreateBetDto, UpdateBetDto } from "../types/bet";

export function useBets(params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  categoryId?: number;
}) {
  return useQuery(
    `bets-${JSON.stringify(params || {})}`,
    () => betService.getBetsWithPagination(params),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes - longer cache
      refetchOnMount: false, // Don't refetch on mount if data exists
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  );
}

export function useBet(id: number) {
  return useQuery(`bet-${id}`, () => betService.getById(id), {
    enabled: !!id,
  });
}

export function useBetsByStatus(status: string) {
  return useQuery(
    `bets-status-${status}`,
    () => betService.getBetsByStatus(status),
    {
      enabled: !!status,
    },
  );
}

export function useBetsByCategory(categoryId: number) {
  return useQuery(
    `bets-category-${categoryId}`,
    () => betService.getBetsByCategory(categoryId),
    {
      enabled: !!categoryId,
    },
  );
}

export function useCreateBet() {
  return useMutation((data: CreateBetDto) => betService.create(data));
}

export function useUpdateBet() {
  return useMutation(({ id, data }: { id: number; data: UpdateBetDto }) =>
    betService.update(id, data),
  );
}

export function useDeleteBet() {
  return useMutation((id: number) => betService.delete(id));
}

export function useCloseBet() {
  return useMutation((id: number) => betService.closeBet(id));
}

export function useResolveBet() {
  return useMutation(
    ({ id, winningOddId }: { id: number; winningOddId: number }) =>
      betService.resolveBet(id, winningOddId),
  );
}
