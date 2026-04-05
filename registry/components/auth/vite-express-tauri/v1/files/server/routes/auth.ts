import { Router, Request, Response } from "express";
import { signToken, verifyToken } from "../services/jwtService.js";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ message: "Email and password required" }); return; }

  // TODO: replace with real DB lookup + bcrypt.compare
  const user = await findUserByCredentials(email, password);
  if (!user) { res.status(401).json({ message: "Invalid email or password" }); return; }

  const token = await signToken({ sub: user.id, email: user.email });
  res.json({ user, token });
});

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) { res.status(400).json({ message: "Name, email, and password required" }); return; }
  if (password.length < 8) { res.status(400).json({ message: "Password must be at least 8 characters" }); return; }

  // TODO: replace with real user creation
  const user = await createUser(name, email, password);
  const token = await signToken({ sub: user.id, email: user.email });
  res.status(201).json({ user, token });
});

router.get("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
  if (!token) { res.status(401).json({ message: "Unauthorized" }); return; }
  try {
    const payload = await verifyToken(token);
    const user = await findUserById(payload.sub);
    if (!user) { res.status(404).json({ message: "User not found" }); return; }
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ message: "Email required" }); return; }
  // TODO: generate reset token, store in DB, send email
  await sendPasswordResetEmail(email);
  res.json({ ok: true });
});

router.post("/reset-password", async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) { res.status(400).json({ message: "Token and password required" }); return; }
  // TODO: verify token, update password in DB
  await resetUserPassword(token, password);
  res.json({ ok: true });
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("refresh_token");
  res.json({ ok: true });
});

// ── Stubs (replace with real DB calls) ───────────────────────────────────────

async function findUserByCredentials(email: string, _password: string) {
  void email;
  return null as { id: string; name: string; email: string } | null;
}

async function createUser(name: string, email: string, _password: string) {
  return { id: crypto.randomUUID(), name, email };
}

async function findUserById(id: string) {
  void id;
  return null as { id: string; name: string; email: string } | null;
}

async function sendPasswordResetEmail(email: string) { void email; }
async function resetUserPassword(token: string, password: string) { void token; void password; }

export default router;
