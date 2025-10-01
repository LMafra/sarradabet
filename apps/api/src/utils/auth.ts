import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export interface AuthPayload {
  adminId: number;
  username: string;
  email: string;
}

export interface AuthToken {
  token: string;
  expiresIn: string;
}

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a password with its hash
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token for an admin
 */
export const generateToken = (payload: AuthPayload): AuthToken => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as unknown as number | undefined,
    issuer: "sarradabet-api",
    audience: "sarradabet-admin",
  };
  const token = jwt.sign(payload as any, JWT_SECRET as unknown as jwt.Secret, options);

  return {
    token,
    expiresIn: JWT_EXPIRES_IN,
  };
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): AuthPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "sarradabet-api",
      audience: "sarradabet-admin",
    }) as AuthPayload;

    return decoded;
  } catch {
    throw new Error("Invalid or expired token");
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (
  authHeader: string | undefined,
): string => {
  if (!authHeader) {
    throw new Error("Authorization header is required");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new Error(
      "Invalid authorization header format. Expected: Bearer <token>",
    );
  }

  return parts[1];
};
