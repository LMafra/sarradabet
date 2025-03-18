// apps/api/src/utils/validator.ts
import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { ValidationError } from "../utils/errors";

/**
 * Generic request validator middleware
 * @param schema Zod schema to validate against
 * @param property Request property to validate ('body', 'query', or 'params')
 */

export const validateRequest = (
  schema: ZodSchema,
  property: "body" | "query",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req[property]);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        throw new ValidationError(errors);
      }

      req[property] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validates odds values for a bet
 * @param odds Array of odds values
 * @throws ValidationError if odds are invalid
 */
export const validateOdds = (odds: number[]) => {
  if (!Array.isArray(odds) || odds.length < 1) {
    throw new ValidationError([
      {
        path: "odds",
        message: "At least one odds entry is required",
      },
    ]);
  }

  if (odds.some((value) => value <= 1)) {
    throw new ValidationError([
      {
        path: "odds",
        message: "All odds values must be greater than 1",
      },
    ]);
  }
};

// Common validation schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;
