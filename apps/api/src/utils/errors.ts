type ErrorDetail = {
  path?: string;
  message: string;
  stack?: string;
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: ErrorDetail[],
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string) {
    super(500, `Database Error: ${message}`);
  }
}

export class ValidationError extends ApiError {
  constructor(errors: ErrorDetail[]) {
    super(400, "Validation Failed", errors);
  }
}
