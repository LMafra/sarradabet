import { z } from "zod";

export const sanitizeString = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
};

export const sanitizeEmail = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.toLowerCase().trim();
};

export const sanitizeUrl = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
};

export const sanitizeNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const sanitizeInteger = (value: unknown): number => {
  if (typeof value === "number") return Math.floor(value);
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const SanitizedStringSchema = z.string().transform(sanitizeString);
export const SanitizedEmailSchema = z.string().email().transform(sanitizeEmail);
export const SanitizedUrlSchema = z.string().url().transform(sanitizeUrl);
export const SanitizedNumberSchema = z.number().transform(sanitizeNumber);
export const SanitizedIntegerSchema = z
  .number()
  .int()
  .transform(sanitizeInteger);

export const IdSchema = z
  .number()
  .int()
  .positive("ID must be a positive integer");
export const PaginationSchema = z.object({
  page: z.number().int().min(1, "Page must be at least 1").default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
  sortBy: SanitizedStringSchema.optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const SearchSchema = z.object({
  search: z
    .string()
    .min(1, "Search term cannot be empty")
    .max(100, "Search term too long")
    .optional(),
});

export const DateRangeSchema = z
  .object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["startDate"],
    },
  );
