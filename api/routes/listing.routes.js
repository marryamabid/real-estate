import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  createController,
  deleteListingController,
} from "../controllers/listing.controllers.js";

const router = express.Router();

router.post("/create", verifyUser, createController);
router.delete("/delete/:id", verifyUser, deleteListingController);

export default router;
