import { CreateVoteDTO } from "../types/vote.types";
import * as voteRepository from "../repositories/vote.repository";

export const createVote = async (data: CreateVoteDTO) => {
  return voteRepository.createVoteWithOdds(data);
};
