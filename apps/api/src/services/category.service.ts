import { CreateCategoryDTO } from "../types/category.types";
import * as categoryRepository from "../repositories/category.repository";

export const createCategory = async (data: CreateCategoryDTO) => {
  return categoryRepository.createCategoryFromRepository(data);
};
