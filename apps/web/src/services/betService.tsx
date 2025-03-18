import axios from "axios";

const VITE_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${VITE_BASE_URL}/api/v1/bets`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const betService = {
  getAll: async () => {
    const response = await api.get("/");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  create: async (data: unknown) => {
    const response = await api.post("/", data);
    return response.data;
  },

  update: async (id: string, data: unknown) => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};

export default betService;
