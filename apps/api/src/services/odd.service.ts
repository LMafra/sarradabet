import * as oddRepository from "../repositories/odd.repository";

export const getAllOddsVotes = async () => {
  const odds = await oddRepository.findAllWithVotes();
  return odds.map((odd: any) => ({
    ...odd,
    totalVotes: odd._count.votes,
  }));
};

export const getOddById = async (oddId: number) => {
  const odd = await oddRepository.findByIdWithVotes(oddId);
  if (!odd) throw new Error("Odd not found");

  return { ...(odd as any), totalVotes: (odd as any)._count.votes };
};
