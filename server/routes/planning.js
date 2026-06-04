import express from "express";
import { getPlanning, createEvent } from "../controllers/planning/planningController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getPlanning);
router.post("/", createEvent);

export default router;
