import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env";
import { errorHandler } from "./config/middlewares/errorHandler";
import router from "./routes";
import { logger } from "./utils/logger";

export const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = config.CORS_ORIGINS.split(',').map(o => o.trim());

    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    console.error(`🚨 CORS bloqueado para origem: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV !== "test") {
  app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));
}

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

app.use("/api/v1", router);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

app.use(errorHandler);

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});
