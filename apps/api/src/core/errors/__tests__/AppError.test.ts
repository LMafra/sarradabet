import {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  InternalServerError,
} from "../AppError";

class TestAppError extends AppError {}

describe("AppError", () => {
  it("should create AppError with default values", () => {
    const error = new TestAppError("Test error");

    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe("TestAppError");
  });

  it("should create AppError with custom values", () => {
    const context = { field: "test" };
    const error = new TestAppError("Custom error", 400, true, context);

    expect(error.message).toBe("Custom error");
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
    expect(error.context).toEqual(context);
  });
});

describe("ValidationError", () => {
  it("should create ValidationError with string message", () => {
    const error = new ValidationError("Invalid input");

    expect(error.message).toBe("Invalid input");
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });

  it("should create ValidationError with array of messages", () => {
    const messages = ["Field 1 is required", "Field 2 is invalid"];
    const error = new ValidationError(messages);

    expect(error.message).toBe("Field 1 is required, Field 2 is invalid");
    expect(error.statusCode).toBe(400);
  });
});

describe("NotFoundError", () => {
  it("should create NotFoundError without id", () => {
    const error = new NotFoundError("Resource");

    expect(error.message).toBe("Resource not found");
    expect(error.statusCode).toBe(404);
  });

  it("should create NotFoundError with id", () => {
    const error = new NotFoundError("User", 123);

    expect(error.message).toBe("User with id 123 not found");
    expect(error.statusCode).toBe(404);
  });
});

describe("ConflictError", () => {
  it("should create ConflictError with default message", () => {
    const error = new ConflictError("Resource already exists");

    expect(error.message).toBe("Resource already exists");
    expect(error.statusCode).toBe(409);
  });

  it("should create ConflictError with context", () => {
    const context = { existingId: 123 };
    const error = new ConflictError("Duplicate resource", context);

    expect(error.message).toBe("Duplicate resource");
    expect(error.statusCode).toBe(409);
    expect(error.context).toEqual(context);
  });
});

describe("UnauthorizedError", () => {
  it("should create UnauthorizedError with default message", () => {
    const error = new UnauthorizedError();

    expect(error.message).toBe("Unauthorized access");
    expect(error.statusCode).toBe(401);
  });

  it("should create UnauthorizedError with custom message", () => {
    const error = new UnauthorizedError("Invalid token");

    expect(error.message).toBe("Invalid token");
    expect(error.statusCode).toBe(401);
  });
});

describe("ForbiddenError", () => {
  it("should create ForbiddenError with default message", () => {
    const error = new ForbiddenError();

    expect(error.message).toBe("Forbidden access");
    expect(error.statusCode).toBe(403);
  });

  it("should create ForbiddenError with custom message", () => {
    const error = new ForbiddenError("Insufficient permissions");

    expect(error.message).toBe("Insufficient permissions");
    expect(error.statusCode).toBe(403);
  });
});

describe("BadRequestError", () => {
  it("should create BadRequestError", () => {
    const context = { field: "email" };
    const error = new BadRequestError("Invalid email format", context);

    expect(error.message).toBe("Invalid email format");
    expect(error.statusCode).toBe(400);
    expect(error.context).toEqual(context);
  });
});

describe("InternalServerError", () => {
  it("should create InternalServerError with default message", () => {
    const error = new InternalServerError();

    expect(error.message).toBe("Internal server error");
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
  });

  it("should create InternalServerError with custom message and context", () => {
    const context = { operation: "database" };
    const error = new InternalServerError(
      "Database connection failed",
      context,
    );

    expect(error.message).toBe("Database connection failed");
    expect(error.statusCode).toBe(500);
    expect(error.context).toEqual(context);
    expect(error.isOperational).toBe(false);
  });
});
