import { CreateBetDTO } from "../types/bet.types";
import * as betRepository from "../repositories/bet.repository";
import { validateOdds } from "../utils/validator";

export const createBet = async (data: CreateBetDTO) => {
  validateOdds(data.odds);
  return betRepository.createBetWithOdds(data);
};
