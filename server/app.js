import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

export default app;
