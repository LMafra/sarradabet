import { Response } from "express";

type ApiResponseData =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

type ApiErrorResponse = {
  path?: string;
  message: string;
  stack?: string;
};

export class ApiResponse {
  constructor(private res: Response) {}

  success(data: ApiResponseData, statusCode: number = 200) {
    // Normalize already-shaped responses safely and only when it truly looks like our API envelope
    if (data && typeof data === "object") {
      const maybeEnvelope = data as Record<string, unknown>;
      const hasOwn = (key: string) => Object.prototype.hasOwnProperty.call(maybeEnvelope, key);
      const hasSuccessKey = hasOwn("success") && typeof maybeEnvelope.success === "boolean";
      const hasEnvelopeHints = hasOwn("data") || hasOwn("message") || hasOwn("errors");

      if (hasSuccessKey && hasEnvelopeHints) {
        const shaped = maybeEnvelope as {
          success: boolean;
          message?: string;
          errors?: ApiErrorResponse[];
          data?: ApiResponseData;
        } & Record<string, unknown>;

        // If the incoming payload indicates failure, emit an error response instead
        if (shaped.success === false) {
          const errorMessage = shaped.message || "Request failed";
          const errorList = shaped.errors;
          const errorStatus = statusCode >= 400 ? statusCode : 400;
          this.error(errorMessage, errorList, errorStatus);
          return;
        }

        // For success=true payloads, re-wrap consistently as { success: true, data }
        const normalizedData = Object.prototype.hasOwnProperty.call(shaped, "data")
          ? shaped.data
          : (() => {
              const { success, message, errors, ...rest } = shaped;
              return Object.keys(rest).length ? (rest as unknown as ApiResponseData) : null;
            })();

        this.res.status(statusCode).json({ success: true, data: normalizedData });
        return;
      }
    }

    this.res.status(statusCode).json({ success: true, data });
  }

  error(
    message: string,
    errors?: ApiErrorResponse[],
    statusCode: number = 400,
  ) {
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
