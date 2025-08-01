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
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000);
