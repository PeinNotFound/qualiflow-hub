import express from "express";
import { getRisques, createRisque } from "../controllers/risques/risqueController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getRisques);
router.post("/", createRisque);

export default router;
