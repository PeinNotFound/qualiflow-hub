import express from "express";
import { createAudit, getAudits, addConstatEcart } from "../controllers/audits/auditController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createAudit);
router.get("/", getAudits);
router.post("/:auditId/ecarts", addConstatEcart);

export default router;
