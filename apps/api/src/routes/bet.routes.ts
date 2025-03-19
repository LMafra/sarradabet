import { Router } from "express";
import {
  listAllBets,
  createBet,
  showBet,
  updateBet,
} from "../controllers/bet.controller";
import { PaginationSchema, validateRequest } from "../utils/validator";
import { CreateBetSchema } from "../types/bet.types";

const router = Router();

router.get("/", validateRequest(PaginationSchema, "query"), listAllBets);
router.get("/:id", validateRequest(PaginationSchema, "query"), showBet);
router.post("/", validateRequest(CreateBetSchema, "body"), createBet);
router.put("/:id", validateRequest(CreateBetSchema, "body"), updateBet);

export default router;
