import express from "express";
import { getProcessusAxes, uploadDocument, getDocumentsByAxe } from "../controllers/documentation/documentationController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.get("/processus/:processusId", getProcessusAxes);
router.post("/", uploadDocument);
router.get("/axe/:axeId", getDocumentsByAxe);

export default router;
