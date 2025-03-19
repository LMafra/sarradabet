import { Request, Response, NextFunction } from "express";
import { createVoteWithOdds } from "../repositories/vote.repository";
import { ApiResponse } from "../utils/api/response";

export const createVote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newVote = await createVoteWithOdds(req.body);
    new ApiResponse(res).success(newVote, 201);
  } catch (error) {
    next(error);
  }
};
