import User from "../models/user.model.js";
import errorhandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupController = async (req, res, next) => {
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
export const signinController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorhandler(404, "User not found"));
    }
    const isPasswordValid = await bcrypt.compare(password, validUser.password);
    if (!isPasswordValid) {
      return next(errorhandler(400, "Wrong credentials!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: _, ...userData } = validUser._doc; // Exclude password from user data
    res.status(200).cookie("token", token, { httpOnly: true }).json(userData);
  } catch (error) {
    next(error);
  }
};
