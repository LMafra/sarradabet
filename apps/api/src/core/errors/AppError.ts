export abstract class AppError extends Error {
  public readonly isOperational: boolean;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string | string[], context?: Record<string, unknown>) {
    const errorMessage = Array.isArray(message) ? message.join(", ") : message;
    super(errorMessage, 400, true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 409, true, context);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super(message, 403);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 400, true, context);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = "Internal server error",
    context?: Record<string, unknown>,
  ) {
    super(message, 500, false, context);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(
    message: string = "Too many requests",
    context?: Record<string, unknown>,
  ) {
    super(message, 429, true, context);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(
    message: string = "Service temporarily unavailable",
    context?: Record<string, unknown>,
  ) {
    super(message, 503, false, context);
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(
    message: string = "Gateway timeout",
    context?: Record<string, unknown>,
  ) {
    super(message, 504, false, context);
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string = "Database operation failed",
    context?: Record<string, unknown>,
  ) {
    super(message, 500, false, context);
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    service: string,
    message: string = "External service error",
    context?: Record<string, unknown>,
  ) {
    super(`${service}: ${message}`, 502, false, context);
  }
}

export class RateLimitExceededError extends AppError {
  constructor(
    message: string = "Rate limit exceeded",
    context?: Record<string, unknown>,
  ) {
    super(message, 429, true, context);
  }
}

export class InvalidTokenError extends AppError {
  constructor(
    message: string = "Invalid or expired token",
    context?: Record<string, unknown>,
  ) {
    super(message, 401, true, context);
  }
}

export class InsufficientPermissionsError extends AppError {
  constructor(
    message: string = "Insufficient permissions",
    context?: Record<string, unknown>,
  ) {
    super(message, 403, true, context);
  }
}
