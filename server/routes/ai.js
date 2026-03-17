import { chatWithAI } from "../controllers/aiController.js";
import express from "express";
const router = express.Router();

router.post("/chat", chatWithAI);

export default router;
