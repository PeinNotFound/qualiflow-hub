import express from "express";
import { getFournisseurs, createEvaluation, createFournisseur } from "../controllers/fournisseurs/fournisseurController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getFournisseurs);
router.post("/", createFournisseur);
router.post("/evaluations", createEvaluation);

export default router;
