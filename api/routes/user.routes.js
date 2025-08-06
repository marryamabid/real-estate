import express from "express";
import verifyUser from "../utils/verifyUser.js";
import { updateUserController } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/update/:id", verifyUser, updateUserController);
export default router;
