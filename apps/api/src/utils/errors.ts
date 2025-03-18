export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: any[],
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
  constructor(errors: any[]) {
    super(400, "Validation Failed", errors);
  }
}
