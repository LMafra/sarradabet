import { CreateBetDTO } from "../types/bet.types";
import * as betRepository from "../repositories/bet.repository";

export const createBet = async (data: CreateBetDTO) => {
  return betRepository.createBetWithOdds(data);
};

export const getAllBetsVotes = async () => {
  const bets = await betRepository.findAllWithVotes();
  return bets.map((bet: any) => ({
    ...bet,
    odds: bet.odds.map((odd: any) => ({
      ...odd,
      totalVotes: odd._count.votes,
    })),
  }));
};

export const getBetById = async (betId: number) => {
  const bet = await betRepository.findByIdWithVotes(betId);
  if (!bet) throw new Error("Bet not found");

  return {
    ...bet,
    odds: bet.odds.map((odd: any) => ({
      ...odd,
      totalVotes: odd._count.votes,
    })),
  };
};
