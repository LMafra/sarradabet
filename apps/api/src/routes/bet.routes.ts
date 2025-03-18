import { Router } from "express";
import { createBet, listAllBets } from "../controllers/bet.controller";
import { PaginationSchema, validateRequest } from "../utils/validator";
import { CreateBetSchema } from "../types/bet.types";

const router = Router();

router.get("/", validateRequest(PaginationSchema, "query"), listAllBets);
router.post("/", validateRequest(CreateBetSchema, "body"), createBet);

export default router;
