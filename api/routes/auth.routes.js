import express from "express";
import {
  signinController,
  signinController,
} from "../controllers/auth.controllers.js";
const router = express.Router();

router.post("/signup", signinController);
router.post("/signin", signinController);
export default router;
