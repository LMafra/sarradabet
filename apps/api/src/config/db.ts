import { PrismaClient } from "@prisma/client";
import { config } from "./env";
import { logger } from "../utils/logger";

const prisma = new PrismaClient({
  log: [
    { level: "warn", emit: "event" },
    { level: "error", emit: "event" },
  ],
});

prisma.$on("warn" as never, (e: { message: string }) => {
  logger.warn(`Prisma Warning: ${e.message}`);
});

prisma.$on("error" as never, (e: { message: string }) => {
  logger.error(`Prisma Error: ${e.message}`);
});

// Graceful shutdown
const shutdownPrisma = async () => {
  logger.info("Disconnecting from database...");
  await prisma.$disconnect();
  logger.info("Database disconnected");
};

process.on("beforeExit", shutdownPrisma);
process.on("SIGINT", shutdownPrisma);
process.on("SIGTERM", shutdownPrisma);

export { prisma };
