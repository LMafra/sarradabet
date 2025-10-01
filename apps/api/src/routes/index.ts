import { Router } from "express";
import betRoutes from "./bet.routes";
import categoryRoutes from "./category.routes";
import voteRoutes from "./vote.routes";
import devRoutes from "./dev.routes";
import adminRoutes from "../modules/admin/routes/admin.routes";

const router = Router();

router.use("/bets", betRoutes);
router.use("/categories", categoryRoutes);
router.use("/votes", voteRoutes);
router.get("/admin/test", (req, res) => {
  res.json({ message: "Admin routes are working!" });
});
router.use("/admin", adminRoutes);
router.use("/dev", devRoutes);

router.get("/", (req, res) => {
  res.json({
    name: "SarradaBet API",
    version: "1.0.0",
    description: "Mock betting platform API",
    endpoints: {
      bets: "/api/v1/bets",
      categories: "/api/v1/categories",
      votes: "/api/v1/votes",
      admin: "/api/v1/admin",
      health: "/health",
    },
  });
});

export default router;
