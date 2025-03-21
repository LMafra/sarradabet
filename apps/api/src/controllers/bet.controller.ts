import { Request, Response, NextFunction } from "express";
import {
  createBetWithOdds,
  getAllBetsFromRepository,
  getBetByIdFromRepository,
  updateBetFromRepository,
} from "../repositories/bet.repository";
import { ApiResponse } from "../utils/api/response";

export const listAllBets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const bets = await getAllBetsFromRepository(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      sortBy as string,
      sortOrder as "asc" | "desc",
    );

    new ApiResponse(res).success({
      data: bets,
      meta: {
        page: Number(page),
        limit: Number(limit),
        count: bets.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createBet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newBet = await createBetWithOdds(req.body);
    new ApiResponse(res).success(newBet, 201);
  } catch (error) {
    next(error);
  }
};

export const showBet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const betId = Number(req.params.id);
    const bet = await getBetByIdFromRepository(betId);
    new ApiResponse(res).success(bet);
  } catch (error) {
    next(error);
  }
};

export const updateBet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const betId = Number(req.params.id);
    const updatedBet = await updateBetFromRepository(betId, req.body);
    new ApiResponse(res).success(updatedBet);
  } catch (error) {
    next(error);
  }
};
