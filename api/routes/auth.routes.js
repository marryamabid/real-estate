import express from "express";
import { authController } from "../controllers/auth.controllers.js";
const router = express.Router();

router.post("/signup", authController);
export default router;
