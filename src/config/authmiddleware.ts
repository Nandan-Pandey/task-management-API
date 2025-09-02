import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any; // Can strongly type later
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token,'my_super_secret_key' as string);

    req.user = decoded; // attach user payload (userId, iat, exp, etc.)
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
