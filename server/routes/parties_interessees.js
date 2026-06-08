import express from "express";
import { getPartiesInteressees, createPartieInteressee } from "../controllers/parties_interessees/partiesInteresseesController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getPartiesInteressees);
router.post("/", createPartieInteressee);

export default router;
