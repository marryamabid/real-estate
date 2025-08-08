import express from "express";
import verifyUser from "../utils/verifyUser.js";
import { createController } from "../controllers/listing.controllers.js";

const router = express.Router();

router.post("/create", verifyUser, createController);

export default router;
