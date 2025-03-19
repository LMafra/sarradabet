import { Request, Response, NextFunction } from "express";
import {
  getAllCategoriesFromRepository,
  createCategoryFromRepository,
  getCategoryByIdFromRepository,
  updateCategoryFromRepository,
} from "../repositories/category.repository";
import { ApiResponse } from "../utils/api/response";

export const listAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const categories = await getAllCategoriesFromRepository(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      sortBy as string,
      sortOrder as "asc" | "desc",
    );

    new ApiResponse(res).success({
      data: categories,
      meta: {
        page: Number(page),
        limit: Number(limit),
        count: categories.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newCategory = await createCategoryFromRepository(req.body);
    new ApiResponse(res).success(newCategory, 201);
  } catch (error) {
    next(error);
  }
};

export const showCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = Number(req.params.id);
    const category = await getCategoryByIdFromRepository(categoryId);
    new ApiResponse(res).success(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = Number(req.params.id);
    const updatedCategory = await updateCategoryFromRepository(
      categoryId,
      req.body,
    );
    new ApiResponse(res).success(updatedCategory);
  } catch (error) {
    next(error);
  }
};
