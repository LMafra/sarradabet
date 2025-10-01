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
      const hasEnvelopeHints =
        hasOwn("data") ||
        (hasOwn("message") && typeof (maybeEnvelope as { message?: unknown }).message === "string") ||
        (hasOwn("errors") && Array.isArray((maybeEnvelope as { errors?: unknown }).errors));

      if (hasSuccessKey && hasEnvelopeHints) {
        const shaped = maybeEnvelope as {
          success: boolean;
          message?: string;
          errors?: ApiErrorResponse[];
          data?: ApiResponseData;
        } & Record<string, unknown>;

        // For success=false payloads coming into success(), convert to a proper error response
        if (shaped.success === false) {
          const message = typeof shaped.message === "string" ? shaped.message : "Request failed";
          const errors = Array.isArray(shaped.errors) ? shaped.errors : undefined;
          this.error(message, errors, statusCode);
          return;
        }

        // For success=true payloads, re-wrap consistently as { success: true, data }
        const hasDataKey = Object.prototype.hasOwnProperty.call(shaped, "data");
        const normalizedData = hasDataKey
          ? ((shaped.data ?? null) as ApiResponseData)
          : (() => {
              // Keep all fields except the envelope discriminator 'success'
              const { success, ...rest } = shaped as Record<string, unknown>;
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
