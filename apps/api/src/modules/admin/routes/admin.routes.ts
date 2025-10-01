import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import {
  validateBody,
  validateParams,
} from "../../../core/middleware/ValidationMiddleware";
import {
  CreateAdminSchema,
  LoginSchema,
  UpdateAdminSchema,
  IdSchema,
} from "../../../core/validation/ValidationSchemas";
import { authenticateAdmin } from "../../../core/middleware/AuthMiddleware";

const router = Router();
const adminController = new AdminController();

router.post("/login", validateBody(LoginSchema), adminController.login);

router.use(authenticateAdmin);

router.get("/profile", adminController.getProfile);
router.post("/logout", adminController.logout);

router.get("/", adminController.getAll);
router.post("/", validateBody(CreateAdminSchema), adminController.create);

router.get(
  "/:id",
  validateParams(IdSchema.transform((val) => ({ id: val }))),
  adminController.getById,
);

router.put(
  "/:id",
  validateParams(IdSchema.transform((val) => ({ id: val }))),
  validateBody(UpdateAdminSchema),
  adminController.update,
);

router.delete(
  "/:id",
  validateParams(IdSchema.transform((val) => ({ id: val }))),
  adminController.delete,
);

export default router;
