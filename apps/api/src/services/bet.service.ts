import { CreateBetDTO } from "../types/bet.types";
import * as betRepository from "../repositories/bet.repository";

export const createBet = async (data: CreateBetDTO) => {
  return betRepository.createBetWithOdds(data);
};
