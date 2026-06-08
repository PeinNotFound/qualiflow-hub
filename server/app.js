import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import ncRoutes from "./routes/nc.js";
import actionRoutes from "./routes/actions.js";
import auditRoutes from "./routes/audits.js";
import kpiRoutes from "./routes/kpis.js";
import pncRoutes from "./routes/pnc.js";
import clientRoutes from "./routes/clients.js";
import fournisseurRoutes from "./routes/fournisseurs.js";
import documentationRoutes from "./routes/documentation.js";
import revueRoutes from "./routes/revues.js";
import planningRoutes from "./routes/planning.js";
import veilleRoutes from "./routes/veille.js";
import risqueRoutes from "./routes/risques.js";
import metrologieRoutes from "./routes/metrologie.js";
import partiesInteresseesRoutes from "./routes/parties_interessees.js";
import notificationRoutes from "./routes/notifications.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/nc", ncRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/audits", auditRoutes);
app.use("/api/kpis", kpiRoutes);
app.use("/api/pnc", pncRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/fournisseurs", fournisseurRoutes);
app.use("/api/documentation", documentationRoutes);
app.use("/api/revues", revueRoutes);
app.use("/api/planning", planningRoutes);
app.use("/api/veille", veilleRoutes);
app.use("/api/risques", risqueRoutes);
app.use("/api/metrologie", metrologieRoutes);
app.use("/api/parties_interessees", partiesInteresseesRoutes);
app.use("/api/notifications", notificationRoutes);

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/**
 * Global error middleware
 */
app.use(errorHandler);

export default app;