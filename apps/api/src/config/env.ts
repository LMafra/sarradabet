import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3001),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().optional(),
  JWT_SECRET: z.string().optional(),
});

export const config = envSchema.parse(process.env);
export type EnvConfig = z.infer<typeof envSchema>;
