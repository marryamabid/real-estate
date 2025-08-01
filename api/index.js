import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes.js";
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ message, success: false, statusCode });
});
app.listen(3000);
