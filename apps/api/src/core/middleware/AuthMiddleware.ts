import { Request, Response, NextFunction } from "express";
import {
  verifyToken,
  extractTokenFromHeader,
  AuthPayload,
} from "../../utils/auth";
import { UnauthorizedError } from "../errors/AppError";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload;
  }
}

/**
 * Middleware to authenticate admin requests
 */
export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch {
    next(new UnauthorizedError("Authentication required"));
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      const payload = verifyToken(token);
      req.user = payload;
    }
  } catch {
    // ignore optional auth errors
  }

  next();
};

/**
 * Middleware to check if user is authenticated (for protected routes)
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    return next(new UnauthorizedError("Authentication required"));
  }
  next();
};

/**
 * Middleware to check if user is admin (additional check)
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    return next(new UnauthorizedError("Authentication required"));
  }

  next();
};
