import { Router } from "express";
import { PaginationSchema, validateRequest } from "../utils/validator";
import {
  listAllCategories,
  createCategory,
  showCategory,
  updateCategory,
} from "../controllers/category.controller";
import { CreateCategorySchema } from "../types/category.types";

const router = Router();

router.get("/", validateRequest(PaginationSchema, "query"), listAllCategories);
router.get("/:id", validateRequest(PaginationSchema, "query"), showCategory);
router.post("/", validateRequest(CreateCategorySchema, "body"), createCategory);
router.put(
  "/:id",
  validateRequest(CreateCategorySchema, "body"),
  updateCategory,
);

export default router;
