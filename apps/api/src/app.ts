import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env";
import { errorHandler } from "./config/middlewares/errorHandler";
import { router } from "./routes";
import { logger } from "./utils/logger";

// Initialize Express application
export const app = express();

// Configure middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.CORS_ORIGINS.split(","),
    credentials: true,
  }),
);

// HTTP request logging
if (config.NODE_ENV !== "test") {
  app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API routes
app.use("/api/v1", router);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// Global error handler
app.use(errorHandler);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});
