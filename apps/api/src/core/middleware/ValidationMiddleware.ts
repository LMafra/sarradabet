import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../errors/AppError";

export const validateRequest = (
  schema: ZodSchema,
  property: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      console.log(
        `🔍 Validation middleware called for ${property}:`,
        req[property],
      );

      const result = schema.safeParse(req[property]);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        console.error("❌ Validation failed:", {
          property,
          data: req[property],
          errors: result.error.errors,
        });

        throw new ValidationError("Validation failed", { errors });
      }

      console.log("✅ Validation passed for", property);
      req[property] = result.data;
      next();
    } catch (error) {
      console.error("💥 Validation middleware error:", error);
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) =>
  validateRequest(schema, "params");

export const validateQuery = (schema: ZodSchema) =>
  validateRequest(schema, "query");

export const validateBody = (schema: ZodSchema) =>
  validateRequest(schema, "body");

export const validateZodError = (error: ZodError): ValidationError => {
  const errors = error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
  }));

  return new ValidationError("Validation failed", { errors });
};
