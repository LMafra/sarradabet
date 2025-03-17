import { Request, Response } from "express";
import * as betService from "../services/bet.service";
import { ApiResponse } from "../utils/api/response";

export const createBet = async (req: Request, res: Response) => {
  try {
    const bet = await betService.createBet(req.body);
    new ApiResponse(res).success(bet, 201);
  } catch (error) {
    new ApiResponse(res).error(error);
  }
};
