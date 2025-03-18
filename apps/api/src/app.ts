import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env";
import { errorHandler } from "./config/middlewares/errorHandler";
import router from "./routes";
import { logger } from "./utils/logger";

export const app = express();

// 1. Middleware CORS melhorado
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    try {
      const allowedOrigins = new Set([
        ...config.CORS_ORIGINS.split(',')
          .map(o => o.trim().replace(/\/$/, ''))
          .filter(Boolean),
      ]);

      if (!origin || allowedOrigins.has(origin) || allowedOrigins.has('*')) {
        return callback(null, true);
      }

      logger.warn(`CORS Blocked: ${origin} | Allowed: ${Array.from(allowedOrigins).join(', ')}`);
      callback(new Error(`Origin not allowed: ${origin}`), false);

    } catch (error) {
      logger.error('CORS Configuration Error:', error);
      callback(new Error('CORS misconfiguration'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV !== "test") {
  app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));
}

app.get("/health", (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

app.use("/api/v1", router);

app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
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
