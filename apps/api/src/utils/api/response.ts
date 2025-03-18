import { Response } from "express";

export class ApiResponse {
  constructor(private res: Response) {}

  success(data: any, statusCode: number = 200) {
    this.res.status(statusCode).json({
      success: true,
      data,
    });
  }

  error(message: string, errors?: any[], statusCode: number = 400) {
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
