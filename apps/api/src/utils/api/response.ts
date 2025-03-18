import { Response } from "express";

type ApiResponseData = Record<string, unknown> | unknown[] | string | number | boolean | null;

type ApiErrorResponse = {
  path?: string;
  message: string;
  stack?: string;
};

export class ApiResponse {
  constructor(private res: Response) {}

  success(data: ApiResponseData, statusCode: number = 200) {
    this.res.status(statusCode).json({
      success: true,
      data,
    });
  }

  error(message: string, errors?: ApiErrorResponse[], statusCode: number = 400) {
    this.res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  status(statusCode: number) {
    this.res.status(statusCode);
    return this;
  }
}
