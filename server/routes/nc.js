import express from "express";
import { createNC, getNCs } from "../controllers/nc/ncController.js";
import { verifyToken } from "../middleware/auth.js";
import { checkRole } from "../middleware/role.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createNC);
router.get("/", getNCs);

export default router;
