import { Router } from "express";
import betRoutes from "./bet.routes";

const router = Router();

router.use("/bets", betRoutes);

export default router;
