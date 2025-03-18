export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiErrorResponse[];
};

export type ApiErrorResponse = {
  path?: string;
  message: string;
  stack?: string;
};
