import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

/* devkit:auth:api */

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
