import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/errors";
import { config } from "../env";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];

  if (!config.API_KEY) {
    throw new ApiError(500, "Server misconfiguration");
  }

  if (apiKey !== config.API_KEY) {
    throw new ApiError(401, "Invalid API key");
  }

  next();
};
