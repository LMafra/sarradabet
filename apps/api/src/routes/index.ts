import { Router } from "express";
import betRoutes from "./bet.routes";
import categoryRoutes from "./category.routes";
import voteRoutes from "./vote.routes";

const router = Router();

router.use("/bets", betRoutes);
router.use("/categories", categoryRoutes);
router.use("/votes", voteRoutes);

export default router;
