import express from "express";
import { getEquipements, createEquipement } from "../controllers/metrologie/metrologieController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getEquipements);
router.post("/", createEquipement);

export default router;
