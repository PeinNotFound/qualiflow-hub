import express from "express";
import VeilleItem from "../models/VeilleItem.js";
import ActionService from "../services/ActionService.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", async (req, res, next) => {
  try {
    const items = await VeilleItem.find().populate("processus_ids", "name");
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const item = await VeilleItem.create({
      ...req.body,
      created_by: req.user.id,
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

export default router;
