import { useQuery, useMutation } from "../core/hooks";
import { voteService } from "../services/VoteService";
import { CreateVoteDto } from "../types/vote";

export function useVotes() {
  return useQuery("votes", () => voteService.getAll(), {
    staleTime: 30000, // 30 seconds
  });
}

export function useVote(id: number) {
  return useQuery(`vote-${id}`, () => voteService.getById(id), {
    enabled: !!id,
  });
}

export function useVotesByOddId(oddId: number) {
  return useQuery(
    `votes-odd-${oddId}`,
    () => voteService.getVotesByOddId(oddId),
    {
      enabled: !!oddId,
    },
  );
}

export function useVotesByBetId(betId: number) {
  return useQuery(
    `votes-bet-${betId}`,
    () => voteService.getVotesByBetId(betId),
    {
      enabled: !!betId,
    },
  );
}

export function useCreateVote() {
  return useMutation((data: CreateVoteDto) => voteService.create(data));
}
