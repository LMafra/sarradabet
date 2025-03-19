import { Router } from "express";
import { createVote } from "../controllers/vote.controller";
import { validateRequest } from "../utils/validator";
import { CreateVoteSchema } from "../types/vote.types";

const router = Router();

router.post("/", validateRequest(CreateVoteSchema, "body"), createVote);

export default router;
