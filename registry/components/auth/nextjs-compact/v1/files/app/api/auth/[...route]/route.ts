import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/auth/authService";

// ── Helpers ─────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function err(message: string, status = 400) {
  return json({ message }, status);
}

// ── Route dispatcher ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  const action = route.join("/");

  if (action === "login") return handleLogin(req);
  if (action === "register") return handleRegister(req);
  if (action === "logout") return handleLogout();
  if (action === "refresh") return handleRefresh(req);
  if (action === "forgot-password") return handleForgotPassword(req);
  if (action === "reset-password") return handleResetPassword(req);

  return err("Not found", 404);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  const action = route.join("/");

  if (action === "me") return handleMe(req);

  return err("Not found", 404);
}

// ── Handlers ─────────────────────────────────────────────────────────────────

async function handleLogin(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return err("Email and password are required");

  // Replace with your real user lookup + bcrypt.compare
  const user = await findUserByCredentials(email, password);
  if (!user) return err("Invalid email or password", 401);

  const token = await signToken({ sub: user.id, email: user.email });
  return json({ user, token });
}

async function handleRegister(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) return err("Name, email, and password are required");
  if (password.length < 8) return err("Password must be at least 8 characters");

  // Replace with your real user creation logic
  const user = await createUser(name, email, password);
  const token = await signToken({ sub: user.id, email: user.email });
  return json({ user, token }, 201);
}

async function handleLogout() {
  const res = json({ ok: true });
  res.cookies.delete("refresh_token");
  return res;
}

async function handleRefresh(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) return err("No refresh token", 401);
  try {
    const payload = await verifyToken(refreshToken);
    const accessToken = await signToken({ sub: payload.sub, email: payload.email });
    return json({ token: accessToken });
  } catch {
    return err("Invalid refresh token", 401);
  }
}

async function handleForgotPassword(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return err("Email is required");
  // Replace: look up user, generate reset token, send email
  await sendPasswordResetEmail(email);
  return json({ ok: true });
}

async function handleResetPassword(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) return err("Token and password are required");
  // Replace: verify token, update user password
  await resetUserPassword(token, password);
  return json({ ok: true });
}

async function handleMe(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return err("Unauthorized", 401);
  try {
    const payload = await verifyToken(token);
    const user = await findUserById(payload.sub);
    if (!user) return err("User not found", 404);
    return json({ user });
  } catch {
    return err("Invalid token", 401);
  }
}

// ── Stubs (replace with real DB calls) ───────────────────────────────────────

async function findUserByCredentials(email: string, _password: string) {
  // TODO: look up user in DB, compare password with bcrypt
  void email;
  return null as { id: string; name: string; email: string } | null;
}

async function createUser(name: string, email: string, _password: string) {
  // TODO: hash password with bcrypt, insert into DB
  void name; void email;
  return { id: "stub", name, email };
}

async function findUserById(id: string) {
  // TODO: look up user in DB by id
  void id;
  return null as { id: string; name: string; email: string } | null;
}

async function sendPasswordResetEmail(email: string) {
  // TODO: generate token, store in DB, send via nodemailer
  void email;
}

async function resetUserPassword(token: string, password: string) {
  // TODO: verify token from DB, hash new password, update user
  void token; void password;
}
