import express from "express";
import { createReclamation, getReclamations } from "../controllers/clients/clientController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.post("/reclamations", createReclamation);
router.get("/reclamations", getReclamations);

export default router;
