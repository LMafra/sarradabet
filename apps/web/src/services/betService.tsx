import axios from "axios";
import { ApiResponse, PaginationMeta } from "../types/api";
import { Bet, CreateBetDto } from "../types/bet";

const VITE_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${VITE_BASE_URL}/api/v1/bets`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const betService = {
  getAll: async (): Promise<{ data: Bet[]; meta: PaginationMeta }> => {
    const response =
      await api.get<ApiResponse<{ data: Bet[]; meta: PaginationMeta }>>("/");
    if (!response.data.success) {
      throw new Error("Failed to fetch bets");
    }
    return response.data.data;
  },

  getById: async (id: number): Promise<{ data: Bet }> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  create: async (data: CreateBetDto): Promise<{ data: Bet }> => {
    const response = await api.post("/", data);
    return response.data.data;
  },

  update: async (
    id: number,
    data: Partial<CreateBetDto>,
  ): Promise<{ data: Bet }> => {
    const response = await api.put(`/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },
};

export default betService;
