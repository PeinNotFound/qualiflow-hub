import express from "express";
import { createIndicateur, addValeur, getDashboardKPIs } from "../controllers/kpis/kpiController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createIndicateur);
router.get("/dashboard", getDashboardKPIs);
router.post("/:indicateurId/valeurs", addValeur);

export default router;
