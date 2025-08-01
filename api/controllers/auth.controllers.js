import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const authController = async (req, res, next) => {
  const { username, email, password } = req.body;
  const bcryptSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, bcryptSalt);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.status(201).json("user created successfully");
  } catch (error) {
    next(error);
  }
};
