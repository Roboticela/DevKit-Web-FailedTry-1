import { SignJWT, jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? "change-me-in-production-min-32-chars!!"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? "change-me-refresh-in-production-32chars"
);

export interface TokenPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function signToken(
  payload: { sub: string; email: string },
  type: "access" | "refresh" = "access"
): Promise<string> {
  const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
  const expiresIn = type === "access" ? "15m" : "30d";
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(
  token: string,
  type: "access" | "refresh" = "access"
): Promise<TokenPayload> {
  const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
  const { payload } = await jwtVerify(token, secret);
  return {
    sub: payload.sub as string,
    email: payload["email"] as string,
    iat: payload.iat,
    exp: payload.exp,
  };
}
