import express from "express";
import { createPNC, updateTraitement } from "../controllers/pnc/pncController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.post("/", createPNC);
router.patch("/:id/traitement", updateTraitement);

export default router;
