import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IApiService, ApiResponse, ApiError } from "../interfaces/IService";
import { requestDeduplicator } from "../utils/requestDeduplicator";

export abstract class BaseService<T, CreateInput, UpdateInput>
  implements IApiService<T, CreateInput, UpdateInput>
{
  protected readonly api: AxiosInstance;

  constructor(baseURL: string, endpoint: string) {
    this.api = axios.create({
      baseURL: `${baseURL}/api/v1/${endpoint}`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem("adminToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError: ApiError = {
          success: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "An error occurred",
          errors: error.response?.data?.errors,
        };
        return Promise.reject(apiError);
      },
    );
  }

  async getAll(): Promise<ApiResponse<T[]>> {
    const endpoint = this.api.defaults.baseURL + "/";
    return requestDeduplicator.deduplicate(`GET:${endpoint}`, async () => {
      const response = await this.api.get<ApiResponse<T[]>>("/");
      return response.data;
    });
  }

  async getById(id: number): Promise<ApiResponse<T>> {
    const endpoint = this.api.defaults.baseURL + `/${id}`;
    return requestDeduplicator.deduplicate(`GET:${endpoint}`, async () => {
      const response = await this.api.get<ApiResponse<T>>(`/${id}`);
      return response.data;
    });
  }

  async create(data: CreateInput): Promise<ApiResponse<T>> {
    const response = await this.api.post<ApiResponse<T>>("/", data);
    return response.data;
  }

  async update(id: number, data: UpdateInput): Promise<ApiResponse<T>> {
    const response = await this.api.put<ApiResponse<T>>(`/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete<ApiResponse<void>>(`/${id}`);
    return response.data;
  }

  protected async getWithParams(
    params: Record<string, string | number | boolean | undefined>,
  ): Promise<ApiResponse<T[]>> {
    const endpoint = this.api.defaults.baseURL + "/";
    const paramString = JSON.stringify(params);
    return requestDeduplicator.deduplicate(
      `GET:${endpoint}?${paramString}`,
      async () => {
        const response = await this.api.get<ApiResponse<T[]>>("/", { params });
        return response.data;
      },
    );
  }
}
