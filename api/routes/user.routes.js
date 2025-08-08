import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/update/:id", verifyUser, updateUserController);
router.delete("/delete/:id", verifyUser, deleteUserController);
export default router;
