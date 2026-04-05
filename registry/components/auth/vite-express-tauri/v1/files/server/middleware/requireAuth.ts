import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/jwtService.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) { res.status(401).json({ message: "Unauthorized" }); return; }
  try {
    const payload = verifyToken(token);
    (req as Request & { user: { id: string; email: string } }).user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
