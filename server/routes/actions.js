import express from "express";
import { createAction, getActions, addSousAction, updateSousAction } from "../controllers/actions/actionController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createAction);
router.get("/", getActions);
router.post("/:actionId/sous-actions", addSousAction);
router.patch("/sous-actions/:id", updateSousAction);

export default router;
