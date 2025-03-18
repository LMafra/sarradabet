import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { ApiError } from "../../utils/errors";
import { ApiResponse } from "../../utils/api/response";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    logger.warn(`Handled Error: ${err.message}`);
    return new ApiResponse(res)
      .status(err.statusCode)
      .error(err.message, err.errors);
  }

  logger.error(`Unhandled Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (process.env.NODE_ENV === "production") {
    return new ApiResponse(res).status(500).error("Internal Server Error");
  }

  return new ApiResponse(res)
    .status(500)
    .error(err.message, { stack: err.stack });
};
