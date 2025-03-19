import axios from "axios";
import { ApiResponse, PaginationMeta } from "../types/api";
import { Vote, CreateVoteDto } from "../types/vote";

const VITE_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${VITE_BASE_URL}/api/v1/votes`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const voteService = {
  getAll: async (): Promise<{ data: Vote[]; meta: PaginationMeta }> => {
    const response =
      await api.get<ApiResponse<{ data: Vote[]; meta: PaginationMeta }>>("/");
    if (!response.data.success) {
      throw new Error("Failed to fetch votes");
    }
    return response.data.data;
  },

  getById: async (id: number): Promise<{ data: Vote }> => {
    const response = await api.get(`/${id}`);
    return response.data.data;
  },

  create: async (data: CreateVoteDto): Promise<{ data: Vote }> => {
    const response = await api.post("/", data);
    return response.data.data;
  },

  update: async (
    id: number,
    data: Partial<CreateVoteDto>,
  ): Promise<{ data: Vote }> => {
    const response = await api.put(`/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },
};

export default voteService;
