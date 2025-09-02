import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

// Load secret from .env
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // fallback for dev
const TOKEN_EXPIRES_IN = "1h"; // can also be set in .env

// 🔹 Hash password before saving to DB
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// 🔹 Compare entered password with stored hash
export const comparePassword = async (
  password,
  hash
) => {
  return await bcrypt.compare(password, hash);
};

// 🔹 Generate JWT with userId
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

// 🔹 Verify JWT and return decoded payload
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
