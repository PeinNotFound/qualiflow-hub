import express from "express";
import { createRevueProcessus, createRevueDirection } from "../controllers/revues/revueController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.post("/processus", createRevueProcessus);
router.post("/direction", createRevueDirection);

export default router;
