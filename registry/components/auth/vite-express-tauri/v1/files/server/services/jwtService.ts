import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "change-me-min-32-chars-access!!";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "change-me-min-32-chars-refresh!";

export interface TokenPayload { sub: string; email: string; iat?: number; exp?: number }

export function signToken(payload: { sub: string; email: string }, type: "access" | "refresh" = "access"): string {
  return jwt.sign(
    { email: payload.email },
    type === "access" ? ACCESS_SECRET : REFRESH_SECRET,
    { subject: payload.sub, expiresIn: type === "access" ? "15m" : "30d" }
  );
}

export function verifyToken(token: string, type: "access" | "refresh" = "access"): TokenPayload {
  const decoded = jwt.verify(token, type === "access" ? ACCESS_SECRET : REFRESH_SECRET) as jwt.JwtPayload;
  return { sub: decoded.sub as string, email: decoded["email"] as string, iat: decoded.iat, exp: decoded.exp };
}
