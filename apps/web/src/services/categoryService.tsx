import axios from "axios";
import { ApiResponse, PaginationMeta } from "../types/api";
import { Category } from "../types/category";

const VITE_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${VITE_BASE_URL}/api/v1/categories`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const categoryService = {
  getAll: async (): Promise<{ data: Category[]; meta: PaginationMeta }> => {
    const response =
      await api.get<ApiResponse<{ data: Category[]; meta: PaginationMeta }>>(
        "/",
      );
    if (!response.data.success) {
      throw new Error("Failed to fetch categorys");
    }
    return response.data.data;
  },

  getById: async (id: number): Promise<{ data: Category }> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },
};

export default categoryService;
