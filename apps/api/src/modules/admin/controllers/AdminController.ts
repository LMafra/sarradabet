import { Request, Response } from "express";
import {
  AdminService,
  CreateAdminInput,
  LoginInput,
} from "../services/AdminService";
import { BaseController } from "../../../core/base/BaseController";
import { AuthPayload } from "../../../utils/auth";

export class AdminController extends BaseController<any, any, any> {
  private adminService: AdminService;

  constructor() {
    super({
      // Minimal no-op implementation to satisfy abstract methods; not used by this controller
      findAll: async () => ({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }),
      findById: async () => ({}),
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => {},
      validateBusinessRules: async () => {},
      executeBusinessLogic: async (d: any) => d,
    } as any);
    this.adminService = new AdminService();
  }

  // Unused in this controller but required by BaseController interface
  async findAll(): Promise<void> { throw new Error("Not implemented"); }
  async findById(): Promise<void> { throw new Error("Not implemented"); }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateAdminInput = req.body;
      const admin = await this.adminService.create(data);

      this.sendSuccess(res, admin, 201, "Admin created successfully");
    } catch (error) {
      this.sendError(res, error);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: LoginInput = req.body;
      const admin = await this.adminService.login(data);

      this.sendSuccess(res, admin, 200, "Login successful");
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const authPayload = req.user as AuthPayload;
      const admin = await this.adminService.getById(authPayload.adminId);

      this.sendSuccess(res, admin);
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const admins = await this.adminService.getAll();

      this.sendSuccess(res, admins);
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const admin = await this.adminService.getById(id);

      this.sendSuccess(res, admin);
    } catch (error) {
      this.sendError(res, error);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const admin = await this.adminService.update(id, data);

      this.sendSuccess(res, admin, 200, "Admin updated successfully");
    } catch (error) {
      this.sendError(res, error);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.adminService.delete(id);

      this.sendSuccess(res, result);
    } catch (error) {
      this.sendError(res, error);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      this.sendSuccess(res, { message: "Logout successful" });
    } catch (error) {
      this.sendError(res, error);
    }
  };
}
